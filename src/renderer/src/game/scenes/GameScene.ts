import Phaser from "phaser";
import { GAME_SCENE_KEY } from "../config/scene-keys";
import { ArenaRenderer } from "../systems/ArenaRenderer";
import { PlayerController } from "../systems/PlayerController";
import { WeaponController } from "../systems/WeaponController";

export class GameScene extends Phaser.Scene {
  private arenaRenderer?: ArenaRenderer;
  private playerController?: PlayerController;
  private weaponController?: WeaponController;

  constructor() {
    super(GAME_SCENE_KEY);
  }

  create(): void {
    this.arenaRenderer = new ArenaRenderer(this);
    this.playerController = new PlayerController(this);
    this.weaponController = new WeaponController(
      this,
      () => this.getPlayerControllerOrThrow().gameObject,
    );
    this.scale.on(Phaser.Scale.Events.RESIZE, this.handleResize, this);

    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      this.scale.off(Phaser.Scale.Events.RESIZE, this.handleResize, this);
      this.weaponController?.destroy();
      this.playerController?.destroy();
      this.arenaRenderer?.destroy();
      this.weaponController = undefined;
      this.playerController = undefined;
      this.arenaRenderer = undefined;
    });
  }

  update(_: number, delta: number): void {
    this.weaponController?.update(delta);
    this.playerController?.update(delta);
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
}
