import Phaser from "phaser";
import { GAME_SCENE_KEY } from "../config/scene-keys";
import {
  getStageDefinition,
  type StageId,
} from "../config/stage-config";
import {
  GAMEPLAY_COMMANDS,
  onGameplayCommand,
} from "../events/gameplay-commands";
import {
  emitGameplayEvent,
  GAMEPLAY_EVENTS,
  onGameplayEvent,
  type PlayerProgressionChangedPayload,
} from "../events/gameplay-events";
import {
  GAME_SESSION_PHASES,
  type GameSessionPhase,
  INITIAL_WAVE_NUMBER,
} from "../state/game-session-state";
import { bindGameUiStoreToGameplayEvents } from "../state/game-ui-event-sync";
import { useGameUiStore } from "../state/use-game-ui-store";
import {
  DEFAULT_SKILL_MODIFIERS,
  getSkillRuntimeModifiers,
  type SkillId,
  type SkillRuntimeModifiers,
  type SkillStackState,
} from "../config/skill-config";
import { ENEMY_POPUP_ID_BY_TYPE } from "../config/popup-config";
import { showPopupOnce } from "../state/popup-ui-service";
import { AimController } from "../systems/AimController";
import { ArenaBounds } from "../systems/ArenaBounds";
import { ArenaRenderer } from "../systems/ArenaRenderer";
import { EnemyController } from "../systems/EnemyController";
import { ExperienceOrbPool } from "../systems/ExperienceOrbPool";
import { type GameplayController } from "../systems/GameplayController";
import { PlayerController } from "../systems/PlayerController";
import { PlayerProgressionController } from "../systems/PlayerProgressionController";
import { SkillController, type SkillChoice } from "../systems/SkillController";
import { WaveController } from "../systems/WaveController";
import { WeaponController } from "../systems/WeaponController";

type EndedSessionPhase = Extract<
  GameSessionPhase,
  typeof GAME_SESSION_PHASES.GAME_OVER | typeof GAME_SESSION_PHASES.STAGE_COMPLETE
>;

export class GameScene extends Phaser.Scene {
  private arenaBounds?: ArenaBounds;
  private arenaRenderer?: ArenaRenderer;
  private aimController?: AimController;
  private enemyController?: EnemyController;
  private experienceOrbPool?: ExperienceOrbPool;
  private playerController?: PlayerController;
  private playerProgressionController?: PlayerProgressionController;
  private skillController?: SkillController;
  private waveController?: WaveController;
  private weaponController?: WeaponController;
  private readonly gameplayControllers: GameplayController[] = [];
  private readonly cleanupCallbacks: Array<() => void> = [];
  private readonly pendingSkillChoiceLevels: number[] = [];
  private activeSkillChoices: readonly SkillChoice[] = [];
  private hasDestroyedSceneResources = false;
  private sessionPhase: GameSessionPhase = GAME_SESSION_PHASES.IDLE;
  private selectedStageId: StageId | null = null;

  constructor() {
    super(GAME_SCENE_KEY);
  }

  create(): void {
    this.hasDestroyedSceneResources = false;
    useGameUiStore.getState().resetGameUiState();
    this.registerCleanup(bindGameUiStoreToGameplayEvents());
    this.arenaBounds = new ArenaBounds(this);
    this.arenaRenderer = new ArenaRenderer(this, this.arenaBounds);
    this.scale.on(Phaser.Scale.Events.RESIZE, this.handleResize, this);
    this.registerCleanup(() => {
      this.scale.off(Phaser.Scale.Events.RESIZE, this.handleResize, this);
    });

    this.registerGameplayCommandListeners();
    this.registerCleanup(
      onGameplayEvent(GAMEPLAY_EVENTS.STAGE_COMPLETE, () => {
        this.endSession(GAME_SESSION_PHASES.STAGE_COMPLETE);
      }),
    );
    this.events.once(
      Phaser.Scenes.Events.SHUTDOWN,
      this.destroySceneResources,
      this,
    );
    this.events.once(
      Phaser.Scenes.Events.DESTROY,
      this.destroySceneResources,
      this,
    );
  }

