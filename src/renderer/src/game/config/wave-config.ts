import { type EnemyTypeId } from "./enemy-config";

export const WAVE_ADVANCE_DELAY_MS = 1600;
export const WAVE_ANNOUNCEMENT_BASE_DURATION_MS = 1800;
export const WAVE_ANNOUNCEMENT_FULL_CLEAR_EXTENSION_MS = 1500;
export const WAVE_ANNOUNCEMENT_DURATION_MS =
  WAVE_ANNOUNCEMENT_BASE_DURATION_MS + WAVE_ANNOUNCEMENT_FULL_CLEAR_EXTENSION_MS;
export const WAVE_ANNOUNCEMENT_HEARTBEAT_START_PERCENT = 14;
export const WAVE_ANNOUNCEMENT_HEARTBEAT_END_PERCENT = 75;
export const WAVE_ANNOUNCEMENT_HEARTBEAT_WINDOW_PERCENT =
  WAVE_ANNOUNCEMENT_HEARTBEAT_END_PERCENT -
  WAVE_ANNOUNCEMENT_HEARTBEAT_START_PERCENT;
export const WAVE_ANNOUNCEMENT_HEARTBEAT_CYCLE_COUNT = 2;
export const PERCENT_DIVISOR = 100;
export const WAVE_ANNOUNCEMENT_HEARTBEAT_DURATION_MS =
  WAVE_ANNOUNCEMENT_DURATION_MS *
  (WAVE_ANNOUNCEMENT_HEARTBEAT_WINDOW_PERCENT / PERCENT_DIVISOR);
export const WAVE_ANNOUNCEMENT_HEARTBEAT_CYCLE_DURATION_MS =
  WAVE_ANNOUNCEMENT_HEARTBEAT_DURATION_MS /
  WAVE_ANNOUNCEMENT_HEARTBEAT_CYCLE_COUNT;

export type WaveSpawnDefinition = {
  enemyTypeId: EnemyTypeId;
  count: number;
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
