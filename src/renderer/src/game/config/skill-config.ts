export const SKILL_CHOICE_COUNT = 3;
export const SKILL_MAX_STACK_COUNT = 5;
export const SKILL_STAR_COUNT = SKILL_MAX_STACK_COUNT;
export const MIN_FIRE_COOLDOWN_MULTIPLIER = 0.28;

export const SKILL_IDS = {
  RAPID_FIRE: "rapidFire",
  HEAVY_SHOT: "heavyShot",
  FLEET_FOOTED: "fleetFooted",
  MAGNET_CORE: "magnetCore",
  REINFORCED_HULL: "reinforcedHull",
} as const;

export type SkillId = (typeof SKILL_IDS)[keyof typeof SKILL_IDS];

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
    modifierDelta: {
      ...EMPTY_MODIFIER_DELTA,
      maxHealthBonus: REINFORCED_HULL_MAX_HEALTH_BONUS,
    },
  },
] as const satisfies readonly SkillDefinition[];

export const SKILL_DEFINITION_BY_ID = Object.fromEntries(
  SKILL_DEFINITIONS.map((skill) => [skill.id, skill]),
) as Record<SkillId, SkillDefinition>;
