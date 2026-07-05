import uiBackUrl from "../../../../assets/audio/ui-back.wav?url";
import uiDenyUrl from "../../../../assets/audio/ui-deny.wav?url";
import uiFocusUrl from "../../../../assets/audio/ui-focus.wav?url";
import uiPanelCloseUrl from "../../../../assets/audio/ui-panel-close.wav?url";
import uiPanelOpenUrl from "../../../../assets/audio/ui-panel-open.wav?url";
import uiSelectUrl from "../../../../assets/audio/ui-select.wav?url";
import uiToggleOffUrl from "../../../../assets/audio/ui-toggle-off.wav?url";
import uiToggleOnUrl from "../../../../assets/audio/ui-toggle-on.wav?url";

export const AUDIO_CATEGORIES = {
  MASTER: "master",
  UI: "ui",
  SFX: "sfx",
  MUSIC: "music",
  AMBIENT: "ambient"
} as const;

export type AudioCategory =
  (typeof AUDIO_CATEGORIES)[keyof typeof AUDIO_CATEGORIES];
export type PlayableAudioCategory = Exclude<
  AudioCategory,
  typeof AUDIO_CATEGORIES.MASTER
>;

export const AUDIO_SOUND_IDS = {
  UI_FOCUS: "ui.focus",
  UI_SELECT: "ui.select",
  UI_BACK: "ui.back",
  UI_DENY: "ui.deny",
  UI_TOGGLE_ON: "ui.toggleOn",
  UI_TOGGLE_OFF: "ui.toggleOff",
  UI_PANEL_OPEN: "ui.panelOpen",
  UI_PANEL_CLOSE: "ui.panelClose"
} as const;

export type AudioSoundId =
  (typeof AUDIO_SOUND_IDS)[keyof typeof AUDIO_SOUND_IDS];

export const UI_AUDIO_EVENTS = {
  FOCUS: "focus",
  SELECT: "select",
  BACK: "back",
  DENY: "deny",
  TOGGLE_ON: "toggleOn",
  TOGGLE_OFF: "toggleOff",
  PANEL_OPEN: "panelOpen",
  PANEL_CLOSE: "panelClose"
} as const;

export type UiAudioEvent =
  (typeof UI_AUDIO_EVENTS)[keyof typeof UI_AUDIO_EVENTS];

export type AudioSoundDefinition = {
  id: AudioSoundId;
  phaserKey: string;
  urls: readonly string[];
  category: PlayableAudioCategory;
  volume: number;
  cooldownMs: number;
  maxConcurrent: number;
  detuneJitterCents: number;
};

const UI_FOCUS_VOLUME = 0.24;
const UI_SELECT_VOLUME = 0.48;
const UI_BACK_VOLUME = 0.34;
const UI_DENY_VOLUME = 0.32;
const UI_TOGGLE_VOLUME = 0.38;
const UI_PANEL_VOLUME = 0.3;

const UI_FOCUS_COOLDOWN_MS = 75;
const UI_SELECT_COOLDOWN_MS = 35;
const UI_BACK_COOLDOWN_MS = 50;
const UI_DENY_COOLDOWN_MS = 150;
const UI_TOGGLE_COOLDOWN_MS = 55;
const UI_PANEL_COOLDOWN_MS = 80;

const UI_FOCUS_MAX_CONCURRENT = 1;
const UI_SELECT_MAX_CONCURRENT = 2;
const UI_BACK_MAX_CONCURRENT = 1;
const UI_DENY_MAX_CONCURRENT = 1;
const UI_TOGGLE_MAX_CONCURRENT = 1;
const UI_PANEL_MAX_CONCURRENT = 1;

const UI_FOCUS_DETUNE_JITTER_CENTS = 18;
const UI_SELECT_DETUNE_JITTER_CENTS = 10;
const UI_BACK_DETUNE_JITTER_CENTS = 8;
const UI_DENY_DETUNE_JITTER_CENTS = 0;
const UI_TOGGLE_DETUNE_JITTER_CENTS = 10;
const UI_PANEL_DETUNE_JITTER_CENTS = 6;

