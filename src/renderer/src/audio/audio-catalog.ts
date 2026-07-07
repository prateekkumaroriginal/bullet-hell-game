import { UI_SOUND_VARIATION_FIRST_INDEX } from "../../../shared/settings-config";
import buttonFocus07Url from "../../../../assets/audio/button-focus/button-focus-07-null-beacon-high.wav?url";
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

export const UI_AUDIO_SOURCE_IDS = {
  BUTTON_FOCUS_07: "uiSource.buttonFocus07",
  FOCUS: "uiSource.focus",
  SELECT: "uiSource.select",
  BACK: "uiSource.back",
  DENY: "uiSource.deny",
  TOGGLE_ON: "uiSource.toggleOn",
  TOGGLE_OFF: "uiSource.toggleOff",
  PANEL_OPEN: "uiSource.panelOpen",
  PANEL_CLOSE: "uiSource.panelClose"
} as const;

export type UiAudioSourceId =
  (typeof UI_AUDIO_SOURCE_IDS)[keyof typeof UI_AUDIO_SOURCE_IDS];

export type AudioSourceDefinition = {
  id: UiAudioSourceId;
  phaserKey: string;
  urls: readonly string[];
};

export type AudioSoundVariation = {
  index: number;
  name: string;
  sourceId: UiAudioSourceId;
  rate: number;
  detuneCents: number;
};

export type AudioSoundDefinition = {
  id: AudioSoundId;
  category: PlayableAudioCategory;
  cooldownMs: number;
  maxConcurrent: number;
  detuneJitterCents: number;
  variations: readonly AudioSoundVariation[];
};

export type UiAudioEventDefinition = {
  eventName: UiAudioEvent;
  soundId: AudioSoundId;
  label: string;
};

const UI_FOCUS_COOLDOWN_MS = 75;
const UI_SELECT_COOLDOWN_MS = 35;
const UI_BACK_COOLDOWN_MS = 50;
const UI_DENY_COOLDOWN_MS = 150;
const UI_TOGGLE_COOLDOWN_MS = 55;
const UI_PANEL_COOLDOWN_MS = 80;

const UI_FOCUS_MAX_CONCURRENT = 2;
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

export const AUDIO_SOURCE_DEFINITIONS = {
  [UI_AUDIO_SOURCE_IDS.BUTTON_FOCUS_07]: {
    id: UI_AUDIO_SOURCE_IDS.BUTTON_FOCUS_07,
    phaserKey: "audio-ui-source-button-focus-07",
    urls: [buttonFocus07Url]
  },
  [UI_AUDIO_SOURCE_IDS.FOCUS]: {
    id: UI_AUDIO_SOURCE_IDS.FOCUS,
    phaserKey: "audio-ui-source-focus",
    urls: [uiFocusUrl]
  },
  [UI_AUDIO_SOURCE_IDS.SELECT]: {
    id: UI_AUDIO_SOURCE_IDS.SELECT,
    phaserKey: "audio-ui-source-select",
    urls: [uiSelectUrl]
  },
  [UI_AUDIO_SOURCE_IDS.BACK]: {
    id: UI_AUDIO_SOURCE_IDS.BACK,
    phaserKey: "audio-ui-source-back",
    urls: [uiBackUrl]
  },
  [UI_AUDIO_SOURCE_IDS.DENY]: {
    id: UI_AUDIO_SOURCE_IDS.DENY,
    phaserKey: "audio-ui-source-deny",
    urls: [uiDenyUrl]
  },
  [UI_AUDIO_SOURCE_IDS.TOGGLE_ON]: {
    id: UI_AUDIO_SOURCE_IDS.TOGGLE_ON,
    phaserKey: "audio-ui-source-toggle-on",
    urls: [uiToggleOnUrl]
  },
  [UI_AUDIO_SOURCE_IDS.TOGGLE_OFF]: {
    id: UI_AUDIO_SOURCE_IDS.TOGGLE_OFF,
    phaserKey: "audio-ui-source-toggle-off",
    urls: [uiToggleOffUrl]
  },
  [UI_AUDIO_SOURCE_IDS.PANEL_OPEN]: {
    id: UI_AUDIO_SOURCE_IDS.PANEL_OPEN,
    phaserKey: "audio-ui-source-panel-open",
    urls: [uiPanelOpenUrl]
  },
  [UI_AUDIO_SOURCE_IDS.PANEL_CLOSE]: {
    id: UI_AUDIO_SOURCE_IDS.PANEL_CLOSE,
    phaserKey: "audio-ui-source-panel-close",
    urls: [uiPanelCloseUrl]
  }
} as const satisfies Record<UiAudioSourceId, AudioSourceDefinition>;

