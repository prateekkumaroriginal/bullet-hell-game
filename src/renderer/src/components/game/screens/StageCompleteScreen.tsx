import { RotateCcw, Trophy } from "lucide-react";
import { getStageCompleteStats } from "@/game/config/screen-ui-config";
import {
  emitGameplayCommand,
  GAMEPLAY_COMMANDS,
} from "@/game/events/gameplay-commands";
import { getNextPlayableStageId } from "@/game/state/stage-progress";
import { useGameUiStore } from "@/game/state/use-game-ui-store";
import { ResultScreen } from "./ResultScreen";
import { ScreenButton } from "./ScreenPrimitives";
import { startStage } from "./screen-actions";

export const StageCompleteScreen = () => {
  const gameSession = useGameUiStore((state) => state.gameSession);
  const completedStageIds = useGameUiStore(
    (state) => state.stageProgress.completedStageIds,
  );
  const nextStageId = gameSession.selectedStageId
    ? getNextPlayableStageId(gameSession.selectedStageId, completedStageIds)
    : null;

  return (
    <ResultScreen
      actions={
        <div className="grid w-[min(44rem,calc(100vw-3rem))] grid-cols-2 gap-4 max-md:grid-cols-1">
          {nextStageId && (
            <ScreenButton
              autoFocus
              onClick={() => {
                startStage(nextStageId);
              }}
            >
              NEXT STAGE
            </ScreenButton>
          )}
          <ScreenButton
            autoFocus={!nextStageId}
            onClick={() => {
              emitGameplayCommand(
                GAMEPLAY_COMMANDS.RETURN_TO_STAGE_SELECT,
                undefined,
              );
            }}
          >
            STAGE SELECT
          </ScreenButton>
          <ScreenButton
            onClick={() => {
              emitGameplayCommand(GAMEPLAY_COMMANDS.RESTART_GAME, undefined);
            }}
          >
            <RotateCcw className="mr-3 size-5" />
            RESTART STAGE
          </ScreenButton>
          <ScreenButton
            onClick={() => {
              emitGameplayCommand(GAMEPLAY_COMMANDS.RETURN_TO_MENU, undefined);
            }}
          >
            MAIN MENU
          </ScreenButton>
        </div>
      }
      icon={<Trophy className="size-20 fill-zinc-200 text-zinc-100" />}
      stats={getStageCompleteStats(gameSession.totalWaves)}
      subtitle="ALL WAVES CLEARED"
      title="STAGE COMPLETE"
    />
  );
};
