export const SCREEN_PRIMARY_STAGE_ID = "stage-1";
export const GAME_TITLE = "VOID STRIKE";

export const SCREEN_BACKDROP = {
  Z_INDEX: 20,
  BORDER_OPACITY: 0.5,
  RADIAL_CENTER: {
    x: "50%",
    y: "42%",
  },
  RADIAL_OPACITY: 0.12,
  RADIAL_FADE_STOP: "34%",
  GRADIENT_OPACITY_TOP: 0.82,
  GRADIENT_OPACITY_BOTTOM: 0.94,
  GRID_SMALL_SIZE: 42,
  GRID_LARGE_SIZE: 168,
  GRID_OPACITY_DIM: 0.05,
  GRID_OPACITY_BRIGHT: 0.075,
  SHADOW_BLUR: 140,
  SHADOW_OPACITY: 0.92,
} as const;

export const MENU_BUTTONS = {
  main: ["PLAY", "QUIT"],
  pause: ["RESUME", "RESTART STAGE", "MAIN MENU", "QUIT TO DESKTOP"],
} as const;

export const getGameOverStats = (currentWave: number, totalWaves: number) =>
  [["WAVES REACHED", `${currentWave}/${totalWaves}`]] as const;

export const getStageCompleteStats = (totalWaves: number) =>
  [
    ["STAGE CLEAR", "100%"],
    ["WAVES CLEARED", `${totalWaves}/${totalWaves}`],
  ] as const;
