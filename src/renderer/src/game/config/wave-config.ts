import { type EnemyTypeId } from "./enemy-config";

export const WAVE_ADVANCE_DELAY_MS = 1600;
export const WAVE_ANNOUNCEMENT_BASE_DURATION_MS = 1800;
export const WAVE_ANNOUNCEMENT_FULL_CLEAR_EXTENSION_MS = 1500;
export const WAVE_ANNOUNCEMENT_DURATION_MS =
  WAVE_ANNOUNCEMENT_BASE_DURATION_MS + WAVE_ANNOUNCEMENT_FULL_CLEAR_EXTENSION_MS;

export type WaveSpawnDefinition = {
  enemyTypeId: EnemyTypeId;
  count: number;
  delayMs?: number;
  spawnCooldownMs?: number;
};

export type WaveDefinition = {
  spawns: readonly WaveSpawnDefinition[];
  spawnCooldownMs: number;
};

export function getWaveEnemyCount(waveDefinition: WaveDefinition): number {
  return waveDefinition.spawns.reduce(
    (enemyCount, spawn) => enemyCount + spawn.count,
    0,
  );
}
