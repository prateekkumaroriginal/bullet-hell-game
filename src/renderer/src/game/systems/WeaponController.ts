import Phaser from "phaser";
import {
  BULLET_DEFAULT_DIRECTION_X,
  BULLET_DEFAULT_DIRECTION_Y,
  BULLET_FIRE_COOLDOWN_MS,
} from "../config/bullet-config";
import {
  MIN_FIRE_COOLDOWN_MULTIPLIER,
  type SkillRuntimeModifiers,
} from "../config/skill-config";
import { ArenaBounds } from "./ArenaBounds";
import { BulletPool } from "./BulletPool";
import { type GameplayController } from "./GameplayController";

export class WeaponController implements GameplayController {
  private readonly bulletPool: BulletPool;
  private fireCooldownRemainingMs = 0;

  constructor(
    private readonly scene: Phaser.Scene,
    arenaBounds: ArenaBounds,
    private readonly getPlayer: () => Phaser.GameObjects.Arc,
    private readonly updateAimDirection: () => void,
    private readonly getAimDirection: () => Phaser.Math.Vector2,
    private readonly getSkillModifiers: () => SkillRuntimeModifiers,
  ) {
    this.bulletPool = new BulletPool(scene, arenaBounds, getSkillModifiers);
  }

  update(delta: number): void {
    this.fireCooldownRemainingMs -= delta;

    if (this.fireCooldownRemainingMs <= 0) {
      this.fireAtCursor();
      this.fireCooldownRemainingMs = this.getFireCooldownMs();
    }

    this.bulletPool.update(delta);
  }

  get bullets(): BulletPool {
    return this.bulletPool;
  }

  destroy(): void {
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

  private getFireCooldownMs(): number {
    return (
      BULLET_FIRE_COOLDOWN_MS *
      Math.max(
        MIN_FIRE_COOLDOWN_MULTIPLIER,
        this.getSkillModifiers().fireCooldownMultiplier,
      )
    );
  }
}
