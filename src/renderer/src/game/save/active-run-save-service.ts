import { ACTIVE_RUN_SAVE_SCHEMA_VERSION } from "../../../../shared/save-config";
import {
  type ActiveRunSave,
  type LoadActiveRunSaveResult,
} from "../../../../shared/save-types";
import {
  PLAYER_BASE_EXPERIENCE_TO_LEVEL,
  PLAYER_EXPERIENCE_TO_LEVEL_STEP,
  PLAYER_STARTING_LEVEL,
} from "../config/experience-config";
import { PLAYER_MAX_HEALTH } from "../config/player-config";
import { getStageDefinition, type StageId } from "../config/stage-config";

export async function hasActiveRunSave(): Promise<boolean> {
  return window.electron?.activeRunSave.hasActiveRunSave() ?? false;
}

export async function loadActiveRunSave(): Promise<LoadActiveRunSaveResult> {
  const result = await window.electron?.activeRunSave.loadActiveRunSave();

  if (!result) {
    return {
      ok: false,
      reason: "unavailable",
    };
  }

  if (!result.ok) {
    return result;
  }

  if (!isKnownStageRunSave(result.save)) {
    return {
      ok: false,
      reason: "invalid",
    };
  }

  return result;
}

export async function writeActiveRunSave(
  selectedStageId: StageId,
  currentWave: number,
  playerHealth: ActiveRunSave["playerHealth"],
  playerProgression: ActiveRunSave["playerProgression"],
): Promise<void> {
  const stage = getStageDefinition(selectedStageId);

  if (currentWave > stage.waves.length) {
    await deleteActiveRunSave();
    return;
  }

  const save = {
    schemaVersion: ACTIVE_RUN_SAVE_SCHEMA_VERSION,
    savedAt: new Date().toISOString(),
    selectedStageId,
    currentWave,
    playerHealth,
    playerProgression,
  } satisfies ActiveRunSave;

  await window.electron?.activeRunSave.writeActiveRunSave(save);
}

export async function deleteActiveRunSave(): Promise<void> {
  await window.electron?.activeRunSave.deleteActiveRunSave();
}

function isKnownStageRunSave(save: ActiveRunSave): save is ActiveRunSave & {
  selectedStageId: StageId;
} {
  try {
    const stage = getStageDefinition(save.selectedStageId as StageId);

    return (
      save.currentWave <= stage.waves.length &&
      save.playerHealth.max >= PLAYER_MAX_HEALTH &&
      save.playerHealth.current <= save.playerHealth.max &&
      isValidPlayerProgression(save.playerProgression)
    );
  } catch {
    return false;
  }
}

function isValidPlayerProgression(
  playerProgression: ActiveRunSave["playerProgression"],
): boolean {
  const expectedExperienceToNextLevel =
    PLAYER_BASE_EXPERIENCE_TO_LEVEL +
    (playerProgression.level - PLAYER_STARTING_LEVEL) *
      PLAYER_EXPERIENCE_TO_LEVEL_STEP;

  return (
    playerProgression.experienceToNextLevel === expectedExperienceToNextLevel &&
    playerProgression.experience < playerProgression.experienceToNextLevel
  );
}
