import {
  useEffect,
  useState,
  type ComponentType,
  type CSSProperties,
  type MouseEventHandler,
} from "react";
import {
  Archive,
  Play,
  Power,
  RotateCcw,
} from "lucide-react";
import {
  GAME_TITLE,
  MAIN_MENU_BACKGROUND_VARIATIONS,
  MAIN_MENU_COLORS,
  MAIN_MENU_COLOR_CONFIG,
  MAIN_MENU_DEFAULT_COLOR,
  MAIN_MENU_DEFAULT_SUBVARIATION,
  MAIN_MENU_LAYOUT,
  MAIN_MENU_SUBVARIATION_COUNT,
  MAIN_MENU_SUBVARIATION_INDICES,
  type MainMenuColor,
  SAVE_ERROR_DIALOG,
} from "@/game/config/screen-ui-config";
import { GAME_SESSION_PHASES } from "@/game/state/game-session-state";
import { useGameUiStore } from "@/game/state/use-game-ui-store";
import {
  clearCorruptedActiveRunSave,
  resolveContinueTarget,
  type ContinueTarget,
} from "@/game/save/continue-target-service";
import { cn } from "@/lib/utils";
import {
  handleScreenNavigationKeyDown,
  ScreenButton,
  ScreenMenuGrid,
  ScreenTitle,
} from "./ScreenPrimitives";
import { continueActiveRun, quitToDesktop, startStage } from "./screen-actions";

type MenuIcon = ComponentType<{
  className?: string;
  "aria-hidden"?: boolean;
}>;

type MainMenuButtonProps = {
  autoFocus?: boolean;
  icon: MenuIcon;
  label: string;
  onClick: MouseEventHandler<HTMLButtonElement>;
};

type MainMenuStyle = CSSProperties & Record<`--${string}`, string>;

const TITLE_LINES = GAME_TITLE.split(" ");

const MainMenuButton = ({
  autoFocus,
  icon: Icon,
  label,
  onClick,
}: MainMenuButtonProps) => (
  <ScreenButton
    autoFocus={autoFocus}
    className="main-menu__button"
    onClick={onClick}
  >
    <Icon aria-hidden={true} className="main-menu__button-icon" />
    <span className="main-menu__button-label">{label}</span>
  </ScreenButton>
);

