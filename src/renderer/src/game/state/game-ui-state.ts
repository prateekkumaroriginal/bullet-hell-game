import { PLAYER_MAX_HEALTH, WAVE_DEFINITIONS } from "../config/game-config";

export type PlayerHealthState = {
  current: number;
  max: number;
};

export type WaveState = {
  current: number;
  total: number;
  enemiesRemaining: number;
  isComplete: boolean;
};

export type GameUiState = {
  playerHealth: PlayerHealthState;
  wave: WaveState;
};

type GameUiStateListener = () => void;

const INITIAL_PLAYER_HEALTH: PlayerHealthState = {
  current: PLAYER_MAX_HEALTH,
  max: PLAYER_MAX_HEALTH,
};

const INITIAL_WAVE_STATE: WaveState = {
  current: 1,
  total: WAVE_DEFINITIONS.length,
  enemiesRemaining: WAVE_DEFINITIONS[0]?.enemyCount ?? 0,
  isComplete: false,
};

let gameUiState: GameUiState = {
  playerHealth: INITIAL_PLAYER_HEALTH,
  wave: INITIAL_WAVE_STATE,
};

const listeners = new Set<GameUiStateListener>();

export function getGameUiStateSnapshot(): GameUiState {
  return gameUiState;
}

export function subscribeToGameUiState(listener: GameUiStateListener): () => void {
  listeners.add(listener);

  return () => {
    listeners.delete(listener);
  };
}

export function setPlayerHealthState(playerHealth: PlayerHealthState): void {
  gameUiState = {
    ...gameUiState,
    playerHealth,
  };

  notifyListeners();
}

export function setWaveState(wave: WaveState): void {
  gameUiState = {
    ...gameUiState,
    wave,
  };

  notifyListeners();
}

function notifyListeners(): void {
  for (const listener of listeners) {
    listener();
  }
}
