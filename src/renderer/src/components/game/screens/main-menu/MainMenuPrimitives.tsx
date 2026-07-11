import type { ComponentProps, CSSProperties, ReactNode } from "react";
import { Button } from "@/components/ui/button";
import {
  getMainMenuVariantOption,
  MAIN_MENU_VARIANT_OPTIONS,
  type MainMenuVariant
} from "@/game/config/main-menu-config";
import { GAME_TITLE } from "@/game/config/screen-ui-config";
import { cn } from "@/lib/utils";
import { ScreenNavigationRegion } from "../ScreenPrimitives";

export const MainMenuStage = ({
  children,
  variant
}: {
  children: ReactNode;
  variant: MainMenuVariant;
}) => {
  const option = getMainMenuVariantOption(variant);
  const stageStyle = {
    backgroundImage: `url("${option.backgroundUrl}")`,
    backgroundPosition: option.backgroundPosition,
    "--menu-accent": option.accent
  } as CSSProperties;

  return (
    <div className="main-menu-stage" data-variant={variant} style={stageStyle}>
      <div aria-hidden="true" className="main-menu-stage__shade" />
      {children}
    </div>
  );
};

export const MainMenuNavigation = ({
  children,
  className,
  label
}: {
  children: ReactNode;
  className?: string;
  label: string;
}) => (
  <ScreenNavigationRegion
    aria-label={label}
    className={cn("main-menu-navigation", className)}
  >
    {children}
  </ScreenNavigationRegion>
);

export const MainMenuTitle = () => (
  <h1 className="main-menu-title">{GAME_TITLE}</h1>
);

export const MainMenuActionButton = ({
  children,
  className,
  onMouseEnter,
  ...props
}: ComponentProps<typeof Button>) => (
  <Button
    {...props}
    className={cn("main-menu-action", className)}
    data-screen-button="true"
    onMouseEnter={(event) => {
      event.currentTarget.focus();
      onMouseEnter?.(event);
    }}
    type="button"
    variant="ghost"
  >
    {children}
  </Button>
);

export const MainMenuVariationButtons = ({
  onSelectVariation,
  selectedVariant
}: {
  onSelectVariation: (variant: MainMenuVariant) => void;
  selectedVariant: MainMenuVariant;
}) => (
  <nav aria-label="Menu variations" className="main-menu-variation-buttons">
    {MAIN_MENU_VARIANT_OPTIONS.map((option) => (
      <button
        aria-label={`Show menu variation ${option.displayNumber}`}
        aria-pressed={selectedVariant === option.id}
        className={cn(
          "main-menu-variation-button",
          selectedVariant === option.id && "main-menu-variation-button--selected"
        )}
        key={option.id}
        onClick={() => onSelectVariation(option.id)}
        type="button"
      >
        {option.displayNumber}
      </button>
    ))}
  </nav>
);
