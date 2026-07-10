import { useEffect, useState, type ComponentType, type ReactNode } from "react";
import {
  Archive,
  ArrowUpRight,
  Gamepad2,
  Gauge,
  Play,
  Power,
  Radio,
  Rocket,
  ScanLine,
  Shield,
  Sparkles,
  Waves,
  Zap,
} from "lucide-react";
import { GAME_TITLE, MAIN_MENU_VARIANTS, SAVE_ERROR_DIALOG, type MainMenuVariant } from "@/game/config/screen-ui-config";
import { GAME_SESSION_PHASES } from "@/game/state/game-session-state";
import { useGameUiStore } from "@/game/state/use-game-ui-store";
import {
  clearCorruptedActiveRunSave,
  resolveContinueTarget,
  type ContinueTarget,
} from "@/game/save/continue-target-service";
import playerSpaceshipUrl from "../../../../../../assets/spaceship.png?url";
import { cn } from "@/lib/utils";
import { ScreenButton } from "./ScreenPrimitives";
import { continueActiveRun, quitToDesktop, startStage } from "./screen-actions";

type MenuIcon = ComponentType<{ className?: string }>;
type MainMenuActionId = "continue" | "play" | "archive" | "quit";

type MainMenuAction = {
  id: MainMenuActionId;
  index: string;
  label: string;
  hint: string;
  icon: MenuIcon;
  isPrimary: boolean;
  onClick: () => void;
};

type MainMenuLayoutProps = {
  actions: readonly MainMenuAction[];
};

const MainMenuActionButton = ({
  action,
  className,
  compact = false,
  showHint = true,
}: {
  action: MainMenuAction;
  className?: string;
  compact?: boolean;
  showHint?: boolean;
}) => {
  const Icon = action.icon;

  return (
    <ScreenButton
      aria-label={`${action.label}: ${action.hint}`}
      autoFocus={action.isPrimary}
      className={cn(
        "main-menu-action",
        action.isPrimary && "main-menu-action--primary",
        compact && "main-menu-action--compact",
        className,
      )}
      onClick={action.onClick}
      type="button"
    >
      <span className="main-menu-action__index">{action.index}</span>
      <Icon className="main-menu-action__icon" />
      <span className="main-menu-action__copy">
        <span className="main-menu-action__label">{action.label}</span>
        {showHint ? <span className="main-menu-action__hint">{action.hint}</span> : null}
      </span>
      <ArrowUpRight className="main-menu-action__arrow" />
    </ScreenButton>
  );
};

const MainMenuShip = ({ className }: { className?: string }) => (
  <div aria-hidden="true" className={cn("main-menu-ship", className)}>
    <span className="main-menu-ship__halo" />
    <span className="main-menu-ship__engine" />
    <img
      alt=""
      className="main-menu-ship__image"
      draggable={false}
      src={playerSpaceshipUrl}
    />
  </div>
);

const MenuWordmark = ({ compact = false }: { compact?: boolean }) => (
  <div className={cn("main-menu-wordmark", compact && "main-menu-wordmark--compact")}>
    <span className="main-menu-wordmark__badge"><span>VS</span></span>
    <span className="main-menu-wordmark__copy">
      <span className="main-menu-wordmark__title">{GAME_TITLE}</span>
      <span className="main-menu-wordmark__subtitle">Deep space operations</span>
    </span>
  </div>
);

const MainMenuHint = ({ children = "WASD / ARROWS TO NAVIGATE" }: { children?: ReactNode }) => (
  <div className="main-menu-hint">
    <Gamepad2 className="main-menu-hint__icon" />
    <span>{children}</span>
    <span className="main-menu-hint__key">ENTER</span>
  </div>
);

const MainMenuScene = ({ variant }: { variant: MainMenuVariant }) => (
  <div aria-hidden="true" className="main-menu-scene">
    <div className="main-menu-scene__stars" />
    <div className="main-menu-scene__nebula" />
    <div className="main-menu-scene__scan" />
    <div className="main-menu-scene__grain" />
    <span className="main-menu-scene__signal main-menu-scene__signal--one" />
    <span className="main-menu-scene__signal main-menu-scene__signal--two" />
    <span className="main-menu-scene__signal main-menu-scene__signal--three" />
    <span className="main-menu-scene__signal main-menu-scene__signal--four" />
    <span className="main-menu-scene__signal main-menu-scene__signal--five" />
    <span className="main-menu-scene__signal main-menu-scene__signal--six" />
    <span className="main-menu-scene__corner main-menu-scene__corner--top-left" />
    <span className="main-menu-scene__corner main-menu-scene__corner--top-right" />
    <span className="main-menu-scene__corner main-menu-scene__corner--bottom-left" />
    <span className="main-menu-scene__corner main-menu-scene__corner--bottom-right" />
    <span className="main-menu-scene__variant" data-variant={variant} />
  </div>
);

