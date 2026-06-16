export const ENEMY_POOL_SIZE = 48;
export const CHASER_ENEMY_RADIUS = 18;
export const CHASER_ENEMY_MOVE_SPEED = 95;
export const CHASER_ENEMY_MAX_HEALTH = 2;
export const CHASER_ENEMY_EXPERIENCE_ORB_COUNT = 1;
export const CHASER_ENEMY_EXPERIENCE_VALUE_PER_ORB = 1;
export const CHASER_ENEMY_FILL_COLOR = 0xff5c7a;
export const CHASER_ENEMY_STROKE_COLOR = 0xffd6df;

export const RUSHER_ENEMY_RADIUS = 13;
export const RUSHER_ENEMY_MOVE_SPEED = 150;
export const RUSHER_ENEMY_MAX_HEALTH = 1;
export const RUSHER_ENEMY_EXPERIENCE_ORB_COUNT = 1;
export const RUSHER_ENEMY_EXPERIENCE_VALUE_PER_ORB = 1;
export const RUSHER_ENEMY_FILL_COLOR = 0xffc857;
export const RUSHER_ENEMY_STROKE_COLOR = 0xfff2c2;

export const TANK_ENEMY_RADIUS = 26;
export const TANK_ENEMY_MOVE_SPEED = 58;
export const TANK_ENEMY_MAX_HEALTH = 6;
export const TANK_ENEMY_EXPERIENCE_ORB_COUNT = 3;
export const TANK_ENEMY_EXPERIENCE_VALUE_PER_ORB = 1;
export const TANK_ENEMY_FILL_COLOR = 0x8e7cff;
export const TANK_ENEMY_STROKE_COLOR = 0xe0dcff;

export const ENEMY_SEPARATION_RADIUS_MULTIPLIER = 1.175;
export const ENEMY_SEPARATION_STRENGTH = 0.5;
export const ENEMY_OVERLAP_FALLBACK_DISTANCE = 1;
export const ENEMY_STROKE_WIDTH = 2;

export const ENEMY_TYPE_IDS = {
  CHASER: "chaser",
  RUSHER: "rusher",
  TANK: "tank",
} as const;

export type EnemyTypeId = (typeof ENEMY_TYPE_IDS)[keyof typeof ENEMY_TYPE_IDS];

export type EnemyDefinition = {
  id: EnemyTypeId;
  radius: number;
  moveSpeed: number;
  maxHealth: number;
  experienceOrbCount: number;
  experienceValuePerOrb: number;
  fillColor: number;
  strokeColor: number;
};

export const ENEMY_DEFINITIONS = {
  [ENEMY_TYPE_IDS.CHASER]: {
    id: ENEMY_TYPE_IDS.CHASER,
    radius: CHASER_ENEMY_RADIUS,
    moveSpeed: CHASER_ENEMY_MOVE_SPEED,
    maxHealth: CHASER_ENEMY_MAX_HEALTH,
    experienceOrbCount: CHASER_ENEMY_EXPERIENCE_ORB_COUNT,
    experienceValuePerOrb: CHASER_ENEMY_EXPERIENCE_VALUE_PER_ORB,
    fillColor: CHASER_ENEMY_FILL_COLOR,
    strokeColor: CHASER_ENEMY_STROKE_COLOR,
  },
  [ENEMY_TYPE_IDS.RUSHER]: {
    id: ENEMY_TYPE_IDS.RUSHER,
    radius: RUSHER_ENEMY_RADIUS,
    moveSpeed: RUSHER_ENEMY_MOVE_SPEED,
    maxHealth: RUSHER_ENEMY_MAX_HEALTH,
    experienceOrbCount: RUSHER_ENEMY_EXPERIENCE_ORB_COUNT,
    experienceValuePerOrb: RUSHER_ENEMY_EXPERIENCE_VALUE_PER_ORB,
    fillColor: RUSHER_ENEMY_FILL_COLOR,
    strokeColor: RUSHER_ENEMY_STROKE_COLOR,
  },
  [ENEMY_TYPE_IDS.TANK]: {
    id: ENEMY_TYPE_IDS.TANK,
    radius: TANK_ENEMY_RADIUS,
    moveSpeed: TANK_ENEMY_MOVE_SPEED,
    maxHealth: TANK_ENEMY_MAX_HEALTH,
    experienceOrbCount: TANK_ENEMY_EXPERIENCE_ORB_COUNT,
    experienceValuePerOrb: TANK_ENEMY_EXPERIENCE_VALUE_PER_ORB,
    fillColor: TANK_ENEMY_FILL_COLOR,
    strokeColor: TANK_ENEMY_STROKE_COLOR,
  },
} as const satisfies Record<EnemyTypeId, EnemyDefinition>;
