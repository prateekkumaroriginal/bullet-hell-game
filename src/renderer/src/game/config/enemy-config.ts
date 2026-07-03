import {
  ENEMY_TYPE_IDS,
  type EnemyTypeId
} from "../../../../shared/game-ids";
import chaserTextureUrl from "../../../../../assets/enemies/chaser.png?url";
import chaserPreviewUrl from "../../../../../assets/enemies/previews/chaser-preview.png?url";
import rusherPreviewUrl from "../../../../../assets/enemies/previews/rusher-preview.png?url";
import rusherTextureUrl from "../../../../../assets/enemies/rusher.png?url";
import tankPreviewUrl from "../../../../../assets/enemies/previews/tank-preview.png?url";
import tankTextureUrl from "../../../../../assets/enemies/tank.png?url";

export { ENEMY_TYPE_IDS, type EnemyTypeId };

export const ENEMY_POOL_SIZE = 48;
export const ENEMY_INTRO_DELAY_MS = 1000;

export const ENEMY_SEPARATION_RADIUS_MULTIPLIER = 1.175;
export const ENEMY_SEPARATION_STRENGTH = 0.5;
export const ENEMY_OVERLAP_FALLBACK_DISTANCE = 1;
export const ENEMY_STROKE_WIDTH = 2;
export const ENEMY_PREVIEW_SIZE = 320;
export const ENEMY_PREVIEW_SCALE = 4;
export const CHASER_TEXTURE_KEY = "chaser";
export const CHASER_TEXTURE_URL = chaserTextureUrl;
export const CHASER_PREVIEW_URL = chaserPreviewUrl;
export const CHASER_ANIMATION_KEY = "chaser-move";
export const CHASER_FRAME_WIDTH = 48;
export const CHASER_FRAME_HEIGHT = 48;
export const CHASER_FRAME_START = 0;
export const CHASER_FRAME_END = 7;
export const CHASER_ANIMATION_FRAME_RATE = 8;
export const CHASER_ANIMATION_REPEAT = -1;
export const CHASER_DISPLAY_SIZE = 48;
export const CHASER_FORWARD_ROTATION_OFFSET_RADIANS = Math.PI / 2;
export const RUSHER_TEXTURE_KEY = "rusher";
export const RUSHER_TEXTURE_URL = rusherTextureUrl;
export const RUSHER_PREVIEW_URL = rusherPreviewUrl;
export const RUSHER_ANIMATION_KEY = "rusher-move";
export const RUSHER_FRAME_WIDTH = 50;
export const RUSHER_FRAME_HEIGHT = 50;
export const RUSHER_FRAME_START = 0;
export const RUSHER_FRAME_END = 7;
export const RUSHER_ANIMATION_FRAME_RATE = 12;
export const RUSHER_ANIMATION_REPEAT = -1;
export const RUSHER_DISPLAY_SIZE = 50;
export const RUSHER_FORWARD_ROTATION_OFFSET_RADIANS = Math.PI / 2;
export const TANK_TEXTURE_KEY = "tank";
export const TANK_TEXTURE_URL = tankTextureUrl;
export const TANK_PREVIEW_URL = tankPreviewUrl;
export const TANK_ANIMATION_KEY = "tank-move";
export const TANK_FRAME_WIDTH = 84;
export const TANK_FRAME_HEIGHT = 84;
export const TANK_FRAME_START = 0;
export const TANK_FRAME_END = 7;
export const TANK_ANIMATION_FRAME_RATE = 8;
export const TANK_ANIMATION_REPEAT = -1;
export const TANK_DISPLAY_SIZE = 84;
export const TANK_FORWARD_ROTATION_OFFSET_RADIANS = Math.PI / 2;

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

export type EnemySpriteDefinition = {
  textureKey: string;
  textureUrl: string;
  previewUrl: string;
  animationKey: string;
  frameWidth: number;
  frameHeight: number;
  frameStart: number;
  frameEnd: number;
  frameRate: number;
  repeat: number;
  displaySize: number;
  forwardRotationOffsetRadians: number;
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

export const ENEMY_SPRITE_DEFINITIONS = {
  [ENEMY_TYPE_IDS.CHASER]: {
    textureKey: CHASER_TEXTURE_KEY,
    textureUrl: CHASER_TEXTURE_URL,
    previewUrl: CHASER_PREVIEW_URL,
    animationKey: CHASER_ANIMATION_KEY,
    frameWidth: CHASER_FRAME_WIDTH,
    frameHeight: CHASER_FRAME_HEIGHT,
    frameStart: CHASER_FRAME_START,
    frameEnd: CHASER_FRAME_END,
    frameRate: CHASER_ANIMATION_FRAME_RATE,
    repeat: CHASER_ANIMATION_REPEAT,
    displaySize: CHASER_DISPLAY_SIZE,
    forwardRotationOffsetRadians: CHASER_FORWARD_ROTATION_OFFSET_RADIANS
  },
  [ENEMY_TYPE_IDS.RUSHER]: {
    textureKey: RUSHER_TEXTURE_KEY,
    textureUrl: RUSHER_TEXTURE_URL,
    previewUrl: RUSHER_PREVIEW_URL,
    animationKey: RUSHER_ANIMATION_KEY,
    frameWidth: RUSHER_FRAME_WIDTH,
    frameHeight: RUSHER_FRAME_HEIGHT,
    frameStart: RUSHER_FRAME_START,
    frameEnd: RUSHER_FRAME_END,
    frameRate: RUSHER_ANIMATION_FRAME_RATE,
    repeat: RUSHER_ANIMATION_REPEAT,
    displaySize: RUSHER_DISPLAY_SIZE,
    forwardRotationOffsetRadians: RUSHER_FORWARD_ROTATION_OFFSET_RADIANS
  },
  [ENEMY_TYPE_IDS.TANK]: {
    textureKey: TANK_TEXTURE_KEY,
    textureUrl: TANK_TEXTURE_URL,
    previewUrl: TANK_PREVIEW_URL,
    animationKey: TANK_ANIMATION_KEY,
    frameWidth: TANK_FRAME_WIDTH,
    frameHeight: TANK_FRAME_HEIGHT,
    frameStart: TANK_FRAME_START,
    frameEnd: TANK_FRAME_END,
    frameRate: TANK_ANIMATION_FRAME_RATE,
    repeat: TANK_ANIMATION_REPEAT,
    displaySize: TANK_DISPLAY_SIZE,
    forwardRotationOffsetRadians: TANK_FORWARD_ROTATION_OFFSET_RADIANS
  }
} as const satisfies Record<EnemyTypeId, EnemySpriteDefinition>;

export function isEnemyTypeId(enemyTypeId: string): enemyTypeId is EnemyTypeId {
  return Object.hasOwn(ENEMY_DEFINITIONS, enemyTypeId);
}
