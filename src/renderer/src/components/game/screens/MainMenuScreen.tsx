import { type ComponentProps, useEffect, useState } from "react";
import mainMenuBackgroundUrl from "../../../../../../assets/menu/main-menu-background.png?url";
import eclipseWarshipBackgroundUrl from "../../../../../../assets/menu/main-menu-eclipse-warship.png?url";
import iceCathedralBackgroundUrl from "../../../../../../assets/menu/main-menu-ice-cathedral.png?url";
import orbitalCityBackgroundUrl from "../../../../../../assets/menu/main-menu-orbital-city.png?url";
import redSingularityBackgroundUrl from "../../../../../../assets/menu/main-menu-red-singularity.png?url";
import ringGateBackgroundUrl from "../../../../../../assets/menu/main-menu-ring-gate.png?url";
import spaceSilverDreamBackgroundUrl from "../../../../../../assets/menu/main-menu-space-silver-dream.png?url";
import { Button } from "@/components/ui/button";
import {
  GAME_TITLE,
  MAIN_MENU_INITIAL_VARIANT_INDEX,
  MAIN_MENU_STYLES,
  MAIN_MENU_VARIANT_DIRECTION,
  MAIN_MENU_VARIANTS,
  SPACE_SILVER_DREAM_BORDER,
  SPACE_SILVER_DREAM_VARIANT_ID,
  SAVE_ERROR_DIALOG,
} from "@/game/config/screen-ui-config";
import { GAME_SESSION_PHASES } from "@/game/state/game-session-state";
import { useGameUiStore } from "@/game/state/use-game-ui-store";
import { cn } from "@/lib/utils";
import {
  clearCorruptedActiveRunSave,
  resolveContinueTarget,
  type ContinueTarget,
} from "@/game/save/continue-target-service";
import {
  handleScreenNavigationKeyDown,
  ScreenButton,
  ScreenMenuGrid,
} from "./ScreenPrimitives";
import { continueActiveRun, quitToDesktop, startStage } from "./screen-actions";

const MAIN_MENU_BACKGROUND_URLS = [
  mainMenuBackgroundUrl,
  ringGateBackgroundUrl,
  eclipseWarshipBackgroundUrl,
  iceCathedralBackgroundUrl,
  orbitalCityBackgroundUrl,
  redSingularityBackgroundUrl,
  spaceSilverDreamBackgroundUrl
] as const;

type MainMenuButtonProps = ComponentProps<typeof ScreenButton> & {
  hasMetallicBorder: boolean;
  variantClassName: string;
};

