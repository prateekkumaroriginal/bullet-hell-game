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

  constructor(private readonly scene: Phaser.Scene) {
    this.bullets = Array.from({ length: BULLET_POOL_SIZE }, () =>
      this.createBullet(),
    );
  }

  spawn(input: SpawnBulletInput): void {
    const bullet = this.bullets.find((candidate) => !candidate.active);

    if (!bullet) {
      return;
    }

    const direction = new Phaser.Math.Vector2(input.directionX, input.directionY);

    if (direction.lengthSq() === 0) {
      return;
    }

    direction.normalize();
    bullet.velocity.set(direction.x * BULLET_SPEED, direction.y * BULLET_SPEED);
    bullet.setPosition(input.x, input.y);
    bullet.setRotation(direction.angle());
    bullet.setActive(true);
    bullet.setVisible(true);
  }

  update(delta: number): void {
    const deltaSeconds = delta / MILLISECONDS_PER_SECOND;

    for (const bullet of this.bullets) {
      if (!bullet.active) {
        continue;
      }

      bullet.x += bullet.velocity.x * deltaSeconds;
      bullet.y += bullet.velocity.y * deltaSeconds;

      if (this.isOutsideArena(bullet)) {
        this.deactivate(bullet);
      }
    }
  }

  destroy(): void {
    for (const bullet of this.bullets) {
      bullet.destroy();
    }
  }

  private createBullet(): Bullet {
    const bullet = this.scene.add.ellipse(
      0,
      0,
      BULLET_WIDTH,
      BULLET_HEIGHT,
      BULLET_FILL_COLOR,
    ) as Bullet;

    bullet.velocity = new Phaser.Math.Vector2();
    bullet.setStrokeStyle(BULLET_STROKE_WIDTH, BULLET_STROKE_COLOR);
    this.deactivate(bullet);

    return bullet;
  }

  private deactivate(bullet: Bullet): void {
    bullet.velocity.set(0, 0);
    bullet.setActive(false);
    bullet.setVisible(false);
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