export const AUDIO_SOURCE_DEFINITION_LIST = Object.values(
  AUDIO_SOURCE_DEFINITIONS
);

const FOCUS_VARIATIONS = defineUiSoundVariations([
  {
    name: "Null Beacon High",
    sourceId: UI_AUDIO_SOURCE_IDS.BUTTON_FOCUS_07,
    rate: 1,
    detuneCents: 0
  }
]);

const SELECT_VARIATIONS = defineUiSoundVariations([
  {
    name: "Confirm Snap",
    sourceId: UI_AUDIO_SOURCE_IDS.SELECT,
    rate: 1,
    detuneCents: 0
  },
  {
    name: "Coin Lock",
    sourceId: UI_AUDIO_SOURCE_IDS.TOGGLE_ON,
    rate: 0.98,
    detuneCents: 40
  },
  {
    name: "Glass Commit",
    sourceId: UI_AUDIO_SOURCE_IDS.SELECT,
    rate: 1.24,
    detuneCents: 180
  },
  {
    name: "Steel Press",
    sourceId: UI_AUDIO_SOURCE_IDS.BACK,
    rate: 0.88,
    detuneCents: -140
  },
  {
    name: "Power Tap",
    sourceId: UI_AUDIO_SOURCE_IDS.PANEL_OPEN,
    rate: 1.08,
    detuneCents: 50
  },
  {
    name: "Short Clack",
    sourceId: UI_AUDIO_SOURCE_IDS.PANEL_CLOSE,
    rate: 1.2,
    detuneCents: 140
  },
  {
    name: "Soft Commit",
    sourceId: UI_AUDIO_SOURCE_IDS.FOCUS,
    rate: 0.96,
    detuneCents: -40
  },
  {
    name: "Bright Punch",
    sourceId: UI_AUDIO_SOURCE_IDS.SELECT,
    rate: 1.42,
    detuneCents: 300
  },
  {
    name: "Heavy Button",
    sourceId: UI_AUDIO_SOURCE_IDS.BACK,
    rate: 0.72,
    detuneCents: -340
  },
  {
    name: "Circuit Yes",
    sourceId: UI_AUDIO_SOURCE_IDS.TOGGLE_ON,
    rate: 1.18,
    detuneCents: 110
  },
  {
    name: "Panel Stamp",
    sourceId: UI_AUDIO_SOURCE_IDS.PANEL_OPEN,
    rate: 0.9,
    detuneCents: -90
  },
  {
    name: "Latch Hit",
    sourceId: UI_AUDIO_SOURCE_IDS.PANEL_CLOSE,
    rate: 0.92,
    detuneCents: -70
  },
  {
    name: "Clean Click",
    sourceId: UI_AUDIO_SOURCE_IDS.SELECT,
    rate: 1.1,
    detuneCents: 70
  },
  {
    name: "Lifted Snap",
    sourceId: UI_AUDIO_SOURCE_IDS.TOGGLE_ON,
    rate: 1.36,
    detuneCents: 260
  },
  {
    name: "Dark Press",
    sourceId: UI_AUDIO_SOURCE_IDS.BACK,
    rate: 0.8,
    detuneCents: -240
  },
  {
    name: "Round Button",
    sourceId: UI_AUDIO_SOURCE_IDS.FOCUS,
    rate: 0.84,
    detuneCents: -180
  },
  {
    name: "Arc Confirm",
    sourceId: UI_AUDIO_SOURCE_IDS.PANEL_OPEN,
    rate: 1.26,
    detuneCents: 190
  },
  {
    name: "Tight Switch",
    sourceId: UI_AUDIO_SOURCE_IDS.TOGGLE_OFF,
    rate: 1.16,
    detuneCents: 120
  },
  {
    name: "Magnet Click",
    sourceId: UI_AUDIO_SOURCE_IDS.PANEL_CLOSE,
    rate: 1.04,
    detuneCents: 20
  },
  {
    name: "Loud Confirm",
    sourceId: UI_AUDIO_SOURCE_IDS.SELECT,
    rate: 0.92,
    detuneCents: -80
  }
]);

