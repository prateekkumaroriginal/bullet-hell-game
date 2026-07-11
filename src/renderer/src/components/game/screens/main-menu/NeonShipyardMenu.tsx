import { Archive, ArrowRight, Play, Power, RotateCcw } from "lucide-react";
import { MAIN_MENU_VARIANTS } from "@/game/config/main-menu-config";
import type { MainMenuVariantProps } from "./main-menu-types";
import {
  MainMenuActionButton,
  MainMenuNavigation,
  MainMenuStage,
  MainMenuTitle,
  MainMenuVariationButtons
} from "./MainMenuPrimitives";

export const NeonShipyardMenu = ({
  actions,
  onSelectVariation,
  selectedVariant
}: MainMenuVariantProps) => (
  <MainMenuStage variant={MAIN_MENU_VARIANTS.SHIPYARD}>
    <MainMenuNavigation
      className="main-menu-shipyard"
      label="Neon shipyard launch bay menu"
    >
      <MainMenuTitle />
      <div
        className="shipyard__launch-surface"
        data-has-continue={actions.canContinue}
      >
        <MainMenuActionButton
          autoFocus={!actions.canContinue}
          className="shipyard__launch-control shipyard__launch-control--play"
          onClick={actions.onPlay}
        >
          <Play aria-hidden="true" />
          <span>PLAY</span>
          <ArrowRight aria-hidden="true" />
        </MainMenuActionButton>
        {actions.canContinue ? (
          <MainMenuActionButton
            autoFocus
            className="shipyard__launch-control shipyard__launch-control--continue"
            onClick={actions.onContinue}
          >
            <RotateCcw aria-hidden="true" />
            <span>CONTINUE</span>
          </MainMenuActionButton>
        ) : null}
        <MainMenuActionButton
          className="shipyard__launch-control shipyard__launch-control--archive"
          onClick={actions.onArchive}
        >
          <Archive aria-hidden="true" />
          <span>ARCHIVE</span>
        </MainMenuActionButton>
        <MainMenuActionButton
          className="shipyard__launch-control shipyard__launch-control--quit"
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
