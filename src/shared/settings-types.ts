import { z } from "zod";
import {
  APP_SETTINGS_SCHEMA_VERSION,
  AUDIO_VOLUME_MAX,
  AUDIO_VOLUME_MIN,
  DEFAULT_AMBIENT_VOLUME,
  DEFAULT_MASTER_VOLUME,
  DEFAULT_MUSIC_VOLUME,
  DEFAULT_SFX_VOLUME,
  DEFAULT_UI_VOLUME
} from "./settings-config";

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
  ambientMuted: z.boolean()
});

export const appSettingsSchema = z.object({
  schemaVersion: z.literal(APP_SETTINGS_SCHEMA_VERSION),
  savedAt: z.string().min(1),
  audio: audioSettingsSchema
});

export type AudioSettings = z.infer<typeof audioSettingsSchema>;
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
  ambientMuted: false
} as const satisfies AudioSettings;