export const MainMenuScreen = ({
  color: initialColor = MAIN_MENU_DEFAULT_COLOR,
  subvariation: initialSubvariation = MAIN_MENU_DEFAULT_SUBVARIATION,
}: {
  color?: MainMenuColor;
  subvariation?: number;
} = {}) => {
  const [continueTarget, setContinueTarget] = useState<ContinueTarget | null>(null);
  const [menuColor, setMenuColor] = useState<MainMenuColor>(initialColor);
  const [menuSubvariation, setMenuSubvariation] = useState(initialSubvariation);
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
  const activeSubvariation = Math.max(
    0,
    Math.min(menuSubvariation, MAIN_MENU_SUBVARIATION_COUNT - 1),
  );
  const colorConfig = MAIN_MENU_COLOR_CONFIG[menuColor];
  const backgroundImageUrl =
    MAIN_MENU_BACKGROUND_VARIATIONS[menuColor][activeSubvariation];
  const menuStyle: MainMenuStyle = {
    "--main-menu-horizontal-padding": MAIN_MENU_LAYOUT.HORIZONTAL_PADDING,
    "--main-menu-vertical-padding": MAIN_MENU_LAYOUT.VERTICAL_PADDING,
    "--main-menu-content-width": MAIN_MENU_LAYOUT.CONTENT_WIDTH,
    "--main-menu-content-gap": MAIN_MENU_LAYOUT.CONTENT_GAP,
    "--main-menu-action-gap": MAIN_MENU_LAYOUT.ACTION_GAP,
    "--main-menu-title-size": MAIN_MENU_LAYOUT.TITLE_SIZE,
    "--main-menu-title-color": colorConfig.titleColor,
    "--main-menu-title-accent": colorConfig.titleAccent,
    "--main-menu-title-glow": colorConfig.titleGlow,
    "--main-menu-button-height": MAIN_MENU_LAYOUT.BUTTON_HEIGHT,
    "--main-menu-button-padding": MAIN_MENU_LAYOUT.BUTTON_PADDING,
    "--main-menu-button-radius": MAIN_MENU_LAYOUT.BUTTON_RADIUS,
    "--main-menu-button-gap": MAIN_MENU_LAYOUT.BUTTON_GAP,
    "--main-menu-button-icon-size": MAIN_MENU_LAYOUT.BUTTON_ICON_SIZE,
    "--main-menu-variant-nav-inset": MAIN_MENU_LAYOUT.VARIANT_NAV_INSET,
    "--main-menu-variant-nav-gap": MAIN_MENU_LAYOUT.VARIANT_NAV_GAP,
    "--main-menu-variant-button-height": MAIN_MENU_LAYOUT.VARIANT_BUTTON_HEIGHT,
    "--main-menu-variant-button-padding": MAIN_MENU_LAYOUT.VARIANT_BUTTON_PADDING,
    "--main-menu-variant-swatch-size": MAIN_MENU_LAYOUT.VARIANT_SWATCH_SIZE,
    "--main-menu-accent": colorConfig.accent,
    "--main-menu-accent-soft": colorConfig.accentSoft,
    "--main-menu-accent-glow": colorConfig.accentGlow,
    "--main-menu-active-surface": colorConfig.activeSurface,
    "--main-menu-active-text": colorConfig.activeText,
  };

  return (
    <section
      aria-label="Main menu"
      className="main-menu"
      data-color={menuColor}
      data-subvariation={activeSubvariation}
      onKeyDown={handleScreenNavigationKeyDown}
      style={menuStyle}
    >
      <img
        alt=""
        aria-hidden="true"
        className="main-menu__background"
        draggable={false}
        src={backgroundImageUrl}
      />

      <nav
        aria-label="Menu variation"
        className="main-menu__variant-nav"
        onKeyDown={(event) => {
          event.stopPropagation();
        }}
      >
        <div
          aria-label="Color variation"
          className="main-menu__variant-group"
          role="group"
        >
          <button
            aria-pressed={menuColor === MAIN_MENU_COLORS.GREEN}
            className={cn(
              "main-menu__variant-button",
              menuColor === MAIN_MENU_COLORS.GREEN &&
                "main-menu__variant-button--active",
            )}
            onClick={() => setMenuColor(MAIN_MENU_COLORS.GREEN)}
            type="button"
          >
            GREEN
          </button>
          <button
            aria-pressed={menuColor === MAIN_MENU_COLORS.SILVER}
            className={cn(
              "main-menu__variant-button",
              menuColor === MAIN_MENU_COLORS.SILVER &&
                "main-menu__variant-button--active",
            )}
            onClick={() => setMenuColor(MAIN_MENU_COLORS.SILVER)}
            type="button"
          >
            SILVER
          </button>
          <button
            aria-pressed={menuColor === MAIN_MENU_COLORS.CYAN}
            className={cn(
              "main-menu__variant-button",
              menuColor === MAIN_MENU_COLORS.CYAN &&
                "main-menu__variant-button--active",
            )}
            onClick={() => setMenuColor(MAIN_MENU_COLORS.CYAN)}
            type="button"
          >
            CYAN
          </button>
        </div>
        <div
          aria-label="Background variation"
          className="main-menu__variant-group main-menu__variant-group--subvariations"
          role="group"
        >
          {MAIN_MENU_SUBVARIATION_INDICES.map((subvariationIndex) => (
            <button
              aria-label={`Background variation ${subvariationIndex + 1}`}
              aria-pressed={activeSubvariation === subvariationIndex}
              className={cn(
                "main-menu__variant-button main-menu__subvariation-button",
                activeSubvariation === subvariationIndex &&
                  "main-menu__variant-button--active",
              )}
              key={subvariationIndex}
              onClick={() => setMenuSubvariation(subvariationIndex)}
              type="button"
            >
              <span aria-hidden="true" className="main-menu__subvariation-swatch" />
            </button>
          ))}
        </div>
      </nav>

      <div className="main-menu__content">
        <ScreenTitle className="main-menu__title" variant="main">
          {TITLE_LINES.map((line) => (
            <span key={line}>{line}</span>
          ))}
        </ScreenTitle>

        <ScreenMenuGrid className="main-menu__actions" variant="main">
          {canContinue && (
            <MainMenuButton
              autoFocus
              icon={RotateCcw}
              label="CONTINUE"
              onClick={handleContinue}
            />
          )}
          <MainMenuButton
            autoFocus={!canContinue}
            icon={Play}
            label="PLAY"
            onClick={() => {
              setGameSessionPhase(GAME_SESSION_PHASES.STAGE_SELECT);
            }}
          />
          <MainMenuButton
            icon={Archive}
            label="ARCHIVE"
            onClick={() => {
              setGameSessionPhase(GAME_SESSION_PHASES.ARCHIVE);
            }}
          />
          <MainMenuButton
            icon={Power}
            label="QUIT"
            onClick={quitToDesktop}
          />
        </ScreenMenuGrid>
      </div>
    </section>
  );
};

export const MainMenuScreenSilver = () => (
  <MainMenuScreen color={MAIN_MENU_COLORS.SILVER} />
);
