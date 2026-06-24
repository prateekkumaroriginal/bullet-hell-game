import Phaser from "phaser";
import {
  BULLET_DEFAULT_DAMAGE,
  BULLET_DESPAWN_PADDING,
  BULLET_POOL_SIZE,
  BULLET_PROJECTILE_DESIGN,
  BULLET_SPEED,
} from "../config/bullet-config";
import { MILLISECONDS_PER_SECOND } from "../config/time-config";
import { COLLISION_CATEGORIES, type CollisionCategory } from "../config/collision-config";
import { type SkillRuntimeModifiers } from "../config/skill-config";
import { ArenaBounds } from "./ArenaBounds";

export type Bullet = {
  view: Phaser.GameObjects.Image;
  poolIndex: number;
  x: number;
  y: number;
  velocityX: number;
  velocityY: number;
  damage: number;
  collisionCategory: CollisionCategory;
};

type SpawnBulletInput = {
  x: number;
  y: number;
  directionX: number;
  directionY: number;
};

export class BulletPool {
  private readonly bullets: Bullet[];
  private readonly activeBullets: Bullet[] = [];
  private readonly freeBulletIndexes: number[] = [];
  private readonly spawnDirection = new Phaser.Math.Vector2();

  constructor(
    private readonly scene: Phaser.Scene,
    private readonly arenaBounds: ArenaBounds,
    private readonly getSkillModifiers: () => SkillRuntimeModifiers,
  ) {
    this.ensureBulletTexture();
    this.bullets = Array.from({ length: BULLET_POOL_SIZE }, (_, index) =>
      this.createBullet(index),
    );

    for (const bullet of this.bullets) {
      this.freeBulletIndexes.push(bullet.poolIndex);
    }
  }

  get active(): readonly Bullet[] {
    return this.activeBullets;
  }

  spawn(input: SpawnBulletInput): void {
    const bulletIndex = this.freeBulletIndexes.pop();

    if (bulletIndex === undefined) {
      return;
    }

    const bullet = this.bullets[bulletIndex];
    this.spawnDirection.set(input.directionX, input.directionY);

    if (this.spawnDirection.lengthSq() === 0) {
      this.freeBulletIndexes.push(bulletIndex);
      return;
    }

    this.spawnDirection.normalize();
    bullet.x = input.x;
    bullet.y = input.y;
    bullet.velocityX = this.spawnDirection.x * BULLET_SPEED;
    bullet.velocityY = this.spawnDirection.y * BULLET_SPEED;
    bullet.damage =
      BULLET_DEFAULT_DAMAGE + this.getSkillModifiers().bulletDamageBonus;
    bullet.view.setPosition(bullet.x, bullet.y);
    bullet.view.setRotation(this.spawnDirection.angle());
    bullet.view.setActive(true);
    bullet.view.setVisible(true);
    this.activeBullets.push(bullet);
  }

  update(delta: number): void {
    const deltaSeconds = delta / MILLISECONDS_PER_SECOND;

    for (let index = this.activeBullets.length - 1; index >= 0; index -= 1) {
      const bullet = this.activeBullets[index];

      bullet.x += bullet.velocityX * deltaSeconds;
      bullet.y += bullet.velocityY * deltaSeconds;
      bullet.view.setPosition(bullet.x, bullet.y);

      if (!this.arenaBounds.containsWithPadding(
        bullet.x,
        bullet.y,
        BULLET_DESPAWN_PADDING,
      )) {
        this.deactivateActiveBullet(index);
      }
    }
  }

  destroy(): void {
    for (const bullet of this.bullets) {
      bullet.view.destroy();
    }

    this.activeBullets.length = 0;
    this.freeBulletIndexes.length = 0;
  }

  deactivate(bullet: Bullet): void {
    const activeBulletIndex = this.activeBullets.indexOf(bullet);

    if (activeBulletIndex === -1) {
      return;
    }

    this.deactivateActiveBullet(activeBulletIndex);
  }

  private createBullet(poolIndex: number): Bullet {
    const view = this.scene.add.image(
      0,
      0,
      BULLET_PROJECTILE_DESIGN.texture.key
    );

    view.setBlendMode(Phaser.BlendModes.ADD);
    view.setActive(false);
    view.setVisible(false);

    return {
      view,
      poolIndex,
      x: 0,
      y: 0,
      velocityX: 0,
      velocityY: 0,
      damage: BULLET_DEFAULT_DAMAGE,
      collisionCategory: COLLISION_CATEGORIES.PLAYER_BULLET,
    };
  }

  private ensureBulletTexture(): void {
    if (this.scene.textures.exists(BULLET_PROJECTILE_DESIGN.texture.key)) {
      return;
    }

    const graphics = this.scene.add.graphics();
    const design = BULLET_PROJECTILE_DESIGN;
    const centerY = design.texture.height / 2;

    graphics.fillStyle(design.colors.shadow, design.alpha.trail);
    graphics.fillEllipse(
      design.trail.endX,
      centerY,
      design.trail.width,
      design.trail.height
    );

    graphics.fillStyle(design.colors.glow, design.alpha.outerGlow);
    graphics.fillEllipse(
      design.body.x,
      design.body.y,
      design.glow.outer.width,
      design.glow.outer.height
    );

    graphics.fillStyle(design.colors.glow, design.alpha.midGlow);
    graphics.fillEllipse(
      design.body.x,
      design.body.y,
      design.glow.mid.width,
      design.glow.mid.height
    );

    graphics.fillStyle(design.colors.trail, design.alpha.trail);
    graphics.fillEllipse(
      design.trail.endX,
      centerY,
      design.trail.width,
      design.trail.height
    );

    graphics.fillStyle(design.colors.glow, design.alpha.body);
    graphics.fillEllipse(
      design.body.x,
      design.body.y,
      design.body.width,
      design.body.height
    );
    graphics.fillTriangle(
      design.body.x,
      design.nose.topY,
      design.nose.x,
      centerY,
      design.body.x,
      design.nose.bottomY
    );

    graphics.fillStyle(design.colors.core, design.alpha.core);
    graphics.fillEllipse(
      design.body.x,
      design.body.y,
      design.core.width,
      design.core.height
    );

    graphics.lineStyle(
      design.trail.streakWidth,
      design.colors.trail,
      design.alpha.streak
    );
    for (const streak of design.trail.streaks) {
      graphics.lineStyle(
        design.trail.streakWidth,
        design.colors.trail,
        streak.alpha
      );
      graphics.lineBetween(streak.startX, streak.startY, streak.endX, streak.endY);
    }

    for (const spark of design.trail.sparks) {
      graphics.fillStyle(design.colors.trail, spark.alpha);
      graphics.fillPoint(spark.x, spark.y, design.trail.sparkSize);
    }

    graphics.generateTexture(
      design.texture.key,
      design.texture.width,
      design.texture.height
    );
    graphics.destroy();
  }

  private deactivateActiveBullet(activeBulletIndex: number): void {
    const bullet = this.activeBullets[activeBulletIndex];
    const lastActiveBullet = this.activeBullets.pop();

    if (lastActiveBullet && lastActiveBullet !== bullet) {
      this.activeBullets[activeBulletIndex] = lastActiveBullet;
    }

    bullet.x = 0;
    bullet.y = 0;
    bullet.velocityX = 0;
    bullet.velocityY = 0;
    bullet.view.setPosition(bullet.x, bullet.y);
    bullet.view.setActive(false);
    bullet.view.setVisible(false);
    this.freeBulletIndexes.push(bullet.poolIndex);
  }
}
