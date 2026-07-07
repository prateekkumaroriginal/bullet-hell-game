import {
  APP_SETTINGS_SCHEMA_VERSION,
  AUDIO_VOLUME_MAX,
  AUDIO_VOLUME_MIN
} from "../../../shared/settings-config";
import {
  DEFAULT_AUDIO_SETTINGS,
  type AppSettings,
  type AudioSettings
} from "../../../shared/settings-types";
import {
  AUDIO_CATEGORIES,
  AUDIO_SOUND_DEFINITIONS,
  getAudioSourceDefinition,
  type AudioCategory,
  type AudioSoundDefinition,
  type AudioSoundId,
  type AudioSourceDefinition,
  type PlayableAudioCategory,
  UI_AUDIO_EVENT_SOUND_IDS,
  type UiAudioEvent
} from "./audio-catalog";

export type AudioPlayOptions = {
  ignoreCooldown?: boolean;
};

export type AudioBackendPlayOptions = {
  volume: number;
  detune: number;
  rate: number;
};

export type AudioBackend = {
  play: (
    sourceDefinition: AudioSourceDefinition,
    options: AudioBackendPlayOptions
  ) => boolean;
  getActiveCount: (phaserKey: string) => number;
  applySettings: (settings: AudioSettings) => void;
};

const RANDOM_SIGNED_RANGE_MULTIPLIER = 2;
const RANDOM_SIGNED_RANGE_OFFSET = 1;

let audioBackend: AudioBackend | null = null;
let audioSettings: AudioSettings = { ...DEFAULT_AUDIO_SETTINGS };
let settingsLoadPromise: Promise<AudioSettings> | null = null;
let settingsWriteQueue: Promise<unknown> = Promise.resolve();

const lastPlayedAtBySoundId = new Map<AudioSoundId, number>();

export const audio = {
  initialize: initializeAudioSettings,
  registerBackend: registerAudioBackend,
  play: playAudio,
  playUi: playUiAudio,
  getSettings: getAudioSettings,
  setVolume: setAudioCategoryVolume,
  setMuted: setAudioCategoryMuted,
  setUiSoundVariation: setUiSoundVariation
} as const;

export async function initializeAudioSettings(): Promise<AudioSettings> {
  if (settingsLoadPromise) {
    return settingsLoadPromise;
  }

  settingsLoadPromise = loadPersistedAudioSettings().then((settings) => {
    audioSettings = normalizeAudioSettings(settings);
    audioBackend?.applySettings(audioSettings);

    return audioSettings;
  });

  return settingsLoadPromise;
}

export function registerAudioBackend(backend: AudioBackend): () => void {
  audioBackend = backend;
  audioSettings = normalizeAudioSettings(audioSettings);
  audioBackend.applySettings(audioSettings);

  return () => {
    if (audioBackend === backend) {
      audioBackend = null;
    }
  };
}

export function playUiAudio(
  eventName: UiAudioEvent,
  options: AudioPlayOptions = {}
): boolean {
  return playAudio(UI_AUDIO_EVENT_SOUND_IDS[eventName], options);
}

export function playAudio(
  soundId: AudioSoundId,
  options: AudioPlayOptions = {}
): boolean {
  audioSettings = normalizeAudioSettings(audioSettings);
  const soundDefinition = AUDIO_SOUND_DEFINITIONS[soundId];
  const variation = getSelectedVariation(soundDefinition);
  const sourceDefinition = getAudioSourceDefinition(variation.sourceId);
  const backend = audioBackend;

  if (!backend || isCategoryMuted(soundDefinition.category)) {
    return false;
  }

  const currentTimeMs = performance.now();
  const lastPlayedAtMs = lastPlayedAtBySoundId.get(soundId);

  if (
    !options.ignoreCooldown &&
    lastPlayedAtMs !== undefined &&
    currentTimeMs - lastPlayedAtMs < soundDefinition.cooldownMs
  ) {
    return false;
  }

  if (
    backend.getActiveCount(sourceDefinition.phaserKey) >=
    soundDefinition.maxConcurrent
  ) {
    return false;
  }

  const didPlay = backend.play(sourceDefinition, {
    volume: getCategoryVolume(soundDefinition.category),
    detune:
      variation.detuneCents +
      getRandomSignedValue(soundDefinition.detuneJitterCents),
    rate: variation.rate
  });

  if (didPlay) {
    lastPlayedAtBySoundId.set(soundId, currentTimeMs);
    console.info(`[audio] played ${soundId}`);
  }

  return didPlay;
}

export function getAudioSettings(): AudioSettings {
  audioSettings = normalizeAudioSettings(audioSettings);

  return {
    ...audioSettings,
    uiSoundSelections: {
      ...audioSettings.uiSoundSelections
    }
  };
}

export function setAudioCategoryVolume(
  category: AudioCategory,
  volume: number
): void {
  const clampedVolume = Math.min(
    AUDIO_VOLUME_MAX,
    Math.max(AUDIO_VOLUME_MIN, volume)
  );

  audioSettings =
    category === AUDIO_CATEGORIES.MASTER
      ? {
          ...audioSettings,
          masterVolume: clampedVolume
        }
      : {
          ...audioSettings,
          [getCategoryVolumeSettingKey(category)]: clampedVolume
        };

  audioBackend?.applySettings(audioSettings);
  persistAudioSettings(audioSettings);
}

