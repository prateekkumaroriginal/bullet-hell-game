import {
  GAMEPLAY_EVENTS,
  onGameplayEvent,
} from "../events/gameplay-events";
import {
  deleteActiveRunSave,
  writeActiveRunSave,
} from "../save/active-run-save-service";
import { markStageCleared } from "../save/profile-save-service";
import { GAME_SESSION_PHASES } from "./game-session-state";
import { useGameUiStore } from "./use-game-ui-store";

export function bindGameUiStoreToGameplayEvents(): () => void {
  const removeGameStartedListener = onGameplayEvent(
    GAMEPLAY_EVENTS.GAME_STARTED,
    (gameSession) => {
      void writeActiveRunSave(
        gameSession.selectedStageId,
        gameSession.currentWave,
        gameSession.playerHealth,
      );
      useGameUiStore.getState().setGameSession({
        phase: GAME_SESSION_PHASES.PLAYING,
        selectedStageId: gameSession.selectedStageId,
        currentWave: gameSession.currentWave,
        totalWaves: gameSession.totalWaves,
      });
    },
  );
  const removeGameOverListener = onGameplayEvent(
    GAMEPLAY_EVENTS.GAME_OVER,
    (gameSession) => {
      const totalWaves = useGameUiStore.getState().gameSession.totalWaves;

      useGameUiStore.getState().setGameSession({
        phase: GAME_SESSION_PHASES.GAME_OVER,
        selectedStageId: gameSession.selectedStageId,
        currentWave: gameSession.currentWave,
        totalWaves,
      });
    },
  );
  const removeGamePausedListener = onGameplayEvent(
    GAMEPLAY_EVENTS.GAME_PAUSED,
    () => {
      useGameUiStore.getState().setGameSessionPhase(GAME_SESSION_PHASES.PAUSED);
    },
  );
  const removeGameResumedListener = onGameplayEvent(
    GAMEPLAY_EVENTS.GAME_RESUMED,
    () => {
      useGameUiStore.getState().setGameSessionPhase(GAME_SESSION_PHASES.PLAYING);
    },
  );
  const removeStageCompleteListener = onGameplayEvent(
    GAMEPLAY_EVENTS.STAGE_COMPLETE,
    (gameSession) => {
      void (async () => {
        const profileSave = await markStageCleared(gameSession.selectedStageId);

        useGameUiStore
          .getState()
          .setCompletedStageIds(profileSave.clearedStageIds);
        await deleteActiveRunSave();
      })();
      useGameUiStore.getState().setGameSession({
        phase: GAME_SESSION_PHASES.STAGE_COMPLETE,
        selectedStageId: gameSession.selectedStageId,
        currentWave: gameSession.currentWave,
        totalWaves: gameSession.totalWaves,
      });
    },
  );
  const removeWaveCompletedListener = onGameplayEvent(
    GAMEPLAY_EVENTS.WAVE_COMPLETED,
    (waveProgress) => {
      void writeActiveRunSave(
        waveProgress.selectedStageId,
        waveProgress.nextWave,
        waveProgress.playerHealth,
      );
    },
  );
  const removeHealthListener = onGameplayEvent(
    GAMEPLAY_EVENTS.PLAYER_HEALTH_CHANGED,
    (playerHealth) => {
      useGameUiStore.getState().setPlayerHealth(playerHealth);
    },
  );
  const removeProgressionListener = onGameplayEvent(
    GAMEPLAY_EVENTS.PLAYER_PROGRESSION_CHANGED,
    (playerProgression) => {
      useGameUiStore.getState().setPlayerProgression(playerProgression);
    },
  );
  const removeWaveListener = onGameplayEvent(
    GAMEPLAY_EVENTS.WAVE_CHANGED,
    (wave) => {
      useGameUiStore.getState().setWave(wave);
      useGameUiStore.getState().setCurrentWave(wave.current);
    },
  );
  const removeWaveAnnouncementListener = onGameplayEvent(
    GAMEPLAY_EVENTS.WAVE_ANNOUNCEMENT_CHANGED,
    (waveAnnouncement) => {
      useGameUiStore.getState().setWaveAnnouncement(waveAnnouncement);
    },
  );

  return () => {
    removeGameStartedListener();
    removeGameOverListener();
    removeGamePausedListener();
    removeGameResumedListener();
    removeWaveCompletedListener();
    removeStageCompleteListener();
    removeHealthListener();
    removeProgressionListener();
    removeWaveListener();
    removeWaveAnnouncementListener();
  };
}
