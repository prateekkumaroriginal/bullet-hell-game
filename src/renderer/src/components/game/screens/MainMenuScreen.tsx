import { useCallback, useEffect, useState } from "react";
import { SAVE_ERROR_DIALOG } from "@/game/config/screen-ui-config";
import {
  DEFAULT_MENU_VARIATION_ID,
  getMenuVariationIdFromSearch,
  MENU_VARIATION_QUERY_PARAM,
  type MenuVariationId
} from "@/game/config/menu-variation-config";
import { GAME_SESSION_PHASES } from "@/game/state/game-session-state";
import { useGameUiStore } from "@/game/state/use-game-ui-store";
import {
  clearCorruptedActiveRunSave,
  resolveContinueTarget,
  type ContinueTarget
} from "@/game/save/continue-target-service";
import { continueActiveRun, quitToDesktop, startStage } from "./screen-actions";
import { MainMenuVariation } from "./MainMenuVariations";

export const MainMenuScreen = () => {
  const [continueTarget, setContinueTarget] = useState<ContinueTarget | null>(null);
  const [variationId, setVariationId] = useState<MenuVariationId>(() => {
    if (typeof window === "undefined") {
      return DEFAULT_MENU_VARIATION_ID;
    }

    return getMenuVariationIdFromSearch(window.location.search);
  });
  const setGameSessionPhase = useGameUiStore(
    (state) => state.setGameSessionPhase
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
  const selectVariation = useCallback((nextVariationId: MenuVariationId) => {
    setVariationId(nextVariationId);

    const nextLocation = new URL(window.location.href);
    nextLocation.searchParams.set(MENU_VARIATION_QUERY_PARAM, nextVariationId);
    window.history.replaceState(null, "", nextLocation);
  }, []);

  return (
    <MainMenuVariation
      canContinue={canContinue}
      handlers={{
        onArchive: () => {
          setGameSessionPhase(GAME_SESSION_PHASES.ARCHIVE);
        },
        onContinue: handleContinue,
        onPlay: () => {
          setGameSessionPhase(GAME_SESSION_PHASES.STAGE_SELECT);
        },
        onQuit: quitToDesktop
      }}
      onSelectVariation={selectVariation}
      variationId={variationId}
    />
  );
};
