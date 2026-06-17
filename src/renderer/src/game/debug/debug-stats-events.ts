import Phaser from "phaser";

export type DebugStatsCategory = {
  name: string;
  stats: readonly DebugStat[];
};

export type DebugStat = {
  prop: string;
  value: string;
};

export type DebugStatsChangedPayload = {
  categories: readonly DebugStatsCategory[];
};

const DEBUG_STATS_CHANGED_EVENT = "debug:stats-changed";
const debugStatsEvents = new Phaser.Events.EventEmitter();

export function emitDebugStatsChanged(payload: DebugStatsChangedPayload): void {
  debugStatsEvents.emit(DEBUG_STATS_CHANGED_EVENT, payload);
}

export function onDebugStatsChanged(
  listener: (payload: DebugStatsChangedPayload) => void,
): () => void {
  debugStatsEvents.on(DEBUG_STATS_CHANGED_EVENT, listener);

  return () => {
    debugStatsEvents.off(DEBUG_STATS_CHANGED_EVENT, listener);
  };
}
