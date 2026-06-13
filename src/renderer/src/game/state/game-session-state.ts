import {
  DEFAULT_STAGE_ID,
  getStageDefinition,
  type StageId,
} from "../config/stage-config";

export const INITIAL_WAVE_NUMBER = 1;
const DEFAULT_STAGE_TOTAL_WAVES = getStageDefinition(DEFAULT_STAGE_ID).waves.length;

export const GAME_SESSION_PHASES = {
  IDLE: "idle",
  STAGE_SELECT: "stageSelect",
  PLAYING: "playing",
  PAUSED: "paused",
  GAME_OVER: "gameOver",
  STAGE_COMPLETE: "stageComplete",
} as const;

export type GameSessionPhase =
  (typeof GAME_SESSION_PHASES)[keyof typeof GAME_SESSION_PHASES];

export type GameSessionState = {
  phase: GameSessionPhase;
  selectedStageId: StageId | null;
  currentWave: number;
  totalWaves: number;
};

export const INITIAL_GAME_SESSION_STATE: GameSessionState = {
  phase: GAME_SESSION_PHASES.IDLE,
  selectedStageId: null,
  currentWave: INITIAL_WAVE_NUMBER,
  totalWaves: DEFAULT_STAGE_TOTAL_WAVES,
};
