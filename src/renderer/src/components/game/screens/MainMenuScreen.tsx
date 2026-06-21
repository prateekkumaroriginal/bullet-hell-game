import { useEffect, useState } from "react";
import {
  GAME_TITLE,
  SAVE_ERROR_DIALOG,
} from "@/game/config/screen-ui-config";
import { GAME_SESSION_PHASES } from "@/game/state/game-session-state";
import { useGameUiStore } from "@/game/state/use-game-ui-store";
import {
  clearCorruptedActiveRunSave,
  resolveContinueTarget,
  type ContinueTarget,
} from "@/game/save/continue-target-service";
import {
  ScreenButton,
  ScreenCenter,
  ScreenMenuGrid,
  ScreenTitle,
} from "./ScreenPrimitives";
import { continueActiveRun, quitToDesktop, startStage } from "./screen-actions";

export const MainMenuScreen = () => {
  const [continueTarget, setContinueTarget] = useState<ContinueTarget | null>(null);
  const setGameSessionPhase = useGameUiStore(
    (state) => state.setGameSessionPhase,
  );

  useEffect(() => {
    let isMounted = true;

    void resolveContinueTarget().then((result) => {
      if (!isMounted) {
        return;
      }

      setContinueTarget(result.ok ? result.target : null);
    });

    return () => {
      isMounted = false;
    };
  }, []);

  const handleContinue = async () => {
    const result = await resolveContinueTarget();

    if (result.ok) {
      if (result.target.kind === "activeRun") {
        continueActiveRun(result.target.save);
        return;
      }

      startStage(result.target.selectedStageId);
      return;
    }

    if (result.reason === "invalid") {
      window.alert(SAVE_ERROR_DIALOG.CORRUPTED_ACTIVE_RUN_MESSAGE);
      await clearCorruptedActiveRunSave();
      const nextResult = await resolveContinueTarget();

      setContinueTarget(nextResult.ok ? nextResult.target : null);
      return;
    }

    setContinueTarget(null);
  };

  const canContinue = continueTarget !== null;

  return (
    <ScreenCenter>
      <div className="flex flex-col items-center gap-10">
        <ScreenTitle variant="main">{GAME_TITLE}</ScreenTitle>
        <ScreenMenuGrid variant="main">
          {canContinue && (
            <ScreenButton autoFocus onClick={handleContinue}>
              CONTINUE
            </ScreenButton>
          )}
          <ScreenButton
            autoFocus={!canContinue}
            onClick={() => {
              setGameSessionPhase(GAME_SESSION_PHASES.STAGE_SELECT);
            }}
          >
            PLAY
          </ScreenButton>
          <ScreenButton
            onClick={() => {
              setGameSessionPhase(GAME_SESSION_PHASES.ARCHIVE);
            }}
          >
            ARCHIVE
          </ScreenButton>
          <ScreenButton onClick={quitToDesktop}>QUIT</ScreenButton>
        </ScreenMenuGrid>
      </div>
    </ScreenCenter>
  );
};
