import {
  SKILL_IDS,
  type SkillId
} from "../../../../shared/game-ids";

export { SKILL_IDS, type SkillId };

export const SKILL_CHOICE_COUNT = 3;
export const SKILL_MAX_STACK_COUNT = 5;
export const SKILL_STAR_COUNT = SKILL_MAX_STACK_COUNT;
export const MIN_FIRE_COOLDOWN_MULTIPLIER = 0.28;

export type SkillModifierDelta = {
  fireCooldownMultiplierDelta: number;
  bulletDamageBonus: number;
  moveSpeedMultiplierDelta: number;
  experienceCollectRadiusBonus: number;
  experienceAttractRadiusBonus: number;
  maxHealthBonus: number;
};

export type SkillDefinition = {
  id: SkillId;
  name: string;
  summary: string;
  detail: string;
  pickupMessage: string;
  modifierDelta: SkillModifierDelta;
};

export type SkillRuntimeModifiers = {
  fireCooldownMultiplier: number;
  bulletDamageBonus: number;
  moveSpeedMultiplier: number;
  experienceCollectRadiusBonus: number;
  experienceAttractRadiusBonus: number;
  maxHealthBonus: number;
};

export const DEFAULT_SKILL_MODIFIERS: SkillRuntimeModifiers = {
  fireCooldownMultiplier: 1,
  bulletDamageBonus: 0,
  moveSpeedMultiplier: 1,
  experienceCollectRadiusBonus: 0,
  experienceAttractRadiusBonus: 0,
  maxHealthBonus: 0,
};

const RAPID_FIRE_COOLDOWN_MULTIPLIER_DELTA = -0.12;
const HEAVY_SHOT_DAMAGE_BONUS = 1;
const FLEET_FOOTED_MOVE_MULTIPLIER_DELTA = 0.12;
const MAGNET_CORE_COLLECT_RADIUS_BONUS = 8;
const MAGNET_CORE_ATTRACT_RADIUS_BONUS = 26;
const REINFORCED_HULL_MAX_HEALTH_BONUS = 20;

const EMPTY_MODIFIER_DELTA: SkillModifierDelta = {
  fireCooldownMultiplierDelta: 0,
  bulletDamageBonus: 0,
  moveSpeedMultiplierDelta: 0,
  experienceCollectRadiusBonus: 0,
  experienceAttractRadiusBonus: 0,
  maxHealthBonus: 0,
};

export const SKILL_DEFINITIONS = [
  {
    id: SKILL_IDS.RAPID_FIRE,
    name: "Rapid Fire",
    summary: "Weapon cooldown reduced.",
    detail: "Your cannon cycles faster.",
    pickupMessage: "Your weapon cycles faster. More shots means more pressure, but aim still matters.",
    modifierDelta: {
      ...EMPTY_MODIFIER_DELTA,
      fireCooldownMultiplierDelta: RAPID_FIRE_COOLDOWN_MULTIPLIER_DELTA,
    },
  },
  {
    id: SKILL_IDS.HEAVY_SHOT,
    name: "Heavy Shot",
    summary: "Bullets deal more damage.",
    detail: "Each shot hits harder.",
    pickupMessage: "Each hit lands harder. Strong against tougher targets and crowded lanes.",
    modifierDelta: {
      ...EMPTY_MODIFIER_DELTA,
      bulletDamageBonus: HEAVY_SHOT_DAMAGE_BONUS,
    },
  },
  {
    id: SKILL_IDS.FLEET_FOOTED,
    name: "Fleet Footed",
    summary: "Movement speed increased.",
    detail: "Strafe through tighter gaps.",
    pickupMessage: "Your movement speed is up. Use the extra pace to keep escape routes open.",
    modifierDelta: {
      ...EMPTY_MODIFIER_DELTA,
      moveSpeedMultiplierDelta: FLEET_FOOTED_MOVE_MULTIPLIER_DELTA,
    },
  },
  {
    id: SKILL_IDS.MAGNET_CORE,
    name: "Magnet Core",
    summary: "XP pickup range expanded.",
    detail: "Orbs bend toward you sooner.",
    pickupMessage: "Experience orbs pull in from farther away. Safer collection means faster scaling.",
    modifierDelta: {
      ...EMPTY_MODIFIER_DELTA,
      experienceCollectRadiusBonus: MAGNET_CORE_COLLECT_RADIUS_BONUS,
      experienceAttractRadiusBonus: MAGNET_CORE_ATTRACT_RADIUS_BONUS,
    },
  },
  {
    id: SKILL_IDS.REINFORCED_HULL,
    name: "Reinforced Hull",
    summary: "Maximum health increased.",
    detail: "Gain room for one more mistake.",
    pickupMessage: "Maximum health increased. It gives breathing room, not permission to stop dodging.",
    modifierDelta: {
      ...EMPTY_MODIFIER_DELTA,
      maxHealthBonus: REINFORCED_HULL_MAX_HEALTH_BONUS,
    },
  },
] as const satisfies readonly SkillDefinition[];

export const SKILL_DEFINITION_BY_ID = Object.fromEntries(
  SKILL_DEFINITIONS.map((skill) => [skill.id, skill]),
) as Record<SkillId, SkillDefinition>;

export type SkillStackState = {
  skillId: SkillId;
  stackCount: number;
};

export function isSkillId(skillId: string): skillId is SkillId {
  return Object.hasOwn(SKILL_DEFINITION_BY_ID, skillId);
}

export function getSkillRuntimeModifiers(
  skillStacks: readonly SkillStackState[],
): SkillRuntimeModifiers {
  const modifiers = { ...DEFAULT_SKILL_MODIFIERS };

  for (const skillStack of skillStacks) {
    const skill = SKILL_DEFINITION_BY_ID[skillStack.skillId];

    modifiers.fireCooldownMultiplier +=
      skill.modifierDelta.fireCooldownMultiplierDelta * skillStack.stackCount;
    modifiers.bulletDamageBonus +=
      skill.modifierDelta.bulletDamageBonus * skillStack.stackCount;
    modifiers.moveSpeedMultiplier +=
      skill.modifierDelta.moveSpeedMultiplierDelta * skillStack.stackCount;
    modifiers.experienceCollectRadiusBonus +=
      skill.modifierDelta.experienceCollectRadiusBonus * skillStack.stackCount;
    modifiers.experienceAttractRadiusBonus +=
      skill.modifierDelta.experienceAttractRadiusBonus * skillStack.stackCount;
    modifiers.maxHealthBonus += skill.modifierDelta.maxHealthBonus * skillStack.stackCount;
  }

  return modifiers;
}
