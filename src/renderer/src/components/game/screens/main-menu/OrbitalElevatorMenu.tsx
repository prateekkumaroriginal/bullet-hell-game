import { Archive, ArrowUp, Play, Power, RotateCcw } from "lucide-react";
import { MAIN_MENU_VARIANTS } from "@/game/config/main-menu-config";
import type { MainMenuVariantProps } from "./main-menu-types";
import {
  MainMenuActionButton,
  MainMenuNavigation,
  MainMenuStage,
  MainMenuTitle,
  MainMenuVariationButtons
} from "./MainMenuPrimitives";

export const OrbitalElevatorMenu = ({
  actions,
  onSelectVariation,
  selectedVariant
}: MainMenuVariantProps) => (
  <MainMenuStage variant={MAIN_MENU_VARIANTS.ORBITAL_ELEVATOR}>
    <MainMenuNavigation
      className="main-menu-orbital-elevator"
      label="Orbital elevator clearance menu"
    >
      <MainMenuTitle />
      <div
        className="orbital-elevator__gates"
        data-has-continue={actions.canContinue}
      >
        {actions.canContinue ? (
          <MainMenuActionButton
            autoFocus
            className="orbital-elevator__gate orbital-elevator__gate--continue"
            onClick={actions.onContinue}
          >
            <RotateCcw aria-hidden="true" />
            <span>CONTINUE</span>
          </MainMenuActionButton>
        ) : null}
        <MainMenuActionButton
          autoFocus={!actions.canContinue}
          className="orbital-elevator__gate orbital-elevator__gate--play"
          onClick={actions.onPlay}
        >
          <Play aria-hidden="true" />
          <span>PLAY</span>
          <ArrowUp aria-hidden="true" />
        </MainMenuActionButton>
        <MainMenuActionButton
          className="orbital-elevator__gate orbital-elevator__gate--archive"
          onClick={actions.onArchive}
        >
          <Archive aria-hidden="true" />
          <span>ARCHIVE</span>
        </MainMenuActionButton>
        <MainMenuActionButton
          className="orbital-elevator__gate orbital-elevator__gate--quit"
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
