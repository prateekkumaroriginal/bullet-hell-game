export const ENEMY_POOL_SIZE = 48;

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
    radius: 18,
    moveSpeed: 95,
    maxHealth: 2,
    experienceOrbCount: 1,
    experienceValuePerOrb: 1,
    fillColor: 0xff5c7a,
    strokeColor: 0xffd6df,
  },
  [ENEMY_TYPE_IDS.RUSHER]: {
    id: ENEMY_TYPE_IDS.RUSHER,
    radius: 13,
    moveSpeed: 150,
    maxHealth: 1,
    experienceOrbCount: 1,
    experienceValuePerOrb: 1,
    fillColor: 0xffc857,
    strokeColor: 0xfff2c2,
  },
  [ENEMY_TYPE_IDS.TANK]: {
    id: ENEMY_TYPE_IDS.TANK,
    radius: 26,
    moveSpeed: 58,
    maxHealth: 6,
    experienceOrbCount: 3,
    experienceValuePerOrb: 1,
    fillColor: 0x8e7cff,
    strokeColor: 0xe0dcff,
  },
} as const satisfies Record<EnemyTypeId, EnemyDefinition>;
