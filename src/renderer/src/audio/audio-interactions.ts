import { UI_AUDIO_EVENTS } from "./audio-catalog";
import { audio } from "./audio-controller";

const FOCUS_AUDIO_INTENT_WINDOW_MS = 180;

const FOCUS_AUDIO_KEYS = new Set([
  "Tab",
  "ArrowDown",
  "ArrowRight",
  "s",
  "S",
  "d",
  "D",
  "ArrowUp",
  "ArrowLeft",
  "w",
  "W",
  "a",
  "A"
]);

let focusIntentExpiresAtMs = 0;
let lastFocusedElement: HTMLElement | null = null;

export function installAudioInteractionIntentListeners(): () => void {
  const handleKeyDown = (event: KeyboardEvent) => {
    if (FOCUS_AUDIO_KEYS.has(event.key)) {
      markUiFocusIntent();
    }
  };

  window.addEventListener("keydown", handleKeyDown, true);

  return () => {
    window.removeEventListener("keydown", handleKeyDown, true);
  };
}

export function markUiFocusIntent(): void {
  focusIntentExpiresAtMs = performance.now() + FOCUS_AUDIO_INTENT_WINDOW_MS;
}

export function playUiFocusForElement(element: HTMLElement): void {
  if (
    performance.now() > focusIntentExpiresAtMs ||
    lastFocusedElement === element
  ) {
    return;
  }

  lastFocusedElement = element;
  audio.playUi(UI_AUDIO_EVENTS.FOCUS);
}

