import Phaser from "phaser";

type ClampedCirclePosition = {
  x: number;
  y: number;
};

export class ArenaBounds {
  private readonly clampedCirclePosition: ClampedCirclePosition = { x: 0, y: 0 };

  constructor(private readonly scene: Phaser.Scene) {}

  get width(): number {
    return this.scene.scale.width;
  }

  get height(): number {
    return this.scene.scale.height;
  }

  containsWithPadding(x: number, y: number, padding: number): boolean {
    return (
      x >= -padding &&
      x <= this.width + padding &&
      y >= -padding &&
      y <= this.height + padding
    );
  }

  clampCircle(x: number, y: number, radius: number): ClampedCirclePosition {
    this.clampedCirclePosition.x = Phaser.Math.Clamp(x, radius, this.width - radius);
    this.clampedCirclePosition.y = Phaser.Math.Clamp(y, radius, this.height - radius);

    return this.clampedCirclePosition;
  }
}