const BACK_VARIATIONS = defineUiSoundVariations([
  {
    name: "Back Step",
    sourceId: UI_AUDIO_SOURCE_IDS.BACK,
    rate: 1,
    detuneCents: 0
  },
  {
    name: "Soft Recede",
    sourceId: UI_AUDIO_SOURCE_IDS.PANEL_CLOSE,
    rate: 0.9,
    detuneCents: -110
  },
  {
    name: "Reverse Tick",
    sourceId: UI_AUDIO_SOURCE_IDS.TOGGLE_OFF,
    rate: 0.96,
    detuneCents: -40
  },
  {
    name: "Low Return",
    sourceId: UI_AUDIO_SOURCE_IDS.BACK,
    rate: 0.78,
    detuneCents: -300
  },
  {
    name: "Close Tap",
    sourceId: UI_AUDIO_SOURCE_IDS.PANEL_CLOSE,
    rate: 1.1,
    detuneCents: 80
  },
  {
    name: "Dim Button",
    sourceId: UI_AUDIO_SOURCE_IDS.FOCUS,
    rate: 0.82,
    detuneCents: -220
  },
  {
    name: "Steel Back",
    sourceId: UI_AUDIO_SOURCE_IDS.SELECT,
    rate: 0.76,
    detuneCents: -320
  },
  {
    name: "Short Return",
    sourceId: UI_AUDIO_SOURCE_IDS.BACK,
    rate: 1.22,
    detuneCents: 140
  },
  {
    name: "Muted Close",
    sourceId: UI_AUDIO_SOURCE_IDS.TOGGLE_OFF,
    rate: 0.84,
    detuneCents: -170
  },
  {
    name: "Door Tap",
    sourceId: UI_AUDIO_SOURCE_IDS.PANEL_CLOSE,
    rate: 0.82,
    detuneCents: -230
  },
  {
    name: "Clean Back",
    sourceId: UI_AUDIO_SOURCE_IDS.BACK,
    rate: 1.08,
    detuneCents: 60
  },
  {
    name: "Needle Return",
    sourceId: UI_AUDIO_SOURCE_IDS.TOGGLE_OFF,
    rate: 1.28,
    detuneCents: 190
  },
  {
    name: "Heavy Rewind",
    sourceId: UI_AUDIO_SOURCE_IDS.BACK,
    rate: 0.68,
    detuneCents: -420
  },
  {
    name: "Hollow Back",
    sourceId: UI_AUDIO_SOURCE_IDS.PANEL_CLOSE,
    rate: 0.72,
    detuneCents: -350
  },
  {
    name: "Signal Retreat",
    sourceId: UI_AUDIO_SOURCE_IDS.FOCUS,
    rate: 0.92,
    detuneCents: -90
  },
  {
    name: "Dry Cancel",
    sourceId: UI_AUDIO_SOURCE_IDS.SELECT,
    rate: 0.82,
    detuneCents: -210
  },
  {
    name: "Carbon Return",
    sourceId: UI_AUDIO_SOURCE_IDS.BACK,
    rate: 0.9,
    detuneCents: -100
  },
  {
    name: "Far Latch",
    sourceId: UI_AUDIO_SOURCE_IDS.PANEL_CLOSE,
    rate: 1.26,
    detuneCents: 170
  },
  {
    name: "Quiet Escape",
    sourceId: UI_AUDIO_SOURCE_IDS.TOGGLE_OFF,
    rate: 1.06,
    detuneCents: 40
  },
  {
    name: "Hard Back",
    sourceId: UI_AUDIO_SOURCE_IDS.BACK,
    rate: 1.34,
    detuneCents: 230
  }
]);

