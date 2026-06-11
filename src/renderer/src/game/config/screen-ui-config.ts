export const SCREEN_PRIMARY_STAGE_ID = "stage-1";
export const GAME_TITLE = "VOID STRIKE";

export const MENU_BUTTONS = {
  main: ["PLAY", "QUIT"],
  pause: ["RESUME", "RESTART STAGE", "MAIN MENU", "QUIT TO DESKTOP"],
} as const;

export const GAME_OVER_STATS = [
  ["ENEMIES KILLED", "142"],
  ["TIME SURVIVED", "06:23"],
  ["ACCURACY", "68%"],
] as const;

export const STAGE_COMPLETE_STATS = [
  ["STAGE CLEAR", "100%"],
  ["WAVES CLEARED", "ALL"],
  ["RANK", "A"],
] as const;
