import Phaser from "phaser";
import {
  ENEMY_FILL_COLOR,
  ENEMY_MAX_HEALTH,
  ENEMY_MOVE_SPEED,
  ENEMY_OVERLAP_FALLBACK_DISTANCE,
  ENEMY_POOL_SIZE,
  ENEMY_RADIUS,
  ENEMY_SEPARATION_RADIUS,
  ENEMY_SEPARATION_STRENGTH,
  ENEMY_STROKE_COLOR,
  ENEMY_STROKE_WIDTH,
  MILLISECONDS_PER_SECOND,
} from "../config/game-config";
import { COLLISION_CATEGORIES, type CollisionCategory } from "../config/collision-config";
import { ArenaBounds } from "./ArenaBounds";

type EnemySpawnEdge = "top" | "right" | "bottom" | "left";

const ENEMY_SPAWN_EDGES: EnemySpawnEdge[] = ["top", "right", "bottom", "left"];

export type Enemy = {
  view: Phaser.GameObjects.Arc;
  poolIndex: number;
  x: number;
  y: number;
  health: number;
  collisionCategory: CollisionCategory;
};

export class EnemyPool {
  private readonly enemies: Enemy[];
  private readonly activeEnemies: Enemy[] = [];
  private readonly freeEnemyIndexes: number[] = [];
  private readonly movementDirection = new Phaser.Math.Vector2();
  private readonly spawnPosition = new Phaser.Math.Vector2();
  private readonly separatedPosition = { x: 0, y: 0 };

  constructor(
    private readonly scene: Phaser.Scene,
    private readonly arenaBounds: ArenaBounds,
    private readonly getPlayer: () => Phaser.GameObjects.Arc,
  ) {
    this.enemies = Array.from({ length: ENEMY_POOL_SIZE }, (_, index) =>
      this.createEnemy(index),
    );

    for (const enemy of this.enemies) {
      this.freeEnemyIndexes.push(enemy.poolIndex);
    }
  }

  get active(): readonly Enemy[] {
    return this.activeEnemies;
  }

  spawn(): void {
    const enemyIndex = this.freeEnemyIndexes.pop();

    if (enemyIndex === undefined) {
      return;
    }

    const enemy = this.enemies[enemyIndex];
    const spawnPosition = this.getRandomEdgeSpawnPosition();

    enemy.x = spawnPosition.x;
    enemy.y = spawnPosition.y;
    enemy.health = ENEMY_MAX_HEALTH;
    enemy.view.setPosition(enemy.x, enemy.y);
    enemy.view.setActive(true);
    enemy.view.setVisible(true);
    this.activeEnemies.push(enemy);
  }

  update(delta: number): void {
    const player = this.getPlayer();
    const deltaSeconds = delta / MILLISECONDS_PER_SECOND;

    for (const enemy of this.activeEnemies) {
      this.movementDirection.set(player.x - enemy.x, player.y - enemy.y);

      if (this.movementDirection.lengthSq() === 0) {
        continue;
      }

      this.movementDirection.normalize();
      enemy.x += this.movementDirection.x * ENEMY_MOVE_SPEED * deltaSeconds;
      enemy.y += this.movementDirection.y * ENEMY_MOVE_SPEED * deltaSeconds;
    }

    this.separateEnemies();
    this.syncActiveEnemyViews();
  }

  damageActive(activeEnemyIndex: number, damageAmount: number): void {
    const enemy = this.activeEnemies[activeEnemyIndex];

    if (!enemy) {
      return;
    }

    enemy.health -= damageAmount;

    if (enemy.health <= 0) {
      this.deactivateActiveEnemy(activeEnemyIndex);
    }
  }

  destroy(): void {
    for (const enemy of this.enemies) {
      enemy.view.destroy();
    }

    this.activeEnemies.length = 0;
    this.freeEnemyIndexes.length = 0;
  }

  private createEnemy(poolIndex: number): Enemy {
    const view = this.scene.add.circle(
      0,
      0,
      ENEMY_RADIUS,
      ENEMY_FILL_COLOR,
    );

    view.setStrokeStyle(ENEMY_STROKE_WIDTH, ENEMY_STROKE_COLOR);
    view.setActive(false);
    view.setVisible(false);

    return {
      view,
      poolIndex,
      x: 0,
      y: 0,
      health: ENEMY_MAX_HEALTH,
      collisionCategory: COLLISION_CATEGORIES.ENEMY,
    };
  }

