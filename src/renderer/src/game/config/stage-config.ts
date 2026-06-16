import { type WaveDefinition } from "./wave-config";
import { ENEMY_TYPE_IDS } from "./enemy-config";

export const STAGE_IDS = {
  STAGE_1: "stage-1",
  STAGE_2: "stage-2",
  STAGE_3: "stage-3",
  STAGE_4: "stage-4",
} as const;

export type StageId = (typeof STAGE_IDS)[keyof typeof STAGE_IDS];

export type StageDefinition = {
  id: StageId;
  name: string;
  order: number;
  waves: readonly WaveDefinition[];
};

export const STAGE_DEFINITIONS = [
  {
    id: STAGE_IDS.STAGE_1,
    name: "Stage 1",
    order: 1,
    waves: [
      {
        spawns: [{ enemyTypeId: ENEMY_TYPE_IDS.CHASER, count: 4 }],
        spawnCooldownMs: 900,
      },
      {
        spawns: [{ enemyTypeId: ENEMY_TYPE_IDS.CHASER, count: 7 }],
        spawnCooldownMs: 800,
      },
      {
        spawns: [{ enemyTypeId: ENEMY_TYPE_IDS.CHASER, count: 10 }],
        spawnCooldownMs: 700,
      },
    ],
  },
  {
    id: STAGE_IDS.STAGE_2,
    name: "Stage 2",
    order: 2,
    waves: [
      {
        spawns: [{ enemyTypeId: ENEMY_TYPE_IDS.CHASER, count: 6 }],
        spawnCooldownMs: 780,
      },
      {
        spawns: [
          { enemyTypeId: ENEMY_TYPE_IDS.CHASER, count: 8 },
          { enemyTypeId: ENEMY_TYPE_IDS.TANK, count: 1 },
        ],
        spawnCooldownMs: 680,
      },
      {
        spawns: [
          { enemyTypeId: ENEMY_TYPE_IDS.CHASER, count: 10 },
          { enemyTypeId: ENEMY_TYPE_IDS.TANK, count: 2 },
        ],
        spawnCooldownMs: 580,
      },
      {
        spawns: [
          { enemyTypeId: ENEMY_TYPE_IDS.CHASER, count: 12 },
          { enemyTypeId: ENEMY_TYPE_IDS.TANK, count: 3 },
        ],
        spawnCooldownMs: 520,
      },
    ],
  },
  {
    id: STAGE_IDS.STAGE_3,
    name: "Stage 3",
    order: 3,
    waves: [
      {
        spawns: [{ enemyTypeId: ENEMY_TYPE_IDS.CHASER, count: 6 }],
        spawnCooldownMs: 760,
      },
      {
        spawns: [
          { enemyTypeId: ENEMY_TYPE_IDS.CHASER, count: 6 },
          { enemyTypeId: ENEMY_TYPE_IDS.RUSHER, count: 3 },
        ],
        spawnCooldownMs: 660,
      },
      {
        spawns: [
          { enemyTypeId: ENEMY_TYPE_IDS.CHASER, count: 7 },
          { enemyTypeId: ENEMY_TYPE_IDS.RUSHER, count: 5 },
        ],
        spawnCooldownMs: 560,
      },
      {
        spawns: [
          { enemyTypeId: ENEMY_TYPE_IDS.CHASER, count: 8 },
          { enemyTypeId: ENEMY_TYPE_IDS.RUSHER, count: 7 },
        ],
        spawnCooldownMs: 500,
      },
    ],
  },
  {
    id: STAGE_IDS.STAGE_4,
    name: "Stage 4",
    order: 4,
    waves: [
      {
        spawns: [
          { enemyTypeId: ENEMY_TYPE_IDS.CHASER, count: 5 },
          { enemyTypeId: ENEMY_TYPE_IDS.RUSHER, count: 2 },
        ],
        spawnCooldownMs: 720,
      },
      {
        spawns: [
          { enemyTypeId: ENEMY_TYPE_IDS.CHASER, count: 6 },
          { enemyTypeId: ENEMY_TYPE_IDS.RUSHER, count: 3 },
          { enemyTypeId: ENEMY_TYPE_IDS.TANK, count: 1 },
        ],
        spawnCooldownMs: 620,
      },
      {
        spawns: [
          { enemyTypeId: ENEMY_TYPE_IDS.CHASER, count: 7 },
          { enemyTypeId: ENEMY_TYPE_IDS.RUSHER, count: 4 },
          { enemyTypeId: ENEMY_TYPE_IDS.TANK, count: 2 },
        ],
        spawnCooldownMs: 540,
      },
      {
        spawns: [
          { enemyTypeId: ENEMY_TYPE_IDS.CHASER, count: 8 },
          { enemyTypeId: ENEMY_TYPE_IDS.RUSHER, count: 5 },
          { enemyTypeId: ENEMY_TYPE_IDS.TANK, count: 3 },
        ],
        spawnCooldownMs: 480,
      },
    ],
  },
] as const satisfies readonly StageDefinition[];

export const DEFAULT_STAGE_ID = STAGE_IDS.STAGE_1;

export const FIRST_STAGE_ORDER = 1;

export function getStageDefinition(stageId: StageId): StageDefinition {
  const stageDefinition = STAGE_DEFINITIONS.find((stage) => stage.id === stageId);

  if (!stageDefinition) {
    throw new Error(`Missing stage definition for ${stageId}.`);
  }

  return stageDefinition;
}