  update(_: number, delta: number): void {
    if (this.sessionPhase !== GAME_SESSION_PHASES.PLAYING) {
      return;
    }

    this.updatePlayer(delta);
    this.updateWeapons(delta);
    this.updateEnemies(delta);
    this.resolveCombatCollisions(delta);
    this.updateGameOverState();
    this.updateEffects(delta);
    if (import.meta.env.DEV) {
      void import("../debug/publish-game-debug-stats").then(
        ({ publishGameDebugStats }) => {
          publishGameDebugStats({
            aimController: this.aimController,
            delta,
            displayObjectCount: this.children.list.length,
            enemyController: this.enemyController,
            experienceOrbPool: this.experienceOrbPool,
            fps: this.game.loop.actualFps,
            gameTimeMs: this.time.now,
            isPaused: this.time.paused,
            playerController: this.playerController,
            playerProgressionController: this.playerProgressionController,
            renderer: this.game.renderer,
            selectedStageId: this.selectedStageId,
            sessionPhase: this.sessionPhase,
            skillController: this.skillController,
            skillModifiers: this.getSkillRuntimeModifiers(),
            waveController: this.waveController,
            weaponController: this.weaponController,
          });
        },
      );
    }
  }

  private registerGameplayCommandListeners(): void {
    this.registerCleanup(
      onGameplayCommand(GAMEPLAY_COMMANDS.START_GAME, (command) => {
        this.startSession(
          command.selectedStageId,
          command.startingWave,
          command.startingPlayerHealth,
          command.startingPlayerProgression,
          command.startingSkillStacks,
        );
      }),
    );
    this.registerCleanup(
      onGameplayCommand(GAMEPLAY_COMMANDS.RESTART_GAME, () => {
        this.restartSession();
      }),
    );
    this.registerCleanup(
      onGameplayCommand(GAMEPLAY_COMMANDS.RETURN_TO_MENU, () => {
        this.returnToMenu();
      }),
    );
    this.registerCleanup(
      onGameplayCommand(GAMEPLAY_COMMANDS.RETURN_TO_STAGE_SELECT, () => {
        this.returnToStageSelect();
      }),
    );
    this.registerCleanup(
      onGameplayCommand(GAMEPLAY_COMMANDS.PAUSE_GAME, () => {
        this.pauseSession();
      }),
    );
    this.registerCleanup(
      onGameplayCommand(GAMEPLAY_COMMANDS.RESUME_GAME, () => {
        this.resumeSession();
      }),
    );
    this.registerCleanup(
      onGameplayCommand(GAMEPLAY_COMMANDS.SELECT_SKILL, (command) => {
        this.selectSkill(command.skillId);
      }),
    );
    this.registerCleanup(
      onGameplayCommand(GAMEPLAY_COMMANDS.COMPLETE_POPUP_DISMISSAL, () => {
        this.completePopupDismissal();
      }),
    );
    this.registerCleanup(
      onGameplayCommand(GAMEPLAY_COMMANDS.BLOCK_GAMEPLAY_FOR_POPUP, () => {
        this.blockGameplayForPopup();
      }),
    );
  }

  private canStartSession(): boolean {
    return (
      this.sessionPhase === GAME_SESSION_PHASES.IDLE ||
      this.sessionPhase === GAME_SESSION_PHASES.GAME_OVER ||
      this.sessionPhase === GAME_SESSION_PHASES.STAGE_COMPLETE
    );
  }

  private canRestartSession(): boolean {
    return (
      this.selectedStageId !== null &&
      this.sessionPhase !== GAME_SESSION_PHASES.IDLE
    );
  }

  private canReturnToMenu(): boolean {
    return this.sessionPhase !== GAME_SESSION_PHASES.IDLE;
  }