const CommandDeckLayout = ({ actions }: MainMenuLayoutProps) => (
  <div className="main-menu-layout main-menu-layout--command-deck">
    <header className="main-menu-command-deck__header">
      <MenuWordmark />
      <div className="main-menu-command-deck__status">
        <span className="main-menu-status-dot" />
        <span>Command uplink stable</span>
        <span className="main-menu-command-deck__status-code">VS-07</span>
      </div>
    </header>

    <div className="main-menu-command-deck__body">
      <section className="main-menu-command-deck__copy">
        <span className="main-menu-kicker">Tactical control / Sector 09</span>
        <h1 className="main-menu-display main-menu-display--stacked">
          <span>Void</span>
          <span>Strike</span>
        </h1>
        <p className="main-menu-lede">
          Drop through the quiet between stars. Every wave is a decision.
        </p>
        <div className="main-menu-command-deck__telemetry">
          <span>MISSION STATUS</span>
          <strong>AWAITING PILOT</strong>
        </div>
        <div className="main-menu-action-rail">
          {actions.map((action) => (
            <MainMenuActionButton action={action} key={action.id} />
          ))}
        </div>
      </section>

      <section className="main-menu-command-deck__ship-bay">
        <div className="main-menu-command-deck__bay-label">
          <ScanLine />
          <span>HANGAR CAMERA / LIVE</span>
        </div>
        <div className="main-menu-command-deck__orbit main-menu-orbit main-menu-orbit--large" />
        <div className="main-menu-command-deck__orbit main-menu-orbit main-menu-orbit--small" />
        <MainMenuShip />
        <div className="main-menu-command-deck__ship-readout">
          <span>VESSEL 01</span>
          <strong>LIGHTBRINGER</strong>
          <span>HULL / 100% &nbsp; • &nbsp; CORE / READY</span>
        </div>
      </section>
    </div>

    <footer className="main-menu-command-deck__footer">
      <MainMenuHint />
      <span className="main-menu-footer-code">BUILD 0.1 / OUTER RIM NETWORK</span>
    </footer>
  </div>
);

const OrbitalLayout = ({ actions }: MainMenuLayoutProps) => (
  <div className="main-menu-layout main-menu-layout--orbital">
    <header className="main-menu-orbital__header">
      <MenuWordmark compact />
      <div className="main-menu-orbital__coordinates">
        <span>ORBITAL WINDOW</span>
        <strong>37° 14′ 08″ N / 142° 52′ 19″ E</strong>
      </div>
      <span className="main-menu-orbital__status">SIGNAL / 99.8%</span>
    </header>

    <div className="main-menu-orbital__body">
      <section className="main-menu-orbital__copy">
        <span className="main-menu-kicker">A flight path through the dark</span>
        <h1 className="main-menu-display main-menu-display--orbital">
          Void<br />
          <em>Strike</em>
        </h1>
        <div className="main-menu-orbital__rule" />
        <p className="main-menu-lede">
          The frontier is quiet until you arrive.
        </p>
        <div className="main-menu-orbital__actions">
          {actions.map((action) => (
            <MainMenuActionButton action={action} compact key={action.id} />
          ))}
        </div>
      </section>

      <section className="main-menu-orbital__viewport">
        <div className="main-menu-orbital__planet" />
        <div className="main-menu-orbital__ring main-menu-orbital__ring--one" />
        <div className="main-menu-orbital__ring main-menu-orbital__ring--two" />
        <div className="main-menu-orbital__ring main-menu-orbital__ring--three" />
        <MainMenuShip className="main-menu-ship--orbital" />
        <span className="main-menu-orbital__orbit-label main-menu-orbital__orbit-label--top">P-09</span>
        <span className="main-menu-orbital__orbit-label main-menu-orbital__orbit-label--right">VECTOR LOCK</span>
        <span className="main-menu-orbital__orbit-label main-menu-orbital__orbit-label--bottom">NIGHT SIDE</span>
      </section>
    </div>

    <footer className="main-menu-orbital__footer">
      <MainMenuHint>ARROWS TO SELECT / ENTER TO CONFIRM</MainMenuHint>
      <span>THE VOID REMEMBERS EVERY PILOT</span>
    </footer>
  </div>
);

