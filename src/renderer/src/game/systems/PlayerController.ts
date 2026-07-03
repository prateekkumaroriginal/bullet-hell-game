import Phaser from "phaser";
import {
  PLAYER_DAMAGE_INVULNERABILITY_MS,
  PLAYER_DISPLAY_SIZE,
  PLAYER_MAX_HEALTH,
  PLAYER_MOVE_SPEED,
  PLAYER_RADIUS,
  PLAYER_START_X,
  PLAYER_START_Y,
  PLAYER_TEXTURE_KEY,
} from "../config/player-config";
import { MILLISECONDS_PER_SECOND } from "../config/time-config";
import {
  emitGameplayEvent,
  GAMEPLAY_EVENTS,
} from "../events/gameplay-events";
import { ArenaBounds } from "./ArenaBounds";
import { type GameplayController } from "./GameplayController";
import { type SkillRuntimeModifiers } from "../config/skill-config";

type MovementKeys = {
  up: Phaser.Input.Keyboard.Key;
  down: Phaser.Input.Keyboard.Key;
  left: Phaser.Input.Keyboard.Key;
  right: Phaser.Input.Keyboard.Key;
};

export type PlayerGameObject = Phaser.GameObjects.Image;

export class PlayerController implements GameplayController {
  private readonly movement = new Phaser.Math.Vector2();
  private readonly player: PlayerGameObject;
  private readonly cursors?: Phaser.Types.Input.Keyboard.CursorKeys;
  private readonly movementKeys?: MovementKeys;
  private currentHealth = PLAYER_MAX_HEALTH;
  private currentMaxHealth = PLAYER_MAX_HEALTH;
  private invulnerabilityTimerMs = 0;

  constructor(
    private readonly scene: Phaser.Scene,
    private readonly arenaBounds: ArenaBounds,
    private readonly getSkillModifiers: () => SkillRuntimeModifiers,
    initialHealth = PLAYER_MAX_HEALTH,
    initialMaxHealthBonus = 0,
  ) {
    this.currentMaxHealth =
      PLAYER_MAX_HEALTH + initialMaxHealthBonus;
    this.currentHealth = Phaser.Math.Clamp(
      initialHealth,
      0,
      this.currentMaxHealth,
    );
    this.player = scene.add.image(
      PLAYER_START_X,
      PLAYER_START_Y,
      PLAYER_TEXTURE_KEY,
    );
    this.player.setDisplaySize(PLAYER_DISPLAY_SIZE, PLAYER_DISPLAY_SIZE);

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

  get gameObject(): PlayerGameObject {
    return this.player;
  }

  get health(): number {
    return this.currentHealth;
  }

  get maxHealth(): number {
    return this.currentMaxHealth;
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
    const moveSpeed =
      PLAYER_MOVE_SPEED * this.getSkillModifiers().moveSpeedMultiplier;
    const nextX = this.player.x + this.movement.x * moveSpeed * deltaSeconds;
    const nextY = this.player.y + this.movement.y * moveSpeed * deltaSeconds;
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
      this.currentMaxHealth,
    );
    this.invulnerabilityTimerMs = PLAYER_DAMAGE_INVULNERABILITY_MS;
    this.publishHealth();
  }

  destroy(): void {
    this.player.destroy();
  }

  increaseMaxHealth(maxHealthBonus: number): void {
    if (maxHealthBonus <= 0) {
      return;
    }

    this.currentMaxHealth += maxHealthBonus;
    this.currentHealth = Phaser.Math.Clamp(
      this.currentHealth + maxHealthBonus,
      0,
      this.currentMaxHealth,
    );
    this.publishHealth();
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
      max: this.currentMaxHealth,
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
