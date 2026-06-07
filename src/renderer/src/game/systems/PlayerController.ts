import Phaser from "phaser";
import {
  MILLISECONDS_PER_SECOND,
  PLAYER_FILL_COLOR,
  PLAYER_MOVE_SPEED,
  PLAYER_RADIUS,
  PLAYER_START_X,
  PLAYER_START_Y,
  PLAYER_STROKE_COLOR,
  PLAYER_STROKE_WIDTH,
} from "../config/game-config";

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

  constructor(private readonly scene: Phaser.Scene) {
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
  }

  get gameObject(): Phaser.GameObjects.Arc {
    return this.player;
  }

  update(delta: number): void {
    this.updateMovementVector();

    if (this.movement.lengthSq() === 0) {
      return;
    }

    this.movement.normalize();

    const deltaSeconds = delta / MILLISECONDS_PER_SECOND;
    const nextX = this.player.x + this.movement.x * PLAYER_MOVE_SPEED * deltaSeconds;
    const nextY = this.player.y + this.movement.y * PLAYER_MOVE_SPEED * deltaSeconds;

    this.player.setPosition(
      Phaser.Math.Clamp(
        nextX,
        PLAYER_RADIUS,
        this.scene.scale.width - PLAYER_RADIUS,
      ),
      Phaser.Math.Clamp(
        nextY,
        PLAYER_RADIUS,
        this.scene.scale.height - PLAYER_RADIUS,
      ),
    );
  }

  destroy(): void {
    this.player.destroy();
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
