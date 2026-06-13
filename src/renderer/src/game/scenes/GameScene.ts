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
} from "../events/gameplay-events";
import {
  GAME_SESSION_PHASES,
  type GameSessionPhase,
  INITIAL_WAVE_NUMBER,
} from "../state/game-session-state";
import { bindGameUiStoreToGameplayEvents } from "../state/game-ui-event-sync";
import { useGameUiStore } from "../state/use-game-ui-store";
import { AimController } from "../systems/AimController";
import { ArenaBounds } from "../systems/ArenaBounds";
import { ArenaRenderer } from "../systems/ArenaRenderer";
import { EnemyController } from "../systems/EnemyController";
import { type GameplayController } from "../systems/GameplayController";
import { PlayerController } from "../systems/PlayerController";
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
  private playerController?: PlayerController;
  private waveController?: WaveController;
  private weaponController?: WeaponController;
  private readonly gameplayControllers: GameplayController[] = [];
  private readonly cleanupCallbacks: Array<() => void> = [];
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
  }

  private registerGameplayCommandListeners(): void {
    this.registerCleanup(
      onGameplayCommand(GAMEPLAY_COMMANDS.START_GAME, (command) => {
        this.startSession(
          command.selectedStageId,
          command.startingWave,
          command.startingPlayerHealth,
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
    useGameUiStore.getState().resetGameUiState();
    this.time.paused = false;
    this.sessionPhase = GAME_SESSION_PHASES.PLAYING;
    this.selectedStageId = selectedStageId;

    const arenaBounds = this.getArenaBoundsOrThrow();

    this.playerController = new PlayerController(
      this,
      arenaBounds,
      startingPlayerHealth,
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
    );
    this.enemyController = new EnemyController(
      this,
      arenaBounds,
      () => this.getPlayerControllerOrThrow().gameObject,
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
        });
      },
      () => {
        this.emitStageComplete();
      },
      clampedStartingWave,
    );
    this.gameplayControllers.push(
      this.playerController,
      this.aimController,
      this.weaponController,
      this.enemyController,
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

  private resolveCombatCollisions(_: number): void {
    if (!this.weaponController || !this.enemyController || !this.playerController) {
      return;
    }

    this.enemyController.resolveBulletHits(this.weaponController.bullets);
    this.enemyController.resolvePlayerContact(this.playerController);
  }

  private updateEffects(_: number): void {
    // Visual-only effects update last so they can react to the settled frame state.
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
    this.enemyController = undefined;
    this.aimController = undefined;
    this.playerController = undefined;
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
