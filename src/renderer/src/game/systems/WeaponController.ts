import Phaser from "phaser";
import {
  BULLET_DEFAULT_DIRECTION_X,
  BULLET_DEFAULT_DIRECTION_Y,
  BULLET_FIRE_COOLDOWN_MS,
} from "../config/bullet-config";
import { ArenaBounds } from "./ArenaBounds";
import { BulletPool } from "./BulletPool";

export class WeaponController {
  private readonly bulletPool: BulletPool;
  private readonly fireTimer: Phaser.Time.TimerEvent;

  constructor(
    private readonly scene: Phaser.Scene,
    arenaBounds: ArenaBounds,
    private readonly getPlayer: () => Phaser.GameObjects.Arc,
    private readonly updateAimDirection: () => void,
    private readonly getAimDirection: () => Phaser.Math.Vector2,
  ) {
    this.bulletPool = new BulletPool(scene, arenaBounds);
    this.fireTimer = scene.time.addEvent({
      delay: BULLET_FIRE_COOLDOWN_MS,
      callback: this.fireAtCursor,
      callbackScope: this,
      loop: true,
    });
  }

  update(delta: number): void {
    this.bulletPool.update(delta);
  }

  get bullets(): BulletPool {
    return this.bulletPool;
  }

  destroy(): void {
    this.fireTimer.remove();
    this.bulletPool.destroy();
  }

  private fireAtCursor(): void {
    const player = this.getPlayer();
    this.updateAimDirection();

    const aimDirection = this.getAimDirection();

    if (aimDirection.lengthSq() === 0) {
      aimDirection.set(BULLET_DEFAULT_DIRECTION_X, BULLET_DEFAULT_DIRECTION_Y);
    }

    this.bulletPool.spawn({
      x: player.x,
      y: player.y,
      directionX: aimDirection.x,
      directionY: aimDirection.y,
    });
  }
}
