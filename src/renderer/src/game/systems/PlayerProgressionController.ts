import Phaser from "phaser";
import {
  PLAYER_BASE_EXPERIENCE_TO_LEVEL,
  PLAYER_EXPERIENCE_TO_LEVEL_STEP,
  PLAYER_STARTING_EXPERIENCE,
  PLAYER_STARTING_LEVEL,
} from "../config/experience-config";
import {
  emitGameplayEvent,
  GAMEPLAY_EVENTS,
  type PlayerProgressionChangedPayload,
} from "../events/gameplay-events";
import { type GameplayController } from "./GameplayController";

export class PlayerProgressionController implements GameplayController {
  private currentLevel = PLAYER_STARTING_LEVEL;
  private currentExperience = PLAYER_STARTING_EXPERIENCE;
  private currentExperienceToNextLevel = this.getExperienceToNextLevel(this.currentLevel);

  constructor(
    private readonly onLevelUp: (level: number) => void,
    initialProgression?: PlayerProgressionChangedPayload,
  ) {
    if (initialProgression) {
      this.currentLevel = initialProgression.level;
      this.currentExperience = initialProgression.experience;
      this.currentExperienceToNextLevel = initialProgression.experienceToNextLevel;
    }

    this.publishProgression();
  }

  get progression(): PlayerProgressionChangedPayload {
    return {
      level: this.currentLevel,
      experience: this.currentExperience,
      experienceToNextLevel: this.currentExperienceToNextLevel
    };
  }

  update(_: number): void {
    return;
  }

  addExperience(experienceAmount: number): void {
    if (experienceAmount <= 0) {
      return;
    }

    this.currentExperience += experienceAmount;

    while (this.currentExperience >= this.currentExperienceToNextLevel) {
      this.currentExperience -= this.currentExperienceToNextLevel;
      this.currentLevel += 1;
      this.onLevelUp(this.currentLevel);
      this.currentExperienceToNextLevel = this.getExperienceToNextLevel(this.currentLevel);
    }

    this.publishProgression();
  }

  destroy(): void {
    return;
  }

  private publishProgression(): void {
    emitGameplayEvent(
      GAMEPLAY_EVENTS.PLAYER_PROGRESSION_CHANGED,
      this.progression,
    );
  }

  private getExperienceToNextLevel(level: number): number {
    return (
      PLAYER_BASE_EXPERIENCE_TO_LEVEL +
      (level - PLAYER_STARTING_LEVEL) * PLAYER_EXPERIENCE_TO_LEVEL_STEP
    );
  }
}
