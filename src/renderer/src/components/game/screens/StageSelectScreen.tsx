import { useEffect } from "react";
import { Check, Lock, Play } from "lucide-react";
import { STAGE_DEFINITIONS } from "@/game/config/stage-config";
import { loadProfileSave } from "@/game/save/profile-save-service";
import { GAME_SESSION_PHASES } from "@/game/state/game-session-state";
import {
  isStageCompleted,
  isStageUnlocked,
} from "@/game/state/stage-progress";
import { useGameUiStore } from "@/game/state/use-game-ui-store";
import {
  ScreenButton,
  ScreenCenter,
  ScreenMenuGrid,
  ScreenTitle,
  StageDivider,
} from "./ScreenPrimitives";
import { startStage } from "./screen-actions";

const STAGE_NUMBER_PREFIX = "STAGE";

export const StageSelectScreen = () => {
  const completedStageIds = useGameUiStore(
    (state) => state.stageProgress.completedStageIds,
  );
  const setCompletedStageIds = useGameUiStore(
    (state) => state.setCompletedStageIds,
  );
  const setGameSessionPhase = useGameUiStore(
    (state) => state.setGameSessionPhase,
  );

  useEffect(() => {
    let isMounted = true;

    void loadProfileSave().then((result) => {
      if (!isMounted || !result.ok) {
        return;
      }

      setCompletedStageIds(result.save.clearedStageIds);
    });

    return () => {
      isMounted = false;
    };
  }, [setCompletedStageIds]);

  return (
    <ScreenCenter>
      <div className="flex flex-col items-center gap-8">
        <div className="flex flex-col items-center gap-6">
          <ScreenTitle>STAGE SELECT</ScreenTitle>
          <StageDivider label="PROGRESSION" />
        </div>

        <ScreenMenuGrid className="w-[min(38rem,calc(100vw-3rem))]">
          {STAGE_DEFINITIONS.map((stage) => {
            const isCompleted = isStageCompleted(stage.id, completedStageIds);
            const isUnlocked = isStageUnlocked(stage, completedStageIds);

            return (
              <ScreenButton
                autoFocus={stage.order === 1}
                className="h-auto justify-between px-6 py-5 text-left disabled:cursor-not-allowed disabled:opacity-55"
                disabled={!isUnlocked}
                key={stage.id}
                onClick={() => {
                  startStage(stage.id);
                }}
              >
                <span className="flex min-w-0 flex-col gap-1">
                  <span className="text-xs tracking-[0.22em] text-cyan-200/80">
                    {STAGE_NUMBER_PREFIX} {stage.order}
                  </span>
                  <span className="truncate text-2xl tracking-[0.12em]">
                    {stage.name}
                  </span>
                </span>
                {isCompleted ? (
                  <Check className="size-6 shrink-0 text-emerald-300" />
                ) : isUnlocked ? (
                  <Play className="size-6 shrink-0 text-zinc-100" />
                ) : (
                  <Lock className="size-6 shrink-0 text-zinc-400" />
                )}
              </ScreenButton>
            );
          })}
        </ScreenMenuGrid>

        <ScreenButton
          className="w-[min(18rem,calc(100vw-3rem))]"
          onClick={() => {
            setGameSessionPhase(GAME_SESSION_PHASES.IDLE);
          }}
        >
          MAIN MENU
        </ScreenButton>
      </div>
    </ScreenCenter>
  );
};