const DENY_VARIATIONS = defineUiSoundVariations([
  {
    name: "Blocked Buzz",
    sourceId: UI_AUDIO_SOURCE_IDS.DENY,
    rate: 1,
    detuneCents: 0
  },
  {
    name: "Low Refuse",
    sourceId: UI_AUDIO_SOURCE_IDS.DENY,
    rate: 0.76,
    detuneCents: -310
  },
  {
    name: "Tight No",
    sourceId: UI_AUDIO_SOURCE_IDS.TOGGLE_OFF,
    rate: 0.7,
    detuneCents: -430
  },
  {
    name: "Hard Error",
    sourceId: UI_AUDIO_SOURCE_IDS.BACK,
    rate: 0.66,
    detuneCents: -460
  },
  {
    name: "Dry Denial",
    sourceId: UI_AUDIO_SOURCE_IDS.PANEL_CLOSE,
    rate: 0.74,
    detuneCents: -360
  },
  {
    name: "Warning Knock",
    sourceId: UI_AUDIO_SOURCE_IDS.DENY,
    rate: 0.9,
    detuneCents: -120
  },
  {
    name: "Muted Error",
    sourceId: UI_AUDIO_SOURCE_IDS.TOGGLE_OFF,
    rate: 0.82,
    detuneCents: -220
  },
  {
    name: "Short Buzz",
    sourceId: UI_AUDIO_SOURCE_IDS.DENY,
    rate: 1.2,
    detuneCents: 140
  },
  {
    name: "Metal No",
    sourceId: UI_AUDIO_SOURCE_IDS.BACK,
    rate: 0.82,
    detuneCents: -240
  },
  {
    name: "Closed Gate",
    sourceId: UI_AUDIO_SOURCE_IDS.PANEL_CLOSE,
    rate: 0.88,
    detuneCents: -150
  },
  {
    name: "Static Refuse",
    sourceId: UI_AUDIO_SOURCE_IDS.DENY,
    rate: 1.34,
    detuneCents: 260
  },
  {
    name: "Dark Fault",
    sourceId: UI_AUDIO_SOURCE_IDS.DENY,
    rate: 0.62,
    detuneCents: -560
  },
  {
    name: "Click Deny",
    sourceId: UI_AUDIO_SOURCE_IDS.TOGGLE_OFF,
    rate: 1.12,
    detuneCents: 80
  },
  {
    name: "Panel Refusal",
    sourceId: UI_AUDIO_SOURCE_IDS.PANEL_CLOSE,
    rate: 0.68,
    detuneCents: -440
  },
  {
    name: "Soft Error",
    sourceId: UI_AUDIO_SOURCE_IDS.FOCUS,
    rate: 0.64,
    detuneCents: -520
  },
  {
    name: "Blunt No",
    sourceId: UI_AUDIO_SOURCE_IDS.BACK,
    rate: 0.58,
    detuneCents: -650
  },
  {
    name: "Warning Pip",
    sourceId: UI_AUDIO_SOURCE_IDS.DENY,
    rate: 1.08,
    detuneCents: 60
  },
  {
    name: "Locked Tap",
    sourceId: UI_AUDIO_SOURCE_IDS.TOGGLE_OFF,
    rate: 0.9,
    detuneCents: -120
  },
  {
    name: "Sharp Fault",
    sourceId: UI_AUDIO_SOURCE_IDS.DENY,
    rate: 1.52,
    detuneCents: 360
  },
  {
    name: "Deep Block",
    sourceId: UI_AUDIO_SOURCE_IDS.DENY,
    rate: 0.7,
    detuneCents: -390
  }
]);

const TOGGLE_ON_VARIATIONS = defineUiSoundVariations([
  {
    name: "Switch Up",
    sourceId: UI_AUDIO_SOURCE_IDS.TOGGLE_ON,
    rate: 1,
    detuneCents: 0
  },
  {
    name: "Relay On",
    sourceId: UI_AUDIO_SOURCE_IDS.SELECT,
    rate: 1.12,
    detuneCents: 70
  },
  {
    name: "Power Rise",
    sourceId: UI_AUDIO_SOURCE_IDS.PANEL_OPEN,
    rate: 1.18,
    detuneCents: 120
  },
  {
    name: "Bright Toggle",
    sourceId: UI_AUDIO_SOURCE_IDS.TOGGLE_ON,
    rate: 1.32,
    detuneCents: 240
  },
  {
    name: "Small Arm",
    sourceId: UI_AUDIO_SOURCE_IDS.FOCUS,
    rate: 1.16,
    detuneCents: 90
  },
  {
    name: "Clean On",
    sourceId: UI_AUDIO_SOURCE_IDS.TOGGLE_ON,
    rate: 1.08,
    detuneCents: 50
  },
  {
    name: "Glass On",
    sourceId: UI_AUDIO_SOURCE_IDS.SELECT,
    rate: 1.36,
    detuneCents: 260
  },
  {
    name: "Panel Wake",
    sourceId: UI_AUDIO_SOURCE_IDS.PANEL_OPEN,
    rate: 0.96,
    detuneCents: -40
  },
  {
    name: "Lift Click",
    sourceId: UI_AUDIO_SOURCE_IDS.TOGGLE_ON,
    rate: 1.24,
    detuneCents: 160
  },
  {
    name: "Positive Dot",
    sourceId: UI_AUDIO_SOURCE_IDS.FOCUS,
    rate: 1.36,
    detuneCents: 260
  },
  {
    name: "Machine On",
    sourceId: UI_AUDIO_SOURCE_IDS.BACK,
    rate: 1.04,
    detuneCents: 30
  },
  {
    name: "High Latch",
    sourceId: UI_AUDIO_SOURCE_IDS.PANEL_CLOSE,
    rate: 1.44,
    detuneCents: 320
  },
  {
    name: "Soft Enable",
    sourceId: UI_AUDIO_SOURCE_IDS.TOGGLE_ON,
    rate: 0.88,
    detuneCents: -140
  },
  {
    name: "Arc On",
    sourceId: UI_AUDIO_SOURCE_IDS.PANEL_OPEN,
    rate: 1.34,
    detuneCents: 240
  },
  {
    name: "Pearl Switch",
    sourceId: UI_AUDIO_SOURCE_IDS.SELECT,
    rate: 1.02,
    detuneCents: 20
  },
  {
    name: "Tiny Enable",
    sourceId: UI_AUDIO_SOURCE_IDS.TOGGLE_ON,
    rate: 1.52,
    detuneCents: 380
  },
  {
    name: "Deep On",
    sourceId: UI_AUDIO_SOURCE_IDS.BACK,
    rate: 0.86,
    detuneCents: -170
  },
  {
    name: "Ready Click",
    sourceId: UI_AUDIO_SOURCE_IDS.PANEL_CLOSE,
    rate: 1.12,
    detuneCents: 80
  },
  {
    name: "Light Enabled",
    sourceId: UI_AUDIO_SOURCE_IDS.FOCUS,
    rate: 1.5,
    detuneCents: 360
  },
  {
    name: "Warm Toggle",
    sourceId: UI_AUDIO_SOURCE_IDS.TOGGLE_ON,
    rate: 0.96,
    detuneCents: -50
  }
]);