const RouteMapLayout = ({ actions }: MainMenuLayoutProps) => (
  <div className="main-menu-layout main-menu-layout--route-map">
    <header className="main-menu-route-map__header">
      <div className="main-menu-route-map__title-lockup">
        <span className="main-menu-kicker">Mission router / Sector 09</span>
        <h1 className="main-menu-route-map__title">{GAME_TITLE}</h1>
      </div>
      <div className="main-menu-route-map__route-count">
        <span>ROUTE MEMORY</span>
        <strong>04 POSSIBLE VECTORS</strong>
      </div>
      <div className="main-menu-route-map__signal">
        <Radio />
        <span>GRAPH LINKED</span>
      </div>
    </header>

    <div className="main-menu-route-map__body">
      <section
        aria-label="Mission route map"
        className="main-menu-route-map__map-panel"
      >
        <div className="main-menu-route-map__map-toolbar">
          <span><ScanLine /> LIVE ROUTE GRAPH</span>
          <span>GRID 09 / 16</span>
        </div>
        <div className="main-menu-route-map__map">
          <span className="main-menu-route-map__map-grid" />
          <span className="main-menu-route-map__route-line main-menu-route-map__route-line--main" />
          <span className="main-menu-route-map__route-line main-menu-route-map__route-line--upper" />
          <span className="main-menu-route-map__route-line main-menu-route-map__route-line--lower" />
          <span className="main-menu-route-map__route-line main-menu-route-map__route-line--finish" />
          <span className="main-menu-route-map__node main-menu-route-map__node--origin">
            <span>ORIGIN</span>
            <strong>HOME</strong>
          </span>
          <span className="main-menu-route-map__node main-menu-route-map__node--current">
            <MainMenuShip className="main-menu-ship--route" />
            <span>YOU ARE HERE</span>
          </span>
          <span className="main-menu-route-map__node main-menu-route-map__node--upper">
            <span>01</span>
            <strong>EMBER</strong>
          </span>
          <span className="main-menu-route-map__node main-menu-route-map__node--lower">
            <span>02</span>
            <strong>NULL</strong>
          </span>
          <span className="main-menu-route-map__node main-menu-route-map__node--finish">
            <span>03</span>
            <strong>THE VEIL</strong>
          </span>
          <span className="main-menu-route-map__map-label main-menu-route-map__map-label--one">SAFE CORRIDOR</span>
          <span className="main-menu-route-map__map-label main-menu-route-map__map-label--two">ANOMALY FIELD</span>
          <span className="main-menu-route-map__map-label main-menu-route-map__map-label--three">UNKNOWN SPACE</span>
        </div>
        <div className="main-menu-route-map__map-note">
          <span>ROUTE PREVIEW</span>
          <p>Choose a branch before the first wave locks your vector.</p>
        </div>
      </section>

      <aside className="main-menu-route-map__brief">
        <span className="main-menu-kicker">Flight plan / uncommitted</span>
        <h2 className="main-menu-display main-menu-display--route">
          Plot<br />
          <em>your run</em>
        </h2>
        <p className="main-menu-lede">
          The shortest path is not always the quietest one.
        </p>
        <nav aria-label="Main menu" className="main-menu-route-map__actions">
          {actions.map((action) => (
            <MainMenuActionButton action={action} key={action.id} />
          ))}
        </nav>
        <div className="main-menu-route-map__stats">
          <span><Gauge /> DISTANCE <strong>4.6 AU</strong></span>
          <span><Zap /> RISK <strong>UNMAPPED</strong></span>
        </div>
      </aside>
    </div>

    <footer className="main-menu-route-map__footer">
      <MainMenuHint>ARROWS TO NAVIGATE / ENTER TO PLOT</MainMenuHint>
      <span>PATHFINDING ENGINE / READY</span>
      <span>SECTOR MEMORY / 03%</span>
    </footer>
  </div>
);

