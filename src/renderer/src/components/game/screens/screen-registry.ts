import type { ReactNode } from "react";
import { GameOverScreen } from "./GameOverScreen";
import { MainMenuScreen } from "./MainMenuScreen";
import { PauseMenuScreen } from "./PauseMenuScreen";
import { StageSelectScreen } from "./StageSelectScreen";
import { StageCompleteScreen } from "./StageCompleteScreen";

export const OVERLAY_SCREENS = {
  MAIN: "main",
  STAGE_SELECT: "stageSelect",
  PAUSE: "pause",
  GAME_OVER: "gameOver",
  STAGE_COMPLETE: "stageComplete",
} as const;

export type OverlayScreen =
  (typeof OVERLAY_SCREENS)[keyof typeof OVERLAY_SCREENS];
type ScreenComponent = () => ReactNode;

export const SCREEN_COMPONENTS = {
  [OVERLAY_SCREENS.MAIN]: MainMenuScreen,
  [OVERLAY_SCREENS.STAGE_SELECT]: StageSelectScreen,
  [OVERLAY_SCREENS.PAUSE]: PauseMenuScreen,
  [OVERLAY_SCREENS.GAME_OVER]: GameOverScreen,
  [OVERLAY_SCREENS.STAGE_COMPLETE]: StageCompleteScreen,
} satisfies Record<OverlayScreen, ScreenComponent>;