const SpaceSilverDreamBorder = () => {
  return (
    <svg
      aria-hidden="true"
      className={SPACE_SILVER_DREAM_BORDER.CLASS_NAME}
      focusable="false"
      preserveAspectRatio="none"
      viewBox={SPACE_SILVER_DREAM_BORDER.VIEW_BOX}
    >
      <polygon
        className={SPACE_SILVER_DREAM_BORDER.GLOW_CLASS_NAME}
        fill="none"
        points={SPACE_SILVER_DREAM_BORDER.POLYGON_POINTS}
        stroke={SPACE_SILVER_DREAM_BORDER.GLOW_COLOR}
        strokeWidth={SPACE_SILVER_DREAM_BORDER.GLOW_STROKE_WIDTH}
        strokeLinejoin="miter"
        vectorEffect="non-scaling-stroke"
      />
      <polygon
        className={SPACE_SILVER_DREAM_BORDER.STEEL_CLASS_NAME}
        fill="none"
        points={SPACE_SILVER_DREAM_BORDER.POLYGON_POINTS}
        stroke={SPACE_SILVER_DREAM_BORDER.STEEL_COLOR}
        strokeWidth={SPACE_SILVER_DREAM_BORDER.STEEL_STROKE_WIDTH}
        strokeLinejoin="miter"
        vectorEffect="non-scaling-stroke"
      />
      <polygon
        className={SPACE_SILVER_DREAM_BORDER.SILVER_CLASS_NAME}
        fill="none"
        points={SPACE_SILVER_DREAM_BORDER.POLYGON_POINTS}
        stroke={SPACE_SILVER_DREAM_BORDER.SILVER_COLOR}
        strokeWidth={SPACE_SILVER_DREAM_BORDER.SILVER_STROKE_WIDTH}
        strokeLinejoin="miter"
        vectorEffect="non-scaling-stroke"
      />
      <path
        className={SPACE_SILVER_DREAM_BORDER.TOP_LEFT_SHINE_CLASS_NAME}
        d={SPACE_SILVER_DREAM_BORDER.TOP_LEFT_SHINE_PATH}
        fill="none"
        stroke={SPACE_SILVER_DREAM_BORDER.TOP_LEFT_SHINE_COLOR}
        strokeWidth={SPACE_SILVER_DREAM_BORDER.SHINE_STROKE_WIDTH}
        vectorEffect="non-scaling-stroke"
      />
      <path
        className={SPACE_SILVER_DREAM_BORDER.BOTTOM_RIGHT_GLOW_CLASS_NAME}
        d={SPACE_SILVER_DREAM_BORDER.BOTTOM_RIGHT_GLOW_PATH}
        fill="none"
        stroke={SPACE_SILVER_DREAM_BORDER.BOTTOM_RIGHT_GLOW_COLOR}
        strokeWidth={SPACE_SILVER_DREAM_BORDER.SHINE_STROKE_WIDTH}
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
};

const MainMenuButton = ({
  children,
  className,
  hasMetallicBorder,
  variantClassName,
  ...props
}: MainMenuButtonProps) => (
  <ScreenButton
    {...props}
    className={cn(MAIN_MENU_STYLES.BUTTON, variantClassName, className)}
  >
    {hasMetallicBorder ? <SpaceSilverDreamBorder /> : null}
    <span className={MAIN_MENU_STYLES.BUTTON_LABEL}>{children}</span>
  </ScreenButton>
);

export const MainMenuScreen = () => {
  const [continueTarget, setContinueTarget] = useState<ContinueTarget | null>(null);
  const [activeVariantIndex, setActiveVariantIndex] = useState(
    MAIN_MENU_INITIAL_VARIANT_INDEX
  );
  const setGameSessionPhase = useGameUiStore(
    (state) => state.setGameSessionPhase,
  );

  useEffect(() => {
    let isMounted = true;

    void resolveContinueTarget().then((result) => {
      if (!isMounted) {
        return;
      }

      setContinueTarget(result.ok ? result.target : null);
    });

    return () => {
      isMounted = false;
    };
  }, []);

  const handleContinue = async () => {
    const result = await resolveContinueTarget();

    if (result.ok) {
      if (result.target.kind === "activeRun") {
        continueActiveRun(result.target.save);
        return;
      }

      startStage(result.target.selectedStageId);
      return;
    }

    if (result.reason === "invalid") {
      window.alert(SAVE_ERROR_DIALOG.CORRUPTED_ACTIVE_RUN_MESSAGE);
      await clearCorruptedActiveRunSave();
      const nextResult = await resolveContinueTarget();

      setContinueTarget(nextResult.ok ? nextResult.target : null);
      return;
    }

    setContinueTarget(null);
  };

  const canContinue = continueTarget !== null;
  const activeVariant = MAIN_MENU_VARIANTS[activeVariantIndex];
  const hasMetallicButtonBorder =
    activeVariant.ID === SPACE_SILVER_DREAM_VARIANT_ID;

  const changeVariant = (
    direction: (typeof MAIN_MENU_VARIANT_DIRECTION)[keyof typeof MAIN_MENU_VARIANT_DIRECTION]
  ) => {
    setActiveVariantIndex((currentIndex) => {
      const variantCount = MAIN_MENU_VARIANTS.length;

      return (currentIndex + direction + variantCount) % variantCount;
    });
  };

  return (
    <section
      className={cn(MAIN_MENU_STYLES.SCREEN, activeVariant.SCREEN)}
      data-menu-variant={activeVariant.ID}
      onKeyDown={handleScreenNavigationKeyDown}
    >
      <img
        alt={activeVariant.ALT}
        className={MAIN_MENU_STYLES.BACKGROUND}
        draggable={false}
        src={MAIN_MENU_BACKGROUND_URLS[activeVariantIndex]}
      />
      <div className={cn(MAIN_MENU_STYLES.CONTENT, activeVariant.CONTENT)}>
        <h1 className={cn(MAIN_MENU_STYLES.TITLE, activeVariant.TITLE)}>
          {GAME_TITLE}
        </h1>
        <ScreenMenuGrid
          className={cn(MAIN_MENU_STYLES.MENU, activeVariant.MENU)}
          variant="main"
        >
          {canContinue && (
            <MainMenuButton
              autoFocus
              hasMetallicBorder={hasMetallicButtonBorder}
              onClick={handleContinue}
              variantClassName={activeVariant.BUTTON}
            >
              CONTINUE
            </MainMenuButton>
          )}
          <MainMenuButton
            autoFocus={!canContinue}
            hasMetallicBorder={hasMetallicButtonBorder}
            onClick={() => {
              setGameSessionPhase(GAME_SESSION_PHASES.STAGE_SELECT);
            }}
            variantClassName={activeVariant.BUTTON}
          >
            PLAY
          </MainMenuButton>
          <MainMenuButton
            hasMetallicBorder={hasMetallicButtonBorder}
            onClick={() => {
              setGameSessionPhase(GAME_SESSION_PHASES.ARCHIVE);
            }}
            variantClassName={activeVariant.BUTTON}
          >
            ARCHIVE
          </MainMenuButton>
          <MainMenuButton
            hasMetallicBorder={hasMetallicButtonBorder}
            onClick={quitToDesktop}
            variantClassName={activeVariant.BUTTON}
          >
            QUIT
          </MainMenuButton>
        </ScreenMenuGrid>
      </div>
      <div className={MAIN_MENU_STYLES.NAVIGATION}>
        <Button
          aria-label="Show previous main menu variation"
          className={cn(
            MAIN_MENU_STYLES.NAVIGATION_BUTTON,
            activeVariant.NAVIGATION_BUTTON
          )}
          onClick={() => {
            changeVariant(MAIN_MENU_VARIANT_DIRECTION.PREVIOUS);
          }}
          size="screen"
          type="button"
          variant="screen"
        >
          PREV
        </Button>
        <Button
          aria-label="Show next main menu variation"
          className={cn(
            MAIN_MENU_STYLES.NAVIGATION_BUTTON,
            activeVariant.NAVIGATION_BUTTON
          )}
          onClick={() => {
            changeVariant(MAIN_MENU_VARIANT_DIRECTION.NEXT);
          }}
          size="screen"
          type="button"
          variant="screen"
        >
          NEXT
        </Button>
      </div>
    </section>
  );
};