const TOGGLE_OFF_VARIATIONS = defineUiSoundVariations([
  {
    name: "Switch Down",
    sourceId: UI_AUDIO_SOURCE_IDS.TOGGLE_OFF,
    rate: 1,
    detuneCents: 0
  },
  {
    name: "Relay Off",
    sourceId: UI_AUDIO_SOURCE_IDS.PANEL_CLOSE,
    rate: 0.96,
    detuneCents: -50
  },
  {
    name: "Power Drop",
    sourceId: UI_AUDIO_SOURCE_IDS.BACK,
    rate: 0.84,
    detuneCents: -180
  },
  {
    name: "Soft Disable",
    sourceId: UI_AUDIO_SOURCE_IDS.TOGGLE_OFF,
    rate: 0.84,
    detuneCents: -190
  },
  {
    name: "Dark Toggle",
    sourceId: UI_AUDIO_SOURCE_IDS.TOGGLE_OFF,
    rate: 0.72,
    detuneCents: -360
  },
  {
    name: "Close Switch",
    sourceId: UI_AUDIO_SOURCE_IDS.PANEL_CLOSE,
    rate: 1.08,
    detuneCents: 60
  },
  {
    name: "Dry Off",
    sourceId: UI_AUDIO_SOURCE_IDS.BACK,
    rate: 1.02,
    detuneCents: 20
  },
  {
    name: "Mute Latch",
    sourceId: UI_AUDIO_SOURCE_IDS.TOGGLE_OFF,
    rate: 0.9,
    detuneCents: -120
  },
  {
    name: "Tiny Off",
    sourceId: UI_AUDIO_SOURCE_IDS.TOGGLE_OFF,
    rate: 1.34,
    detuneCents: 240
  },
  {
    name: "Panel Sleep",
    sourceId: UI_AUDIO_SOURCE_IDS.PANEL_CLOSE,
    rate: 0.8,
    detuneCents: -260
  },
  {
    name: "Needle Off",
    sourceId: UI_AUDIO_SOURCE_IDS.SELECT,
    rate: 0.86,
    detuneCents: -170
  },
  {
    name: "Hard Disable",
    sourceId: UI_AUDIO_SOURCE_IDS.BACK,
    rate: 0.68,
    detuneCents: -430
  },
  {
    name: "Clean Off",
    sourceId: UI_AUDIO_SOURCE_IDS.TOGGLE_OFF,
    rate: 1.1,
    detuneCents: 70
  },
  {
    name: "Low Switch",
    sourceId: UI_AUDIO_SOURCE_IDS.PANEL_CLOSE,
    rate: 0.7,
    detuneCents: -390
  },
  {
    name: "Quick Disable",
    sourceId: UI_AUDIO_SOURCE_IDS.TOGGLE_OFF,
    rate: 1.22,
    detuneCents: 150
  },
  {
    name: "Quiet Drop",
    sourceId: UI_AUDIO_SOURCE_IDS.FOCUS,
    rate: 0.72,
    detuneCents: -380
  },
  {
    name: "Carbon Off",
    sourceId: UI_AUDIO_SOURCE_IDS.BACK,
    rate: 0.9,
    detuneCents: -100
  },
  {
    name: "Pearl Off",
    sourceId: UI_AUDIO_SOURCE_IDS.SELECT,
    rate: 0.94,
    detuneCents: -80
  },
  {
    name: "Gate Closed",
    sourceId: UI_AUDIO_SOURCE_IDS.PANEL_CLOSE,
    rate: 1.2,
    detuneCents: 130
  },
  {
    name: "Deep Disable",
    sourceId: UI_AUDIO_SOURCE_IDS.TOGGLE_OFF,
    rate: 0.62,
    detuneCents: -540
  }
]);

