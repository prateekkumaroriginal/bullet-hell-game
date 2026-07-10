export const GAME_TITLE = "VOID STRIKE";

export const MAIN_MENU_VARIANTS = {
  COMMAND_DECK: "commandDeck",
  ORBITAL: "orbital",
  RADAR: "radar",
  HANGAR: "hangar",
  PRISM: "prism",
} as const;

export type MainMenuVariant =
  (typeof MAIN_MENU_VARIANTS)[keyof typeof MAIN_MENU_VARIANTS];

export const MAIN_MENU_VARIANT_OPTIONS = [
  {
    id: MAIN_MENU_VARIANTS.COMMAND_DECK,
    index: "01",
    name: "Command Deck",
    summary: "Mission control with a launch rail",
  },
  {
    id: MAIN_MENU_VARIANTS.ORBITAL,
    index: "02",
    name: "Orbital",
    summary: "A navigation window into deep space",
  },
  {
    id: MAIN_MENU_VARIANTS.RADAR,
    index: "03",
    name: "Route Map",
    summary: "Branching mission path planner",
  },
  {
    id: MAIN_MENU_VARIANTS.HANGAR,
    index: "04",
    name: "Flight Recorder",
    summary: "Launch sequence and command log",
  },
  {
    id: MAIN_MENU_VARIANTS.PRISM,
    index: "05",
    name: "Prism",
    summary: "High-contrast color, minimal surface",
  },
] as const;

export const DEFAULT_MAIN_MENU_VARIANT = MAIN_MENU_VARIANTS.PRISM;
export const MAIN_MENU_VARIANT_STEP = 1;

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

export const SAVE_ERROR_DIALOG = {
  CORRUPTED_ACTIVE_RUN_MESSAGE: "Saved run could not be loaded.",
} as const;

export const getGameOverStats = (currentWave: number, totalWaves: number) =>
  [["WAVES REACHED", `${currentWave}/${totalWaves}`]] as const;

export const getStageCompleteStats = (totalWaves: number) =>
  [
    ["STAGE CLEAR", "100%"],
    ["WAVES CLEARED", `${totalWaves}/${totalWaves}`],
  ] as const;
