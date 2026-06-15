import Phaser from "phaser";
import {
  DEFAULT_SKILL_MODIFIERS,
  getSkillRuntimeModifiers,
  SKILL_CHOICE_COUNT,
  SKILL_DEFINITIONS,
  SKILL_DEFINITION_BY_ID,
  SKILL_MAX_STACK_COUNT,
  type SkillDefinition,
  type SkillId,
  type SkillRuntimeModifiers,
  type SkillStackState,
} from "../config/skill-config";
import { type GameplayController } from "./GameplayController";
import { type PlayerController } from "./PlayerController";

export type SkillChoice = {
  id: SkillId;
  name: string;
  summary: string;
  detail: string;
  stackCount: number;
  offeredAtLevel: number;
};

export type LearnedSkill = {
  id: SkillId;
  name: string;
  summary: string;
  stackCount: number;
};

export class SkillController implements GameplayController {
  private readonly stackCounts = new Map<SkillId, number>();
  private readonly modifiers = { ...DEFAULT_SKILL_MODIFIERS };

  constructor(
    private readonly playerController: PlayerController,
    initialSkillStacks: readonly SkillStackState[] = [],
  ) {
    for (const skillStack of initialSkillStacks) {
      this.stackCounts.set(skillStack.skillId, skillStack.stackCount);
    }

    Object.assign(this.modifiers, getSkillRuntimeModifiers(initialSkillStacks));
  }

  get runtimeModifiers(): SkillRuntimeModifiers {
    return this.modifiers;
  }

  get learnedSkills(): readonly LearnedSkill[] {
    return SKILL_DEFINITIONS.flatMap((skill) => {
      const stackCount = this.stackCounts.get(skill.id) ?? 0;

      if (stackCount <= 0) {
        return [];
      }

      return [
        {
          id: skill.id,
          name: skill.name,
          summary: skill.summary,
          stackCount,
        },
      ];
    });
  }

  get skillStacks(): readonly SkillStackState[] {
    return SKILL_DEFINITIONS.flatMap((skill) => {
      const stackCount = this.stackCounts.get(skill.id) ?? 0;

      if (stackCount <= 0) {
        return [];
      }

      return [
        {
          skillId: skill.id,
          stackCount,
        },
      ];
    });
  }

  update(_: number): void {
    return;
  }

  createChoices(offeredAtLevel: number): SkillChoice[] {
    const availableSkills = SKILL_DEFINITIONS.filter(
      (skill) => (this.stackCounts.get(skill.id) ?? 0) < SKILL_MAX_STACK_COUNT,
    );

    return Phaser.Utils.Array.Shuffle([...availableSkills])
      .slice(0, SKILL_CHOICE_COUNT)
      .map((skill) => this.createChoice(skill, offeredAtLevel));
  }

  applySkill(skillId: SkillId): void {
    const skill = SKILL_DEFINITION_BY_ID[skillId];
    const previousStackCount = this.stackCounts.get(skillId) ?? 0;

    if (previousStackCount >= SKILL_MAX_STACK_COUNT) {
      return;
    }

    this.stackCounts.set(skillId, previousStackCount + 1);
    this.modifiers.fireCooldownMultiplier +=
      skill.modifierDelta.fireCooldownMultiplierDelta;
    this.modifiers.bulletDamageBonus += skill.modifierDelta.bulletDamageBonus;
    this.modifiers.moveSpeedMultiplier +=
      skill.modifierDelta.moveSpeedMultiplierDelta;
    this.modifiers.experienceCollectRadiusBonus +=
      skill.modifierDelta.experienceCollectRadiusBonus;
    this.modifiers.experienceAttractRadiusBonus +=
      skill.modifierDelta.experienceAttractRadiusBonus;
    this.modifiers.maxHealthBonus += skill.modifierDelta.maxHealthBonus;

    if (skill.modifierDelta.maxHealthBonus > 0) {
      this.playerController.increaseMaxHealth(skill.modifierDelta.maxHealthBonus);
    }
  }

  destroy(): void {
    this.stackCounts.clear();
  }

  private createChoice(
    skill: SkillDefinition,
    offeredAtLevel: number,
  ): SkillChoice {
    return {
      id: skill.id,
      name: skill.name,
      summary: skill.summary,
      detail: skill.detail,
      stackCount: this.stackCounts.get(skill.id) ?? 0,
      offeredAtLevel,
    };
  }
}
