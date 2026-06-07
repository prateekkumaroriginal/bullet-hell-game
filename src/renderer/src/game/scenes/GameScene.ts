import Phaser from "phaser";
import {
  AIM_GUIDE_ALPHA,
  AIM_GUIDE_COLOR,
  AIM_GUIDE_DOT_RADIUS,
  AIM_GUIDE_DOT_SPACING,
  AIM_GUIDE_LENGTH,
  AIM_GUIDE_START_OFFSET,
  ARENA_BORDER_ALPHA,
  ARENA_BORDER_COLOR,
  ARENA_BORDER_WIDTH,
  BULLET_DEFAULT_DIRECTION_X,
  BULLET_DEFAULT_DIRECTION_Y,
  BULLET_FIRE_COOLDOWN_MS,
  GRID_ALPHA,
  GRID_COLOR,
  GRID_LINE_WIDTH,
  GRID_SPACING,
  MILLISECONDS_PER_SECOND,
  PLAYER_FILL_COLOR,
  PLAYER_MOVE_SPEED,
  PLAYER_SIZE,
  PLAYER_START_X,
  PLAYER_START_Y,
  PLAYER_STROKE_COLOR,
  PLAYER_STROKE_WIDTH,
} from "../config/game-config";
import { GAME_SCENE_KEY } from "../config/scene-keys";
import { BulletPool } from "../systems/BulletPool";

type MovementKeys = {
  up: Phaser.Input.Keyboard.Key;
  down: Phaser.Input.Keyboard.Key;
  left: Phaser.Input.Keyboard.Key;
  right: Phaser.Input.Keyboard.Key;
};

export class GameScene extends Phaser.Scene {
  private player?: Phaser.GameObjects.Arc;
  private arenaGuide?: Phaser.GameObjects.Graphics;
  private aimGuide?: Phaser.GameObjects.Graphics;
  private cursors?: Phaser.Types.Input.Keyboard.CursorKeys;
  private movementKeys?: MovementKeys;
  private bulletPool?: BulletPool;
  private fireTimer?: Phaser.Time.TimerEvent;

  constructor() {
    super(GAME_SCENE_KEY);
  }

