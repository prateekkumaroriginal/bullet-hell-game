import Phaser from "phaser";
import { GAME_SCENE_KEY } from "../config/scene-keys";
import { WAVE_DEFINITIONS } from "../config/wave-config";
import {
  emitGameplayEvent,
  GAMEPLAY_EVENTS,
  onGameplayEvent,
} from "../events/gameplay-events";
import {
  DEFAULT_LEVEL_ID,
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
  private hasEndedSession = false;

  constructor() {
    super(GAME_SCENE_KEY);
  }

  create(): void {
    useGameUiStore.getState().resetGameUiState();
    this.registerCleanup(bindGameUiStoreToGameplayEvents());
    this.arenaBounds = new ArenaBounds(this);
    this.arenaRenderer = new ArenaRenderer(this, this.arenaBounds);
    this.playerController = new PlayerController(this, this.arenaBounds);
    this.aimController = new AimController(
      this,
      () => this.getPlayerControllerOrThrow().gameObject,
    );
    this.weaponController = new WeaponController(
      this,
      this.arenaBounds,
      () => this.getPlayerControllerOrThrow().gameObject,
      () => this.getAimControllerOrThrow().updateAimDirection(),
      () => this.getAimControllerOrThrow().direction,
    );
    this.enemyController = new EnemyController(
      this,
      this.arenaBounds,
      () => this.getPlayerControllerOrThrow().gameObject,
    );
    this.waveController = new WaveController(
      this,
      this.enemyController,
    );
    this.gameplayControllers.push(
      this.arenaRenderer,
      this.playerController,
      this.aimController,
      this.weaponController,
      this.enemyController,
      this.waveController,
    );

    this.scale.on(Phaser.Scale.Events.RESIZE, this.handleResize, this);
    this.registerCleanup(() => {
      this.scale.off(Phaser.Scale.Events.RESIZE, this.handleResize, this);
    });
    const removeLevelCompleteListener = onGameplayEvent(
      GAMEPLAY_EVENTS.LEVEL_COMPLETE,
      () => {
        this.endSession();
      },
    );
    this.registerCleanup(removeLevelCompleteListener);
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      this.destroySceneResources();
    });

    emitGameplayEvent(GAMEPLAY_EVENTS.GAME_STARTED, {
      selectedLevelId: DEFAULT_LEVEL_ID,
      currentWave: INITIAL_WAVE_NUMBER,
      totalWaves: WAVE_DEFINITIONS.length,
    });
  }

  update(_: number, delta: number): void {
    if (this.hasEndedSession) {
      return;
    }

    this.updatePlayer(delta);
    this.updateWeapons(delta);
    this.updateEnemies(delta);
    this.resolveCombatCollisions(delta);
    this.updateGameOverState();
    this.updateEffects(delta);
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
      emitGameplayEvent(GAMEPLAY_EVENTS.GAME_OVER, {
        selectedLevelId: DEFAULT_LEVEL_ID,
        currentWave: this.waveController.currentWaveNumber,
      });
      this.endSession();
    }
  }

  private registerCleanup(cleanup: () => void): void {
    this.cleanupCallbacks.push(cleanup);
  }

  private destroySceneResources(): void {
    for (
      let cleanupIndex = this.cleanupCallbacks.length - 1;
      cleanupIndex >= 0;
      cleanupIndex -= 1
    ) {
      this.cleanupCallbacks[cleanupIndex]();
    }

    this.cleanupCallbacks.length = 0;

    this.destroyGameplayControllers();
    this.hasEndedSession = false;
  }

  private endSession(): void {
    if (this.hasEndedSession) {
      return;
    }

    this.hasEndedSession = true;
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
    this.arenaBounds = undefined;
    this.weaponController = undefined;
    this.waveController = undefined;
    this.enemyController = undefined;
    this.aimController = undefined;
    this.playerController = undefined;
    this.arenaRenderer = undefined;
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
}
