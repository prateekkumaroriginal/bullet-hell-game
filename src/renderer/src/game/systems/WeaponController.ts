import Phaser from "phaser";
import {
  BULLET_DEFAULT_DIRECTION_X,
  BULLET_DEFAULT_DIRECTION_Y,
  BULLET_FIRE_COOLDOWN_MS,
} from "../config/bullet-config";
import { PLAYER_BULLET_MUZZLE_OFFSET } from "../config/player-config";
import {
  MIN_FIRE_COOLDOWN_MULTIPLIER,
  type SkillRuntimeModifiers,
} from "../config/skill-config";
import { ArenaBounds } from "./ArenaBounds";
import { BulletPool } from "./BulletPool";
import { type GameplayController } from "./GameplayController";
import { type PlayerGameObject } from "./PlayerController";

export class WeaponController implements GameplayController {
  private readonly bulletPool: BulletPool;
  private readonly fireDirection = new Phaser.Math.Vector2();
  private fireCooldownRemainingMs = 0;

  constructor(
    private readonly scene: Phaser.Scene,
    arenaBounds: ArenaBounds,
    private readonly getPlayer: () => PlayerGameObject,
    private readonly updateAimDirection: () => void,
    private readonly getAimDirection: () => Phaser.Math.Vector2,
    private readonly getSkillModifiers: () => SkillRuntimeModifiers,
  ) {
    this.bulletPool = new BulletPool(scene, arenaBounds, getSkillModifiers);
  }

  update(delta: number): void {
    this.fireCooldownRemainingMs -= delta;

    while (this.fireCooldownRemainingMs <= 0) {
      const fireCooldownMs = this.getFireCooldownMs();

      if (fireCooldownMs <= 0) {
        return;
      }

      this.fireAtCursor();
      this.fireCooldownRemainingMs += fireCooldownMs;
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
    this.fireDirection.set(aimDirection.x, aimDirection.y);

    if (this.fireDirection.lengthSq() === 0) {
      this.fireDirection.set(
        BULLET_DEFAULT_DIRECTION_X,
        BULLET_DEFAULT_DIRECTION_Y,
      );
    }

    this.fireDirection.normalize();

    this.bulletPool.spawn({
      x: player.x + this.fireDirection.x * PLAYER_BULLET_MUZZLE_OFFSET,
      y: player.y + this.fireDirection.y * PLAYER_BULLET_MUZZLE_OFFSET,
      directionX: this.fireDirection.x,
      directionY: this.fireDirection.y,
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
