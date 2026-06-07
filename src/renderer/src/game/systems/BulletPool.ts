import Phaser from "phaser";
import {
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

type Bullet = Phaser.GameObjects.Ellipse & {
  poolIndex: number;
  velocity: Phaser.Math.Vector2;
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

  constructor(private readonly scene: Phaser.Scene) {
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
    bullet.velocity.set(
      this.spawnDirection.x * BULLET_SPEED,
      this.spawnDirection.y * BULLET_SPEED,
    );
    bullet.setPosition(input.x, input.y);
    bullet.setRotation(this.spawnDirection.angle());
    bullet.setActive(true);
    bullet.setVisible(true);
    this.activeBullets.push(bullet);
  }

  update(delta: number): void {
    const deltaSeconds = delta / MILLISECONDS_PER_SECOND;

    for (let index = this.activeBullets.length - 1; index >= 0; index -= 1) {
      const bullet = this.activeBullets[index];

      bullet.x += bullet.velocity.x * deltaSeconds;
      bullet.y += bullet.velocity.y * deltaSeconds;

      if (this.isOutsideArena(bullet)) {
        this.deactivateActiveBullet(index);
      }
    }
  }

  destroy(): void {
    for (const bullet of this.bullets) {
      bullet.destroy();
    }

    this.activeBullets.length = 0;
    this.freeBulletIndexes.length = 0;
  }

  private createBullet(poolIndex: number): Bullet {
    const bullet = this.scene.add.ellipse(
      0,
      0,
      BULLET_WIDTH,
      BULLET_HEIGHT,
      BULLET_FILL_COLOR,
    ) as Bullet;

    bullet.poolIndex = poolIndex;
    bullet.velocity = new Phaser.Math.Vector2();
    bullet.setStrokeStyle(BULLET_STROKE_WIDTH, BULLET_STROKE_COLOR);
    bullet.setActive(false);
    bullet.setVisible(false);

    return bullet;
  }

  private deactivateActiveBullet(activeBulletIndex: number): void {
    const bullet = this.activeBullets[activeBulletIndex];
    const lastActiveBullet = this.activeBullets.pop();

    if (lastActiveBullet && lastActiveBullet !== bullet) {
      this.activeBullets[activeBulletIndex] = lastActiveBullet;
    }

    bullet.velocity.set(0, 0);
    bullet.setActive(false);
    bullet.setVisible(false);
    this.freeBulletIndexes.push(bullet.poolIndex);
  }

  private isOutsideArena(bullet: Bullet): boolean {
    return (
      bullet.x < -BULLET_DESPAWN_PADDING ||
      bullet.x > this.scene.scale.width + BULLET_DESPAWN_PADDING ||
      bullet.y < -BULLET_DESPAWN_PADDING ||
      bullet.y > this.scene.scale.height + BULLET_DESPAWN_PADDING
    );
  }
}
