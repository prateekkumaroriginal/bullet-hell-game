import { Archive, Play, Power, RotateCcw } from "lucide-react";
import { MAIN_MENU_VARIANTS } from "@/game/config/main-menu-config";
import type { MainMenuVariantProps } from "./main-menu-types";
import {
  MainMenuActionButton,
  MainMenuNavigation,
  MainMenuStage,
  MainMenuTitle,
  MainMenuVariationButtons
} from "./MainMenuPrimitives";

export const DerelictStationMenu = ({
  actions,
  onSelectVariation,
  selectedVariant
}: MainMenuVariantProps) => (
  <MainMenuStage variant={MAIN_MENU_VARIANTS.DERELICT_STATION}>
    <MainMenuNavigation
      className="main-menu-derelict-station"
      label="Derelict station distress broadcast menu"
    >
      <MainMenuTitle />
      <div
        className="derelict-station__fragments"
        data-has-continue={actions.canContinue}
      >
        {actions.canContinue ? (
          <MainMenuActionButton
            autoFocus
            className="derelict-station__fragment derelict-station__fragment--continue"
            onClick={actions.onContinue}
          >
            <RotateCcw aria-hidden="true" />
            <span>CONTINUE</span>
          </MainMenuActionButton>
        ) : null}
        <MainMenuActionButton
          autoFocus={!actions.canContinue}
          className="derelict-station__fragment derelict-station__fragment--play"
          onClick={actions.onPlay}
        >
          <Play aria-hidden="true" />
          <span>PLAY</span>
        </MainMenuActionButton>
        <MainMenuActionButton
          className="derelict-station__fragment derelict-station__fragment--archive"
          onClick={actions.onArchive}
        >
          <Archive aria-hidden="true" />
          <span>ARCHIVE</span>
        </MainMenuActionButton>
        <MainMenuActionButton
          className="derelict-station__fragment derelict-station__fragment--quit"
          onClick={actions.onQuit}
        >
          <Power aria-hidden="true" />
          <span>QUIT</span>
        </MainMenuActionButton>
      </div>
      <MainMenuVariationButtons
        onSelectVariation={onSelectVariation}
        selectedVariant={selectedVariant}
      />
    </MainMenuNavigation>
  </MainMenuStage>
);
