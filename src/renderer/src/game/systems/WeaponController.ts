import Phaser from "phaser";
import {
  AIM_GUIDE_ALPHA,
  AIM_GUIDE_COLOR,
  AIM_GUIDE_DOT_RADIUS,
  AIM_GUIDE_DOT_SPACING,
  AIM_GUIDE_LENGTH,
  AIM_GUIDE_START_OFFSET,
  BULLET_DEFAULT_DIRECTION_X,
  BULLET_DEFAULT_DIRECTION_Y,
  BULLET_FIRE_COOLDOWN_MS,
} from "../config/game-config";
import { ArenaBounds } from "./ArenaBounds";
import { BulletPool } from "./BulletPool";

export class WeaponController {
  private readonly aimDirection = new Phaser.Math.Vector2();
  private readonly aimGuide: Phaser.GameObjects.Graphics;
  private readonly bulletPool: BulletPool;
  private readonly fireTimer: Phaser.Time.TimerEvent;

  constructor(
    private readonly scene: Phaser.Scene,
    arenaBounds: ArenaBounds,
    private readonly getPlayer: () => Phaser.GameObjects.Arc,
  ) {
    this.bulletPool = new BulletPool(scene, arenaBounds);
    this.aimGuide = scene.add.graphics();
    this.fireTimer = scene.time.addEvent({
      delay: BULLET_FIRE_COOLDOWN_MS,
      callback: this.fireAtCursor,
      callbackScope: this,
      loop: true,
    });
  }

  update(delta: number): void {
    this.bulletPool.update(delta);
    this.updateAimGuide();
  }

  destroy(): void {
    this.fireTimer.remove();
    this.bulletPool.destroy();
    this.aimGuide.destroy();
  }

  private fireAtCursor(): void {
    const player = this.getPlayer();

    this.updateAimDirection(player);

    if (this.aimDirection.lengthSq() === 0) {
      this.aimDirection.set(BULLET_DEFAULT_DIRECTION_X, BULLET_DEFAULT_DIRECTION_Y);
    }

    this.bulletPool.spawn({
      x: player.x,
      y: player.y,
      directionX: this.aimDirection.x,
      directionY: this.aimDirection.y,
    });
  }

  private updateAimGuide(): void {
    const player = this.getPlayer();

    this.aimGuide.clear();
    this.updateAimDirection(player);

    if (this.aimDirection.lengthSq() === 0) {
      return;
    }

    this.aimDirection.normalize();
    this.aimGuide.fillStyle(AIM_GUIDE_COLOR, AIM_GUIDE_ALPHA);
    this.drawDottedAimGuide(player);
  }

  private updateAimDirection(player: Phaser.GameObjects.Arc): void {
    const pointer = this.scene.input.activePointer;

    this.aimDirection.set(pointer.worldX - player.x, pointer.worldY - player.y);
  }

  private drawDottedAimGuide(player: Phaser.GameObjects.Arc): void {
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
