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

export const BlackMarketBountyMenu = ({
  actions,
  onSelectVariation,
  selectedVariant
}: MainMenuVariantProps) => (
  <MainMenuStage variant={MAIN_MENU_VARIANTS.BLACK_MARKET}>
    <MainMenuNavigation
      className="main-menu-black-market"
      label="Black-market bounty terminal menu"
    >
      <MainMenuTitle />
      <div
        className="black-market__seal-field"
        data-has-continue={actions.canContinue}
      >
        {actions.canContinue ? (
          <MainMenuActionButton
            autoFocus
            className="black-market__seal black-market__seal--continue"
            onClick={actions.onContinue}
          >
            <RotateCcw aria-hidden="true" />
            <span>CONTINUE</span>
          </MainMenuActionButton>
        ) : null}
        <MainMenuActionButton
          autoFocus={!actions.canContinue}
          className="black-market__seal black-market__seal--play"
          onClick={actions.onPlay}
        >
          <Play aria-hidden="true" />
          <span>PLAY</span>
        </MainMenuActionButton>
        <MainMenuActionButton
          className="black-market__seal black-market__seal--archive"
          onClick={actions.onArchive}
        >
          <Archive aria-hidden="true" />
          <span>ARCHIVE</span>
        </MainMenuActionButton>
        <MainMenuActionButton
          className="black-market__seal black-market__seal--quit"
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
