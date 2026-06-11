import { create } from "zustand";
import { PLAYER_MAX_HEALTH } from "../config/player-config";
import { WAVE_DEFINITIONS } from "../config/wave-config";
import {
  type PlayerHealthChangedPayload,
  type WaveAnnouncementChangedPayload,
  type WaveChangedPayload,
} from "../events/gameplay-events";

export type PlayerHealthState = PlayerHealthChangedPayload;
export type WaveState = WaveChangedPayload;
export type WaveAnnouncementState = WaveAnnouncementChangedPayload;

export type GameUiState = {
  playerHealth: PlayerHealthState;
  wave: WaveState;
  waveAnnouncement: WaveAnnouncementState;
  setPlayerHealth: (playerHealth: PlayerHealthState) => void;
  setWave: (wave: WaveState) => void;
  setWaveAnnouncement: (waveAnnouncement: WaveAnnouncementState) => void;
  resetGameUiState: () => void;
};

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

const INITIAL_WAVE_ANNOUNCEMENT_STATE: WaveAnnouncementState = {
  id: 0,
  waveNumber: 1,
  totalWaves: WAVE_DEFINITIONS.length,
  isVisible: false,
};

export const useGameUiStore = create<GameUiState>((set) => ({
  playerHealth: INITIAL_PLAYER_HEALTH,
  wave: INITIAL_WAVE_STATE,
  waveAnnouncement: INITIAL_WAVE_ANNOUNCEMENT_STATE,
  setPlayerHealth: (playerHealth) => {
    set({ playerHealth });
  },
  setWave: (wave) => {
    set({ wave });
  },
  setWaveAnnouncement: (waveAnnouncement) => {
    set({ waveAnnouncement });
  },
  resetGameUiState: () => {
    set({
      playerHealth: INITIAL_PLAYER_HEALTH,
      wave: INITIAL_WAVE_STATE,
      waveAnnouncement: INITIAL_WAVE_ANNOUNCEMENT_STATE,
    });
  },
}));
