import Phaser from "phaser";

export type DebugHitboxOverlayChangedPayload = {
  isVisible: boolean;
};

const DEBUG_HITBOX_OVERLAY_CHANGED_EVENT = "debug:hitbox-overlay-changed";
const debugHitboxEvents = new Phaser.Events.EventEmitter();
let isHitboxOverlayVisible = false;

export function isDebugHitboxOverlayVisible(): boolean {
  return isHitboxOverlayVisible;
}

export function setDebugHitboxOverlayVisible(isVisible: boolean): void {
  if (isHitboxOverlayVisible === isVisible) {
    return;
  }

  isHitboxOverlayVisible = isVisible;
  debugHitboxEvents.emit(DEBUG_HITBOX_OVERLAY_CHANGED_EVENT, { isVisible });
}

export function onDebugHitboxOverlayChanged(
  listener: (payload: DebugHitboxOverlayChangedPayload) => void
): () => void {
  debugHitboxEvents.on(DEBUG_HITBOX_OVERLAY_CHANGED_EVENT, listener);

  return () => {
    debugHitboxEvents.off(DEBUG_HITBOX_OVERLAY_CHANGED_EVENT, listener);
  };
}
