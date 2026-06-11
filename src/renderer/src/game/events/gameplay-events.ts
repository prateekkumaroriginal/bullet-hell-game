import Phaser from "phaser";

export const GAMEPLAY_EVENTS = {
  PLAYER_HEALTH_CHANGED: "player:health-changed",
  WAVE_CHANGED: "wave:changed",
  WAVE_ANNOUNCEMENT_CHANGED: "wave:announcement-changed",
} as const;

export type GameplayEventName = (typeof GAMEPLAY_EVENTS)[keyof typeof GAMEPLAY_EVENTS];

export type PlayerHealthChangedPayload = {
  current: number;
  max: number;
};

export type WaveChangedPayload = {
  current: number;
  total: number;
  enemiesRemaining: number;
  isComplete: boolean;
};

export type WaveAnnouncementChangedPayload = {
  id: number;
  waveNumber: number;
  totalWaves: number;
  isVisible: boolean;
};

export type GameplayEventPayloads = {
  [GAMEPLAY_EVENTS.PLAYER_HEALTH_CHANGED]: PlayerHealthChangedPayload;
  [GAMEPLAY_EVENTS.WAVE_CHANGED]: WaveChangedPayload;
  [GAMEPLAY_EVENTS.WAVE_ANNOUNCEMENT_CHANGED]: WaveAnnouncementChangedPayload;
};

type GameplayEventListener<EventName extends GameplayEventName> = (
  payload: GameplayEventPayloads[EventName],
) => void;

const gameplayEvents = new Phaser.Events.EventEmitter();

export function emitGameplayEvent<EventName extends GameplayEventName>(
  eventName: EventName,
  payload: GameplayEventPayloads[EventName],
): void {
  gameplayEvents.emit(eventName, payload);
}

export function onGameplayEvent<EventName extends GameplayEventName>(
  eventName: EventName,
  listener: GameplayEventListener<EventName>,
): () => void {
  gameplayEvents.on(eventName, listener);

  return () => {
    gameplayEvents.off(eventName, listener);
  };
}
