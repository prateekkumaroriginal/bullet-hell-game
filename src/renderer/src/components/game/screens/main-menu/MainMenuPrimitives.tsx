import type { ComponentProps, CSSProperties, ReactNode } from "react";
import { Button } from "@/components/ui/button";
import {
  getMainMenuVariantOption,
  MAIN_MENU_VARIANT_OPTIONS,
  type MainMenuVariant
} from "@/game/config/main-menu-config";
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

export const MainMenuVariantRail = ({
  onSelect,
  selectedVariant
}: {
  onSelect: (variant: MainMenuVariant) => void;
  selectedVariant: MainMenuVariant;
}) => (
  <nav aria-label="Main menu design preview" className="main-menu-variant-rail">
    <span className="main-menu-variant-rail__label">DESIGN PREVIEW</span>
    <div className="main-menu-variant-rail__options">
      {MAIN_MENU_VARIANT_OPTIONS.map((option) => (
        <button
          aria-label={`Preview ${option.label}`}
          aria-pressed={selectedVariant === option.id}
          className={cn(
            "main-menu-variant-rail__option",
            selectedVariant === option.id &&
              "main-menu-variant-rail__option--selected"
          )}
          key={option.id}
          onClick={() => onSelect(option.id)}
          type="button"
        >
          <span>{option.displayNumber}</span>
          <span>{option.shortLabel}</span>
        </button>
      ))}
    </div>
  </nav>
);

export const MenuStatusLight = ({
  label,
  tone = "accent"
}: {
  label: string;
  tone?: "accent" | "danger" | "muted";
}) => (
  <span className={cn("menu-status-light", `menu-status-light--${tone}`)}>
    <span aria-hidden="true" className="menu-status-light__dot" />
    <span>{label}</span>
  </span>
);

export const MenuKeyHint = ({
  children,
  label
}: {
  children: ReactNode;
  label: string;
}) => (
  <span className="menu-key-hint">
    <kbd>{children}</kbd>
    <span>{label}</span>
  </span>
);
