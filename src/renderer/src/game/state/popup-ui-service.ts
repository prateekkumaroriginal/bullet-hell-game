import {
  POPUP_DEFINITIONS,
  POPUP_MODES,
  POPUP_STORAGE_KEY,
  type PopupId,
  type PopupState
} from "../config/popup-config";
import {
  emitGameplayCommand,
  GAMEPLAY_COMMANDS
} from "../events/gameplay-commands";
import { GAME_SESSION_PHASES } from "./game-session-state";
import { useGameUiStore } from "./use-game-ui-store";

const EMPTY_SEEN_POPUP_IDS: readonly PopupId[] = [];

const isPopupId = (popupId: unknown): popupId is PopupId =>
  typeof popupId === "string" && Object.hasOwn(POPUP_DEFINITIONS, popupId);

const readSeenPopupIds = (): readonly PopupId[] => {
  try {
    const storedSeenPopupIds = window.localStorage.getItem(POPUP_STORAGE_KEY);

    if (!storedSeenPopupIds) {
      return EMPTY_SEEN_POPUP_IDS;
    }

    const parsedSeenPopupIds = JSON.parse(storedSeenPopupIds);

    return Array.isArray(parsedSeenPopupIds)
      ? parsedSeenPopupIds.filter(isPopupId)
      : EMPTY_SEEN_POPUP_IDS;
  } catch {
    return EMPTY_SEEN_POPUP_IDS;
  }
};

const seenPopupIds = new Set<PopupId>(readSeenPopupIds());

const markPopupSeen = (popupId: PopupId): void => {
  seenPopupIds.add(popupId);

  try {
    window.localStorage.setItem(
      POPUP_STORAGE_KEY,
      JSON.stringify([...seenPopupIds])
    );
  } catch {
    // The in-memory set still prevents repeats during this app session.
  }
};

export const showPopup = (popupId: PopupId): PopupState | null => {
  const store = useGameUiStore.getState();
  const popupDefinition = POPUP_DEFINITIONS[popupId];

  if (
    popupDefinition.mode === POPUP_MODES.MODAL &&
    store.popups.activeModal
  ) {
    return null;
  }

  const popup = {
    ...popupDefinition,
    shownAtMs: Date.now()
  };

  store.showPopup(popup);

  if (popup.mode === POPUP_MODES.MODAL) {
    store.setGameSessionPhase(GAME_SESSION_PHASES.POPUP);
    emitGameplayCommand(GAMEPLAY_COMMANDS.BLOCK_GAMEPLAY_FOR_POPUP, undefined);
  }

  return popup;
};

export const showPopupOnce = (popupId: PopupId): PopupState | null => {
  if (seenPopupIds.has(popupId)) {
    return null;
  }

  const popup = showPopup(popupId);

  if (popup) {
    markPopupSeen(popupId);
  }

  return popup;
};

export const dismissActivePopup = (): void => {
  const store = useGameUiStore.getState();
  const activeModalId = store.popups.activeModal?.id;

  if (activeModalId) {
    store.dismissPopup(activeModalId);
  }
};

export const completePopupDismissal = (): void => {
  const store = useGameUiStore.getState();

  if (store.gameSession.phase !== GAME_SESSION_PHASES.POPUP) {
    return;
  }

  emitGameplayCommand(GAMEPLAY_COMMANDS.COMPLETE_POPUP_DISMISSAL, undefined);
  store.setGameSessionPhase(GAME_SESSION_PHASES.PLAYING);
};