  private startSession(
    selectedStageId: StageId,
    startingWave = INITIAL_WAVE_NUMBER,
    startingPlayerHealth?: number,
    startingPlayerProgression?: PlayerProgressionChangedPayload,
    startingSkillStacks: readonly SkillStackState[] = [],
  ): void {
    if (!this.canStartSession()) {
      return;
    }

    const selectedStage = getStageDefinition(selectedStageId);
    const clampedStartingWave = Phaser.Math.Clamp(
      startingWave,
      INITIAL_WAVE_NUMBER,
      selectedStage.waves.length,
    );

    this.destroyGameplayControllers();
    this.clearSkillSelectionState();
    useGameUiStore.getState().resetGameUiState();
    this.time.paused = false;
    this.sessionPhase = GAME_SESSION_PHASES.PLAYING;
    this.selectedStageId = selectedStageId;

    const arenaBounds = this.getArenaBoundsOrThrow();
    const startingSkillModifiers = getSkillRuntimeModifiers(startingSkillStacks);

    this.playerController = new PlayerController(
      this,
      arenaBounds,
      () => this.getSkillRuntimeModifiers(),
      startingPlayerHealth,
      startingSkillModifiers.maxHealthBonus,
    );
    this.skillController = new SkillController(
      this.playerController,
      startingSkillStacks,
    );
    this.publishLearnedSkills();
    this.playerProgressionController = new PlayerProgressionController(
      (level) => {
        this.queueSkillChoice(level);
      },
      startingPlayerProgression,
    );
    this.aimController = new AimController(
      this,
      () => this.getPlayerControllerOrThrow().gameObject,
    );
    this.weaponController = new WeaponController(
      this,
      arenaBounds,
      () => this.getPlayerControllerOrThrow().gameObject,
      () => this.getAimControllerOrThrow().updateAimDirection(),
      () => this.getAimControllerOrThrow().direction,
      () => this.getSkillRuntimeModifiers(),
    );
    this.enemyController = new EnemyController(
      this,
      arenaBounds,
      () => this.getPlayerControllerOrThrow().gameObject,
    );
    this.experienceOrbPool = new ExperienceOrbPool(
      this,
      () => this.getSkillRuntimeModifiers(),
    );
    this.waveController = new WaveController(
      this,
      this.enemyController,
      selectedStage.waves,
      (nextWave) => {
        emitGameplayEvent(GAMEPLAY_EVENTS.WAVE_COMPLETED, {
          selectedStageId,
          nextWave,
          playerHealth: {
            current: this.getPlayerControllerOrThrow().health,
            max: this.getPlayerControllerOrThrow().maxHealth,
          },
          playerProgression:
            this.getPlayerProgressionControllerOrThrow().progression,
          learnedSkillStacks: this.getSkillControllerOrThrow().skillStacks,
        });
      },
      () => {
        this.emitStageComplete();
      },
      (enemyTypeId) => {
        return showPopupOnce(ENEMY_POPUP_ID_BY_TYPE[enemyTypeId]) !== null;
      },
      clampedStartingWave,
    );
    this.gameplayControllers.push(
      this.playerController,
      this.skillController,
      this.playerProgressionController,
      this.aimController,
      this.weaponController,
      this.enemyController,
      this.experienceOrbPool,
      this.waveController,
    );

    emitGameplayEvent(GAMEPLAY_EVENTS.GAME_STARTED, {
      selectedStageId,
      currentWave: clampedStartingWave,
      totalWaves: selectedStage.waves.length,
      playerHealth: {
        current: this.getPlayerControllerOrThrow().health,
        max: this.getPlayerControllerOrThrow().maxHealth,
      },
      playerProgression: this.getPlayerProgressionControllerOrThrow().progression,
      learnedSkillStacks: this.getSkillControllerOrThrow().skillStacks,
    });
  }

  private pauseSession(): void {
    if (this.sessionPhase !== GAME_SESSION_PHASES.PLAYING) {
      return;
    }

    this.sessionPhase = GAME_SESSION_PHASES.PAUSED;
    this.time.paused = true;
    emitGameplayEvent(GAMEPLAY_EVENTS.GAME_PAUSED, undefined);
  }

  private resumeSession(): void {
    if (this.sessionPhase !== GAME_SESSION_PHASES.PAUSED) {
      return;
    }

    this.sessionPhase = GAME_SESSION_PHASES.PLAYING;
    this.time.paused = false;
    emitGameplayEvent(GAMEPLAY_EVENTS.GAME_RESUMED, undefined);
  }

  private queueSkillChoice(level: number): void {
    this.pendingSkillChoiceLevels.push(level);

    if (this.sessionPhase === GAME_SESSION_PHASES.PLAYING) {
      this.startNextSkillSelection();
    }
  }

