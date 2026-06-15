import { getContinueStageId } from "../state/stage-progress";
import {
  deleteActiveRunSave,
  loadActiveRunSave,
  type ValidatedActiveRunSave,
} from "./active-run-save-service";
import { loadProfileSave } from "./profile-save-service";
import { type StageId } from "../config/stage-config";

export type ContinueTarget =
  | {
      kind: "activeRun";
      save: ValidatedActiveRunSave;
    }
  | {
      kind: "nextStage";
      selectedStageId: StageId;
    };

export type ContinueTargetResult =
  | {
      ok: true;
      target: ContinueTarget;
    }
  | {
      ok: false;
      reason: "missing" | "invalid" | "unavailable";
    };

export async function resolveContinueTarget(): Promise<ContinueTargetResult> {
  const activeRunResult = await loadActiveRunSave();

  if (activeRunResult.ok) {
    return {
      ok: true,
      target: {
        kind: "activeRun",
        save: activeRunResult.save,
      },
    };
  }

  if (activeRunResult.reason === "invalid") {
    return activeRunResult;
  }

  const profileResult = await loadProfileSave();

  if (!profileResult.ok) {
    return {
      ok: false,
      reason: profileResult.reason === "invalid" ? "missing" : profileResult.reason,
    };
  }

  const continueStageId = getContinueStageId(
    profileResult.save.clearedStageIds as readonly StageId[],
  );

  if (!continueStageId) {
    return {
      ok: false,
      reason: "missing",
    };
  }

  return {
    ok: true,
    target: {
      kind: "nextStage",
      selectedStageId: continueStageId,
    },
  };
}

export async function clearCorruptedActiveRunSave(): Promise<void> {
  await deleteActiveRunSave();
}