export const AUDIO_SOUND_DEFINITIONS = {
  [AUDIO_SOUND_IDS.UI_FOCUS]: {
    id: AUDIO_SOUND_IDS.UI_FOCUS,
    phaserKey: "audio-ui-focus",
    urls: [uiPanelOpenUrl],
    category: AUDIO_CATEGORIES.UI,
    volume: UI_FOCUS_VOLUME,
    cooldownMs: UI_FOCUS_COOLDOWN_MS,
    maxConcurrent: UI_FOCUS_MAX_CONCURRENT,
    detuneJitterCents: UI_FOCUS_DETUNE_JITTER_CENTS
  },
  [AUDIO_SOUND_IDS.UI_SELECT]: {
    id: AUDIO_SOUND_IDS.UI_SELECT,
    phaserKey: "audio-ui-select",
    urls: [uiSelectUrl],
    category: AUDIO_CATEGORIES.UI,
    volume: UI_SELECT_VOLUME,
    cooldownMs: UI_SELECT_COOLDOWN_MS,
    maxConcurrent: UI_SELECT_MAX_CONCURRENT,
    detuneJitterCents: UI_SELECT_DETUNE_JITTER_CENTS
  },
  [AUDIO_SOUND_IDS.UI_BACK]: {
    id: AUDIO_SOUND_IDS.UI_BACK,
    phaserKey: "audio-ui-back",
    urls: [uiBackUrl],
    category: AUDIO_CATEGORIES.UI,
    volume: UI_BACK_VOLUME,
    cooldownMs: UI_BACK_COOLDOWN_MS,
    maxConcurrent: UI_BACK_MAX_CONCURRENT,
    detuneJitterCents: UI_BACK_DETUNE_JITTER_CENTS
  },
  [AUDIO_SOUND_IDS.UI_DENY]: {
    id: AUDIO_SOUND_IDS.UI_DENY,
    phaserKey: "audio-ui-deny",
    urls: [uiDenyUrl],
    category: AUDIO_CATEGORIES.UI,
    volume: UI_DENY_VOLUME,
    cooldownMs: UI_DENY_COOLDOWN_MS,
    maxConcurrent: UI_DENY_MAX_CONCURRENT,
    detuneJitterCents: UI_DENY_DETUNE_JITTER_CENTS
  },
  [AUDIO_SOUND_IDS.UI_TOGGLE_ON]: {
    id: AUDIO_SOUND_IDS.UI_TOGGLE_ON,
    phaserKey: "audio-ui-toggle-on",
    urls: [uiToggleOnUrl],
    category: AUDIO_CATEGORIES.UI,
    volume: UI_TOGGLE_VOLUME,
    cooldownMs: UI_TOGGLE_COOLDOWN_MS,
    maxConcurrent: UI_TOGGLE_MAX_CONCURRENT,
    detuneJitterCents: UI_TOGGLE_DETUNE_JITTER_CENTS
  },
  [AUDIO_SOUND_IDS.UI_TOGGLE_OFF]: {
    id: AUDIO_SOUND_IDS.UI_TOGGLE_OFF,
    phaserKey: "audio-ui-toggle-off",
    urls: [uiToggleOffUrl],
    category: AUDIO_CATEGORIES.UI,
    volume: UI_TOGGLE_VOLUME,
    cooldownMs: UI_TOGGLE_COOLDOWN_MS,
    maxConcurrent: UI_TOGGLE_MAX_CONCURRENT,
    detuneJitterCents: UI_TOGGLE_DETUNE_JITTER_CENTS
  },
  [AUDIO_SOUND_IDS.UI_PANEL_OPEN]: {
    id: AUDIO_SOUND_IDS.UI_PANEL_OPEN,
    phaserKey: "audio-ui-panel-open",
    urls: [uiFocusUrl],
    category: AUDIO_CATEGORIES.UI,
    volume: UI_PANEL_VOLUME,
    cooldownMs: UI_PANEL_COOLDOWN_MS,
    maxConcurrent: UI_PANEL_MAX_CONCURRENT,
    detuneJitterCents: UI_PANEL_DETUNE_JITTER_CENTS
  },
  [AUDIO_SOUND_IDS.UI_PANEL_CLOSE]: {
    id: AUDIO_SOUND_IDS.UI_PANEL_CLOSE,
    phaserKey: "audio-ui-panel-close",
    urls: [uiPanelCloseUrl],
    category: AUDIO_CATEGORIES.UI,
    volume: UI_PANEL_VOLUME,
    cooldownMs: UI_PANEL_COOLDOWN_MS,
    maxConcurrent: UI_PANEL_MAX_CONCURRENT,
    detuneJitterCents: UI_PANEL_DETUNE_JITTER_CENTS
  }
} as const satisfies Record<AudioSoundId, AudioSoundDefinition>;

export const AUDIO_SOUND_DEFINITION_LIST = Object.values(
  AUDIO_SOUND_DEFINITIONS
);

export const UI_AUDIO_EVENT_SOUND_IDS = {
  [UI_AUDIO_EVENTS.FOCUS]: AUDIO_SOUND_IDS.UI_FOCUS,
  [UI_AUDIO_EVENTS.SELECT]: AUDIO_SOUND_IDS.UI_SELECT,
  [UI_AUDIO_EVENTS.BACK]: AUDIO_SOUND_IDS.UI_BACK,
  [UI_AUDIO_EVENTS.DENY]: AUDIO_SOUND_IDS.UI_DENY,
  [UI_AUDIO_EVENTS.TOGGLE_ON]: AUDIO_SOUND_IDS.UI_TOGGLE_ON,
  [UI_AUDIO_EVENTS.TOGGLE_OFF]: AUDIO_SOUND_IDS.UI_TOGGLE_OFF,
  [UI_AUDIO_EVENTS.PANEL_OPEN]: AUDIO_SOUND_IDS.UI_PANEL_OPEN,
  [UI_AUDIO_EVENTS.PANEL_CLOSE]: AUDIO_SOUND_IDS.UI_PANEL_CLOSE
} as const satisfies Record<UiAudioEvent, AudioSoundId>;
