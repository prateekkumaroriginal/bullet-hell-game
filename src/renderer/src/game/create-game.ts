import Phaser from "phaser";
import {
  GAME_BACKGROUND_COLOR,
  GAME_DESIGN_HEIGHT,
  GAME_DESIGN_WIDTH,
  GAME_FPS_MIN,
  GAME_FPS_TARGET,
} from "./config/game-config";
import { GameScene } from "./scenes/GameScene";

export const createGame = (parent: HTMLElement): Phaser.Game => {
  return new Phaser.Game({
    type: Phaser.AUTO,
    parent,
    backgroundColor: GAME_BACKGROUND_COLOR,
    fps: {
      min: GAME_FPS_MIN,
      target: GAME_FPS_TARGET,
    },
    scale: {
      mode: Phaser.Scale.RESIZE,
      width: GAME_DESIGN_WIDTH,
      height: GAME_DESIGN_HEIGHT,
    },
    scene: [GameScene],
  });
};
