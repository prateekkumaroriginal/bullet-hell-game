import { type WaveDefinition } from "./wave-config";

export const STAGE_IDS = {
  STAGE_1: "stage-1",
  STAGE_2: "stage-2",
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
        enemyCount: 4,
        spawnCooldownMs: 900,
      },
      {
        enemyCount: 7,
        spawnCooldownMs: 800,
      },
      {
        enemyCount: 10,
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
        enemyCount: 6,
        spawnCooldownMs: 780,
      },
      {
        enemyCount: 9,
        spawnCooldownMs: 680,
      },
      {
        enemyCount: 12,
        spawnCooldownMs: 580,
      },
      {
        enemyCount: 15,
        spawnCooldownMs: 520,
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