  private startNextSkillSelection(): void {
    const offeredAtLevel = this.pendingSkillChoiceLevels.shift();

    if (offeredAtLevel === undefined) {
      this.clearSkillSelectionState();
      this.sessionPhase = GAME_SESSION_PHASES.PLAYING;
      this.time.paused = false;
      emitGameplayEvent(GAMEPLAY_EVENTS.SKILL_SELECTION_ENDED, undefined);
      return;
    }

    this.activeSkillChoices =
      this.getSkillControllerOrThrow().createChoices(offeredAtLevel);

    if (this.activeSkillChoices.length === 0) {
      this.startNextSkillSelection();
      return;
    }

    this.sessionPhase = GAME_SESSION_PHASES.SKILL_SELECT;
    this.time.paused = true;
    emitGameplayEvent(GAMEPLAY_EVENTS.SKILL_SELECTION_STARTED, {
      offeredAtLevel,
      choices: this.activeSkillChoices,
    });
  }

  private selectSkill(skillId: SkillId): void {
    if (this.sessionPhase !== GAME_SESSION_PHASES.SKILL_SELECT) {
      return;
    }

    const selectedChoice = this.activeSkillChoices.find(
      (choice) => choice.id === skillId,
    );

    if (!selectedChoice) {
      return;
    }

    this.getSkillControllerOrThrow().applySkill(selectedChoice.id);
    this.publishLearnedSkills();
    this.startNextSkillSelection();
    emitGameplayEvent(GAMEPLAY_EVENTS.SKILL_ACQUIRED, {
      skillId: selectedChoice.id
    });
  }

  private blockGameplayForPopup(): void {
    if (this.sessionPhase !== GAME_SESSION_PHASES.PLAYING) {
      return;
    }

    this.sessionPhase = GAME_SESSION_PHASES.POPUP;
    this.time.paused = true;
  }

  private completePopupDismissal(): void {
    if (this.sessionPhase !== GAME_SESSION_PHASES.POPUP) {
      return;
    }

    this.sessionPhase = GAME_SESSION_PHASES.PLAYING;
    this.time.paused = false;
  }

  private returnToMenu(): void {
    if (!this.canReturnToMenu()) {
      return;
    }

    this.resetToIdleSession();
    useGameUiStore.getState().resetGameUiState();
  }

  private returnToStageSelect(): void {
    if (!this.canReturnToMenu()) {
      return;
    }

    this.resetToIdleSession();
    useGameUiStore
      .getState()
      .setGameSessionPhase(GAME_SESSION_PHASES.STAGE_SELECT);
  }

  private resetToIdleSession(): void {
    this.destroyGameplayControllers();
    this.clearSkillSelectionState();
    this.time.paused = false;
    this.sessionPhase = GAME_SESSION_PHASES.IDLE;
    this.selectedStageId = null;
  }

  private restartSession(): void {
    if (!this.canRestartSession()) {
      return;
    }

    const selectedStageId = this.getSelectedStageIdOrThrow();

    this.sessionPhase = GAME_SESSION_PHASES.IDLE;
    this.startSession(selectedStageId);
  }

  private updatePlayer(delta: number): void {
    this.playerController?.update(delta);
    this.aimController?.update(delta);
  }

  private updateWeapons(delta: number): void {
    this.weaponController?.update(delta);
  }

  private updateEnemies(delta: number): void {
    this.enemyController?.update(delta);
    this.waveController?.update(delta);
  }

  private resolveCombatCollisions(delta: number): void {
    if (!this.weaponController || !this.enemyController || !this.playerController) {
      return;
    }

    const deathDrops = this.enemyController.resolveBulletHits(this.weaponController.bullets);

    for (const deathDrop of deathDrops) {
      for (
        let orbIndex = 0;
        orbIndex < deathDrop.experienceOrbCount;
        orbIndex += 1
      ) {
        this.experienceOrbPool?.spawn({
          x: deathDrop.x,
          y: deathDrop.y,
          value: deathDrop.experienceValuePerOrb,
        });
      }
    }

    this.enemyController.resolvePlayerContact(this.playerController);

    if (this.experienceOrbPool && this.playerProgressionController) {
      this.experienceOrbPool.resolvePlayerCollection(
        this.playerController,
        this.playerProgressionController,
        delta,
      );
    }
  }

  private updateEffects(delta: number): void {
    // Visual-only effects update last so they can react to the settled frame state.
    this.experienceOrbPool?.update(delta);
  }

  private updateGameOverState(): void {
    if (!this.playerController || !this.waveController) {
      return;
    }

    if (this.playerController.health <= 0) {
      const selectedStageId = this.getSelectedStageIdOrThrow();

      emitGameplayEvent(GAMEPLAY_EVENTS.GAME_OVER, {
        selectedStageId,
        currentWave: this.waveController.currentWaveNumber,
      });
      this.endSession(GAME_SESSION_PHASES.GAME_OVER);
    }
  }

