import Phaser from "phaser";
import { TRIJAL_BOSS } from "../config/boss-config";
import { ENEMY_DEFINITIONS, ENEMY_TYPE_IDS } from "../config/enemy-config";
import { PLAYER_RADIUS } from "../config/player-config";
import { MILLISECONDS_PER_SECOND } from "../config/time-config";
import {
  emitGameplayEvent,
  GAMEPLAY_EVENTS,
  type BossChangedPayload
} from "../events/gameplay-events";
import { type ArenaBounds } from "./ArenaBounds";
import { type EnemyController } from "./EnemyController";
import { type Enemy } from "./EnemyPool";
import { type GameplayController } from "./GameplayController";
import { type PlayerController } from "./PlayerController";

type BossProjectile = {
  view: Phaser.GameObjects.Image;
  isActive: boolean;
  x: number;
  y: number;
  velocityX: number;
  velocityY: number;
  remainingMs: number;
};

export class BossController implements GameplayController {
  private readonly projectiles: BossProjectile[] = [];
  private readonly freeProjectileIndexes: number[] = [];
  private telegraph?: Phaser.GameObjects.Arc;
  private aimGuide?: Phaser.GameObjects.Line;
  private bossSpawnId: number | null = null;
  private cooldownMs: number = TRIJAL_BOSS.openingDelayMs;
  private windupRemainingMs = 0;
  private windupDurationMs = 0;
  private isVolley = false;
  private lockedAimRadians = 0;
  private pulseRotationRadians = 0;
  private lastPublishedState: BossChangedPayload = null;

  constructor(
    private readonly scene: Phaser.Scene,
    private readonly arenaBounds: ArenaBounds,
    private readonly enemies: EnemyController,
    private readonly player: PlayerController
  ) {}

  update(delta: number): void {
    const boss = this.enemies.activeEnemies.find(
      (enemy) => enemy.typeId === ENEMY_TYPE_IDS.TRIJAL
    );

    if (!boss) {
      this.resetEncounter();
      return;
    }

    if (this.bossSpawnId !== boss.spawnId) {
      this.resetEncounter();
      this.initializeViews();
      this.bossSpawnId = boss.spawnId;
    }

    const isEnraged = boss.health <= boss.maxHealth * TRIJAL_BOSS.enrageHealthFraction;
    this.publishState(boss, isEnraged);
    this.updateProjectiles(delta);

    if (this.windupRemainingMs > 0) {
      this.windupRemainingMs = Math.max(0, this.windupRemainingMs - delta);
      this.updateTelegraph(boss, isEnraged);

      if (this.windupRemainingMs === 0) {
        this.firePattern(boss, isEnraged);
        this.isVolley = !this.isVolley;
        this.cooldownMs = isEnraged
          ? TRIJAL_BOSS.enragedAttackCooldownMs
          : TRIJAL_BOSS.attackCooldownMs;
        this.telegraph?.setVisible(false);
        this.aimGuide?.setVisible(false);
      }

      return;
    }

    // Fire at most one pattern per update, even after a long frame.
    this.cooldownMs = Math.max(0, this.cooldownMs - delta);

    if (this.cooldownMs === 0) {
      this.windupDurationMs = isEnraged
        ? TRIJAL_BOSS.enragedWindupMs
        : TRIJAL_BOSS.windupMs;
      this.windupRemainingMs = this.windupDurationMs;
      this.lockedAimRadians = Phaser.Math.Angle.Between(
        boss.x,
        boss.y,
        this.player.gameObject.x,
        this.player.gameObject.y
      );
      this.updateTelegraph(boss, isEnraged);
    }
  }

  destroy(): void {
    this.resetEncounter();
    this.telegraph?.destroy();
    this.aimGuide?.destroy();

    for (const projectile of this.projectiles) {
      projectile.view.destroy();
    }

    this.projectiles.length = 0;
    this.freeProjectileIndexes.length = 0;
  }

