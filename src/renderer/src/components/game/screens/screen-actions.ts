import { type StageId } from "@/game/config/stage-config";
import { type ValidatedActiveRunSave } from "@/game/save/active-run-save-service";
import {
  emitGameplayCommand,
  GAMEPLAY_COMMANDS,
} from "@/game/events/gameplay-commands";

export const startStage = (selectedStageId: StageId, startingWave?: number) => {
  emitGameplayCommand(GAMEPLAY_COMMANDS.START_GAME, {
    selectedStageId,
    startingWave,
  });
};

export const continueActiveRun = (save: ValidatedActiveRunSave) => {
  emitGameplayCommand(GAMEPLAY_COMMANDS.START_GAME, {
    selectedStageId: save.selectedStageId,
    startingWave: save.currentWave,
    startingPlayerHealth: save.playerHealth.current,
    startingPlayerProgression: save.playerProgression,
    startingSkillStacks: save.learnedSkillStacks,
  });
};

export const quitToDesktop = () => {
  if (!window.electron) {
    return;
  }

  void window.electron.requestQuit();
};