export function setAudioCategoryMuted(
  category: AudioCategory,
  muted: boolean
): void {
  audioSettings =
    category === AUDIO_CATEGORIES.MASTER
      ? {
          ...audioSettings,
          muted
        }
      : {
          ...audioSettings,
          [getCategoryMutedSettingKey(category)]: muted
        };

  audioBackend?.applySettings(audioSettings);
  persistAudioSettings(audioSettings);
}

export function setUiSoundVariation(
  eventName: UiAudioEvent,
  variationIndex: number
): void {
  audioSettings = normalizeAudioSettings(audioSettings);
  audioSettings = {
    ...audioSettings,
    uiSoundSelections: {
      ...audioSettings.uiSoundSelections,
      [eventName]: variationIndex
    }
  };

  persistAudioSettings(audioSettings);
}

async function loadPersistedAudioSettings(): Promise<AudioSettings> {
  const result = await window.electron?.settings.loadSettings();

  if (result?.ok) {
    const settings = normalizeAudioSettings(result.settings.audio);

    if (!hasUiSoundSelections(result.settings.audio)) {
      persistAudioSettings(settings);
    }

    return settings;
  }

  const defaultSettings = normalizeAudioSettings(DEFAULT_AUDIO_SETTINGS);

  if (result?.reason === "missing") {
    persistAudioSettings(defaultSettings);
  }

  return defaultSettings;
}

function persistAudioSettings(settings: AudioSettings): void {
  const appSettings = createAppSettings(settings);

  settingsWriteQueue = settingsWriteQueue
    .catch(() => undefined)
    .then(() => window.electron?.settings.writeSettings(appSettings));
}

function createAppSettings(settings: AudioSettings): AppSettings {
  return {
    schemaVersion: APP_SETTINGS_SCHEMA_VERSION,
    savedAt: new Date().toISOString(),
    audio: normalizeAudioSettings(settings)
  };
}

function normalizeAudioSettings(settings: Partial<AudioSettings>): AudioSettings {
  return {
    ...DEFAULT_AUDIO_SETTINGS,
    ...settings,
    uiSoundSelections: {
      ...DEFAULT_AUDIO_SETTINGS.uiSoundSelections,
      ...settings.uiSoundSelections
    }
  };
}

function hasUiSoundSelections(settings: AudioSettings): boolean {
  return (
    "uiSoundSelections" in settings &&
    typeof settings.uiSoundSelections === "object" &&
    settings.uiSoundSelections !== null
  );
}

function isCategoryMuted(category: PlayableAudioCategory): boolean {
  return audioSettings.muted || audioSettings[getCategoryMutedSettingKey(category)];
}

function getCategoryVolume(category: PlayableAudioCategory): number {
  return audioSettings[getCategoryVolumeSettingKey(category)];
}

function getSelectedVariation(soundDefinition: AudioSoundDefinition) {
  const eventName = getUiAudioEventForSoundId(soundDefinition.id);
  const selectedVariationIndex = eventName
    ? normalizeAudioSettings(audioSettings).uiSoundSelections[eventName]
    : undefined;

  return (
    soundDefinition.variations.find(
      (variation) => variation.index === selectedVariationIndex
    ) ?? soundDefinition.variations[0]
  );
}

function getUiAudioEventForSoundId(soundId: AudioSoundId): UiAudioEvent | null {
  for (const [eventName, eventSoundId] of Object.entries(
    UI_AUDIO_EVENT_SOUND_IDS
  ) as [UiAudioEvent, AudioSoundId][]) {
    if (eventSoundId === soundId) {
      return eventName;
    }
  }

  return null;
}

function getCategoryVolumeSettingKey(
  category: PlayableAudioCategory
): keyof Pick<
  AudioSettings,
  "uiVolume" | "sfxVolume" | "musicVolume" | "ambientVolume"
> {
  switch (category) {
    case AUDIO_CATEGORIES.UI:
      return "uiVolume";
    case AUDIO_CATEGORIES.SFX:
      return "sfxVolume";
    case AUDIO_CATEGORIES.MUSIC:
      return "musicVolume";
    case AUDIO_CATEGORIES.AMBIENT:
      return "ambientVolume";
  }
}

function getCategoryMutedSettingKey(
  category: PlayableAudioCategory
): keyof Pick<
  AudioSettings,
  "uiMuted" | "sfxMuted" | "musicMuted" | "ambientMuted"
> {
  switch (category) {
    case AUDIO_CATEGORIES.UI:
      return "uiMuted";
    case AUDIO_CATEGORIES.SFX:
      return "sfxMuted";
    case AUDIO_CATEGORIES.MUSIC:
      return "musicMuted";
    case AUDIO_CATEGORIES.AMBIENT:
      return "ambientMuted";
  }
}

function getRandomSignedValue(range: number): number {
  if (range === 0) {
    return 0;
  }

  return (
    (Math.random() * RANDOM_SIGNED_RANGE_MULTIPLIER -
      RANDOM_SIGNED_RANGE_OFFSET) *
    range
  );
}