  private deactivateActiveEnemy(activeEnemyIndex: number): void {
    const enemy = this.activeEnemies[activeEnemyIndex];
    const lastActiveEnemy = this.activeEnemies.pop();

    if (lastActiveEnemy && lastActiveEnemy !== enemy) {
      this.activeEnemies[activeEnemyIndex] = lastActiveEnemy;
    }

    enemy.x = 0;
    enemy.y = 0;
    enemy.health = ENEMY_MAX_HEALTH;
    enemy.view.setPosition(enemy.x, enemy.y);
    enemy.view.setActive(false);
    enemy.view.setVisible(false);
    this.freeEnemyIndexes.push(enemy.poolIndex);
  }

  private separateEnemies(): void {
    const minimumDistanceSquared = ENEMY_SEPARATION_RADIUS * ENEMY_SEPARATION_RADIUS;

    for (
      let firstEnemyIndex = 0;
      firstEnemyIndex < this.activeEnemies.length;
      firstEnemyIndex += 1
    ) {
      const firstEnemy = this.activeEnemies[firstEnemyIndex];

      for (
        let secondEnemyIndex = firstEnemyIndex + 1;
        secondEnemyIndex < this.activeEnemies.length;
        secondEnemyIndex += 1
      ) {
        const secondEnemy = this.activeEnemies[secondEnemyIndex];
        let deltaX = secondEnemy.x - firstEnemy.x;
        let deltaY = secondEnemy.y - firstEnemy.y;
        const distanceSquared = deltaX * deltaX + deltaY * deltaY;

        if (distanceSquared >= minimumDistanceSquared) {
          continue;
        }

        if (distanceSquared === 0) {
          deltaX = ENEMY_OVERLAP_FALLBACK_DISTANCE;
          deltaY = 0;
        }

        const distance = Math.max(
          Math.sqrt(distanceSquared),
          ENEMY_OVERLAP_FALLBACK_DISTANCE,
        );
        const overlap = ENEMY_SEPARATION_RADIUS - distance;
        const pushDistance = overlap * ENEMY_SEPARATION_STRENGTH;
        const pushX = (deltaX / distance) * pushDistance;
        const pushY = (deltaY / distance) * pushDistance;

        this.setEnemyPosition(firstEnemy, firstEnemy.x - pushX, firstEnemy.y - pushY);
        this.setEnemyPosition(secondEnemy, secondEnemy.x + pushX, secondEnemy.y + pushY);
      }
    }
  }

  private syncActiveEnemyViews(): void {
    for (const enemy of this.activeEnemies) {
      enemy.view.setPosition(enemy.x, enemy.y);
    }
  }

  private setEnemyPosition(enemy: Enemy, x: number, y: number): void {
    const clampedPosition = this.arenaBounds.clampCircle(x, y, ENEMY_RADIUS);

    this.separatedPosition.x = clampedPosition.x;
    this.separatedPosition.y = clampedPosition.y;
    enemy.x = this.separatedPosition.x;
    enemy.y = this.separatedPosition.y;
  }

  private getRandomEdgeSpawnPosition(): Phaser.Math.Vector2 {
    const edge = Phaser.Math.RND.pick(ENEMY_SPAWN_EDGES);

    switch (edge) {
      case "top":
        return this.spawnPosition.set(
          this.getRandomSpawnCoordinate(this.arenaBounds.width),
          ENEMY_RADIUS,
        );
      case "right":
        return this.spawnPosition.set(
          this.arenaBounds.width - ENEMY_RADIUS,
          this.getRandomSpawnCoordinate(this.arenaBounds.height),
        );
      case "bottom":
        return this.spawnPosition.set(
          this.getRandomSpawnCoordinate(this.arenaBounds.width),
          this.arenaBounds.height - ENEMY_RADIUS,
        );
      case "left":
        return this.spawnPosition.set(
          ENEMY_RADIUS,
          this.getRandomSpawnCoordinate(this.arenaBounds.height),
        );
      default:
        return assertNever(edge);
    }
  }

  private getRandomSpawnCoordinate(arenaSize: number): number {
    const minCoordinate = ENEMY_RADIUS;
    const maxCoordinate = Math.max(ENEMY_RADIUS, arenaSize - ENEMY_RADIUS);

    return Phaser.Math.Between(minCoordinate, maxCoordinate);
  }
}

function assertNever(value: never): never {
  throw new Error(`Unhandled enemy spawn edge: ${value}`);
}
