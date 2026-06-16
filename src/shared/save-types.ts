import { z } from "zod";
import {
  ACTIVE_RUN_SAVE_SCHEMA_VERSION,
  PROFILE_SAVE_SCHEMA_VERSION,
} from "./save-config";

export const activeRunSaveSchema = z.object({
  schemaVersion: z.literal(ACTIVE_RUN_SAVE_SCHEMA_VERSION),
  savedAt: z.string().min(1),
  selectedStageId: z.string().min(1),
  currentWave: z.int().positive(),
  playerHealth: z
    .object({
      current: z.number().positive(),
      max: z.number().positive(),
    })
    .refine((playerHealth) => playerHealth.current <= playerHealth.max),
  playerProgression: z
    .object({
      level: z.int().positive(),
      experience: z.number().nonnegative(),
      experienceToNextLevel: z.number().positive()
    })
    .refine(
      (playerProgression) => playerProgression.experience < playerProgression.experienceToNextLevel
    ),
  learnedSkillStacks: z
    .array(
      z.object({
        skillId: z.string().min(1),
        stackCount: z.int().positive(),
      }),
    )
    .readonly()
    .default([]),
});

export type ActiveRunSave = z.infer<typeof activeRunSaveSchema>;

export type LoadActiveRunSaveResult =
  | {
      ok: true;
      save: ActiveRunSave;
    }
  | {
      ok: false;
      reason: "missing" | "invalid" | "unavailable";
    };

export type ActiveRunSaveApi = {
  hasActiveRunSave: () => Promise<boolean>;
  loadActiveRunSave: () => Promise<LoadActiveRunSaveResult>;
  writeActiveRunSave: (save: ActiveRunSave) => Promise<void>;
  deleteActiveRunSave: () => Promise<void>;
};

export const profileSaveSchema = z.object({
  schemaVersion: z.literal(PROFILE_SAVE_SCHEMA_VERSION),
  savedAt: z.string().min(1),
  clearedStageIds: z.array(z.string().min(1)).readonly(),
});

export type ProfileSave = z.infer<typeof profileSaveSchema>;

export type LoadProfileSaveResult =
  | {
      ok: true;
      save: ProfileSave;
    }
  | {
      ok: false;
      reason: "missing" | "invalid" | "unavailable";
    };

export type ProfileSaveApi = {
  loadProfileSave: () => Promise<LoadProfileSaveResult>;
  writeProfileSave: (save: ProfileSave) => Promise<void>;
};
