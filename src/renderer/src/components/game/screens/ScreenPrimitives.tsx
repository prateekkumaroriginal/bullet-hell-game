import type { ComponentProps, KeyboardEvent, ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const SCREEN_BUTTON_SELECTOR = "[data-screen-button='true']:not(:disabled)";
const MENU_NAVIGATION_KEYS = new Set([
  "ArrowDown",
  "ArrowRight",
  "s",
  "S",
  "d",
  "D",
  "ArrowUp",
  "ArrowLeft",
  "w",
  "W",
  "a",
  "A",
]);
const FORWARD_MENU_NAVIGATION_KEYS = new Set([
  "ArrowDown",
  "ArrowRight",
  "s",
  "S",
  "d",
  "D",
]);
const FIRST_BUTTON_INDEX = 0;
const MISSING_FOCUSED_BUTTON_INDEX = -1;
const NEXT_BUTTON_STEP = 1;

export const ScreenTitle = ({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) => (
  <h1
    className={cn(
      "text-center font-black leading-[0.95] tracking-[0.16em] text-zinc-100 [text-shadow:0_1px_0_rgb(255_255_255_/_0.9),0_4px_0_rgb(0_0_0_/_0.8),0_0_22px_rgb(230_240_250_/_0.42)]",
      className,
    )}
  >
    {children}
  </h1>
);

export const ScreenCenter = ({ children }: { children: ReactNode }) => (
  <section
    className="relative z-10 grid h-full place-items-center px-6 py-10"
    onKeyDown={handleScreenNavigationKeyDown}
  >
    <div className="grid justify-items-center">{children}</div>
  </section>
);

export const ScreenButton = ({
  className,
  onMouseEnter,
  ...props
}: ComponentProps<typeof Button>) => (
  <Button
    {...props}
    className={cn(className)}
    data-screen-button="true"
    onMouseEnter={(event) => {
      event.currentTarget.focus();
      onMouseEnter?.(event);
    }}
    size="screen"
    variant="screen"
  />
);

export const StageDivider = ({ label }: { label: string }) => (
  <div className="mt-9 flex w-[min(30rem,calc(100vw-3rem))] items-center gap-8 text-sm font-black tracking-[0.16em] text-sky-100">
    <span className="h-px flex-1 bg-zinc-500/30" />
    <span className="size-1.5 rounded-full bg-sky-100 shadow-[0_0_10px_rgba(190,225,255,0.92)]" />
    <span>{label}</span>
    <span className="size-1.5 rounded-full bg-sky-100 shadow-[0_0_10px_rgba(190,225,255,0.92)]" />
    <span className="h-px flex-1 bg-zinc-500/30" />
  </div>
);

function handleScreenNavigationKeyDown(
  event: KeyboardEvent<HTMLElement>,
): void {
  if (!MENU_NAVIGATION_KEYS.has(event.key)) {
    return;
  }

  const buttons = Array.from(
    event.currentTarget.querySelectorAll<HTMLButtonElement>(
      SCREEN_BUTTON_SELECTOR,
    ),
  );

  if (buttons.length === 0) {
    return;
  }

  event.preventDefault();

  const focusedButtonIndex = buttons.indexOf(
    document.activeElement as HTMLButtonElement,
  );
  const startingButtonIndex =
    focusedButtonIndex === MISSING_FOCUSED_BUTTON_INDEX
      ? FIRST_BUTTON_INDEX
      : focusedButtonIndex;
  const direction = FORWARD_MENU_NAVIGATION_KEYS.has(event.key)
    ? NEXT_BUTTON_STEP
    : -NEXT_BUTTON_STEP;
  const nextButtonIndex =
    (startingButtonIndex + direction + buttons.length) % buttons.length;

  buttons[nextButtonIndex]?.focus();
}