const PANEL_OPEN_VARIATIONS = defineUiSoundVariations([
  {
    name: "Panel Bloom",
    sourceId: UI_AUDIO_SOURCE_IDS.PANEL_OPEN,
    rate: 1,
    detuneCents: 0
  },
  {
    name: "Door Wake",
    sourceId: UI_AUDIO_SOURCE_IDS.PANEL_OPEN,
    rate: 0.88,
    detuneCents: -130
  },
  {
    name: "Arc Door",
    sourceId: UI_AUDIO_SOURCE_IDS.TOGGLE_ON,
    rate: 0.86,
    detuneCents: -150
  },
  {
    name: "Bright Open",
    sourceId: UI_AUDIO_SOURCE_IDS.SELECT,
    rate: 0.9,
    detuneCents: -90
  },
  {
    name: "Wide Panel",
    sourceId: UI_AUDIO_SOURCE_IDS.PANEL_OPEN,
    rate: 0.76,
    detuneCents: -310
  },
  {
    name: "Glass Reveal",
    sourceId: UI_AUDIO_SOURCE_IDS.SELECT,
    rate: 1.08,
    detuneCents: 50
  },
  {
    name: "Soft Open",
    sourceId: UI_AUDIO_SOURCE_IDS.FOCUS,
    rate: 0.74,
    detuneCents: -340
  },
  {
    name: "Hatch Lift",
    sourceId: UI_AUDIO_SOURCE_IDS.PANEL_OPEN,
    rate: 1.16,
    detuneCents: 110
  },
  {
    name: "Machine Reveal",
    sourceId: UI_AUDIO_SOURCE_IDS.BACK,
    rate: 0.82,
    detuneCents: -220
  },
  {
    name: "Light Pane",
    sourceId: UI_AUDIO_SOURCE_IDS.TOGGLE_ON,
    rate: 1.14,
    detuneCents: 90
  },
  {
    name: "Clean Panel",
    sourceId: UI_AUDIO_SOURCE_IDS.PANEL_OPEN,
    rate: 1.08,
    detuneCents: 60
  },
  {
    name: "Deep Open",
    sourceId: UI_AUDIO_SOURCE_IDS.PANEL_OPEN,
    rate: 0.66,
    detuneCents: -480
  },
  {
    name: "Tight Open",
    sourceId: UI_AUDIO_SOURCE_IDS.PANEL_OPEN,
    rate: 1.32,
    detuneCents: 240
  },
  {
    name: "Console Bloom",
    sourceId: UI_AUDIO_SOURCE_IDS.FOCUS,
    rate: 0.9,
    detuneCents: -90
  },
  {
    name: "Steel Open",
    sourceId: UI_AUDIO_SOURCE_IDS.BACK,
    rate: 0.72,
    detuneCents: -380
  },
  {
    name: "Signal Door",
    sourceId: UI_AUDIO_SOURCE_IDS.TOGGLE_ON,
    rate: 1.3,
    detuneCents: 220
  },
  {
    name: "Pearl Reveal",
    sourceId: UI_AUDIO_SOURCE_IDS.SELECT,
    rate: 1.2,
    detuneCents: 140
  },
  {
    name: "Warm Open",
    sourceId: UI_AUDIO_SOURCE_IDS.PANEL_OPEN,
    rate: 0.94,
    detuneCents: -60
  },
  {
    name: "Quick Panel",
    sourceId: UI_AUDIO_SOURCE_IDS.PANEL_OPEN,
    rate: 1.44,
    detuneCents: 320
  },
  {
    name: "Heavy Hatch",
    sourceId: UI_AUDIO_SOURCE_IDS.BACK,
    rate: 0.58,
    detuneCents: -650
  }
]);

