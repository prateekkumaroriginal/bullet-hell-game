import Phaser from "phaser";
import {
  BULLET_DEFAULT_DAMAGE,
  BULLET_DESPAWN_PADDING,
  BULLET_POOL_SIZE,
  BULLET_PROJECTILE_DESIGN,
  BULLET_SPEED
} from "../config/bullet-config";
import { MILLISECONDS_PER_SECOND } from "../config/time-config";
import {
  COLLISION_CATEGORIES,
  type CollisionCategory
} from "../config/collision-config";
import { type SkillRuntimeModifiers } from "../config/skill-config";
import { ArenaBounds } from "./ArenaBounds";

export type Bullet = {
  bodyView: Phaser.GameObjects.Image;
  tailView: Phaser.GameObjects.Image;
  poolIndex: number;
  x: number;
  y: number;
  spawnX: number;
  spawnY: number;
  directionX: number;
  directionY: number;
  velocityX: number;
  velocityY: number;
  ageMs: number;
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
    private readonly getSkillModifiers: () => SkillRuntimeModifiers
  ) {
    this.ensureBulletTextures();
    this.bullets = Array.from({ length: BULLET_POOL_SIZE }, (_, index) =>
      this.createBullet(index)
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
    bullet.spawnX = input.x;
    bullet.spawnY = input.y;
    bullet.directionX = this.spawnDirection.x;
    bullet.directionY = this.spawnDirection.y;
    bullet.velocityX = this.spawnDirection.x * BULLET_SPEED;
    bullet.velocityY = this.spawnDirection.y * BULLET_SPEED;
    bullet.ageMs = 0;
    bullet.damage =
      BULLET_DEFAULT_DAMAGE + this.getSkillModifiers().bulletDamageBonus;
    this.updateBulletViews(bullet);
    bullet.bodyView.setActive(true);
    bullet.bodyView.setVisible(true);
    bullet.tailView.setActive(true);
    bullet.tailView.setVisible(true);
    this.activeBullets.push(bullet);
  }

  update(delta: number): void {
    const deltaSeconds = delta / MILLISECONDS_PER_SECOND;

    for (let index = this.activeBullets.length - 1; index >= 0; index -= 1) {
      const bullet = this.activeBullets[index];

      bullet.x += bullet.velocityX * deltaSeconds;
      bullet.y += bullet.velocityY * deltaSeconds;
      bullet.ageMs += delta;
      this.updateBulletViews(bullet);

      if (!this.arenaBounds.containsWithPadding(
        bullet.x,
        bullet.y,
        BULLET_DESPAWN_PADDING
      )) {
        this.deactivateActiveBullet(index);
      }
    }
  }

  destroy(): void {
    for (const bullet of this.bullets) {
      bullet.bodyView.destroy();
      bullet.tailView.destroy();
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
    const tailView = this.scene.add.image(
      0,
      0,
      BULLET_PROJECTILE_DESIGN.textures.tail.key
    );
    const bodyView = this.scene.add.image(
      0,
      0,
      BULLET_PROJECTILE_DESIGN.textures.body.key
    );
    const { body, tail } = BULLET_PROJECTILE_DESIGN.textures;

    tailView.setOrigin(tail.originX, tail.originY);
    tailView.setBlendMode(Phaser.BlendModes.ADD);
    tailView.setActive(false);
    tailView.setVisible(false);
    bodyView.setOrigin(body.originX, body.originY);
    bodyView.setBlendMode(Phaser.BlendModes.ADD);
    bodyView.setActive(false);
    bodyView.setVisible(false);

    return {
      bodyView,
      tailView,
      poolIndex,
      x: 0,
      y: 0,
      spawnX: 0,
      spawnY: 0,
      directionX: 0,
      directionY: 0,
      velocityX: 0,
      velocityY: 0,
      ageMs: 0,
      damage: BULLET_DEFAULT_DAMAGE,
      collisionCategory: COLLISION_CATEGORIES.PLAYER_BULLET
    };
  }

  private ensureBulletTextures(): void {
    const design = BULLET_PROJECTILE_DESIGN;

    if (
      this.scene.textures.exists(design.textures.body.key) &&
      this.scene.textures.exists(design.textures.tail.key)
    ) {
      return;
    }

    const graphics = this.scene.add.graphics();

    if (!this.scene.textures.exists(design.textures.tail.key)) {
      this.drawBulletTailTexture(graphics);
      graphics.generateTexture(
        design.textures.tail.key,
        design.textures.tail.width,
        design.textures.tail.height
      );
      graphics.clear();
    }

    if (!this.scene.textures.exists(design.textures.body.key)) {
      this.drawBulletBodyTexture(graphics);
      graphics.generateTexture(
        design.textures.body.key,
        design.textures.body.width,
        design.textures.body.height
      );
    }

    graphics.destroy();
  }

  private drawBulletTailTexture(graphics: Phaser.GameObjects.Graphics): void {
    const design = BULLET_PROJECTILE_DESIGN;

    for (const segment of design.trail.fadeSegments) {
      graphics.lineStyle(
        design.trail.glowWidth,
        design.colors.trail,
        design.alpha.trailGlow * segment.alphaScale
      );
      graphics.lineBetween(
        segment.startX,
        design.trail.y,
        segment.endX,
        design.trail.y
      );
    }

    for (const segment of design.trail.fadeSegments) {
      graphics.lineStyle(
        design.trail.beamWidth,
        design.colors.trail,
        design.alpha.trail * segment.alphaScale
      );
      graphics.lineBetween(
        segment.startX,
        design.trail.y,
        segment.endX,
        design.trail.y
      );
    }

    graphics.lineStyle(
      design.trail.coreWidth,
      design.colors.highlight,
      design.alpha.trailCore
    );
    graphics.lineBetween(
      design.trail.startX,
      design.trail.y,
      design.trail.endX,
      design.trail.y
    );
  }

  private drawBulletBodyTexture(graphics: Phaser.GameObjects.Graphics): void {
    const design = BULLET_PROJECTILE_DESIGN;

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
  }

  private updateBulletViews(bullet: Bullet): void {
    const design = BULLET_PROJECTILE_DESIGN;
    const rotation = Math.atan2(bullet.directionY, bullet.directionX);
    const tailProgress =
      design.trail.growDurationMs <= 0
        ? 1
        : Math.min(1, bullet.ageMs / design.trail.growDurationMs);
    const distanceFromSpawn = Math.hypot(
      bullet.x - bullet.spawnX,
      bullet.y - bullet.spawnY
    );
    const tailSpawnLength =
      design.textures.tail.width * design.trail.spawnScaleX;
    const tailDistanceScaleX = Math.min(
      1,
      (tailSpawnLength + distanceFromSpawn) / design.textures.tail.width
    );
    const tailTimeScaleX =
      design.trail.spawnScaleX +
      (1 - design.trail.spawnScaleX) * tailProgress;
    const tailScaleX = Math.min(tailTimeScaleX, tailDistanceScaleX);
    const tailVisibleProgress =
      (tailScaleX - design.trail.spawnScaleX) /
      (1 - design.trail.spawnScaleX);
    const tailAlpha =
      design.trail.spawnAlpha +
      (1 - design.trail.spawnAlpha) * tailVisibleProgress;
    const tailX = bullet.x + bullet.directionX * design.trail.attachOffsetX;
    const tailY = bullet.y + bullet.directionY * design.trail.attachOffsetX;

    bullet.bodyView.setPosition(bullet.x, bullet.y);
    bullet.bodyView.setRotation(rotation);
    bullet.tailView.setPosition(tailX, tailY);
    bullet.tailView.setRotation(rotation);
    bullet.tailView.setScale(tailScaleX, 1);
    bullet.tailView.setAlpha(tailAlpha);
  }

  private resetBulletViews(bullet: Bullet): void {
    bullet.bodyView.setPosition(bullet.x, bullet.y);
    bullet.bodyView.setActive(false);
    bullet.bodyView.setVisible(false);
    bullet.tailView.setPosition(bullet.x, bullet.y);
    bullet.tailView.setScale(
      BULLET_PROJECTILE_DESIGN.trail.spawnScaleX,
      1
    );
    bullet.tailView.setAlpha(BULLET_PROJECTILE_DESIGN.trail.spawnAlpha);
    bullet.tailView.setActive(false);
    bullet.tailView.setVisible(false);
  }

  private deactivateActiveBullet(activeBulletIndex: number): void {
    const bullet = this.activeBullets[activeBulletIndex];
    const lastActiveBullet = this.activeBullets.pop();

    if (lastActiveBullet && lastActiveBullet !== bullet) {
      this.activeBullets[activeBulletIndex] = lastActiveBullet;
    }

    bullet.x = 0;
    bullet.y = 0;
    bullet.spawnX = 0;
    bullet.spawnY = 0;
    bullet.directionX = 0;
    bullet.directionY = 0;
    bullet.velocityX = 0;
    bullet.velocityY = 0;
    bullet.ageMs = 0;
    this.resetBulletViews(bullet);
    this.freeBulletIndexes.push(bullet.poolIndex);
  }
}
