import Phaser from "phaser";
import {
  BULLET_DEFAULT_DAMAGE,
  BULLET_DESPAWN_PADDING,
  BULLET_FILL_COLOR,
  BULLET_HEIGHT,
  BULLET_POOL_SIZE,
  BULLET_SPEED,
  BULLET_STROKE_COLOR,
  BULLET_STROKE_WIDTH,
  BULLET_WIDTH,
  MILLISECONDS_PER_SECOND,
} from "../config/game-config";
import { COLLISION_CATEGORIES, type CollisionCategory } from "../config/collision-config";
import { ArenaBounds } from "./ArenaBounds";

type Bullet = {
  view: Phaser.GameObjects.Ellipse;
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
  ) {
    this.bullets = Array.from({ length: BULLET_POOL_SIZE }, (_, index) =>
      this.createBullet(index),
    );

    for (const bullet of this.bullets) {
      this.freeBulletIndexes.push(bullet.poolIndex);
    }
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

  private createBullet(poolIndex: number): Bullet {
    const view = this.scene.add.ellipse(
      0,
      0,
      BULLET_WIDTH,
      BULLET_HEIGHT,
      BULLET_FILL_COLOR,
    );

    view.setStrokeStyle(BULLET_STROKE_WIDTH, BULLET_STROKE_COLOR);
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
