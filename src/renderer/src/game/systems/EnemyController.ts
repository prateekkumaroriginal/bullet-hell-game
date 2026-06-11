import Phaser from "phaser";
import { BULLET_HIT_RADIUS } from "../config/bullet-config";
import { ENEMY_RADIUS } from "../config/enemy-config";
import {
  PLAYER_ENEMY_CONTACT_DAMAGE,
  PLAYER_RADIUS,
} from "../config/player-config";
import { COLLISION_CATEGORIES, canCollide } from "../config/collision-config";
import { ArenaBounds } from "./ArenaBounds";
import { type BulletPool } from "./BulletPool";
import { EnemyPool } from "./EnemyPool";
import { PlayerController } from "./PlayerController";

export class EnemyController {
  private readonly enemyPool: EnemyPool;

  constructor(
    scene: Phaser.Scene,
    arenaBounds: ArenaBounds,
    getPlayer: () => Phaser.GameObjects.Arc,
  ) {
    this.enemyPool = new EnemyPool(scene, arenaBounds, getPlayer);
  }

  get activeEnemyCount(): number {
    return this.enemyPool.active.length;
  }

  spawnEnemy(): void {
    this.enemyPool.spawn();
  }

  update(delta: number): void {
    this.enemyPool.update(delta);
  }

  resolveBulletHits(bulletPool: BulletPool): void {
    const bullets = bulletPool.active;
    const enemies = this.enemyPool.active;
    const hitDistance = ENEMY_RADIUS + BULLET_HIT_RADIUS;
    const hitDistanceSquared = hitDistance * hitDistance;

    for (let enemyIndex = enemies.length - 1; enemyIndex >= 0; enemyIndex -= 1) {
      const enemy = enemies[enemyIndex];

      for (let bulletIndex = bullets.length - 1; bulletIndex >= 0; bulletIndex -= 1) {
        const bullet = bullets[bulletIndex];

        if (!canCollide(bullet.collisionCategory, enemy.collisionCategory)) {
          continue;
        }

        const distanceSquared = Phaser.Math.Distance.Squared(
          bullet.x,
          bullet.y,
          enemy.x,
          enemy.y,
        );

        if (distanceSquared > hitDistanceSquared) {
          continue;
        }

        bulletPool.deactivate(bullet);
        this.enemyPool.damageActive(enemyIndex, bullet.damage);
        break;
      }
    }
  }

  resolvePlayerContact(playerController: PlayerController): void {
    if (!playerController.canTakeDamage) {
      return;
    }

    const player = playerController.gameObject;
    const hitDistance = ENEMY_RADIUS + PLAYER_RADIUS;
    const hitDistanceSquared = hitDistance * hitDistance;

    for (const enemy of this.enemyPool.active) {
      if (!canCollide(enemy.collisionCategory, COLLISION_CATEGORIES.PLAYER)) {
        continue;
      }

      const distanceSquared = Phaser.Math.Distance.Squared(
        enemy.x,
        enemy.y,
        player.x,
        player.y,
      );

      if (distanceSquared > hitDistanceSquared) {
        continue;
      }

      playerController.takeDamage(PLAYER_ENEMY_CONTACT_DAMAGE);
      return;
    }
  }

  destroy(): void {
    this.enemyPool.destroy();
  }
}
