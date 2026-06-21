import { PROFILE_SAVE_SCHEMA_VERSION } from "../../../../shared/save-config";
import { type ProfileSave } from "../../../../shared/save-types";
import { type EnemyTypeId } from "../config/enemy-config";
import { type SkillId } from "../config/skill-config";
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

type ProfileMutation = (
  profile: ValidatedProfileSave
) => ValidatedProfileSave;

let profileMutationQueueTail: Promise<unknown> = Promise.resolve();

export async function loadProfileSave(): Promise<LoadValidatedProfileSaveResult> {
  const result = await window.electron?.profileSave.loadProfileSave();

  if (!result) {
    return {
      ok: false,
      reason: "unavailable"
    };
  }

  if (!result.ok) {
    return result;
  }

  return {
    ok: true,
    save: validateProfileSave(result.save)
  };
}

export function markStageCleared(
  stageId: StageId
): Promise<ValidatedProfileSave> {
  return updateProfileSave((profile) => ({
    ...profile,
    clearedStageIds: appendUnique(profile.clearedStageIds, stageId)
  }));
}

export function markEnemyDiscovered(
  enemyTypeId: EnemyTypeId
): Promise<ValidatedProfileSave> {
  return updateProfileSave((profile) => ({
    ...profile,
    discoveredEnemyIds: appendUnique(
      profile.discoveredEnemyIds,
      enemyTypeId
    )
  }));
}

export function markSkillUnlocked(
  skillId: SkillId
): Promise<ValidatedProfileSave> {
  return updateProfileSave((profile) => ({
    ...profile,
    unlockedSkillIds: appendUnique(profile.unlockedSkillIds, skillId)
  }));
}

function updateProfileSave(
  mutateProfile: ProfileMutation
): Promise<ValidatedProfileSave> {
  const mutation = profileMutationQueueTail.then(async () => {
    const existingProfile = await loadProfileSave();
    const currentProfile = existingProfile.ok
      ? existingProfile.save
      : createEmptyProfileSave();
    const nextProfile = mutateProfile(currentProfile);
    const save = {
      ...nextProfile,
      savedAt: new Date().toISOString()
    } satisfies ProfileSave;

    await window.electron?.profileSave.writeProfileSave(save);

    return validateProfileSave(save);
  });

  profileMutationQueueTail = mutation.catch(() => undefined);

  return mutation;
}

function createEmptyProfileSave(): ValidatedProfileSave {
  return {
    schemaVersion: PROFILE_SAVE_SCHEMA_VERSION,
    savedAt: new Date().toISOString(),
    clearedStageIds: [],
    discoveredEnemyIds: [],
    unlockedSkillIds: []
  };
}

function validateProfileSave(save: ProfileSave): ValidatedProfileSave {
  return {
    ...save,
    clearedStageIds: save.clearedStageIds.filter(isKnownStageId)
  };
}

function appendUnique<Value>(
  values: readonly Value[],
  value: Value
): readonly Value[] {
  return values.includes(value) ? values : [...values, value];
}

function isKnownStageId(stageId: string): stageId is StageId {
  return STAGE_DEFINITIONS.some((stage) => stage.id === stageId);
}
