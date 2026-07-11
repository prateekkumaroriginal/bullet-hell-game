import greenBackground01Url from "../../../../../assets/main-menu/green/green-01.png?url";
import greenBackground02Url from "../../../../../assets/main-menu/green/green-02.png?url";
import greenBackground03Url from "../../../../../assets/main-menu/green/green-03.png?url";
import greenBackground04Url from "../../../../../assets/main-menu/green/green-04.png?url";
import greenBackground05Url from "../../../../../assets/main-menu/green/green-05.png?url";
import silverBackground01Url from "../../../../../assets/main-menu/silver/silver-01.png?url";
import silverBackground02Url from "../../../../../assets/main-menu/silver/silver-02.png?url";
import silverBackground03Url from "../../../../../assets/main-menu/silver/silver-03.png?url";
import silverBackground04Url from "../../../../../assets/main-menu/silver/silver-04.png?url";
import silverBackground05Url from "../../../../../assets/main-menu/silver/silver-05.png?url";
import cyanBackground01Url from "../../../../../assets/main-menu/cyan/cyan-01.png?url";
import cyanBackground02Url from "../../../../../assets/main-menu/cyan/cyan-02.png?url";
import cyanBackground03Url from "../../../../../assets/main-menu/cyan/cyan-03.png?url";
import cyanBackground04Url from "../../../../../assets/main-menu/cyan/cyan-04.png?url";
import cyanBackground05Url from "../../../../../assets/main-menu/cyan/cyan-05.png?url";

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

export const MAIN_MENU_COLORS = {
  GREEN: "green",
  SILVER: "silver",
  CYAN: "cyan",
} as const;

export type MainMenuColor =
  (typeof MAIN_MENU_COLORS)[keyof typeof MAIN_MENU_COLORS];

export const MAIN_MENU_DEFAULT_COLOR = MAIN_MENU_COLORS.GREEN;
export const MAIN_MENU_DEFAULT_SUBVARIATION = 0;
export const MAIN_MENU_SUBVARIATION_COUNT = 5;
export const MAIN_MENU_SUBVARIATION_INDICES = [0, 1, 2, 3, 4] as const;

export const MAIN_MENU_BACKGROUND_VARIATIONS = {
  [MAIN_MENU_COLORS.GREEN]: [
    greenBackground01Url,
    greenBackground02Url,
    greenBackground03Url,
    greenBackground04Url,
    greenBackground05Url,
  ],
  [MAIN_MENU_COLORS.SILVER]: [
    silverBackground01Url,
    silverBackground02Url,
    silverBackground03Url,
    silverBackground04Url,
    silverBackground05Url,
  ],
  [MAIN_MENU_COLORS.CYAN]: [
    cyanBackground01Url,
    cyanBackground02Url,
    cyanBackground03Url,
    cyanBackground04Url,
    cyanBackground05Url,
  ],
} as const;

export const MAIN_MENU_COLOR_CONFIG = {
  [MAIN_MENU_COLORS.GREEN]: {
    accent: "rgb(174 255 47)",
    accentSoft: "rgb(174 255 47 / 0.24)",
    accentGlow: "rgb(174 255 47 / 0.36)",
    titleColor: "rgb(244 247 252)",
    titleAccent: "rgb(174 255 47)",
    titleGlow: "rgb(174 255 47 / 0.24)",
    activeSurface: "rgb(174 255 47)",
    activeText: "rgb(8 12 10)",
  },
  [MAIN_MENU_COLORS.SILVER]: {
    accent: "rgb(160 178 196)",
    accentSoft: "rgb(160 178 196 / 0.2)",
    accentGlow: "rgb(160 178 196 / 0.34)",
    titleColor: "rgb(198 211 224)",
    titleAccent: "rgb(160 178 196)",
    titleGlow: "rgb(160 178 196 / 0.24)",
    activeSurface: "linear-gradient(135deg, rgb(93 111 130), rgb(205 216 226) 48%, rgb(119 139 158))",
    activeText: "rgb(7 11 16)",
  },
  [MAIN_MENU_COLORS.CYAN]: {
    accent: "rgb(77 224 255)",
    accentSoft: "rgb(77 224 255 / 0.2)",
    accentGlow: "rgb(77 224 255 / 0.34)",
    titleColor: "rgb(228 248 255)",
    titleAccent: "rgb(77 224 255)",
    titleGlow: "rgb(77 224 255 / 0.24)",
    activeSurface: "rgb(77 224 255)",
    activeText: "rgb(5 16 22)",
  },
} as const;

export const MAIN_MENU_LAYOUT = {
  HORIZONTAL_PADDING: "clamp(1.5rem, 5vw, 4.5rem)",
  VERTICAL_PADDING: "clamp(2rem, 6vh, 4.5rem)",
  CONTENT_WIDTH: "min(31rem, 100%)",
  CONTENT_GAP: "clamp(1.75rem, 4vh, 3rem)",
  ACTION_GAP: "clamp(0.65rem, 1.5vh, 1rem)",
  TITLE_SIZE: "clamp(4.5rem, 10vw, 8rem)",
  BUTTON_HEIGHT: "clamp(4.25rem, 10vh, 5.75rem)",
  BUTTON_PADDING: "clamp(1rem, 2vw, 1.5rem)",
  BUTTON_RADIUS: "0.5rem",
  BUTTON_GAP: "clamp(0.7rem, 1.5vw, 1rem)",
  BUTTON_ICON_SIZE: "1.45rem",
  VARIANT_NAV_INSET: "clamp(1rem, 3vw, 2rem)",
  VARIANT_NAV_GAP: "0.3rem",
  VARIANT_BUTTON_HEIGHT: "2rem",
  VARIANT_BUTTON_PADDING: "0.7rem",
  VARIANT_SWATCH_SIZE: "0.35rem",
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
