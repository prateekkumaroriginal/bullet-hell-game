import Phaser from "phaser";
import { BULLET_HIT_RADIUS } from "../config/bullet-config";
import { PLAYER_RADIUS } from "../config/player-config";
import { type Bullet } from "../systems/BulletPool";
import { type EnemyController } from "../systems/EnemyController";
import { type Enemy } from "../systems/EnemyPool";
import { type PlayerController } from "../systems/PlayerController";
import { type WeaponController } from "../systems/WeaponController";

type HitboxDebugOverlayInput = {
  enemyController?: EnemyController;
  playerController?: PlayerController;
  weaponController?: WeaponController;
};

const HITBOX_OVERLAY_DEPTH = 10000;
const HITBOX_FILL_ALPHA = 0.24;
const HITBOX_STROKE_ALPHA = 0.9;
const HITBOX_STROKE_WIDTH = 2;
const PLAYER_HITBOX_COLOR = 0x38bdf8;
const ENEMY_HITBOX_COLOR = 0xfb7185;
const BULLET_HITBOX_COLOR = 0xa3e635;

export class HitboxDebugOverlay {
  private readonly graphics: Phaser.GameObjects.Graphics;
  private isEnabled = false;

  constructor(scene: Phaser.Scene) {
    this.graphics = scene.add.graphics();
    this.graphics.setDepth(HITBOX_OVERLAY_DEPTH);
    this.graphics.setActive(false);
    this.graphics.setVisible(false);
  }

  setEnabled(isEnabled: boolean): void {
    this.isEnabled = isEnabled;
    this.graphics.setActive(isEnabled);
    this.graphics.setVisible(isEnabled);

    if (!isEnabled) {
      this.clear();
    }
  }

  clear(): void {
    this.graphics.clear();
  }

  update(input: HitboxDebugOverlayInput): void {
    if (!this.isEnabled) {
      return;
    }

    this.graphics.clear();
    this.drawPlayerHitbox(input.playerController);
    this.drawEnemyHitboxes(input.enemyController?.activeEnemies ?? []);
    this.drawBulletHitboxes(input.weaponController?.bullets.active ?? []);
  }

  destroy(): void {
    this.graphics.destroy();
  }

  private drawPlayerHitbox(playerController?: PlayerController): void {
    const player = playerController?.gameObject;

    if (!player) {
      return;
    }

    this.drawHitboxCircle(player.x, player.y, PLAYER_RADIUS, PLAYER_HITBOX_COLOR);
  }

  private drawEnemyHitboxes(enemies: readonly Enemy[]): void {
    for (const enemy of enemies) {
      this.drawHitboxCircle(enemy.x, enemy.y, enemy.radius, ENEMY_HITBOX_COLOR);
    }
  }

  private drawBulletHitboxes(bullets: readonly Bullet[]): void {
    for (const bullet of bullets) {
      this.drawHitboxCircle(
        bullet.x,
        bullet.y,
        BULLET_HIT_RADIUS,
        BULLET_HITBOX_COLOR
      );
    }
  }

  private drawHitboxCircle(
    x: number,
    y: number,
    radius: number,
    color: number
  ): void {
    this.graphics.fillStyle(color, HITBOX_FILL_ALPHA);
    this.graphics.fillCircle(x, y, radius);
    this.graphics.lineStyle(HITBOX_STROKE_WIDTH, color, HITBOX_STROKE_ALPHA);
    this.graphics.strokeCircle(x, y, radius);
  }
}
