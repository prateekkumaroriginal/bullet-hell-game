export const DEBUG_STATS_UPDATE_INTERVAL_MS = 50;

export function isDebugStatsEnabled(): boolean {
  return import.meta.env.DEV;
}
