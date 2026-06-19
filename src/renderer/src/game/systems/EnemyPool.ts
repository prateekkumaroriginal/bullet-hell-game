import Phaser from "phaser";
import {
  ENEMY_DEFINITIONS,
  ENEMY_OVERLAP_FALLBACK_DISTANCE,
  ENEMY_POOL_SIZE,
  ENEMY_SEPARATION_RADIUS_MULTIPLIER,
  ENEMY_SEPARATION_STRENGTH,
  ENEMY_STROKE_WIDTH,
  ENEMY_TYPE_IDS,
  type EnemyDefinition,
  type EnemyTypeId,
} from "../config/enemy-config";
import { MILLISECONDS_PER_SECOND } from "../config/time-config";
import { COLLISION_CATEGORIES, type CollisionCategory } from "../config/collision-config";
import { ArenaBounds } from "./ArenaBounds";

type EnemySpawnEdge = "top" | "right" | "bottom" | "left";

const ENEMY_SPAWN_EDGES: EnemySpawnEdge[] = ["top", "right", "bottom", "left"];

export type Enemy = {
  view: Phaser.GameObjects.Arc;
  poolIndex: number;
  spawnId: number;
  typeId: EnemyTypeId;
  x: number;
  y: number;
  radius: number;
  health: number;
  maxHealth: number;
  moveSpeed: number;
  experienceOrbCount: number;
  experienceValuePerOrb: number;
  collisionCategory: CollisionCategory;
};

export type EnemySpawnToken = {
  poolIndex: number;
  spawnId: number;
  typeId: EnemyTypeId;
};

export type EnemyDeathDrop = {
  x: number;
  y: number;
  experienceOrbCount: number;
  experienceValuePerOrb: number;
};

export class EnemyPool {
  private readonly enemies: Enemy[];
  private readonly activeEnemies: Enemy[] = [];
  private readonly freeEnemyIndexes: number[] = [];
  private readonly movementDirection = new Phaser.Math.Vector2();
  private readonly spawnPosition = new Phaser.Math.Vector2();
  private readonly separatedPosition = { x: 0, y: 0 };
  private nextSpawnId = 1;

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

  spawn(enemyTypeId: EnemyTypeId): EnemySpawnToken | null {
    const enemyIndex = this.freeEnemyIndexes.pop();

    if (enemyIndex === undefined) {
      return null;
    }

    const enemy = this.enemies[enemyIndex];
    const enemyDefinition = ENEMY_DEFINITIONS[enemyTypeId];
    const spawnPosition = this.getRandomEdgeSpawnPosition(enemyDefinition.radius);

    this.applyEnemyDefinition(enemy, enemyDefinition);
    enemy.spawnId = this.nextSpawnId;
    this.nextSpawnId += 1;
    enemy.x = spawnPosition.x;
    enemy.y = spawnPosition.y;
    enemy.view.setPosition(enemy.x, enemy.y);
    enemy.view.setActive(true);
    enemy.view.setVisible(true);
    this.activeEnemies.push(enemy);
    return {
      poolIndex: enemy.poolIndex,
      spawnId: enemy.spawnId,
      typeId: enemy.typeId
    };
  }

  isSpawnActive(spawnToken: EnemySpawnToken): boolean {
    const enemy = this.enemies[spawnToken.poolIndex];

    return enemy.view.active && enemy.spawnId === spawnToken.spawnId;
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
      enemy.x += this.movementDirection.x * enemy.moveSpeed * deltaSeconds;
      enemy.y += this.movementDirection.y * enemy.moveSpeed * deltaSeconds;
    }