const FlightRecorderLayout = ({ actions }: MainMenuLayoutProps) => (
  <div className="main-menu-layout main-menu-layout--flight-recorder">
    <header className="main-menu-flight-recorder__header">
      <MenuWordmark compact />
      <div className="main-menu-flight-recorder__title-lockup">
        <span>FLIGHT RECORDER</span>
        <strong>LAUNCH SEQUENCE / 01</strong>
      </div>
      <div className="main-menu-flight-recorder__status">
        <span className="main-menu-status-dot" />
        <span>LINK ARMED</span>
      </div>
    </header>

    <div className="main-menu-flight-recorder__body">
      <aside className="main-menu-flight-recorder__log" aria-label="Launch sequence log">
        <div className="main-menu-flight-recorder__log-header">
          <span>SEQUENCE LOG</span>
          <strong>00:00:00</strong>
        </div>
        <div className="main-menu-flight-recorder__timeline">
          <div className="main-menu-flight-recorder__log-entry main-menu-flight-recorder__log-entry--complete">
            <span className="main-menu-flight-recorder__log-marker" />
            <span><strong>CORE WAKE</strong><small>COMPLETE / 100%</small></span>
          </div>
          <div className="main-menu-flight-recorder__log-entry main-menu-flight-recorder__log-entry--active">
            <span className="main-menu-flight-recorder__log-marker" />
            <span><strong>PILOT LINK</strong><small>AWAITING COMMAND</small></span>
          </div>
          <div className="main-menu-flight-recorder__log-entry">
            <span className="main-menu-flight-recorder__log-marker" />
            <span><strong>VECTOR LOCK</strong><small>STANDBY</small></span>
          </div>
          <div className="main-menu-flight-recorder__log-entry">
            <span className="main-menu-flight-recorder__log-marker" />
            <span><strong>GATE OPEN</strong><small>STANDBY</small></span>
          </div>
        </div>
        <div className="main-menu-flight-recorder__log-footer">
          <span>4 SYSTEMS ONLINE</span>
          <span>REC / ARMED</span>
        </div>
      </aside>

      <section className="main-menu-flight-recorder__launch">
        <div className="main-menu-flight-recorder__countdown">
          <span>READY</span>
          <strong>03</strong>
          <span>SECONDS TO VECTOR</span>
        </div>
        <div className="main-menu-flight-recorder__launch-rule" />
        <h1 className="main-menu-display main-menu-display--flight">
          Launch<br />
          <em>sequence</em>
        </h1>
        <p className="main-menu-lede">
          Confirm a command and the recorder will keep the route alive.
        </p>
        <div className="main-menu-flight-recorder__launch-bay">
          <span className="main-menu-flight-recorder__bay-mark main-menu-flight-recorder__bay-mark--left" />
          <span className="main-menu-flight-recorder__bay-mark main-menu-flight-recorder__bay-mark--right" />
          <span className="main-menu-flight-recorder__bay-floor" />
          <MainMenuShip className="main-menu-ship--flight" />
        </div>
      </section>

      <nav className="main-menu-flight-recorder__controls" aria-label="Main menu">
        <div className="main-menu-flight-recorder__controls-heading">
          <span className="main-menu-kicker">Control surface</span>
          <strong>SELECT COMMAND</strong>
          <span>ENTER / EXECUTE</span>
        </div>
        <div className="main-menu-flight-recorder__actions">
          {actions.map((action) => (
            <MainMenuActionButton action={action} key={action.id} />
          ))}
        </div>
        <div className="main-menu-flight-recorder__dial">
          <span className="main-menu-flight-recorder__dial-ring" />
          <Shield />
          <span>HULL / NOMINAL</span>
        </div>
      </nav>
    </div>

    <footer className="main-menu-flight-recorder__footer">
      <MainMenuHint>ARROWS TO SELECT / ENTER TO EXECUTE</MainMenuHint>
      <span>RECORDER BUFFER / 98.4%</span>
      <span>BLACK BOX / ONLINE</span>
    </footer>
  </div>
);

