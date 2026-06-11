import { WAVE_DEFINITIONS } from "../config/wave-config";

export const DEFAULT_LEVEL_ID = "level-1";
export const INITIAL_WAVE_NUMBER = 1;

export type GameSessionPhase =
  | "idle"
  | "playing"
  | "paused"
  | "gameOver"
  | "levelComplete";

export type GameSessionState = {
  phase: GameSessionPhase;
  selectedLevelId: string;
  currentWave: number;
  totalWaves: number;
};

export const INITIAL_GAME_SESSION_STATE: GameSessionState = {
  phase: "idle",
  selectedLevelId: DEFAULT_LEVEL_ID,
  currentWave: INITIAL_WAVE_NUMBER,
  totalWaves: WAVE_DEFINITIONS.length,
};