const PANEL_CLOSE_VARIATIONS = defineUiSoundVariations([
  {
    name: "Panel Seal",
    sourceId: UI_AUDIO_SOURCE_IDS.PANEL_CLOSE,
    rate: 1,
    detuneCents: 0
  },
  {
    name: "Door Shut",
    sourceId: UI_AUDIO_SOURCE_IDS.PANEL_CLOSE,
    rate: 0.86,
    detuneCents: -160
  },
  {
    name: "Arc Close",
    sourceId: UI_AUDIO_SOURCE_IDS.TOGGLE_OFF,
    rate: 0.9,
    detuneCents: -110
  },
  {
    name: "Soft Seal",
    sourceId: UI_AUDIO_SOURCE_IDS.FOCUS,
    rate: 0.68,
    detuneCents: -440
  },
  {
    name: "Hard Close",
    sourceId: UI_AUDIO_SOURCE_IDS.BACK,
    rate: 0.76,
    detuneCents: -320
  },
  {
    name: "Glass Close",
    sourceId: UI_AUDIO_SOURCE_IDS.SELECT,
    rate: 0.86,
    detuneCents: -160
  },
  {
    name: "Hatch Drop",
    sourceId: UI_AUDIO_SOURCE_IDS.PANEL_CLOSE,
    rate: 0.7,
    detuneCents: -400
  },
  {
    name: "Quick Seal",
    sourceId: UI_AUDIO_SOURCE_IDS.PANEL_CLOSE,
    rate: 1.24,
    detuneCents: 160
  },
  {
    name: "Machine Sleep",
    sourceId: UI_AUDIO_SOURCE_IDS.TOGGLE_OFF,
    rate: 0.78,
    detuneCents: -300
  },
  {
    name: "Light Close",
    sourceId: UI_AUDIO_SOURCE_IDS.PANEL_CLOSE,
    rate: 1.12,
    detuneCents: 80
  },
  {
    name: "Clean Seal",
    sourceId: UI_AUDIO_SOURCE_IDS.PANEL_CLOSE,
    rate: 0.96,
    detuneCents: -40
  },
  {
    name: "Deep Seal",
    sourceId: UI_AUDIO_SOURCE_IDS.BACK,
    rate: 0.6,
    detuneCents: -600
  },
  {
    name: "Tight Close",
    sourceId: UI_AUDIO_SOURCE_IDS.PANEL_CLOSE,
    rate: 1.36,
    detuneCents: 260
  },
  {
    name: "Console Close",
    sourceId: UI_AUDIO_SOURCE_IDS.FOCUS,
    rate: 0.82,
    detuneCents: -220
  },
  {
    name: "Steel Seal",
    sourceId: UI_AUDIO_SOURCE_IDS.BACK,
    rate: 0.82,
    detuneCents: -220
  },
  {
    name: "Signal Close",
    sourceId: UI_AUDIO_SOURCE_IDS.TOGGLE_OFF,
    rate: 1.14,
    detuneCents: 90
  },
  {
    name: "Pearl Close",
    sourceId: UI_AUDIO_SOURCE_IDS.SELECT,
    rate: 0.98,
    detuneCents: -20
  },
  {
    name: "Warm Seal",
    sourceId: UI_AUDIO_SOURCE_IDS.PANEL_CLOSE,
    rate: 0.92,
    detuneCents: -90
  },
  {
    name: "Tiny Close",
    sourceId: UI_AUDIO_SOURCE_IDS.PANEL_CLOSE,
    rate: 1.5,
    detuneCents: 360
  },
  {
    name: "Heavy Door",
    sourceId: UI_AUDIO_SOURCE_IDS.BACK,
    rate: 0.54,
    detuneCents: -720
  }
]);

