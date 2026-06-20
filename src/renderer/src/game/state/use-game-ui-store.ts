import { create } from "zustand";
import { PLAYER_MAX_HEALTH } from "../config/player-config";
import {
  PLAYER_BASE_EXPERIENCE_TO_LEVEL,
  PLAYER_STARTING_EXPERIENCE,
  PLAYER_STARTING_LEVEL,
} from "../config/experience-config";
import {
  DEFAULT_STAGE_ID,
  getStageDefinition,
  type StageId,
} from "../config/stage-config";
import { getWaveEnemyCount } from "../config/wave-config";
import {
  INITIAL_GAME_SESSION_STATE,
  INITIAL_WAVE_NUMBER,
  type GameSessionPhase,
  type GameSessionState,
} from "./game-session-state";
import {
  INITIAL_STAGE_PROGRESS_STATE,
  type StageProgressState,
} from "./stage-progress";
import {
  POPUP_MAX_TOAST_COUNT,
  POPUP_MODES,
  type PopupState,
} from "../config/popup-config";
import {
  type SkillSelectionStartedPayload,
  type SkillsChangedPayload,
  type PlayerHealthChangedPayload,
  type PlayerProgressionChangedPayload,
  type WaveAnnouncementChangedPayload,
  type WaveChangedPayload,
} from "../events/gameplay-events";

export type PlayerHealthState = PlayerHealthChangedPayload;
export type PlayerProgressionState = PlayerProgressionChangedPayload;
export type WaveState = WaveChangedPayload;
export type WaveAnnouncementState = WaveAnnouncementChangedPayload;
export type SkillSelectionState = SkillSelectionStartedPayload | null;
export type LearnedSkillsState = SkillsChangedPayload["learnedSkills"];
export type PopupUiState = {
  activeModal: PopupState | null;
  toasts: readonly PopupState[];
};

export type GameUiState = {
  gameSession: GameSessionState;
  stageProgress: StageProgressState;
  playerHealth: PlayerHealthState;
  playerProgression: PlayerProgressionState;
  skillSelection: SkillSelectionState;
  learnedSkills: LearnedSkillsState;
  wave: WaveState;
  waveAnnouncement: WaveAnnouncementState;
  popups: PopupUiState;
  setGameSession: (gameSession: GameSessionState) => void;
  setGameSessionPhase: (phase: GameSessionPhase) => void;
  setCurrentWave: (currentWave: number) => void;
  setCompletedStageIds: (completedStageIds: readonly StageId[]) => void;
  markStageComplete: (stageId: StageId) => void;
  setPlayerHealth: (playerHealth: PlayerHealthState) => void;
  setPlayerProgression: (playerProgression: PlayerProgressionState) => void;
  setSkillSelection: (skillSelection: SkillSelectionState) => void;
  setLearnedSkills: (learnedSkills: LearnedSkillsState) => void;
  setWave: (wave: WaveState) => void;
  setWaveAnnouncement: (waveAnnouncement: WaveAnnouncementState) => void;
  showPopup: (popup: PopupState) => void;
  dismissPopup: (popupId: string) => void;
  prunePopupToasts: (currentTimeMs: number, toastDurationMs: number) => void;
  resetGameUiState: () => void;
};

const INITIAL_PLAYER_HEALTH: PlayerHealthState = {
  current: PLAYER_MAX_HEALTH,
  max: PLAYER_MAX_HEALTH,
};

const INITIAL_PLAYER_PROGRESSION: PlayerProgressionState = {
  level: PLAYER_STARTING_LEVEL,
  experience: PLAYER_STARTING_EXPERIENCE,
  experienceToNextLevel: PLAYER_BASE_EXPERIENCE_TO_LEVEL,
};

const DEFAULT_STAGE = getStageDefinition(DEFAULT_STAGE_ID);

const INITIAL_WAVE_STATE: WaveState = {
  current: INITIAL_WAVE_NUMBER,
  total: DEFAULT_STAGE.waves.length,
  enemiesRemaining: DEFAULT_STAGE.waves[0]
    ? getWaveEnemyCount(DEFAULT_STAGE.waves[0])
    : 0,
  isComplete: false,
};

