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

    graphics.lineStyle(
      design.trail.center.width,
      design.colors.trail,
      design.alpha.trailGlow
    );
    graphics.lineBetween(
      design.trail.center.startX,
      design.trail.center.startY,
      design.trail.center.endX,
      design.trail.center.endY
    );

    graphics.lineStyle(
      design.trail.upper.width,
      design.colors.trail,
      design.alpha.trail
    );
    graphics.lineBetween(
      design.trail.upper.startX,
      design.trail.upper.startY,
      design.trail.upper.endX,
      design.trail.upper.endY
    );
    graphics.lineBetween(
      design.trail.lower.startX,
      design.trail.lower.startY,
      design.trail.lower.endX,
      design.trail.lower.endY
    );

    graphics.lineStyle(
      design.trail.center.width,
      design.colors.highlight,
      design.alpha.trailCore
    );
    graphics.lineBetween(
      design.trail.center.startX,
      design.trail.center.startY,
      design.trail.center.endX,
      design.trail.center.endY
    );

    graphics.fillStyle(design.colors.glow, design.alpha.outerGlow);
    graphics.fillRoundedRect(
      design.glow.outer.x,
      design.glow.outer.y,
      design.glow.outer.width,
      design.glow.outer.height,
      design.glow.outer.radius
    );

    graphics.fillStyle(design.colors.glow, design.alpha.innerGlow);
    graphics.fillRoundedRect(
      design.glow.inner.x,
      design.glow.inner.y,
      design.glow.inner.width,
      design.glow.inner.height,
      design.glow.inner.radius
    );

    graphics.fillStyle(design.colors.body, design.alpha.body);
    graphics.fillRoundedRect(
      design.body.x,
      design.body.y,
      design.body.width,
      design.body.height,
      design.body.radius
    );

    graphics.fillStyle(design.colors.core, design.alpha.core);
    graphics.fillRoundedRect(
      design.core.x,
      design.core.y,
      design.core.width,
      design.core.height,
      design.core.radius
    );

    graphics.lineStyle(
      design.rim.lineWidth,
      design.colors.rim,
      design.alpha.rim
    );
    graphics.strokeRoundedRect(
      design.rim.x,
      design.rim.y,
      design.rim.width,
      design.rim.height,
      design.rim.radius
    );

    graphics.fillStyle(design.colors.highlight, design.alpha.highlight);
    graphics.fillRect(
      design.highlights.top.x,
      design.highlights.top.y,
      design.highlights.top.width,
      design.highlights.top.height
    );
    graphics.fillRect(
      design.highlights.bottom.x,
      design.highlights.bottom.y,
      design.highlights.bottom.width,
      design.highlights.bottom.height
    );

    graphics.fillStyle(design.colors.highlight, design.alpha.capHighlight);
    graphics.fillRect(
      design.highlights.rightCap.x,
      design.highlights.rightCap.y,
      design.highlights.rightCap.width,
      design.highlights.rightCap.height
    );
    graphics.fillRect(
      design.highlights.leftCap.x,
      design.highlights.leftCap.y,
      design.highlights.leftCap.width,
      design.highlights.leftCap.height
    );

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
