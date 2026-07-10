import { useEffect, useState } from "react";
import { SAVE_ERROR_DIALOG } from "@/game/config/screen-ui-config";
import {
  DEFAULT_MAIN_MENU_VARIANT,
  readMainMenuVariant,
  type MainMenuVariantId
} from "@/game/config/main-menu-config";
import { GAME_SESSION_PHASES } from "@/game/state/game-session-state";
import { useGameUiStore } from "@/game/state/use-game-ui-store";
import {
  clearCorruptedActiveRunSave,
  resolveContinueTarget,
  type ContinueTarget
} from "@/game/save/continue-target-service";
import { MainMenuVariant } from "./MainMenuVariants";
import {
  MenuBackdrop,
  MenuPreviewPicker
} from "./main-menu/main-menu-primitives";
import type { MainMenuActions } from "./main-menu/main-menu-types";
import {
  continueActiveRun as emitContinueActiveRun,
  quitToDesktop,
  startStage as emitStartStage
} from "./screen-actions";
import "./main-menu/main-menu.css";

export const MainMenuScreen = () => {
  const [continueTarget, setContinueTarget] = useState<ContinueTarget | null>(null);
  const [menuVariant] = useState<MainMenuVariantId>(() => {
    if (typeof window === "undefined") {
      return DEFAULT_MAIN_MENU_VARIANT;
    }

    return readMainMenuVariant();
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
        emitContinueActiveRun(result.target.save);
        return;
      }

      emitStartStage(result.target.selectedStageId);
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

  const actions: MainMenuActions = {
    continueTarget,
    onContinue: () => {
      void handleContinue();
    },
    onPlay: () => {
      setGameSessionPhase(GAME_SESSION_PHASES.STAGE_SELECT);
    },
    onArchive: () => {
      setGameSessionPhase(GAME_SESSION_PHASES.ARCHIVE);
    },
    onQuit: quitToDesktop
  };

  return (
    <MenuBackdrop variant={menuVariant}>
      <MenuPreviewPicker activeVariant={menuVariant} />
      <MainMenuVariant actions={actions} variant={menuVariant} />
    </MenuBackdrop>
  );
};
