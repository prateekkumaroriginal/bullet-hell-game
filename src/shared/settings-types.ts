import { z } from "zod";
import {
  APP_SETTINGS_SCHEMA_VERSION,
  AUDIO_VOLUME_MAX,
  AUDIO_VOLUME_MIN,
  DEFAULT_AMBIENT_VOLUME,
  DEFAULT_MASTER_VOLUME,
  DEFAULT_MUSIC_VOLUME,
  DEFAULT_SFX_VOLUME,
  DEFAULT_UI_VOLUME,
  UI_SOUND_VARIATION_FIRST_INDEX,
  UI_SOUND_VARIATION_LAST_INDEX
} from "./settings-config";

export const uiSoundSelectionsSchema = z
  .object({
    focus: z
      .number()
      .int()
      .min(UI_SOUND_VARIATION_FIRST_INDEX)
      .max(UI_SOUND_VARIATION_LAST_INDEX),
    select: z
      .number()
      .int()
      .min(UI_SOUND_VARIATION_FIRST_INDEX)
      .max(UI_SOUND_VARIATION_LAST_INDEX),
    back: z
      .number()
      .int()
      .min(UI_SOUND_VARIATION_FIRST_INDEX)
      .max(UI_SOUND_VARIATION_LAST_INDEX),
    deny: z
      .number()
      .int()
      .min(UI_SOUND_VARIATION_FIRST_INDEX)
      .max(UI_SOUND_VARIATION_LAST_INDEX),
    toggleOn: z
      .number()
      .int()
      .min(UI_SOUND_VARIATION_FIRST_INDEX)
      .max(UI_SOUND_VARIATION_LAST_INDEX),
    toggleOff: z
      .number()
      .int()
      .min(UI_SOUND_VARIATION_FIRST_INDEX)
      .max(UI_SOUND_VARIATION_LAST_INDEX),
    panelOpen: z
      .number()
      .int()
      .min(UI_SOUND_VARIATION_FIRST_INDEX)
      .max(UI_SOUND_VARIATION_LAST_INDEX),
    panelClose: z
      .number()
      .int()
      .min(UI_SOUND_VARIATION_FIRST_INDEX)
      .max(UI_SOUND_VARIATION_LAST_INDEX)
  })
  .default({
    focus: UI_SOUND_VARIATION_FIRST_INDEX,
    select: UI_SOUND_VARIATION_FIRST_INDEX,
    back: UI_SOUND_VARIATION_FIRST_INDEX,
    deny: UI_SOUND_VARIATION_FIRST_INDEX,
    toggleOn: UI_SOUND_VARIATION_FIRST_INDEX,
    toggleOff: UI_SOUND_VARIATION_FIRST_INDEX,
    panelOpen: UI_SOUND_VARIATION_FIRST_INDEX,
    panelClose: UI_SOUND_VARIATION_FIRST_INDEX
  });

export const audioSettingsSchema = z.object({
  masterVolume: z.number().min(AUDIO_VOLUME_MIN).max(AUDIO_VOLUME_MAX),
  uiVolume: z.number().min(AUDIO_VOLUME_MIN).max(AUDIO_VOLUME_MAX),
  sfxVolume: z.number().min(AUDIO_VOLUME_MIN).max(AUDIO_VOLUME_MAX),
  musicVolume: z.number().min(AUDIO_VOLUME_MIN).max(AUDIO_VOLUME_MAX),
  ambientVolume: z.number().min(AUDIO_VOLUME_MIN).max(AUDIO_VOLUME_MAX),
  muted: z.boolean(),
  uiMuted: z.boolean(),
  sfxMuted: z.boolean(),
  musicMuted: z.boolean(),
  ambientMuted: z.boolean(),
  uiSoundSelections: uiSoundSelectionsSchema
});

export const appSettingsSchema = z.object({
  schemaVersion: z.literal(APP_SETTINGS_SCHEMA_VERSION),
  savedAt: z.string().min(1),
  audio: audioSettingsSchema
});

export type AudioSettings = z.infer<typeof audioSettingsSchema>;
export type UiSoundSelections = z.infer<typeof uiSoundSelectionsSchema>;
export type AppSettings = z.infer<typeof appSettingsSchema>;

export type LoadAppSettingsResult =
  | {
      ok: true;
      settings: AppSettings;
    }
  | {
      ok: false;
      reason: "missing" | "invalid" | "unavailable";
    };

export type AppSettingsApi = {
  loadSettings: () => Promise<LoadAppSettingsResult>;
  writeSettings: (settings: AppSettings) => Promise<void>;
};

export const DEFAULT_AUDIO_SETTINGS = {
  masterVolume: DEFAULT_MASTER_VOLUME,
  uiVolume: DEFAULT_UI_VOLUME,
  sfxVolume: DEFAULT_SFX_VOLUME,
  musicVolume: DEFAULT_MUSIC_VOLUME,
  ambientVolume: DEFAULT_AMBIENT_VOLUME,
  muted: false,
  uiMuted: false,
  sfxMuted: false,
  musicMuted: false,
  ambientMuted: false,
  uiSoundSelections: {
    focus: UI_SOUND_VARIATION_FIRST_INDEX,
    select: UI_SOUND_VARIATION_FIRST_INDEX,
    back: UI_SOUND_VARIATION_FIRST_INDEX,
    deny: UI_SOUND_VARIATION_FIRST_INDEX,
    toggleOn: UI_SOUND_VARIATION_FIRST_INDEX,
    toggleOff: UI_SOUND_VARIATION_FIRST_INDEX,
    panelOpen: UI_SOUND_VARIATION_FIRST_INDEX,
    panelClose: UI_SOUND_VARIATION_FIRST_INDEX
  }
} as const satisfies AudioSettings;
