export interface GameplayController {
  update(delta: number): void;
  destroy(): void;
}