  private emitStageComplete(): void {
    if (!this.waveController) {
      return;
    }

    emitGameplayEvent(GAMEPLAY_EVENTS.STAGE_COMPLETE, {
      selectedStageId: this.getSelectedStageIdOrThrow(),
      currentWave: this.waveController.currentWaveNumber,
      totalWaves: this.waveController.totalWaves,
    });
  }

  private registerCleanup(cleanup: () => void): void {
    this.cleanupCallbacks.push(cleanup);
  }

  private destroySceneResources(): void {
    if (this.hasDestroyedSceneResources) {
      return;
    }

    this.hasDestroyedSceneResources = true;

    for (
      let cleanupIndex = this.cleanupCallbacks.length - 1;
      cleanupIndex >= 0;
      cleanupIndex -= 1
    ) {
      this.cleanupCallbacks[cleanupIndex]();
    }

    this.cleanupCallbacks.length = 0;

    this.destroyGameplayControllers();
    this.arenaRenderer?.destroy();
    this.arenaRenderer = undefined;
    this.arenaBounds = undefined;
    this.time.paused = false;
    this.clearSkillSelectionState();
    this.sessionPhase = GAME_SESSION_PHASES.IDLE;
    this.selectedStageId = null;
  }

  private endSession(nextPhase: EndedSessionPhase): void {
    if (
      this.sessionPhase === GAME_SESSION_PHASES.IDLE ||
      this.sessionPhase === GAME_SESSION_PHASES.GAME_OVER ||
      this.sessionPhase === GAME_SESSION_PHASES.STAGE_COMPLETE
    ) {
      return;
    }

    this.sessionPhase = nextPhase;
    this.time.paused = false;
    this.clearSkillSelectionState();
    this.destroyGameplayControllers();
  }

  private destroyGameplayControllers(): void {
    for (
      let controllerIndex = this.gameplayControllers.length - 1;
      controllerIndex >= 0;
      controllerIndex -= 1
    ) {
      this.gameplayControllers[controllerIndex].destroy();
    }

    this.gameplayControllers.length = 0;
    this.weaponController = undefined;
    this.waveController = undefined;
    this.skillController = undefined;
    this.experienceOrbPool = undefined;
    this.enemyController = undefined;
    this.aimController = undefined;
    this.playerProgressionController = undefined;
    this.playerController = undefined;
  }

  private clearSkillSelectionState(): void {
    this.pendingSkillChoiceLevels.length = 0;
    this.activeSkillChoices = [];
  }

  private getSkillRuntimeModifiers(): SkillRuntimeModifiers {
    return this.skillController?.runtimeModifiers ?? DEFAULT_SKILL_MODIFIERS;
  }

  private publishLearnedSkills(): void {
    emitGameplayEvent(GAMEPLAY_EVENTS.SKILLS_CHANGED, {
      learnedSkills: this.getSkillControllerOrThrow().learnedSkills,
    });
  }

  private handleResize(): void {
    this.cameras.main.setSize(this.scale.width, this.scale.height);
    this.arenaRenderer?.draw();
  }

  private getPlayerControllerOrThrow(): PlayerController {
    if (!this.playerController) {
      throw new Error("PlayerController is required before weapon setup.");
    }

    return this.playerController;
  }

  private getAimControllerOrThrow(): AimController {
    if (!this.aimController) {
      throw new Error("AimController is required before weapon setup.");
    }

    return this.aimController;
  }

  private getPlayerProgressionControllerOrThrow(): PlayerProgressionController {
    if (!this.playerProgressionController) {
      throw new Error("PlayerProgressionController is required during a session.");
    }

    return this.playerProgressionController;
  }

  private getSkillControllerOrThrow(): SkillController {
    if (!this.skillController) {
      throw new Error("SkillController is required during a session.");
    }

    return this.skillController;
  }

  private getArenaBoundsOrThrow(): ArenaBounds {
    if (!this.arenaBounds) {
      throw new Error("ArenaBounds is required before session setup.");
    }

    return this.arenaBounds;
  }

  private getSelectedStageIdOrThrow(): StageId {
    if (!this.selectedStageId) {
      throw new Error("Selected stage is required during an active session.");
    }

    return this.selectedStageId;
  }
}
