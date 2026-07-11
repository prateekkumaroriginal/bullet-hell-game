import { type CSSProperties } from "react";
import { GAME_TITLE } from "@/game/config/screen-ui-config";
import {
  getMenuVariationDefinition,
  MENU_VARIATION_DEFINITIONS,
  type MenuVariationId
} from "@/game/config/menu-variation-config";
import { ScreenButton, ScreenCenter, ScreenMenuGrid, ScreenTitle } from "./ScreenPrimitives";
import "./main-menu-variations.css";

type MenuCssStyle = CSSProperties & Record<`--${string}`, string>;

export type MainMenuActionHandlers = {
  onContinue: () => void;
  onPlay: () => void;
  onArchive: () => void;
  onQuit: () => void;
};

type MainMenuVariationProps = {
  canContinue: boolean;
  handlers: MainMenuActionHandlers;
  onSelectVariation: (variationId: MenuVariationId) => void;
  variationId: MenuVariationId;
};

const MenuVariationSwitcher = ({
  variationId,
  onSelectVariation
}: {
  variationId: MenuVariationId;
  onSelectVariation: (variationId: MenuVariationId) => void;
}) => (
  <nav aria-label="Menu variations" className="menu-variation__switcher">
    {MENU_VARIATION_DEFINITIONS.map((definition) => (
      <button
        aria-label={`Show menu variation ${definition.index}`}
        aria-pressed={variationId === definition.id}
        className={
          variationId === definition.id
            ? "menu-variation__switch-button menu-variation__switch-button--selected"
            : "menu-variation__switch-button"
        }
        key={definition.id}
        onClick={() => onSelectVariation(definition.id)}
        type="button"
      >
        {definition.index}
      </button>
    ))}
  </nav>
);

export const MainMenuVariation = ({
  canContinue,
  handlers,
  onSelectVariation,
  variationId
}: MainMenuVariationProps) => {
  const definition = getMenuVariationDefinition(variationId);
  const style: MenuCssStyle = {
    "--menu-accent": definition.theme.accent,
    "--menu-accent-bright": definition.theme.accentBright
  };

  return (
    <main className="menu-variation" data-variation={variationId} style={style}>
      <img
        alt=""
        aria-hidden="true"
        className="menu-variation__art"
        draggable={false}
        src={definition.artUrl}
      />
      <div aria-hidden="true" className="menu-variation__veil" />
      <ScreenCenter className="menu-variation__content" contentClassName="menu-variation__stack">
        <ScreenTitle className="menu-variation__title" variant="main">
          {GAME_TITLE}
        </ScreenTitle>
        <ScreenMenuGrid className="menu-variation__actions" variant="main">
          {canContinue ? (
            <ScreenButton autoFocus onClick={handlers.onContinue}>
              Continue
            </ScreenButton>
          ) : null}
          <ScreenButton autoFocus={!canContinue} onClick={handlers.onPlay}>
            Play
          </ScreenButton>
          <ScreenButton onClick={handlers.onArchive}>Archive</ScreenButton>
          <ScreenButton onClick={handlers.onQuit}>Quit</ScreenButton>
        </ScreenMenuGrid>
      </ScreenCenter>
      <MenuVariationSwitcher
        onSelectVariation={onSelectVariation}
        variationId={variationId}
      />
    </main>
  );
};
