import Phaser from "phaser";
import {
  AIM_GUIDE_ALPHA,
  AIM_GUIDE_COLOR,
  AIM_GUIDE_DOT_RADIUS,
  AIM_GUIDE_DOT_SPACING,
  AIM_GUIDE_LENGTH,
  AIM_GUIDE_START_OFFSET,
} from "../config/aim-config";
import { PLAYER_SPRITE_FORWARD_ROTATION_OFFSET_RADIANS } from "../config/player-config";
import { type GameplayController } from "./GameplayController";
import { type PlayerGameObject } from "./PlayerController";

export class AimController implements GameplayController {
  private readonly aimDirection = new Phaser.Math.Vector2();
  private readonly aimGuide: Phaser.GameObjects.Graphics;

  constructor(
    private readonly scene: Phaser.Scene,
    private readonly getPlayer: () => PlayerGameObject,
  ) {
    this.aimGuide = scene.add.graphics();
  }

  get direction(): Phaser.Math.Vector2 {
    return this.aimDirection;
  }

  update(_: number): void {
    const player = this.getPlayer();

    this.aimGuide.clear();
    this.updateAimDirection();

    if (this.aimDirection.lengthSq() === 0) {
      return;
    }

    this.aimDirection.normalize();
    player.setRotation(
      this.aimDirection.angle() + PLAYER_SPRITE_FORWARD_ROTATION_OFFSET_RADIANS,
    );
    this.aimGuide.fillStyle(AIM_GUIDE_COLOR, AIM_GUIDE_ALPHA);
    this.drawDottedAimGuide(player);
  }

  destroy(): void {
    this.aimGuide.destroy();
  }

  updateAimDirection(): void {
    const player = this.getPlayer();
    const pointer = this.scene.input.activePointer;

    this.aimDirection.set(pointer.worldX - player.x, pointer.worldY - player.y);
  }

  private drawDottedAimGuide(player: PlayerGameObject): void {
    for (
      let distance = AIM_GUIDE_START_OFFSET;
      distance < AIM_GUIDE_LENGTH;
      distance += AIM_GUIDE_DOT_SPACING
    ) {
      this.aimGuide.fillCircle(
        player.x + this.aimDirection.x * distance,
        player.y + this.aimDirection.y * distance,
        AIM_GUIDE_DOT_RADIUS,
      );
    }
  }
}
