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

export const StarshipFlightDeckMenu = ({
  actions,
  onSelectVariation,
  selectedVariant
}: MainMenuVariantProps) => (
  <MainMenuStage variant={MAIN_MENU_VARIANTS.FLIGHT_DECK}>
    <MainMenuNavigation
      className="main-menu-flight-deck"
      label="Starship flight deck menu"
    >
      <MainMenuTitle />
      <div
        className="flight-deck__cockpit"
        data-has-continue={actions.canContinue}
      >
        {actions.canContinue ? (
          <MainMenuActionButton
            autoFocus
            className="flight-deck__action flight-deck__action--continue"
            onClick={actions.onContinue}
          >
            <RotateCcw aria-hidden="true" />
            <span>CONTINUE</span>
          </MainMenuActionButton>
        ) : null}
        <MainMenuActionButton
          autoFocus={!actions.canContinue}
          className="flight-deck__action flight-deck__action--play"
          onClick={actions.onPlay}
        >
          <Play aria-hidden="true" />
          <span>PLAY</span>
        </MainMenuActionButton>
        <MainMenuActionButton
          className="flight-deck__action flight-deck__action--archive"
          onClick={actions.onArchive}
        >
          <Archive aria-hidden="true" />
          <span>ARCHIVE</span>
        </MainMenuActionButton>
        <MainMenuActionButton
          className="flight-deck__action flight-deck__action--quit"
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