  private initializeViews(): void {
    if (this.telegraph) {
      return;
    }

    this.telegraph = this.scene.add.circle(0, 0, TRIJAL_BOSS.telegraphRadius)
      .setVisible(false);
    this.aimGuide = this.scene.add.line(0, 0, 0, 0, TRIJAL_BOSS.aimGuideLength, 0)
      .setOrigin(0, 0)
      .setVisible(false);

    if (!this.scene.textures.exists(TRIJAL_BOSS.projectileTextureKey)) {
      const graphics = this.scene.make.graphics({ x: 0, y: 0 });
      graphics.fillStyle(TRIJAL_BOSS.projectileCoreColor, TRIJAL_BOSS.projectileGlowAlpha);
      graphics.fillCircle(
        TRIJAL_BOSS.projectileTextureCenter,
        TRIJAL_BOSS.projectileTextureCenter,
        TRIJAL_BOSS.projectileGlowRadius
      );
      graphics.fillStyle(TRIJAL_BOSS.projectileCoreColor, TRIJAL_BOSS.projectileBodyAlpha);
      graphics.fillCircle(
        TRIJAL_BOSS.projectileTextureCenter,
        TRIJAL_BOSS.projectileTextureCenter,
        TRIJAL_BOSS.projectileRadius
      );
      graphics.fillStyle(TRIJAL_BOSS.projectileCoreColor);
      graphics.fillCircle(
        TRIJAL_BOSS.projectileTextureCenter,
        TRIJAL_BOSS.projectileTextureCenter,
        TRIJAL_BOSS.projectileCoreRadius
      );
      graphics.generateTexture(
        TRIJAL_BOSS.projectileTextureKey,
        TRIJAL_BOSS.projectileTextureSize,
        TRIJAL_BOSS.projectileTextureSize
      );
      graphics.destroy();
    }

    for (let index = 0; index < TRIJAL_BOSS.projectilePoolSize; index += 1) {
      this.projectiles.push({
        view: this.scene.add.image(0, 0, TRIJAL_BOSS.projectileTextureKey)
          .setDepth(TRIJAL_BOSS.projectileDepth)
          .setActive(false)
          .setVisible(false),
        isActive: false,
        x: 0,
        y: 0,
        velocityX: 0,
        velocityY: 0,
        remainingMs: 0
      });
      this.freeProjectileIndexes.push(index);
    }
  }

  private updateTelegraph(boss: Enemy, isEnraged: boolean): void {
    const color = isEnraged ? TRIJAL_BOSS.enragedColor : TRIJAL_BOSS.projectileColor;
    const progress = 1 - this.windupRemainingMs / this.windupDurationMs;
    this.telegraph?.setPosition(boss.x, boss.y)
      .setStrokeStyle(TRIJAL_BOSS.telegraphStrokeWidth, color, TRIJAL_BOSS.telegraphAlpha)
      .setScale(TRIJAL_BOSS.telegraphMinScale + progress * TRIJAL_BOSS.telegraphScaleGrowth)
      .setVisible(true);
    this.aimGuide?.setPosition(boss.x, boss.y)
      .setRotation(this.lockedAimRadians)
      .setStrokeStyle(TRIJAL_BOSS.aimGuideStrokeWidth, color, TRIJAL_BOSS.telegraphAlpha)
      .setVisible(this.isVolley);
  }

  private firePattern(boss: Enemy, isEnraged: boolean): void {
    const shotCount = this.isVolley
      ? TRIJAL_BOSS.volleyShotCount
      : isEnraged ? TRIJAL_BOSS.enragedPulseShotCount : TRIJAL_BOSS.pulseShotCount;

    // Skip a whole pattern when full so gaps remain predictable.
    if (this.freeProjectileIndexes.length < shotCount) {
      return;
    }

    const speed = isEnraged
      ? TRIJAL_BOSS.enragedProjectileSpeed
      : TRIJAL_BOSS.projectileSpeed;

    for (let shotIndex = 0; shotIndex < shotCount; shotIndex += 1) {
      const angle = this.isVolley
        ? this.lockedAimRadians +
          (shotIndex - (shotCount - 1) * TRIJAL_BOSS.half) * TRIJAL_BOSS.volleySpreadRadians
        : this.pulseRotationRadians + shotIndex * TRIJAL_BOSS.fullCircleRadians / shotCount;
      const projectileIndex = this.freeProjectileIndexes.pop();

      if (projectileIndex === undefined) {
        return;
      }

      const projectile = this.projectiles[projectileIndex];
      projectile.isActive = true;
      projectile.x = boss.x;
      projectile.y = boss.y;
      projectile.velocityX = Math.cos(angle) * speed;
      projectile.velocityY = Math.sin(angle) * speed;
      projectile.remainingMs = TRIJAL_BOSS.projectileLifetimeMs;
      projectile.view.setPosition(boss.x, boss.y)
        .setTint(isEnraged ? TRIJAL_BOSS.enragedTint : TRIJAL_BOSS.normalTint)
        .setActive(true)
        .setVisible(true);
    }

    this.pulseRotationRadians =
      (this.pulseRotationRadians + TRIJAL_BOSS.pulseRotationStepRadians) %
      TRIJAL_BOSS.fullCircleRadians;
  }

