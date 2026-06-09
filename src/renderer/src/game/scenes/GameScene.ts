import Phaser from "phaser";
import { GAME_SCENE_KEY } from "../config/scene-keys";
import { AimController } from "../systems/AimController";
import { ArenaBounds } from "../systems/ArenaBounds";
import { ArenaRenderer } from "../systems/ArenaRenderer";
import { EnemyController } from "../systems/EnemyController";
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

  constructor() {
    super(GAME_SCENE_KEY);
  }

  create(): void {
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
    this.scale.on(Phaser.Scale.Events.RESIZE, this.handleResize, this);

    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      this.scale.off(Phaser.Scale.Events.RESIZE, this.handleResize, this);
      this.waveController?.destroy();
      this.enemyController?.destroy();
      this.weaponController?.destroy();
      this.aimController?.destroy();
      this.playerController?.destroy();
      this.arenaRenderer?.destroy();
      this.arenaBounds = undefined;
      this.weaponController = undefined;
      this.waveController = undefined;
      this.enemyController = undefined;
      this.aimController = undefined;
      this.playerController = undefined;
      this.arenaRenderer = undefined;
    });
  }

  update(_: number, delta: number): void {
    this.updatePlayer(delta);
    this.updateWeapons(delta);
    this.updateEnemies(delta);
    this.resolveCombatCollisions(delta);
    this.updateEffects(delta);
  }

  private updatePlayer(delta: number): void {
    this.playerController?.update(delta);
    this.aimController?.update();
  }

  private updateWeapons(delta: number): void {
    this.weaponController?.update(delta);
  }

  private updateEnemies(delta: number): void {
    this.enemyController?.update(delta);
    this.waveController?.update();
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
