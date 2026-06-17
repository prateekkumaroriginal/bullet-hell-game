import {
  POPUP_DEFINITIONS,
  POPUP_MODES,
  POPUP_STORAGE_KEY,
  type PopupDefinition,
  type PopupId
} from "../config/popup-config";
import {
  emitGameplayEvent,
  GAMEPLAY_EVENTS
} from "../events/gameplay-events";

const EMPTY_SEEN_POPUP_IDS: readonly PopupId[] = [];

export class PopupController {
  private readonly seenPopupIds = new Set<PopupId>();
  private activeModalId: PopupId | null = null;

  constructor() {
    for (const popupId of this.readSeenPopupIds()) {
      this.seenPopupIds.add(popupId);
    }
  }

  get hasActiveModal(): boolean {
    return this.activeModalId !== null;
  }

  showOnce(popupId: PopupId): PopupDefinition | null {
    if (this.seenPopupIds.has(popupId)) {
      return null;
    }

    const popup = POPUP_DEFINITIONS[popupId];

    this.markSeen(popup.id);

    if (popup.mode === POPUP_MODES.MODAL) {
      this.activeModalId = popup.id;
    }

    emitGameplayEvent(GAMEPLAY_EVENTS.POPUP_SHOWN, {
      ...popup,
      shownAtMs: Date.now()
    });

    return popup;
  }

  dismissActiveModal(): PopupId | null {
    if (!this.activeModalId) {
      return null;
    }

    const dismissedPopupId = this.activeModalId;
    this.activeModalId = null;
    emitGameplayEvent(GAMEPLAY_EVENTS.POPUP_DISMISSED, {
      id: dismissedPopupId
    });

    return dismissedPopupId;
  }

  resetActiveModal(): void {
    this.activeModalId = null;
  }

  private markSeen(popupId: PopupId): void {
    this.seenPopupIds.add(popupId);

    try {
      window.localStorage.setItem(
        POPUP_STORAGE_KEY,
        JSON.stringify([...this.seenPopupIds])
      );
    } catch {
      // Keep the in-memory set so a storage failure does not repeat within a run.
    }
  }

  private readSeenPopupIds(): readonly PopupId[] {
    let storedSeenPopupIds: string | null = null;

    try {
      storedSeenPopupIds = window.localStorage.getItem(
        POPUP_STORAGE_KEY
      );
    } catch {
      return EMPTY_SEEN_POPUP_IDS;
    }

    if (!storedSeenPopupIds) {
      return EMPTY_SEEN_POPUP_IDS;
    }

    try {
      const parsedSeenPopupIds = JSON.parse(storedSeenPopupIds);

      if (!Array.isArray(parsedSeenPopupIds)) {
        return EMPTY_SEEN_POPUP_IDS;
      }

      return parsedSeenPopupIds.filter(
        (popupId): popupId is PopupId =>
          this.isPopupId(popupId)
      );
    } catch {
      return EMPTY_SEEN_POPUP_IDS;
    }
  }

  private isPopupId(popupId: unknown): popupId is PopupId {
    return (
      typeof popupId === "string" &&
      Object.hasOwn(POPUP_DEFINITIONS, popupId)
    );
  }
}
