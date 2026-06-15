import Phaser from "phaser";
import { type LearnedSkill, type SkillChoice } from "../systems/SkillController";
import { type StageId } from "../config/stage-config";

export const GAMEPLAY_EVENTS = {
  GAME_STARTED: "game:started",
  GAME_PAUSED: "game:paused",
  GAME_RESUMED: "game:resumed",
  GAME_OVER: "game:over",
  WAVE_COMPLETED: "wave:completed",
  STAGE_COMPLETE: "stage:complete",
  SKILL_SELECTION_STARTED: "skill-selection:started",
  SKILL_SELECTION_ENDED: "skill-selection:ended",
  SKILLS_CHANGED: "skills:changed",
  PLAYER_HEALTH_CHANGED: "player:health-changed",
  PLAYER_PROGRESSION_CHANGED: "player:progression-changed",
  WAVE_CHANGED: "wave:changed",
  WAVE_ANNOUNCEMENT_CHANGED: "wave:announcement-changed",
} as const;

export type GameplayEventName = (typeof GAMEPLAY_EVENTS)[keyof typeof GAMEPLAY_EVENTS];

export type PlayerHealthChangedPayload = {
  current: number;
  max: number;
};

export type PlayerProgressionChangedPayload = {
  level: number;
  experience: number;
  experienceToNextLevel: number;
};

export type GameStartedPayload = {
  selectedStageId: StageId;
  currentWave: number;
  totalWaves: number;
  playerHealth: PlayerHealthChangedPayload;
  playerProgression: PlayerProgressionChangedPayload;
};

export type GameOverPayload = {
  selectedStageId: StageId;
  currentWave: number;
};

export type WaveCompletedPayload = {
  selectedStageId: StageId;
  nextWave: number;
  playerHealth: PlayerHealthChangedPayload;
  playerProgression: PlayerProgressionChangedPayload;
};

export type StageCompletePayload = {
  selectedStageId: StageId;
  currentWave: number;
  totalWaves: number;
};

export type SkillSelectionStartedPayload = {
  offeredAtLevel: number;
  choices: readonly SkillChoice[];
};

export type SkillsChangedPayload = {
  learnedSkills: readonly LearnedSkill[];
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
  [GAMEPLAY_EVENTS.GAME_STARTED]: GameStartedPayload;
  [GAMEPLAY_EVENTS.GAME_PAUSED]: undefined;
  [GAMEPLAY_EVENTS.GAME_RESUMED]: undefined;
  [GAMEPLAY_EVENTS.GAME_OVER]: GameOverPayload;
  [GAMEPLAY_EVENTS.WAVE_COMPLETED]: WaveCompletedPayload;
  [GAMEPLAY_EVENTS.STAGE_COMPLETE]: StageCompletePayload;
  [GAMEPLAY_EVENTS.SKILL_SELECTION_STARTED]: SkillSelectionStartedPayload;
  [GAMEPLAY_EVENTS.SKILL_SELECTION_ENDED]: undefined;
  [GAMEPLAY_EVENTS.SKILLS_CHANGED]: SkillsChangedPayload;
  [GAMEPLAY_EVENTS.PLAYER_HEALTH_CHANGED]: PlayerHealthChangedPayload;
  [GAMEPLAY_EVENTS.PLAYER_PROGRESSION_CHANGED]: PlayerProgressionChangedPayload;
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
