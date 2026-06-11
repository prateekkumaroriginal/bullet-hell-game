import {
  GAMEPLAY_EVENTS,
  onGameplayEvent,
} from "../events/gameplay-events";
import { useGameUiStore } from "./use-game-ui-store";

export function bindGameUiStoreToGameplayEvents(): () => void {
  const removeGameStartedListener = onGameplayEvent(
    GAMEPLAY_EVENTS.GAME_STARTED,
    (gameSession) => {
      useGameUiStore.getState().setGameSession({
        phase: "playing",
        selectedLevelId: gameSession.selectedLevelId,
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
        phase: "gameOver",
        selectedLevelId: gameSession.selectedLevelId,
        currentWave: gameSession.currentWave,
        totalWaves,
      });
    },
  );
  const removeGamePausedListener = onGameplayEvent(
    GAMEPLAY_EVENTS.GAME_PAUSED,
    () => {
      useGameUiStore.getState().setGameSessionPhase("paused");
    },
  );
  const removeGameResumedListener = onGameplayEvent(
    GAMEPLAY_EVENTS.GAME_RESUMED,
    () => {
      useGameUiStore.getState().setGameSessionPhase("playing");
    },
  );
  const removeLevelCompleteListener = onGameplayEvent(
    GAMEPLAY_EVENTS.LEVEL_COMPLETE,
    (gameSession) => {
      useGameUiStore.getState().setGameSession({
        phase: "levelComplete",
        selectedLevelId: gameSession.selectedLevelId,
        currentWave: gameSession.currentWave,
        totalWaves: gameSession.totalWaves,
      });
    },
  );
  const removeHealthListener = onGameplayEvent(
    GAMEPLAY_EVENTS.PLAYER_HEALTH_CHANGED,
    (playerHealth) => {
      useGameUiStore.getState().setPlayerHealth(playerHealth);
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
    removeLevelCompleteListener();
    removeHealthListener();
    removeWaveListener();
    removeWaveAnnouncementListener();
  };
}
