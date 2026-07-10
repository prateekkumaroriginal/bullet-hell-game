import {
  type ButtonHTMLAttributes,
  type ChangeEvent,
  type KeyboardEvent,
  type ReactNode
} from "react";
import { cn } from "@/lib/utils";
import {
  MAIN_MENU_VARIANT_IDS,
  MAIN_MENU_VARIATION_DEFINITIONS,
  type MainMenuVariantId
} from "@/game/config/main-menu-config";
import { getStageDefinition } from "@/game/config/stage-config";
import type { ContinueTarget } from "@/game/save/continue-target-service";
import type { MainMenuActionId } from "./main-menu-types";

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

type MenuPreviewPickerProps = {
  activeVariant: MainMenuVariantId;
};

export const MenuPreviewPicker = ({
  activeVariant
}: MenuPreviewPickerProps) => {
  if (!import.meta.env.DEV) {
    return null;
  }

  const handleChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const nextUrl = new URL(window.location.href);
    nextUrl.searchParams.set("menu", event.currentTarget.value);
    window.location.assign(nextUrl.href);
  };

  return (
    <label className="menu-preview-picker">
      <span className="menu-preview-picker-label">DESIGN LAB</span>
      <select
        aria-label="Choose main menu variation preview"
        onChange={handleChange}
        value={activeVariant}
      >
        {MAIN_MENU_VARIANT_IDS.map((variantId) => {
          const definition = MAIN_MENU_VARIATION_DEFINITIONS[variantId];

          return (
            <option key={variantId} value={variantId}>
              {definition.shortName}
            </option>
          );
        })}
      </select>
    </label>
  );
};

export type ContinueStatus = {
  eyebrow: string;
  title: string;
  detail: string;
};

export function getContinueStatus(
  continueTarget: ContinueTarget | null
): ContinueStatus {
  if (!continueTarget) {
    return {
      eyebrow: "NO SAVE DETECTED",
      title: "READY FOR A NEW RUN",
      detail: "Select play to choose a sector"
    };
  }

  if (continueTarget.kind === "activeRun") {
    const stage = getStageDefinition(continueTarget.save.selectedStageId);

    return {
      eyebrow: "ACTIVE RUN",
      title: stage.name.toUpperCase(),
      detail: `WAVE ${continueTarget.save.currentWave} / PILOT LEVEL ${continueTarget.save.playerProgression.level}`
    };
  }

  const nextStage = getStageDefinition(continueTarget.selectedStageId);

  return {
    eyebrow: "NEXT SECTOR",
    title: nextStage.name.toUpperCase(),
    detail: "Cleared route / sortie available"
  };
}

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
