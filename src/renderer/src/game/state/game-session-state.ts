import { WAVE_DEFINITIONS } from "../config/wave-config";

export const DEFAULT_STAGE_ID = "stage-1";
export const INITIAL_WAVE_NUMBER = 1;

export const GAME_SESSION_PHASES = {
  IDLE: "idle",
  PLAYING: "playing",
  PAUSED: "paused",
  GAME_OVER: "gameOver",
  STAGE_COMPLETE: "stageComplete",
} as const;

export type GameSessionPhase =
  (typeof GAME_SESSION_PHASES)[keyof typeof GAME_SESSION_PHASES];

export type GameSessionState = {
  phase: GameSessionPhase;
  selectedStageId: string;
  currentWave: number;
  totalWaves: number;
};

export const INITIAL_GAME_SESSION_STATE: GameSessionState = {
  phase: GAME_SESSION_PHASES.IDLE,
  selectedStageId: DEFAULT_STAGE_ID,
  currentWave: INITIAL_WAVE_NUMBER,
  totalWaves: WAVE_DEFINITIONS.length,
};
