import {
  FIRST_STAGE_ORDER,
  STAGE_DEFINITIONS,
  type StageDefinition,
  type StageId,
} from "../config/stage-config";

export type StageProgressState = {
  completedStageIds: readonly StageId[];
};

export const INITIAL_STAGE_PROGRESS_STATE: StageProgressState = {
  completedStageIds: [],
};

export function isStageCompleted(
  stageId: StageId,
  completedStageIds: readonly StageId[],
): boolean {
  return completedStageIds.includes(stageId);
}

export function isStageUnlocked(
  stage: StageDefinition,
  completedStageIds: readonly StageId[],
): boolean {
  if (stage.order === FIRST_STAGE_ORDER) {
    return true;
  }

  const previousStage = STAGE_DEFINITIONS.find(
    (candidateStage) => candidateStage.order === stage.order - 1,
  );

  if (!previousStage) {
    return false;
  }

  return isStageCompleted(previousStage.id, completedStageIds);
}

export function getNextPlayableStageId(
  currentStageId: StageId,
  completedStageIds: readonly StageId[],
): StageId | null {
  const currentStage = STAGE_DEFINITIONS.find((stage) => stage.id === currentStageId);

  if (!currentStage) {
    return null;
  }

  const nextStage = STAGE_DEFINITIONS.find(
    (stage) => stage.order === currentStage.order + 1,
  );

  if (!nextStage || !isStageUnlocked(nextStage, completedStageIds)) {
    return null;
  }

  return nextStage.id;
}

export function getContinueStageId(
  completedStageIds: readonly StageId[],
): StageId | null {
  if (completedStageIds.length === 0) {
    return null;
  }

  const nextStage = STAGE_DEFINITIONS.find(
    (stage) =>
      !isStageCompleted(stage.id, completedStageIds) &&
      isStageUnlocked(stage, completedStageIds),
  );

  return nextStage?.id ?? null;
}