  private updateProjectiles(delta: number): void {
    const player = this.player.gameObject;
    const hitRadius = PLAYER_RADIUS + TRIJAL_BOSS.projectileRadius;

    for (let index = 0; index < this.projectiles.length; index += 1) {
      const projectile = this.projectiles[index];

      if (!projectile.isActive) {
        continue;
      }

      const startX = projectile.x;
      const startY = projectile.y;
      const deltaSeconds = Math.min(delta, projectile.remainingMs) / MILLISECONDS_PER_SECOND;
      const stepX = projectile.velocityX * deltaSeconds;
      const stepY = projectile.velocityY * deltaSeconds;
      projectile.x += stepX;
      projectile.y += stepY;
      projectile.remainingMs -= delta;

      // Test the whole movement segment so slow frames cannot skip the player.
      const lengthSquared = stepX * stepX + stepY * stepY;
      const progress = lengthSquared === 0 ? 0 : Phaser.Math.Clamp(
        ((player.x - startX) * stepX + (player.y - startY) * stepY) / lengthSquared,
        0,
        1
      );
      const distanceX = player.x - (startX + stepX * progress);
      const distanceY = player.y - (startY + stepY * progress);

      if (distanceX * distanceX + distanceY * distanceY <= hitRadius * hitRadius) {
        this.releaseProjectile(index);
        this.player.takeDamage(TRIJAL_BOSS.projectileDamage);
      } else if (projectile.remainingMs <= 0 || !this.arenaBounds.containsWithPadding(
        projectile.x,
        projectile.y,
        TRIJAL_BOSS.projectileDespawnPadding
      )) {
        this.releaseProjectile(index);
      } else {
        projectile.view.setPosition(projectile.x, projectile.y);
      }
    }
  }

  private releaseProjectile(index: number): void {
    const projectile = this.projectiles[index];
    projectile.isActive = false;
    projectile.view.setActive(false).setVisible(false);
    this.freeProjectileIndexes.push(index);
  }

  private resetEncounter(): void {
    if (this.bossSpawnId === null) {
      return;
    }

    this.bossSpawnId = null;
    this.cooldownMs = TRIJAL_BOSS.openingDelayMs;
    this.windupRemainingMs = 0;
    this.isVolley = false;
    this.pulseRotationRadians = 0;
    this.telegraph?.setVisible(false);
    this.aimGuide?.setVisible(false);

    for (let index = 0; index < this.projectiles.length; index += 1) {
      if (this.projectiles[index].isActive) {
        this.releaseProjectile(index);
      }
    }

    this.lastPublishedState = null;
    emitGameplayEvent(GAMEPLAY_EVENTS.BOSS_CHANGED, null);
  }

  private publishState(boss: Enemy, isEnraged: boolean): void {
    if (this.lastPublishedState?.current === boss.health &&
        this.lastPublishedState.isEnraged === isEnraged) {
      return;
    }

    this.lastPublishedState = {
      name: ENEMY_DEFINITIONS[boss.typeId].name,
      current: boss.health,
      max: boss.maxHealth,
      isEnraged
    };
    emitGameplayEvent(GAMEPLAY_EVENTS.BOSS_CHANGED, this.lastPublishedState);
  }
}