    this.separateEnemies();
    this.syncActiveEnemyViews();
  }

  damageActive(
    activeEnemyIndex: number,
    damageAmount: number,
  ): EnemyDeathDrop | undefined {
    const enemy = this.activeEnemies[activeEnemyIndex];

    if (!enemy) {
      return undefined;
    }

    enemy.health -= damageAmount;

    if (enemy.health <= 0) {
      const deathDrop: EnemyDeathDrop = {
        x: enemy.x,
        y: enemy.y,
        experienceOrbCount: enemy.experienceOrbCount,
        experienceValuePerOrb: enemy.experienceValuePerOrb,
      };

      this.deactivateActiveEnemy(activeEnemyIndex);
      return deathDrop;
    }

    return undefined;
  }

  destroy(): void {
    for (const enemy of this.enemies) {
      enemy.view.destroy();
    }

    this.activeEnemies.length = 0;
    this.freeEnemyIndexes.length = 0;
  }

  private createEnemy(poolIndex: number): Enemy {
    const enemyDefinition = ENEMY_DEFINITIONS[ENEMY_TYPE_IDS.CHASER];
    const view = this.scene.add.circle(
      0,
      0,
      enemyDefinition.radius,
      enemyDefinition.fillColor,
    );

    view.setStrokeStyle(ENEMY_STROKE_WIDTH, enemyDefinition.strokeColor);
    view.setActive(false);
    view.setVisible(false);

    return {
      view,
      poolIndex,
      spawnId: 0,
      typeId: enemyDefinition.id,
      x: 0,
      y: 0,
      radius: enemyDefinition.radius,
      health: enemyDefinition.maxHealth,
      maxHealth: enemyDefinition.maxHealth,
      moveSpeed: enemyDefinition.moveSpeed,
      experienceOrbCount: enemyDefinition.experienceOrbCount,
      experienceValuePerOrb: enemyDefinition.experienceValuePerOrb,
      collisionCategory: COLLISION_CATEGORIES.ENEMY,
    };
  }

  private applyEnemyDefinition(
    enemy: Enemy,
    enemyDefinition: EnemyDefinition,
  ): void {
    enemy.typeId = enemyDefinition.id;
    enemy.radius = enemyDefinition.radius;
    enemy.health = enemyDefinition.maxHealth;
    enemy.maxHealth = enemyDefinition.maxHealth;
    enemy.moveSpeed = enemyDefinition.moveSpeed;
    enemy.experienceOrbCount = enemyDefinition.experienceOrbCount;
    enemy.experienceValuePerOrb = enemyDefinition.experienceValuePerOrb;
    enemy.view.setRadius(enemyDefinition.radius);
    enemy.view.setFillStyle(enemyDefinition.fillColor);
    enemy.view.setStrokeStyle(ENEMY_STROKE_WIDTH, enemyDefinition.strokeColor);
  }

  private deactivateActiveEnemy(activeEnemyIndex: number): void {
    const enemy = this.activeEnemies[activeEnemyIndex];
    const lastActiveEnemy = this.activeEnemies.pop();

    if (lastActiveEnemy && lastActiveEnemy !== enemy) {
      this.activeEnemies[activeEnemyIndex] = lastActiveEnemy;
    }

    enemy.x = 0;
    enemy.y = 0;
    enemy.health = enemy.maxHealth;
    enemy.view.setPosition(enemy.x, enemy.y);
    enemy.view.setActive(false);
    enemy.view.setVisible(false);
    this.freeEnemyIndexes.push(enemy.poolIndex);
  }

  private separateEnemies(): void {
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
        const minimumDistance =
          (firstEnemy.radius + secondEnemy.radius) *
          ENEMY_SEPARATION_RADIUS_MULTIPLIER;
        const minimumDistanceSquared = minimumDistance * minimumDistance;

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
        const overlap = minimumDistance - distance;
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
    const clampedPosition = this.arenaBounds.clampCircle(x, y, enemy.radius);

    this.separatedPosition.x = clampedPosition.x;
    this.separatedPosition.y = clampedPosition.y;
    enemy.x = this.separatedPosition.x;
    enemy.y = this.separatedPosition.y;
  }

  private getRandomEdgeSpawnPosition(enemyRadius: number): Phaser.Math.Vector2 {
    const edge = Phaser.Math.RND.pick(ENEMY_SPAWN_EDGES);

    switch (edge) {
      case "top":
        return this.spawnPosition.set(
          this.getRandomSpawnCoordinate(this.arenaBounds.width, enemyRadius),
          enemyRadius,
        );
      case "right":
        return this.spawnPosition.set(
          this.arenaBounds.width - enemyRadius,
          this.getRandomSpawnCoordinate(this.arenaBounds.height, enemyRadius),
        );
      case "bottom":
        return this.spawnPosition.set(
          this.getRandomSpawnCoordinate(this.arenaBounds.width, enemyRadius),
          this.arenaBounds.height - enemyRadius,
        );
      case "left":
        return this.spawnPosition.set(
          enemyRadius,
          this.getRandomSpawnCoordinate(this.arenaBounds.height, enemyRadius),
        );
      default:
        return assertNever(edge);
    }
  }

  private getRandomSpawnCoordinate(arenaSize: number, enemyRadius: number): number {
    const minCoordinate = enemyRadius;
    const maxCoordinate = Math.max(enemyRadius, arenaSize - enemyRadius);

    return Phaser.Math.Between(minCoordinate, maxCoordinate);
  }
}

function assertNever(value: never): never {
  throw new Error(`Unhandled enemy spawn edge: ${value}`);
}
