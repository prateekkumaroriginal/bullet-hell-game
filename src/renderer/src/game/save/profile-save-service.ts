import { PROFILE_SAVE_SCHEMA_VERSION } from "../../../../shared/save-config";
import {
  type ProfileSave,
} from "../../../../shared/save-types";
import { STAGE_DEFINITIONS, type StageId } from "../config/stage-config";

export type ValidatedProfileSave = Omit<ProfileSave, "clearedStageIds"> & {
  clearedStageIds: readonly StageId[];
};

export type LoadValidatedProfileSaveResult =
  | {
      ok: true;
      save: ValidatedProfileSave;
    }
  | {
      ok: false;
      reason: "missing" | "invalid" | "unavailable";
    };

export async function loadProfileSave(): Promise<LoadValidatedProfileSaveResult> {
  const result = await window.electron?.profileSave.loadProfileSave();

  if (!result) {
    return {
      ok: false,
      reason: "unavailable",
    };
  }

  if (!result.ok) {
    return result;
  }

  return {
    ok: true,
    save: {
      ...result.save,
      clearedStageIds: result.save.clearedStageIds.filter(isKnownStageId),
    },
  };
}

export async function markStageCleared(
  stageId: StageId,
): Promise<ValidatedProfileSave> {
  const existingProfile = await loadProfileSave();
  const clearedStageIds = existingProfile.ok
    ? existingProfile.save.clearedStageIds.filter(isKnownStageId)
    : [];

  const nextClearedStageIds = clearedStageIds.includes(stageId)
    ? clearedStageIds
    : [...clearedStageIds, stageId];
  const save = {
    schemaVersion: PROFILE_SAVE_SCHEMA_VERSION,
    savedAt: new Date().toISOString(),
    clearedStageIds: nextClearedStageIds,
  } satisfies ProfileSave;

  await window.electron?.profileSave.writeProfileSave(save);

  return save;
}

function isKnownStageId(stageId: string): stageId is StageId {
  return STAGE_DEFINITIONS.some((stage) => stage.id === stageId);
}
