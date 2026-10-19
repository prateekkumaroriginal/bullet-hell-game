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
import rivalTextureUrl from "../../../../../assets/enemies/rival.png?url";
import rivalPreviewUrl from "../../../../../assets/enemies/previews/rival-preview.png?url";
import { TRIJAL_BOSS } from "./boss-config";

export { ENEMY_TYPE_IDS, type EnemyTypeId };

export const ENEMY_POOL_SIZE = 48;
export const ENEMY_INTRO_DELAY_MS = 1000;

export const ENEMY_SEPARATION_RADIUS_MULTIPLIER = 1.175;
export const ENEMY_SEPARATION_STRENGTH = 0.5;
export const ENEMY_OVERLAP_FALLBACK_DISTANCE = 1;

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
  rotateToFacePlayer: boolean;
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
    experienceValuePerOrb: 1
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
    experienceValuePerOrb: 1
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
    radius: 42,
    moveSpeed: 58,
    maxHealth: 6,
    experienceOrbCount: 3,
    experienceValuePerOrb: 1
  },
  [ENEMY_TYPE_IDS.TRIJAL]: {
    id: ENEMY_TYPE_IDS.TRIJAL,
    name: TRIJAL_BOSS.name,
    intel: {
      description: "Trijal guards the end of Stage 1. Dodge his cyan pulse rings and aimed volleys. At half health he enters Overdrive, firing faster pink shots. Keep moving through the gaps and aim at his hover pod.",
      speed: "Slow",
      behavior: "Pulse rings and volleys",
      threat: "Boss"
    },
    radius: TRIJAL_BOSS.radius,
    moveSpeed: TRIJAL_BOSS.moveSpeed,
    maxHealth: TRIJAL_BOSS.maxHealth,
    experienceOrbCount: TRIJAL_BOSS.experienceOrbCount,
    experienceValuePerOrb: TRIJAL_BOSS.experienceValuePerOrb
  }
} as const satisfies Record<EnemyTypeId, EnemyDefinition>;

export const ENEMY_SPRITE_DEFINITIONS = {
  [ENEMY_TYPE_IDS.CHASER]: {
    textureKey: "chaser",
    textureUrl: chaserTextureUrl,
    previewUrl: chaserPreviewUrl,
    animationKey: "chaser-move",
    frameWidth: 48,
    frameHeight: 48,
    frameStart: 0,
    frameEnd: 7,
    frameRate: 8,
    repeat: -1,
    displaySize: 48,
    rotateToFacePlayer: true,
    forwardRotationOffsetRadians: Math.PI / 2
  },
  [ENEMY_TYPE_IDS.RUSHER]: {
    textureKey: "rusher",
    textureUrl: rusherTextureUrl,
    previewUrl: rusherPreviewUrl,
    animationKey: "rusher-move",
    frameWidth: 50,
    frameHeight: 50,
    frameStart: 0,
    frameEnd: 7,
    frameRate: 12,
    repeat: -1,
    displaySize: 50,
    rotateToFacePlayer: true,
    forwardRotationOffsetRadians: Math.PI / 2
  },
  [ENEMY_TYPE_IDS.TANK]: {
    textureKey: "tank",
    textureUrl: tankTextureUrl,
    previewUrl: tankPreviewUrl,
    animationKey: "tank-move",
    frameWidth: 84,
    frameHeight: 84,
    frameStart: 0,
    frameEnd: 7,
    frameRate: 8,
    repeat: -1,
    displaySize: 84,
    rotateToFacePlayer: true,
    forwardRotationOffsetRadians: Math.PI / 2
  },
  [ENEMY_TYPE_IDS.TRIJAL]: {
    textureKey: "rival",
    textureUrl: rivalTextureUrl,
    previewUrl: rivalPreviewUrl,
    animationKey: "rival-hover",
    frameWidth: TRIJAL_BOSS.frameSize,
    frameHeight: TRIJAL_BOSS.frameSize,
    frameStart: 0,
    frameEnd: 0,
    frameRate: 1,
    repeat: -1,
    displaySize: TRIJAL_BOSS.displaySize,
    rotateToFacePlayer: false,
    forwardRotationOffsetRadians: 0
  }
} as const satisfies Record<EnemyTypeId, EnemySpriteDefinition>;
