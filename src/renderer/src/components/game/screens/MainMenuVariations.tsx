import { type CSSProperties, type ReactNode } from "react";
import { GAME_TITLE } from "@/game/config/screen-ui-config";
import {
  getMenuVariationDefinition,
  MENU_VARIATION_DEFINITIONS,
  MENU_VARIATION_IDS,
  type MenuVariationId
} from "@/game/config/menu-variation-config";
import { cn } from "@/lib/utils";
import { ScreenButton, ScreenCenter } from "./ScreenPrimitives";
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

type MenuActionProps = {
  autoFocus?: boolean;
  children: ReactNode;
  className?: string;
  onClick: () => void;
};

const MenuAction = ({
  autoFocus,
  children,
  className,
  onClick
}: MenuActionProps) => (
  <ScreenButton
    autoFocus={autoFocus}
    className={cn("menu-action", className)}
    onClick={onClick}
  >
    {children}
  </ScreenButton>
);

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
        className={cn(
          "menu-variation__switch-button",
          variationId === definition.id &&
            "menu-variation__switch-button--selected"
        )}
        key={definition.id}
        onClick={() => onSelectVariation(definition.id)}
        type="button"
      >
        {definition.index}
      </button>
    ))}
  </nav>
);

const MenuTitle = ({ className }: { className?: string }) => (
  <h1 className={cn("menu-layout__title", className)}>{GAME_TITLE}</h1>
);

const SpaceportLayout = ({
  canContinue,
  handlers
}: MainMenuVariationProps) => (
  <div className="menu-layout menu-layout--spaceport">
    <MenuTitle />
    <div className="menu-actions menu-actions--spaceport">
      {canContinue ? (
        <MenuAction
          autoFocus
          className="menu-action--continue"
          onClick={handlers.onContinue}
        >
          CONTINUE
        </MenuAction>
      ) : null}
      <MenuAction
        autoFocus={!canContinue}
        className="menu-action--play"
        onClick={handlers.onPlay}
      >
        PLAY
      </MenuAction>
      <MenuAction
        className="menu-action--archive"
        onClick={handlers.onArchive}
      >
        ARCHIVE
      </MenuAction>
      <MenuAction className="menu-action--quit" onClick={handlers.onQuit}>
        QUIT
      </MenuAction>
    </div>
  </div>
);

const SalvageLayout = ({
  canContinue,
  handlers
}: MainMenuVariationProps) => (
  <div className="menu-layout menu-layout--salvage">
    <MenuTitle />
    <div className="menu-actions menu-actions--salvage">
      {canContinue ? (
        <MenuAction
          autoFocus
          className="menu-action--continue"
          onClick={handlers.onContinue}
        >
          CONTINUE
        </MenuAction>
      ) : null}
      <MenuAction
        autoFocus={!canContinue}
        className="menu-action--play"
        onClick={handlers.onPlay}
      >
        PLAY
      </MenuAction>
      <MenuAction
        className="menu-action--archive"
        onClick={handlers.onArchive}
      >
        ARCHIVE
      </MenuAction>
      <MenuAction className="menu-action--quit" onClick={handlers.onQuit}>
        QUIT
      </MenuAction>
    </div>
  </div>
);

const AnomalyLayout = ({
  canContinue,
  handlers
}: MainMenuVariationProps) => (
  <div className="menu-layout menu-layout--anomaly">
    <MenuTitle />
    <div className="menu-actions menu-actions--anomaly">
      {canContinue ? (
        <MenuAction
          autoFocus
          className="menu-action--continue"
          onClick={handlers.onContinue}
        >
          CONTINUE
        </MenuAction>
      ) : null}
      <MenuAction
        autoFocus={!canContinue}
        className="menu-action--play"
        onClick={handlers.onPlay}
      >
        PLAY
      </MenuAction>
      <MenuAction
        className="menu-action--archive"
        onClick={handlers.onArchive}
      >
        ARCHIVE
      </MenuAction>
      <MenuAction className="menu-action--quit" onClick={handlers.onQuit}>
        QUIT
      </MenuAction>
    </div>
  </div>
);

const WarfrontLayout = ({
  canContinue,
  handlers
}: MainMenuVariationProps) => (
  <div className="menu-layout menu-layout--warfront">
    <MenuTitle />
    <div className="menu-actions menu-actions--warfront">
      {canContinue ? (
        <MenuAction
          autoFocus
          className="menu-action--continue"
          onClick={handlers.onContinue}
        >
          CONTINUE
        </MenuAction>
      ) : null}
      <MenuAction
        autoFocus={!canContinue}
        className="menu-action--play"
        onClick={handlers.onPlay}
      >
        PLAY
      </MenuAction>
      <MenuAction
        className="menu-action--archive"
        onClick={handlers.onArchive}
      >
        ARCHIVE
      </MenuAction>
      <MenuAction className="menu-action--quit" onClick={handlers.onQuit}>
        QUIT
      </MenuAction>
    </div>
  </div>
);

const TempleLayout = ({
  canContinue,
  handlers
}: MainMenuVariationProps) => (
  <div className="menu-layout menu-layout--temple">
    <MenuTitle />
    <div className="menu-actions menu-actions--temple">
      {canContinue ? (
        <MenuAction
          autoFocus
          className="menu-action--continue"
          onClick={handlers.onContinue}
        >
          CONTINUE
        </MenuAction>
      ) : null}
      <MenuAction
        autoFocus={!canContinue}
        className="menu-action--play"
        onClick={handlers.onPlay}
      >
        PLAY
      </MenuAction>
      <MenuAction
        className="menu-action--archive"
        onClick={handlers.onArchive}
      >
        ARCHIVE
      </MenuAction>
      <MenuAction className="menu-action--quit" onClick={handlers.onQuit}>
        QUIT
      </MenuAction>
    </div>
  </div>
);

const MENU_LAYOUT_BY_ID = {
  [MENU_VARIATION_IDS.SPACEPORT]: SpaceportLayout,
  [MENU_VARIATION_IDS.SALVAGE]: SalvageLayout,
  [MENU_VARIATION_IDS.ANOMALY]: AnomalyLayout,
  [MENU_VARIATION_IDS.WARFRONT]: WarfrontLayout,
  [MENU_VARIATION_IDS.TEMPLE]: TempleLayout
} as const satisfies Record<MenuVariationId, typeof SpaceportLayout>;

export const MainMenuVariation = ({
  canContinue,
  handlers,
  onSelectVariation,
  variationId
}: MainMenuVariationProps) => {
  const definition = getMenuVariationDefinition(variationId);
  const Layout = MENU_LAYOUT_BY_ID[variationId];
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
      <ScreenCenter
        className="menu-variation__content"
        contentClassName="menu-variation__inner"
      >
        <Layout
          canContinue={canContinue}
          handlers={handlers}
          onSelectVariation={onSelectVariation}
          variationId={variationId}
        />
      </ScreenCenter>
      <MenuVariationSwitcher
        onSelectVariation={onSelectVariation}
        variationId={variationId}
      />
    </main>
  );
};