const INITIAL_WAVE_ANNOUNCEMENT_STATE: WaveAnnouncementState = {
  id: 0,
  waveNumber: INITIAL_WAVE_NUMBER,
  totalWaves: DEFAULT_STAGE.waves.length,
  isVisible: false,
};

const INITIAL_POPUP_STATE: PopupUiState = {
  activeModal: null,
  toasts: [],
};

export const useGameUiStore = create<GameUiState>((set) => ({
  gameSession: INITIAL_GAME_SESSION_STATE,
  stageProgress: INITIAL_STAGE_PROGRESS_STATE,
  playerHealth: INITIAL_PLAYER_HEALTH,
  playerProgression: INITIAL_PLAYER_PROGRESSION,
  skillSelection: null,
  learnedSkills: [],
  wave: INITIAL_WAVE_STATE,
  waveAnnouncement: INITIAL_WAVE_ANNOUNCEMENT_STATE,
  popups: INITIAL_POPUP_STATE,
  setGameSession: (gameSession) => {
    set({ gameSession });
  },
  setGameSessionPhase: (phase) => {
    set((state) => ({
      gameSession: {
        ...state.gameSession,
        phase,
      },
    }));
  },
  setCurrentWave: (currentWave) => {
    set((state) => ({
      gameSession: {
        ...state.gameSession,
        currentWave,
      },
    }));
  },
  setCompletedStageIds: (completedStageIds) => {
    set({
      stageProgress: {
        completedStageIds,
      },
    });
  },
  markStageComplete: (stageId) => {
    set((state) => {
      if (state.stageProgress.completedStageIds.includes(stageId)) {
        return {};
      }

      return {
        stageProgress: {
          completedStageIds: [
            ...state.stageProgress.completedStageIds,
            stageId,
          ],
        },
      };
    });
  },
  setPlayerHealth: (playerHealth) => {
    set({ playerHealth });
  },
  setPlayerProgression: (playerProgression) => {
    set({ playerProgression });
  },
  setSkillSelection: (skillSelection) => {
    set({ skillSelection });
  },
  setLearnedSkills: (learnedSkills) => {
    set({ learnedSkills });
  },
  setWave: (wave) => {
    set({ wave });
  },
  setWaveAnnouncement: (waveAnnouncement) => {
    set({ waveAnnouncement });
  },
  showPopup: (popup) => {
    set((state) => {
      if (popup.mode === POPUP_MODES.MODAL) {
        return {
          popups: {
            ...state.popups,
            activeModal: popup,
          },
        };
      }

      const toasts = [
        popup,
        ...state.popups.toasts.filter((toast) => toast.id !== popup.id),
      ].slice(0, POPUP_MAX_TOAST_COUNT);

      return {
        popups: {
          ...state.popups,
          toasts,
        },
      };
    });
  },
  dismissPopup: (popupId) => {
    set((state) => ({
      popups: {
        activeModal:
          state.popups.activeModal?.id === popupId
            ? null
            : state.popups.activeModal,
        toasts: state.popups.toasts.filter((toast) => toast.id !== popupId),
      },
    }));
  },
  prunePopupToasts: (currentTimeMs, toastDurationMs) => {
    set((state) => {
      const hasExpiredToast = state.popups.toasts.some(
        (toast) => currentTimeMs - toast.shownAtMs >= toastDurationMs
      );

      if (!hasExpiredToast) {
        return state;
      }

      return {
        popups: {
          ...state.popups,
          toasts: state.popups.toasts.filter(
            (toast) => currentTimeMs - toast.shownAtMs < toastDurationMs
          )
        }
      };
    });
  },
  resetGameUiState: () => {
    set({
      gameSession: INITIAL_GAME_SESSION_STATE,
      playerHealth: INITIAL_PLAYER_HEALTH,
      playerProgression: INITIAL_PLAYER_PROGRESSION,
      skillSelection: null,
      learnedSkills: [],
      wave: INITIAL_WAVE_STATE,
      waveAnnouncement: INITIAL_WAVE_ANNOUNCEMENT_STATE,
      popups: INITIAL_POPUP_STATE,
    });
  },
}));
