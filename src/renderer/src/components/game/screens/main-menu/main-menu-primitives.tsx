import {
  type ButtonHTMLAttributes,
  type KeyboardEvent,
  type ReactNode
} from "react";
import { cn } from "@/lib/utils";
import {
  MAIN_MENU_VARIANT_IDS,
  MAIN_MENU_VARIATION_DEFINITIONS,
  type MainMenuVariantId
} from "@/game/config/main-menu-config";
import { GAME_TITLE } from "@/game/config/screen-ui-config";
import type { MainMenuActionId, MainMenuActions } from "./main-menu-types";

type MenuBackdropProps = {
  variant: MainMenuVariantId;
  children: ReactNode;
};

export const MenuBackdrop = ({ variant, children }: MenuBackdropProps) => {
  const definition = MAIN_MENU_VARIATION_DEFINITIONS[variant];

  return (
    <div className="main-menu-backdrop" data-variant={variant}>
      <img
        alt=""
        aria-hidden="true"
        className="main-menu-backdrop-image"
        draggable={false}
        src={definition.backgroundUrl}
      />
      <div aria-hidden="true" className="main-menu-backdrop-tint" />
      <div aria-hidden="true" className="main-menu-backdrop-shadow" />
      <div className="main-menu-backdrop-content">{children}</div>
    </div>
  );
};

type MenuFrameProps = {
  children: ReactNode;
  className?: string;
  ariaLabel: string;
};

export const MenuFrame = ({
  ariaLabel,
  children,
  className
}: MenuFrameProps) => (
  <section
    aria-label={ariaLabel}
    className={cn("main-menu-frame", className)}
    onKeyDown={handleMenuNavigationKeyDown}
  >
    {children}
  </section>
);

type MenuControlProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  actionId: MainMenuActionId;
};

export const MenuControl = ({
  actionId,
  children,
  className,
  ...props
}: MenuControlProps) => (
  <button
    {...props}
    className={cn("main-menu-control", className)}
    data-menu-action={actionId}
    type="button"
  >
    {children}
  </button>
);

export const MinimalMainMenu = ({
  actions,
  ariaLabel
}: {
  actions: MainMenuActions;
  ariaLabel: string;
}) => (
  <MenuFrame ariaLabel={ariaLabel} className="minimal-main-menu">
    <h1 className="minimal-main-menu__title">{GAME_TITLE}</h1>
    <nav aria-label="Main menu actions" className="minimal-main-menu__actions">
      {actions.continueTarget ? (
        <MenuControl actionId="continue" autoFocus onClick={actions.onContinue}>
          Continue
        </MenuControl>
      ) : null}
      <MenuControl
        actionId="play"
        autoFocus={!actions.continueTarget}
        onClick={actions.onPlay}
      >
        Play
      </MenuControl>
      <MenuControl actionId="archive" onClick={actions.onArchive}>
        Archive
      </MenuControl>
      <MenuControl actionId="quit" onClick={actions.onQuit}>
        Quit
      </MenuControl>
    </nav>
  </MenuFrame>
);

const FIRST_VARIATION_DISPLAY_NUMBER = 1;
const VARIATION_BUTTON_LABEL_WIDTH = 2;

export const MenuVariationSwitcher = ({
  activeVariant,
  onSelectVariation
}: {
  activeVariant: MainMenuVariantId;
  onSelectVariation: (variant: MainMenuVariantId) => void;
}) => (
  <nav aria-label="Menu variations" className="menu-variation-switcher">
    {MAIN_MENU_VARIANT_IDS.map((variantId, index) => (
      <button
        aria-label={`Show menu variation ${String(index + FIRST_VARIATION_DISPLAY_NUMBER).padStart(VARIATION_BUTTON_LABEL_WIDTH, "0")}`}
        aria-pressed={activeVariant === variantId}
        className={cn(
          "menu-variation-switcher__button",
          activeVariant === variantId && "menu-variation-switcher__button--selected"
        )}
        key={variantId}
        onClick={() => onSelectVariation(variantId)}
        type="button"
      >
        {String(index + FIRST_VARIATION_DISPLAY_NUMBER).padStart(
          VARIATION_BUTTON_LABEL_WIDTH,
          "0"
        )}
      </button>
    ))}
  </nav>
);

function handleMenuNavigationKeyDown(
  event: KeyboardEvent<HTMLElement>
): void {
  if (!(event.target instanceof HTMLButtonElement)) {
    return;
  }

  if (!event.target.matches("[data-menu-action]")) {
    return;
  }

  const navigationDirection = getMenuNavigationDirection(event.key);

  if (navigationDirection === null) {
    return;
  }

  const buttons = Array.from(
    event.currentTarget.querySelectorAll<HTMLButtonElement>(
      "[data-menu-action]:not(:disabled)"
    )
  );

  if (buttons.length === 0) {
    return;
  }

  const currentIndex = buttons.indexOf(event.target);
  const safeCurrentIndex = currentIndex < 0 ? 0 : currentIndex;
  const nextIndex =
    (safeCurrentIndex + navigationDirection + buttons.length) % buttons.length;

  event.preventDefault();
  buttons[nextIndex]?.focus();
}

function getMenuNavigationDirection(key: string): number | null {
  if (key === "ArrowDown" || key === "ArrowRight" || key === "s" || key === "S") {
    return 1;
  }

  if (key === "ArrowUp" || key === "ArrowLeft" || key === "w" || key === "W") {
    return -1;
  }

  return null;
}
