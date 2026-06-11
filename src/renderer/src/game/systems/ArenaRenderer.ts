import Phaser from "phaser";
import {
  ARENA_BORDER_ALPHA,
  ARENA_BORDER_COLOR,
  ARENA_BORDER_WIDTH,
  GRID_ALPHA,
  GRID_COLOR,
  GRID_LINE_WIDTH,
  GRID_SPACING,
} from "../config/arena-config";
import { ArenaBounds } from "./ArenaBounds";

export class ArenaRenderer {
  private readonly guide: Phaser.GameObjects.Graphics;

  constructor(
    private readonly scene: Phaser.Scene,
    private readonly arenaBounds: ArenaBounds,
  ) {
    this.guide = scene.add.graphics();
    this.draw();
  }

  draw(): void {
    this.guide.clear();
    this.guide.lineStyle(GRID_LINE_WIDTH, GRID_COLOR, GRID_ALPHA);

    const arenaWidth = this.arenaBounds.width;
    const arenaHeight = this.arenaBounds.height;

    for (let x = 0; x <= arenaWidth; x += GRID_SPACING) {
      this.guide.lineBetween(x, 0, x, arenaHeight);
    }

    for (let y = 0; y <= arenaHeight; y += GRID_SPACING) {
      this.guide.lineBetween(0, y, arenaWidth, y);
    }

    this.guide.lineStyle(
      ARENA_BORDER_WIDTH,
      ARENA_BORDER_COLOR,
      ARENA_BORDER_ALPHA,
    );
    this.guide.strokeRect(0, 0, arenaWidth, arenaHeight);
  }

  destroy(): void {
    this.guide.destroy();
  }
}
