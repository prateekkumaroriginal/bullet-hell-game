import {
  ENEMY_TYPE_IDS,
  type EnemyTypeId
} from "../../../../shared/game-ids";

export { ENEMY_TYPE_IDS, type EnemyTypeId };

export const ENEMY_POOL_SIZE = 48;
export const ENEMY_INTRO_DELAY_MS = 1000;

export const ENEMY_SEPARATION_RADIUS_MULTIPLIER = 1.175;
export const ENEMY_SEPARATION_STRENGTH = 0.5;
export const ENEMY_OVERLAP_FALLBACK_DISTANCE = 1;
export const ENEMY_STROKE_WIDTH = 2;
export const ENEMY_PREVIEW_SIZE = 320;
export const ENEMY_PREVIEW_SCALE = 4;

export type EnemyDefinition = {
  id: EnemyTypeId;
  name: string;
  intel: {
    description: string;
    speed: string;
    behavior: string;
    threat: string;
  };
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
    name: "Chaser",
    intel: {
      description: "Tracks directly toward you. Circle wide before the arena gets crowded.",
      speed: "Fast",
      behavior: "Tracks player",
      threat: "Moderate"
    },
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
    name: "Rusher",
    intel: {
      description: "Fast and fragile. Clear space early so it cannot force a panic turn.",
      speed: "Very fast",
      behavior: "Rushes player",
      threat: "High"
    },
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
    name: "Tank",
    intel: {
      description: "Slow, heavy, and worth more experience. Kite it while thinning the smaller enemies.",
      speed: "Slow",
      behavior: "Absorbs fire",
      threat: "Severe"
    },
    radius: 26,
    moveSpeed: 58,
    maxHealth: 6,
    experienceOrbCount: 3,
    experienceValuePerOrb: 1,
    fillColor: 0x8e7cff,
    strokeColor: 0xe0dcff,
  },
} as const satisfies Record<EnemyTypeId, EnemyDefinition>;

export function isEnemyTypeId(enemyTypeId: string): enemyTypeId is EnemyTypeId {
  return Object.hasOwn(ENEMY_DEFINITIONS, enemyTypeId);
}
