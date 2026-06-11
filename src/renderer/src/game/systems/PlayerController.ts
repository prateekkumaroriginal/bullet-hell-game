import Phaser from "phaser";
import {
  PLAYER_DAMAGE_INVULNERABILITY_MS,
  PLAYER_FILL_COLOR,
  PLAYER_MAX_HEALTH,
  PLAYER_MOVE_SPEED,
  PLAYER_RADIUS,
  PLAYER_START_X,
  PLAYER_START_Y,
  PLAYER_STROKE_COLOR,
  PLAYER_STROKE_WIDTH,
} from "../config/player-config";
import { MILLISECONDS_PER_SECOND } from "../config/time-config";
import {
  emitGameplayEvent,
  GAMEPLAY_EVENTS,
} from "../events/gameplay-events";
import { ArenaBounds } from "./ArenaBounds";

type MovementKeys = {
  up: Phaser.Input.Keyboard.Key;
  down: Phaser.Input.Keyboard.Key;
  left: Phaser.Input.Keyboard.Key;
  right: Phaser.Input.Keyboard.Key;
};

export class PlayerController {
  private readonly movement = new Phaser.Math.Vector2();
  private readonly player: Phaser.GameObjects.Arc;
  private readonly cursors?: Phaser.Types.Input.Keyboard.CursorKeys;
  private readonly movementKeys?: MovementKeys;
  private currentHealth = PLAYER_MAX_HEALTH;
  private invulnerabilityTimerMs = 0;

  constructor(
    private readonly scene: Phaser.Scene,
    private readonly arenaBounds: ArenaBounds,
  ) {
    this.player = scene.add.circle(
      PLAYER_START_X,
      PLAYER_START_Y,
      PLAYER_RADIUS,
      PLAYER_FILL_COLOR,
    );
    this.player.setStrokeStyle(PLAYER_STROKE_WIDTH, PLAYER_STROKE_COLOR);

    this.cursors = scene.input.keyboard?.createCursorKeys();

    const keys = scene.input.keyboard?.addKeys({
      up: Phaser.Input.Keyboard.KeyCodes.W,
      down: Phaser.Input.Keyboard.KeyCodes.S,
      left: Phaser.Input.Keyboard.KeyCodes.A,
      right: Phaser.Input.Keyboard.KeyCodes.D,
    });

    if (keys && !Array.isArray(keys)) {
      this.movementKeys = keys as MovementKeys;
    }

    this.publishHealth();
  }

  get gameObject(): Phaser.GameObjects.Arc {
    return this.player;
  }

  get health(): number {
    return this.currentHealth;
  }

  get maxHealth(): number {
    return PLAYER_MAX_HEALTH;
  }

  get canTakeDamage(): boolean {
    return this.currentHealth > 0 && this.invulnerabilityTimerMs <= 0;
  }

  update(delta: number): void {
    this.updateInvulnerability(delta);
    this.updateMovementVector();

    if (this.movement.lengthSq() === 0) {
      return;
    }

    this.movement.normalize();

    const deltaSeconds = delta / MILLISECONDS_PER_SECOND;
    const nextX = this.player.x + this.movement.x * PLAYER_MOVE_SPEED * deltaSeconds;
    const nextY = this.player.y + this.movement.y * PLAYER_MOVE_SPEED * deltaSeconds;
    const clampedPosition = this.arenaBounds.clampCircle(
      nextX,
      nextY,
      PLAYER_RADIUS,
    );

    this.player.setPosition(clampedPosition.x, clampedPosition.y);
  }

  takeDamage(damageAmount: number): void {
    if (!this.canTakeDamage) {
      return;
    }

    this.currentHealth = Phaser.Math.Clamp(
      this.currentHealth - damageAmount,
      0,
      PLAYER_MAX_HEALTH,
    );
    this.invulnerabilityTimerMs = PLAYER_DAMAGE_INVULNERABILITY_MS;
    this.publishHealth();
  }

  destroy(): void {
    this.player.destroy();
  }

  private updateInvulnerability(delta: number): void {
    if (this.invulnerabilityTimerMs <= 0) {
      return;
    }

    this.invulnerabilityTimerMs = Math.max(0, this.invulnerabilityTimerMs - delta);
  }

  private publishHealth(): void {
    emitGameplayEvent(GAMEPLAY_EVENTS.PLAYER_HEALTH_CHANGED, {
      current: this.currentHealth,
      max: PLAYER_MAX_HEALTH,
    });
  }

  private updateMovementVector(): void {
    this.movement.set(0, 0);

    if (this.isMovingLeft()) {
      this.movement.x -= 1;
    }

    if (this.isMovingRight()) {
      this.movement.x += 1;
    }

    if (this.isMovingUp()) {
      this.movement.y -= 1;
    }

    if (this.isMovingDown()) {
      this.movement.y += 1;
    }
  }

  private isMovingLeft(): boolean {
    return Boolean(this.cursors?.left.isDown || this.movementKeys?.left.isDown);
  }

  private isMovingRight(): boolean {
    return Boolean(this.cursors?.right.isDown || this.movementKeys?.right.isDown);
  }

  private isMovingUp(): boolean {
    return Boolean(this.cursors?.up.isDown || this.movementKeys?.up.isDown);
  }

  private isMovingDown(): boolean {
    return Boolean(this.cursors?.down.isDown || this.movementKeys?.down.isDown);
  }
}
