import { type CSSProperties } from "react";
import { GAME_TITLE } from "@/game/config/screen-ui-config";
import {
  getMenuVariationDefinition,
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
  variationId: MenuVariationId;
};

export const MainMenuVariation = ({
  canContinue,
  handlers,
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
    </main>
  );
};
