import { useEffect, useState, type ReactNode } from "react";
import {
  getMainMenuVariant,
  type MainMenuVariant
} from "@/game/config/main-menu-config";
import {
  GAME_TITLE,
  SAVE_ERROR_DIALOG
} from "@/game/config/screen-ui-config";
import { GAME_SESSION_PHASES } from "@/game/state/game-session-state";
import { useGameUiStore } from "@/game/state/use-game-ui-store";
import {
  clearCorruptedActiveRunSave,
  resolveContinueTarget,
  type ContinueTarget
} from "@/game/save/continue-target-service";
import { quitToDesktop, startStage, continueActiveRun } from "./screen-actions";
import { MainMenuVariantNav } from "./main-menu/MainMenuPrimitives";
import { BlackMarketBountyMenu } from "./main-menu/BlackMarketBountyMenu";
import { DerelictStationMenu } from "./main-menu/DerelictStationMenu";
import { NeonShipyardMenu } from "./main-menu/NeonShipyardMenu";
import { OrbitalElevatorMenu } from "./main-menu/OrbitalElevatorMenu";
import { StarshipFlightDeckMenu } from "./main-menu/StarshipFlightDeckMenu";
import type { MainMenuActions } from "./main-menu/main-menu-types";
import "@/styles/main-menu.css";

type MainMenuVariantComponent = (props: {
  actions: MainMenuActions;
}) => ReactNode;

const MAIN_MENU_VARIANT_COMPONENTS = {
  "flight-deck": StarshipFlightDeckMenu,
  "black-market": BlackMarketBountyMenu,
  "derelict-station": DerelictStationMenu,
  shipyard: NeonShipyardMenu,
  "orbital-elevator": OrbitalElevatorMenu
} satisfies Record<MainMenuVariant, MainMenuVariantComponent>;

export const MainMenuScreen = () => {
  const [continueTarget, setContinueTarget] = useState<ContinueTarget | null>(null);
  const [variant, setVariant] = useState<MainMenuVariant>(() => getMainMenuVariant());
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

  const actions: MainMenuActions = {
    canContinue: continueTarget !== null,
    onContinue: handleContinue,
    onPlay: () => {
      setGameSessionPhase(GAME_SESSION_PHASES.STAGE_SELECT);
    },
    onArchive: () => {
      setGameSessionPhase(GAME_SESSION_PHASES.ARCHIVE);
    },
    onQuit: quitToDesktop
  };
  const ActiveMenu = MAIN_MENU_VARIANT_COMPONENTS[variant];

  return (
    <div className="main-menu-host">
      <ActiveMenu actions={actions} />
      <MainMenuVariantNav onSelect={setVariant} selectedVariant={variant} />
      <span className="sr-only">{GAME_TITLE} main menu</span>
    </div>
  );
};