  create(): void {
    this.drawArenaGuide();
    this.createBulletPool();
    this.createPlayer();
    this.createAimGuide();
    this.createKeyboardInput();
    this.createAutoFireTimer();
    this.scale.on(Phaser.Scale.Events.RESIZE, this.handleResize, this);

    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      this.scale.off(Phaser.Scale.Events.RESIZE, this.handleResize, this);
      this.fireTimer?.remove();
      this.fireTimer = undefined;
      this.bulletPool?.destroy();
      this.bulletPool = undefined;
      this.aimGuide = undefined;
    });
  }

  update(_: number, delta: number): void {
    this.bulletPool?.update(delta);
    this.updateAimGuide();

    if (!this.player) {
      return;
    }

    const movement = this.getMovementVector();

    if (movement.lengthSq() === 0) {
      return;
    }

    movement.normalize();

    const deltaSeconds = delta / MILLISECONDS_PER_SECOND;
    const nextX = this.player.x + movement.x * PLAYER_MOVE_SPEED * deltaSeconds;
    const nextY = this.player.y + movement.y * PLAYER_MOVE_SPEED * deltaSeconds;
    const playerRadius = PLAYER_SIZE / 2;

    this.player.setPosition(
      Phaser.Math.Clamp(nextX, playerRadius, this.getArenaWidth() - playerRadius),
      Phaser.Math.Clamp(nextY, playerRadius, this.getArenaHeight() - playerRadius),
    );
  }

  private createPlayer(): void {
    const playerRadius = PLAYER_SIZE / 2;

    this.player = this.add.circle(
      PLAYER_START_X,
      PLAYER_START_Y,
      playerRadius,
      PLAYER_FILL_COLOR,
    );
    this.player.setStrokeStyle(PLAYER_STROKE_WIDTH, PLAYER_STROKE_COLOR);
  }

  private createBulletPool(): void {
    this.bulletPool = new BulletPool(this);
  }

  private createAimGuide(): void {
    this.aimGuide = this.add.graphics();
  }

  private createKeyboardInput(): void {
    this.cursors = this.input.keyboard?.createCursorKeys();

    const keys = this.input.keyboard?.addKeys({
      up: Phaser.Input.Keyboard.KeyCodes.W,
      down: Phaser.Input.Keyboard.KeyCodes.S,
      left: Phaser.Input.Keyboard.KeyCodes.A,
      right: Phaser.Input.Keyboard.KeyCodes.D,
    });

    if (keys && !Array.isArray(keys)) {
      this.movementKeys = keys as MovementKeys;
    }
  }

  private createAutoFireTimer(): void {
    this.fireTimer = this.time.addEvent({
      delay: BULLET_FIRE_COOLDOWN_MS,
      callback: this.fireAtCursor,
      callbackScope: this,
      loop: true,
    });
  }

  private fireAtCursor(): void {
    if (!this.player || !this.bulletPool) {
      return;
    }

    const direction = this.getAimDirection(this.player);

    if (direction.lengthSq() === 0) {
      direction.set(BULLET_DEFAULT_DIRECTION_X, BULLET_DEFAULT_DIRECTION_Y);
    }

    this.bulletPool.spawn({
      x: this.player.x,
      y: this.player.y,
      directionX: direction.x,
      directionY: direction.y,
    });
  }

  private updateAimGuide(): void {
    if (!this.player || !this.aimGuide) {
      return;
    }

    this.aimGuide.clear();

    const direction = this.getAimDirection(this.player);

    if (direction.lengthSq() === 0) {
      return;
    }

    direction.normalize();
    this.aimGuide.fillStyle(AIM_GUIDE_COLOR, AIM_GUIDE_ALPHA);
    this.drawDottedAimGuide(direction);
  }

  private getAimDirection(player: Phaser.GameObjects.Arc): Phaser.Math.Vector2 {
    const pointer = this.input.activePointer;

    return new Phaser.Math.Vector2(
      pointer.worldX - player.x,
      pointer.worldY - player.y,
    );
  }

  private drawDottedAimGuide(direction: Phaser.Math.Vector2): void {
    if (!this.player || !this.aimGuide) {
      return;
    }

    for (
      let distance = AIM_GUIDE_START_OFFSET;
      distance < AIM_GUIDE_LENGTH;
      distance += AIM_GUIDE_DOT_SPACING
    ) {
      const dotX = this.player.x + direction.x * distance;
      const dotY = this.player.y + direction.y * distance;

      this.aimGuide.fillCircle(dotX, dotY, AIM_GUIDE_DOT_RADIUS);
    }
  }

  private getMovementVector(): Phaser.Math.Vector2 {
    const movement = new Phaser.Math.Vector2();

    if (this.isMovingLeft()) {
      movement.x -= 1;
    }

    if (this.isMovingRight()) {
      movement.x += 1;
    }

    if (this.isMovingUp()) {
      movement.y -= 1;
    }

    if (this.isMovingDown()) {
      movement.y += 1;
    }

    return movement;
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

  private drawArenaGuide(): void {
    this.arenaGuide?.clear();

    const guide = this.arenaGuide ?? this.add.graphics();
    this.arenaGuide = guide;
    guide.lineStyle(GRID_LINE_WIDTH, GRID_COLOR, GRID_ALPHA);
    const arenaWidth = this.getArenaWidth();
    const arenaHeight = this.getArenaHeight();

    for (let x = 0; x <= arenaWidth; x += GRID_SPACING) {
      guide.lineBetween(x, 0, x, arenaHeight);
    }

    for (let y = 0; y <= arenaHeight; y += GRID_SPACING) {
      guide.lineBetween(0, y, arenaWidth, y);
    }

    guide.lineStyle(ARENA_BORDER_WIDTH, ARENA_BORDER_COLOR, ARENA_BORDER_ALPHA);
    guide.strokeRect(0, 0, arenaWidth, arenaHeight);
  }

  private handleResize(): void {
    this.cameras.main.setSize(this.getArenaWidth(), this.getArenaHeight());
    this.drawArenaGuide();
  }

  private getArenaWidth(): number {
    return this.scale.width;
  }

  private getArenaHeight(): number {
    return this.scale.height;
  }
}