export const AUDIO_SOUND_DEFINITIONS = {
  [AUDIO_SOUND_IDS.UI_FOCUS]: {
    id: AUDIO_SOUND_IDS.UI_FOCUS,
    category: AUDIO_CATEGORIES.UI,
    cooldownMs: UI_FOCUS_COOLDOWN_MS,
    maxConcurrent: UI_FOCUS_MAX_CONCURRENT,
    detuneJitterCents: UI_FOCUS_DETUNE_JITTER_CENTS,
    variations: FOCUS_VARIATIONS
  },
  [AUDIO_SOUND_IDS.UI_SELECT]: {
    id: AUDIO_SOUND_IDS.UI_SELECT,
    category: AUDIO_CATEGORIES.UI,
    cooldownMs: UI_SELECT_COOLDOWN_MS,
    maxConcurrent: UI_SELECT_MAX_CONCURRENT,
    detuneJitterCents: UI_SELECT_DETUNE_JITTER_CENTS,
    variations: SELECT_VARIATIONS
  },
  [AUDIO_SOUND_IDS.UI_BACK]: {
    id: AUDIO_SOUND_IDS.UI_BACK,
    category: AUDIO_CATEGORIES.UI,
    cooldownMs: UI_BACK_COOLDOWN_MS,
    maxConcurrent: UI_BACK_MAX_CONCURRENT,
    detuneJitterCents: UI_BACK_DETUNE_JITTER_CENTS,
    variations: BACK_VARIATIONS
  },
  [AUDIO_SOUND_IDS.UI_DENY]: {
    id: AUDIO_SOUND_IDS.UI_DENY,
    category: AUDIO_CATEGORIES.UI,
    cooldownMs: UI_DENY_COOLDOWN_MS,
    maxConcurrent: UI_DENY_MAX_CONCURRENT,
    detuneJitterCents: UI_DENY_DETUNE_JITTER_CENTS,
    variations: DENY_VARIATIONS
  },
  [AUDIO_SOUND_IDS.UI_TOGGLE_ON]: {
    id: AUDIO_SOUND_IDS.UI_TOGGLE_ON,
    category: AUDIO_CATEGORIES.UI,
    cooldownMs: UI_TOGGLE_COOLDOWN_MS,
    maxConcurrent: UI_TOGGLE_MAX_CONCURRENT,
    detuneJitterCents: UI_TOGGLE_DETUNE_JITTER_CENTS,
    variations: TOGGLE_ON_VARIATIONS
  },
  [AUDIO_SOUND_IDS.UI_TOGGLE_OFF]: {
    id: AUDIO_SOUND_IDS.UI_TOGGLE_OFF,
    category: AUDIO_CATEGORIES.UI,
    cooldownMs: UI_TOGGLE_COOLDOWN_MS,
    maxConcurrent: UI_TOGGLE_MAX_CONCURRENT,
    detuneJitterCents: UI_TOGGLE_DETUNE_JITTER_CENTS,
    variations: TOGGLE_OFF_VARIATIONS
  },
  [AUDIO_SOUND_IDS.UI_PANEL_OPEN]: {
    id: AUDIO_SOUND_IDS.UI_PANEL_OPEN,
    category: AUDIO_CATEGORIES.UI,
    cooldownMs: UI_PANEL_COOLDOWN_MS,
    maxConcurrent: UI_PANEL_MAX_CONCURRENT,
    detuneJitterCents: UI_PANEL_DETUNE_JITTER_CENTS,
    variations: PANEL_OPEN_VARIATIONS
  },
  [AUDIO_SOUND_IDS.UI_PANEL_CLOSE]: {
    id: AUDIO_SOUND_IDS.UI_PANEL_CLOSE,
    category: AUDIO_CATEGORIES.UI,
    cooldownMs: UI_PANEL_COOLDOWN_MS,
    maxConcurrent: UI_PANEL_MAX_CONCURRENT,
    detuneJitterCents: UI_PANEL_DETUNE_JITTER_CENTS,
    variations: PANEL_CLOSE_VARIATIONS
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

export const UI_AUDIO_EVENT_DEFINITIONS = [
  {
    eventName: UI_AUDIO_EVENTS.FOCUS,
    soundId: AUDIO_SOUND_IDS.UI_FOCUS,
    label: "Button Focus"
  },
  {
    eventName: UI_AUDIO_EVENTS.SELECT,
    soundId: AUDIO_SOUND_IDS.UI_SELECT,
    label: "Select"
  },
  {
    eventName: UI_AUDIO_EVENTS.BACK,
    soundId: AUDIO_SOUND_IDS.UI_BACK,
    label: "Back"
  },
  {
    eventName: UI_AUDIO_EVENTS.DENY,
    soundId: AUDIO_SOUND_IDS.UI_DENY,
    label: "Deny"
  },
  {
    eventName: UI_AUDIO_EVENTS.TOGGLE_ON,
    soundId: AUDIO_SOUND_IDS.UI_TOGGLE_ON,
    label: "Toggle On"
  },
  {
    eventName: UI_AUDIO_EVENTS.TOGGLE_OFF,
    soundId: AUDIO_SOUND_IDS.UI_TOGGLE_OFF,
    label: "Toggle Off"
  },
  {
    eventName: UI_AUDIO_EVENTS.PANEL_OPEN,
    soundId: AUDIO_SOUND_IDS.UI_PANEL_OPEN,
    label: "Panel Open"
  },
  {
    eventName: UI_AUDIO_EVENTS.PANEL_CLOSE,
    soundId: AUDIO_SOUND_IDS.UI_PANEL_CLOSE,
    label: "Panel Close"
  }
] as const satisfies readonly UiAudioEventDefinition[];

export function getAudioSourceDefinition(
  sourceId: UiAudioSourceId
): AudioSourceDefinition {
  return AUDIO_SOURCE_DEFINITIONS[sourceId];
}

type AudioSoundVariationInput = Omit<AudioSoundVariation, "index">;

function defineUiSoundVariations(
  variations: readonly AudioSoundVariationInput[]
): readonly AudioSoundVariation[] {
  return variations.map((variation, index) => ({
    ...variation,
    index: UI_SOUND_VARIATION_FIRST_INDEX + index
  }));
}