const PrismLayout = ({ actions }: MainMenuLayoutProps) => (
  <div className="main-menu-layout main-menu-layout--prism">
    <header className="main-menu-prism__header">
      <MenuWordmark compact />
      <div className="main-menu-prism__signal">
        <span className="main-menu-status-dot" />
        <span>OUTER RIM NETWORK</span>
        <strong>ONLINE</strong>
      </div>
    </header>

    <div className="main-menu-prism__body">
      <section className="main-menu-prism__copy">
        <span className="main-menu-kicker">A new frontier opens</span>
        <h1 className="main-menu-display main-menu-display--prism">
          <span>Void</span>
          <span>Strike</span>
        </h1>
        <p className="main-menu-lede">
          A precise bullet-hell run through the edge of known space.
        </p>
        <div className="main-menu-prism__actions">
          {actions.map((action) => (
            <MainMenuActionButton action={action} key={action.id} />
          ))}
        </div>
      </section>

      <section className="main-menu-prism__hero">
        <div className="main-menu-prism__burst" />
        <div className="main-menu-prism__halo main-menu-prism__halo--outer" />
        <div className="main-menu-prism__halo main-menu-prism__halo--inner" />
        <div className="main-menu-prism__beam" />
        <MainMenuShip className="main-menu-ship--prism" />
        <div className="main-menu-prism__hero-label">
          <span>VESSEL / 01</span>
          <strong>LIGHTBRINGER</strong>
          <span>READY FOR DEPLOYMENT</span>
        </div>
        <div className="main-menu-prism__hero-axis main-menu-prism__hero-axis--x" />
        <div className="main-menu-prism__hero-axis main-menu-prism__hero-axis--y" />
      </section>
    </div>

    <footer className="main-menu-prism__footer">
      <MainMenuHint>WASD / ARROWS TO NAVIGATE</MainMenuHint>
      <div className="main-menu-prism__footer-meta">
        <span><Sparkles /> CORE STABLE</span>
        <span><Waves /> SIGNAL CLEAR</span>
        <span>BUILD 0.1</span>
      </div>
    </footer>
  </div>
);

const MainMenuLayout = ({
  actions,
  variant,
}: MainMenuLayoutProps & { variant: MainMenuVariant }) => {
  if (variant === MAIN_MENU_VARIANTS.COMMAND_DECK) {
    return <CommandDeckLayout actions={actions} />;
  }

  if (variant === MAIN_MENU_VARIANTS.ORBITAL) {
    return <OrbitalLayout actions={actions} />;
  }

  if (variant === MAIN_MENU_VARIANTS.RADAR) {
    return <RouteMapLayout actions={actions} />;
  }

  if (variant === MAIN_MENU_VARIANTS.HANGAR) {
    return <FlightRecorderLayout actions={actions} />;
  }

  return <PrismLayout actions={actions} />;
};

export const MainMenuScreen = () => {
  const [continueTarget, setContinueTarget] = useState<ContinueTarget | null>(null);
  const mainMenuVariant = useGameUiStore((state) => state.mainMenuVariant);
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
  const actions: readonly MainMenuAction[] = [
    ...(canContinue
      ? [
          {
            id: "continue" as const,
            index: "01",
            label: "CONTINUE",
            hint: "Resume your last run",
            icon: Rocket,
            isPrimary: true,
            onClick: handleContinue,
          },
        ]
      : []),
    {
      id: "play",
      index: canContinue ? "02" : "01",
      label: "PLAY",
      hint: "Start a new run",
      icon: Play,
      isPrimary: !canContinue,
      onClick: () => {
        setGameSessionPhase(GAME_SESSION_PHASES.STAGE_SELECT);
      },
    },
    {
      id: "archive",
      index: canContinue ? "03" : "02",
      label: "ARCHIVE",
      hint: "Review enemies and skills",
      icon: Archive,
      isPrimary: false,
      onClick: () => {
        setGameSessionPhase(GAME_SESSION_PHASES.ARCHIVE);
      },
    },
    {
      id: "quit",
      index: canContinue ? "04" : "03",
      label: "QUIT",
      hint: "Return to desktop",
      icon: Power,
      isPrimary: false,
      onClick: quitToDesktop,
    },
  ];

  return (
    <div className="main-menu" data-main-menu-variant={mainMenuVariant}>
      <MainMenuScene variant={mainMenuVariant} />
      <MainMenuLayout actions={actions} variant={mainMenuVariant} />
    </div>
  );
};
