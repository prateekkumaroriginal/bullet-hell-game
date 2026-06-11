import {
  GAMEPLAY_EVENTS,
  onGameplayEvent,
} from "../events/gameplay-events";
import { useGameUiStore } from "./use-game-ui-store";

export function bindGameUiStoreToGameplayEvents(): () => void {
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
    },
  );
  const removeWaveAnnouncementListener = onGameplayEvent(
    GAMEPLAY_EVENTS.WAVE_ANNOUNCEMENT_CHANGED,
    (waveAnnouncement) => {
      useGameUiStore.getState().setWaveAnnouncement(waveAnnouncement);
    },
  );

  return () => {
    removeHealthListener();
    removeWaveListener();
    removeWaveAnnouncementListener();
  };
}
