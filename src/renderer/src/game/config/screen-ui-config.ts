export const SCREEN_PRIMARY_STAGE_ID = "stage-1";
export const GAME_TITLE = "VOID STRIKE";

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
