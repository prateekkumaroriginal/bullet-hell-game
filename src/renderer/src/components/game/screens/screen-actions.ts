import { type StageId } from "@/game/config/stage-config";
import {
  emitGameplayCommand,
  GAMEPLAY_COMMANDS,
} from "@/game/events/gameplay-commands";

export const startStage = (selectedStageId: StageId) => {
  emitGameplayCommand(GAMEPLAY_COMMANDS.START_GAME, {
    selectedStageId,
  });
};

export const quitToDesktop = () => {
  if (!window.electron) {
    return;
  }

  void window.electron.requestQuit();
};
