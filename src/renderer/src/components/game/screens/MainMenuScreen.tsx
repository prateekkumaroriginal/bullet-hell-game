import { type ComponentProps, useEffect, useState } from "react";
import mainMenuBackgroundUrl from "../../../../../../assets/menu/main-menu-background.png?url";
import eclipseWarshipBackgroundUrl from "../../../../../../assets/menu/main-menu-eclipse-warship.png?url";
import iceCathedralBackgroundUrl from "../../../../../../assets/menu/main-menu-ice-cathedral.png?url";
import orbitalCityBackgroundUrl from "../../../../../../assets/menu/main-menu-orbital-city.png?url";
import redSingularityBackgroundUrl from "../../../../../../assets/menu/main-menu-red-singularity.png?url";
import ringGateBackgroundUrl from "../../../../../../assets/menu/main-menu-ring-gate.png?url";
import { Button } from "@/components/ui/button";
import {
  GAME_TITLE,
  MAIN_MENU_INITIAL_VARIANT_INDEX,
  MAIN_MENU_STYLES,
  MAIN_MENU_VARIANT_DIRECTION,
  MAIN_MENU_VARIANTS,
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
  redSingularityBackgroundUrl
] as const;

type MainMenuButtonProps = ComponentProps<typeof ScreenButton> & {
  variantClassName: string;
};

const MainMenuButton = ({
  children,
  className,
  variantClassName,
  ...props
}: MainMenuButtonProps) => (
  <ScreenButton
    {...props}
    className={cn(MAIN_MENU_STYLES.BUTTON, variantClassName, className)}
  >
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
              onClick={handleContinue}
              variantClassName={activeVariant.BUTTON}
            >
              CONTINUE
            </MainMenuButton>
          )}
          <MainMenuButton
            autoFocus={!canContinue}
            onClick={() => {
              setGameSessionPhase(GAME_SESSION_PHASES.STAGE_SELECT);
            }}
            variantClassName={activeVariant.BUTTON}
          >
            PLAY
          </MainMenuButton>
          <MainMenuButton
            onClick={() => {
              setGameSessionPhase(GAME_SESSION_PHASES.ARCHIVE);
            }}
            variantClassName={activeVariant.BUTTON}
          >
            ARCHIVE
          </MainMenuButton>
          <MainMenuButton
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
