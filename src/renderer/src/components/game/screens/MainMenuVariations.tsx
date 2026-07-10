import { useEffect, type CSSProperties, type ReactNode } from "react";
import {
  Archive,
  ArrowDownToLine,
  ArrowUpRight,
  BatteryCharging,
  ChevronRight,
  CircleDot,
  Crosshair,
  Gauge,
  Hammer,
  LogOut,
  Radio,
  ScanLine,
  Shield,
  Sparkles,
  Wrench,
  Zap
} from "lucide-react";
import spaceshipUrl from "../../../../../../assets/spaceship.png?url";
import { GAME_TITLE } from "@/game/config/screen-ui-config";
import {
  type MenuVariationDefinition,
  MENU_ANOMALY_ROTATION_DURATION_MS,
  MENU_ART_BLUR_PX,
  MENU_ART_OPACITY,
  MENU_ART_TRANSITION_MS,
  getMenuVariationDefinition,
  MENU_REVEAL_DURATION_MS,
  MENU_REVEAL_STAGGER_MS,
  MENU_STAGE_LABEL_WIDTH,
  MENU_TEMPLE_PULSE_DURATION_MS,
  MENU_VARIATION_COUNT,
  MENU_VARIATION_DEFINITIONS,
  MENU_VARIATION_IDS,
  type MenuVariationId
} from "@/game/config/menu-variation-config";
import { STAGE_DEFINITIONS, type StageDefinition } from "@/game/config/stage-config";
import { type ContinueTarget } from "@/game/save/continue-target-service";
import { ScreenButton, ScreenCenter } from "./ScreenPrimitives";
import { cn } from "@/lib/utils";
import "./main-menu-variations.css";

type MenuCssStyle = CSSProperties & Record<`--${string}`, string | number>;

export type MainMenuActionHandlers = {
  onContinue: () => void;
  onPlay: () => void;
  onArchive: () => void;
  onQuit: () => void;
};

export type MainMenuVariationProps = {
  canContinue: boolean;
  continueTarget: ContinueTarget | null;
  handlers: MainMenuActionHandlers;
};

type MainMenuVariationFrameProps = MainMenuVariationProps & {
  variationId: MenuVariationId;
  onSelectVariation: (variationId: MenuVariationId) => void;
};

const IS_MENU_DECK_ENABLED = import.meta.env.DEV;
const PRIMARY_STAGE: StageDefinition = STAGE_DEFINITIONS[0];
const SPACEPORT_DEFINITION = getMenuVariationDefinition(MENU_VARIATION_IDS.SPACEPORT);
const SALVAGE_DEFINITION = getMenuVariationDefinition(MENU_VARIATION_IDS.SALVAGE);
const ANOMALY_DEFINITION = getMenuVariationDefinition(MENU_VARIATION_IDS.ANOMALY);
const WARFRONT_DEFINITION = getMenuVariationDefinition(MENU_VARIATION_IDS.WARFRONT);
const TEMPLE_DEFINITION = getMenuVariationDefinition(MENU_VARIATION_IDS.TEMPLE);

const getStageLabel = (stage: StageDefinition): string =>
  `S${String(stage.order).padStart(MENU_STAGE_LABEL_WIDTH, "0")}`;

const getMissionLabel = (stage: StageDefinition): string =>
  `${getStageLabel(stage)} / ${stage.name.toUpperCase()}`;

const getContinueLabel = (continueTarget: ContinueTarget | null): string => {
  if (!continueTarget) {
    return "NO RUN STORED";
  }

  if (continueTarget.kind === "activeRun") {
    return `WAVE ${continueTarget.save.currentWave} / ${continueTarget.save.selectedStageId}`;
  }

  return `NEXT / ${getMissionLabel(
    STAGE_DEFINITIONS.find((stage) => stage.id === continueTarget.selectedStageId) ?? PRIMARY_STAGE
  )}`;
};

const getThemeStyle = (definition: MenuVariationDefinition): MenuCssStyle => ({
  "--menu-accent": definition.theme.accent,
  "--menu-accent-bright": definition.theme.accentBright,
  "--menu-accent-muted": definition.theme.accentMuted,
  "--menu-ink": definition.theme.ink,
  "--menu-paper": definition.theme.paper,
  "--menu-panel": definition.theme.panel,
  "--menu-display-font": definition.theme.displayFont,
  "--menu-body-font": definition.theme.bodyFont,
  "--menu-art-opacity": MENU_ART_OPACITY,
  "--menu-art-blur": `${MENU_ART_BLUR_PX}px`,
  "--menu-art-transition": `${MENU_ART_TRANSITION_MS}ms`,
  "--menu-reveal-duration": `${MENU_REVEAL_DURATION_MS}ms`,
  "--menu-reveal-stagger": `${MENU_REVEAL_STAGGER_MS}ms`
});

const MenuArt = ({
  definition,
  className
}: {
  definition: MenuVariationDefinition;
  className?: string;
}) => (
  <div className={cn("menu-art", className)} aria-hidden="true">
    <img
      alt=""
      className="menu-art__image"
      draggable={false}
      src={definition.artUrl}
    />
    <div className="menu-art__veil" />
    <div className="menu-art__frame" />
  </div>
);

const MenuDeck = ({
  variationId,
  onSelectVariation
}: {
  variationId: MenuVariationId;
  onSelectVariation: (variationId: MenuVariationId) => void;
}) => (
  <nav className="menu-deck" aria-label="Main menu variation preview">
    <span className="menu-deck__label">DEV DECK / 1–{MENU_VARIATION_COUNT}</span>
    <div className="menu-deck__buttons">
      {MENU_VARIATION_DEFINITIONS.map((definition) => (
        <button
          aria-label={`${definition.index} ${definition.name}`}
          aria-pressed={variationId === definition.id}
          className={cn(
            "menu-deck__button",
            variationId === definition.id && "menu-deck__button--active"
          )}
          key={definition.id}
          onClick={() => onSelectVariation(definition.id)}
          title={definition.name}
          type="button"
        >
          {definition.index}
        </button>
      ))}
    </div>
  </nav>
);

const MenuRule = ({ children }: { children: ReactNode }) => (
  <div className="menu-rule">
    <span className="menu-rule__line" />
    <span className="menu-rule__label">{children}</span>
    <span className="menu-rule__line" />
  </div>
);

const SpaceportVariation = ({
  canContinue,
  continueTarget,
  handlers
}: MainMenuVariationProps) => (
  <div className="menu-variant menu-variant--spaceport">
    <MenuArt
      className="menu-art--spaceport"
      definition={SPACEPORT_DEFINITION}
    />
    <header className="spaceport__header menu-reveal menu-reveal--one">
      <div className="spaceport__brand">
        <span className="spaceport__brand-mark">VS</span>
        <span>
          <strong>{GAME_TITLE}</strong>
          <small>AFTER-HOURS OPERATIONS / 7C</small>
        </span>
      </div>
      <div className="spaceport__status">
        <span className="spaceport__status-dot" />
        <span>PORT STATUS / OPEN</span>
      </div>
    </header>

    <main className="spaceport__main">
      <section className="spaceport__hero menu-reveal menu-reveal--two">
        <span className="spaceport__eyebrow">CITY OF LAST LIGHT / 01</span>
        <h1>
          <span>NEON</span>
          <em>RUNNER</em>
        </h1>
        <p>
          The port never sleeps. Find a ship, find a target, and leave before
          the sunrise scanners know your name.
        </p>
        <div className="spaceport__live-line">
          <span>LIVE CONTRACT</span>
          <span>{getMissionLabel(PRIMARY_STAGE)}</span>
        </div>
      </section>

      <section className="spaceport__board menu-panel menu-reveal menu-reveal--three">
        <div className="spaceport__board-heading">
          <div>
            <span className="spaceport__board-kicker">NIGHT SHIFT</span>
            <h2>GIG BOARD</h2>
          </div>
          <span className="spaceport__open-count">04 OPEN</span>
        </div>
        <div className="spaceport__contract">
          <div className="spaceport__contract-topline">
            <span>{getMissionLabel(PRIMARY_STAGE)}</span>
            <span>HOT</span>
          </div>
          <strong>BREAK THE ORBITAL QUIET</strong>
          <span>
            {PRIMARY_STAGE.waves.length} waves / {PRIMARY_STAGE.waves[0]?.spawns.length ?? 0} threat signatures
          </span>
        </div>
        {canContinue ? (
          <ScreenButton
            autoFocus
            className="spaceport__action spaceport__action--continue"
            onClick={handlers.onContinue}
          >
            <span className="spaceport__action-copy">
              <small>RETURN TO RUN</small>
              <strong>{getContinueLabel(continueTarget)}</strong>
            </span>
            <ArrowUpRight className="size-5" />
          </ScreenButton>
        ) : null}
        <ScreenButton
          autoFocus={!canContinue}
          className="spaceport__action spaceport__action--primary"
          onClick={handlers.onPlay}
        >
          <span className="spaceport__action-copy">
            <small>NEW CONTRACT</small>
            <strong>TAKE A GIG</strong>
          </span>
          <ChevronRight className="size-6" />
        </ScreenButton>
        <div className="spaceport__utility-actions">
          <ScreenButton onClick={handlers.onArchive}>
            <Archive className="size-4" />
            ARCHIVE
          </ScreenButton>
          <ScreenButton onClick={handlers.onQuit}>
            <LogOut className="size-4" />
            EXIT PORT
          </ScreenButton>
        </div>
      </section>
    </main>

    <footer className="spaceport__footer menu-reveal menu-reveal--four">
      <MenuRule>THE CITY IS A WEAPON</MenuRule>
      <span>WASD / ARROWS TO NAVIGATE</span>
    </footer>
  </div>
);

const SalvageMetric = ({
  label,
  value,
  tone = "normal"
}: {
  label: string;
  value: string;
  tone?: "normal" | "warn" | "good";
}) => (
  <div className="salvage__metric">
    <span>{label}</span>
    <strong className={`salvage__metric-value salvage__metric-value--${tone}`}>
      {value}
    </strong>
  </div>
);

const SalvageVariation = ({
  canContinue,
  continueTarget,
  handlers
}: MainMenuVariationProps) => (
  <div className="menu-variant menu-variant--salvage">
    <MenuArt
      className="menu-art--salvage"
      definition={SALVAGE_DEFINITION}
    />
    <header className="salvage__header menu-reveal menu-reveal--one">
      <div className="salvage__stamp">
        <span className="salvage__stamp-mark">RIG</span>
        <span>
          <strong>LOCKER 04</strong>
          <small>CREW ACCESS / MAINTENANCE DECK</small>
        </span>
      </div>
      <div className="salvage__bus-status">
        <span>POWER BUS</span>
        <strong>ONLINE</strong>
        <BatteryCharging className="size-4" />
      </div>
    </header>

    <main className="salvage__main">
      <aside className="salvage__manifest menu-panel menu-reveal menu-reveal--two">
        <span className="salvage__kicker">LOADOUT MANIFEST / 02</span>
        <h1>
          READY
          <span>TO BREAK</span>
        </h1>
        <p>
          A patched hull, a full magazine, and just enough fuel to make the
          next bad decision.
        </p>
        <div className="salvage__metrics">
          <SalvageMetric label="HULL" value="100%" tone="good" />
          <SalvageMetric label="COOLANT" value="STABLE" />
          <SalvageMetric label="AMMO" value="FULL" />
        </div>
        {canContinue ? (
          <ScreenButton
            autoFocus
            className="salvage__button salvage__button--continue"
            onClick={handlers.onContinue}
          >
            <ArrowDownToLine className="size-4" />
            {getContinueLabel(continueTarget)}
          </ScreenButton>
        ) : null}
        <ScreenButton
          autoFocus={!canContinue}
          className="salvage__button salvage__button--primary"
          onClick={handlers.onPlay}
        >
          <Wrench className="size-4" />
          OPEN LOADOUT
        </ScreenButton>
      </aside>

      <section className="salvage__bay menu-panel menu-reveal menu-reveal--three">
        <div className="salvage__bay-header">
          <span>FLIGHT UNIT / VS-01</span>
          <span className="salvage__repair-status">REPAIR COMPLETE</span>
        </div>
        <div className="salvage__ship-stage">
          <span className="salvage__stage-line salvage__stage-line--left" />
          <img alt="" className="salvage__ship" draggable={false} src={spaceshipUrl} />
          <span className="salvage__stage-line salvage__stage-line--right" />
          <span className="salvage__ship-label">VOID STRIKE / 01</span>
        </div>
        <div className="salvage__bay-readout">
          <span>
            <Hammer className="size-4" />
            THE RIG REMEMBERS EVERY IMPACT
          </span>
          <span>LAST SERVICE / 06:42:11</span>
        </div>
      </section>

      <aside className="salvage__toolwall menu-panel menu-reveal menu-reveal--four">
        <span className="salvage__kicker">SYSTEMS CHECK</span>
        <div className="salvage__tool-item">
          <Gauge className="size-5" />
          <span>
            <small>DRIVE CORE</small>
            <strong>COHERENT</strong>
          </span>
        </div>
        <div className="salvage__tool-item">
          <Shield className="size-5" />
          <span>
            <small>ARMOR PLATE</small>
            <strong>PATCHED</strong>
          </span>
        </div>
        <div className="salvage__tool-item">
          <Zap className="size-5" />
          <span>
            <small>WEAPON BUS</small>
            <strong>CHARGED</strong>
          </span>
        </div>
        <div className="salvage__tool-actions">
          <ScreenButton onClick={handlers.onArchive}>
            <Archive className="size-4" />
            ARCHIVE
          </ScreenButton>
          <ScreenButton onClick={handlers.onQuit}>
            <LogOut className="size-4" />
            SHUT DOWN
          </ScreenButton>
        </div>
      </aside>
    </main>

    <footer className="salvage__footer menu-reveal menu-reveal--five">
      <span>TOOLS DOWN / EYES UP</span>
      <span>LOCKER 04 // SHIFT ENDS WHEN YOU SAY SO</span>
    </footer>
  </div>
);

const AnomalyReadout = ({ label, value }: { label: string; value: string }) => (
  <div className="anomaly__readout-row">
    <span>{label}</span>
    <strong>{value}</strong>
  </div>
);

const AnomalyVariation = ({
  canContinue,
  continueTarget,
  handlers
}: MainMenuVariationProps) => (
  <div className="menu-variant menu-variant--anomaly">
    <MenuArt
      className="menu-art--anomaly"
      definition={ANOMALY_DEFINITION}
    />
    <header className="anomaly__header menu-reveal menu-reveal--one">
      <div>
        <span className="anomaly__node-mark">OBSERVATORY / NODE 03</span>
        <strong>DEEP-SPACE ANOMALY LAB</strong>
      </div>
      <div className="anomaly__signal-state">
        <Radio className="size-4" />
        <span>SIGNAL ACQUIRED</span>
      </div>
    </header>

    <main className="anomaly__main">
      <aside className="anomaly__readout menu-reveal menu-reveal--two">
        <span className="anomaly__readout-heading">SIGNAL PROFILE</span>
        <AnomalyReadout label="ORIGIN" value="UNKNOWN" />
        <AnomalyReadout label="VECTOR" value="NEGATIVE" />
        <AnomalyReadout label="HARMONIC" value="13.8 KHZ" />
        <AnomalyReadout label="RESPONSE" value="RECIPROCAL" />
        <div className="anomaly__readout-note">
          <ScanLine className="size-4" />
          <span>THE INSTRUMENTS ARE LISTENING BACK.</span>
        </div>
      </aside>

      <section className="anomaly__core menu-reveal menu-reveal--three">
        <div
          className="anomaly__orbit"
          style={
            {
              "--menu-anomaly-rotation-duration": `${MENU_ANOMALY_ROTATION_DURATION_MS}ms`
            } as MenuCssStyle
          }
        >
          <span className="anomaly__orbit-ring anomaly__orbit-ring--outer" />
          <span className="anomaly__orbit-ring anomaly__orbit-ring--inner" />
          <span className="anomaly__orbit-core">
            <CircleDot className="size-8" />
          </span>
        </div>
        <span className="anomaly__core-kicker">SIGNAL / UNRESOLVED</span>
        <h1>
          THE
          <span>UNANSWERED</span>
        </h1>
        <p>
          It arrived before the stars did. Every sweep says empty space. Every
          sweep returns with a new coordinate.
        </p>
        <div className="anomaly__actions">
          {canContinue ? (
            <ScreenButton
              autoFocus
              className="anomaly__button anomaly__button--continue"
              onClick={handlers.onContinue}
            >
              <span>CONTINUE / {getContinueLabel(continueTarget)}</span>
              <ArrowUpRight className="size-4" />
            </ScreenButton>
          ) : null}
          <ScreenButton
            autoFocus={!canContinue}
            className="anomaly__button anomaly__button--primary"
            onClick={handlers.onPlay}
          >
            <Crosshair className="size-4" />
            INITIATE CONTACT
          </ScreenButton>
        </div>
      </section>

      <aside className="anomaly__index menu-panel menu-reveal menu-reveal--four">
        <span className="anomaly__index-kicker">ANOMALY INDEX</span>
        <strong>03</strong>
        <span>DO NOT CALIBRATE ALONE</span>
        <div className="anomaly__index-actions">
          <ScreenButton onClick={handlers.onArchive}>
            <Archive className="size-4" />
            ARCHIVE
          </ScreenButton>
          <ScreenButton onClick={handlers.onQuit}>
            <LogOut className="size-4" />
            DISCONNECT
          </ScreenButton>
        </div>
      </aside>
    </main>

    <footer className="anomaly__footer menu-reveal menu-reveal--five">
      <MenuRule>OBSERVE / MEASURE / SURVIVE</MenuRule>
      <span>LAB NOTE 0003 / THE VOID IS NOT EMPTY</span>
    </footer>
  </div>
);

const WarfrontStageRow = ({ stage }: { stage: StageDefinition }) => (
  <div className="warfront__stage-row">
    <span className="warfront__stage-index">{getStageLabel(stage)}</span>
    <span className="warfront__stage-name">{stage.name.toUpperCase()}</span>
    <span className="warfront__stage-waves">{stage.waves.length} WAVES</span>
    <span className="warfront__stage-status">STANDBY</span>
  </div>
);

const WarfrontVariation = ({
  canContinue,
  continueTarget,
  handlers
}: MainMenuVariationProps) => (
  <div className="menu-variant menu-variant--warfront">
    <MenuArt
      className="menu-art--warfront"
      definition={WARFRONT_DEFINITION}
    />
    <header className="warfront__header menu-reveal menu-reveal--one">
      <div className="warfront__broadcast">
        <span className="warfront__broadcast-dot" />
        <strong>FRONTLINE BROADCAST</strong>
        <span>ORBITAL DEFENSE NET / 07</span>
      </div>
      <div className="warfront__header-meta">
        <span>DEFCON / RED</span>
        <span>ALL CHANNELS LIVE</span>
      </div>
    </header>

    <main className="warfront__main">
      <section className="warfront__poster menu-reveal menu-reveal--two">
        <span className="warfront__poster-kicker">THIS IS NOT A DRILL</span>
        <div className="warfront__poster-rule" />
        <h1>
          DEFEND
          <span>ORBIT</span>
        </h1>
        <strong className="warfront__poster-number">07</strong>
        <p>
          The planet is burning below the line. You are the line. Make the
          next wave regret the distance.
        </p>
      </section>

      <section className="warfront__briefing menu-panel menu-reveal menu-reveal--three">
        <div className="warfront__briefing-heading">
          <div>
            <span>COMMAND BRIEFING / 04</span>
            <h2>MISSION ROSTER</h2>
          </div>
          <TargetGlyph />
        </div>
        <div className="warfront__stage-list">
          {STAGE_DEFINITIONS.map((stage) => (
            <WarfrontStageRow key={stage.id} stage={stage} />
          ))}
        </div>
        <div className="warfront__launch-actions">
          {canContinue ? (
            <ScreenButton
              autoFocus
              className="warfront__button warfront__button--continue"
              onClick={handlers.onContinue}
            >
              <span>
                <small>RESUME ASSAULT</small>
                <strong>{getContinueLabel(continueTarget)}</strong>
              </span>
              <ArrowUpRight className="size-5" />
            </ScreenButton>
          ) : null}
          <ScreenButton
            autoFocus={!canContinue}
            className="warfront__button warfront__button--primary"
            onClick={handlers.onPlay}
          >
            <span>
              <small>NEW DEPLOYMENT</small>
              <strong>START OFFENSIVE</strong>
            </span>
            <ChevronRight className="size-6" />
          </ScreenButton>
        </div>
      </section>
    </main>

    <footer className="warfront__footer menu-reveal menu-reveal--four">
      <div className="warfront__footer-actions">
        <ScreenButton onClick={handlers.onArchive}>
          <Archive className="size-4" />
          ARCHIVE
        </ScreenButton>
        <ScreenButton onClick={handlers.onQuit}>
          <LogOut className="size-4" />
          ABORT TO DESKTOP
        </ScreenButton>
      </div>
      <span>NO HEROES / ONLY THE NEXT DECISION</span>
    </footer>
  </div>
);

const TargetGlyph = () => (
  <div className="warfront__target-glyph" aria-hidden="true">
    <span />
    <span />
    <Crosshair className="size-8" />
  </div>
);

const TempleAction = ({
  children,
  icon,
  onClick,
  autoFocus,
  tone = "normal"
}: {
  children: ReactNode;
  icon: ReactNode;
  onClick: () => void;
  autoFocus?: boolean;
  tone?: "normal" | "primary";
}) => (
  <ScreenButton
    autoFocus={autoFocus}
    className={cn(
      "temple__action",
      tone === "primary" && "temple__action--primary"
    )}
    onClick={onClick}
  >
    <span className="temple__action-icon">{icon}</span>
    <span className="temple__action-label">{children}</span>
    <ArrowUpRight className="size-4" />
  </ScreenButton>
);

const TempleVariation = ({
  canContinue,
  continueTarget,
  handlers
}: MainMenuVariationProps) => (
  <div className="menu-variant menu-variant--temple">
    <MenuArt
      className="menu-art--temple"
      definition={TEMPLE_DEFINITION}
    />
    <header className="temple__header menu-reveal menu-reveal--one">
      <span>ASTRAL SYNTH / RITE 05</span>
      <span>THE TEMPLE IS OPEN</span>
    </header>

    <main className="temple__main">
      <div
        className="temple__halo"
        style={
          {
            "--menu-temple-pulse-duration": `${MENU_TEMPLE_PULSE_DURATION_MS}ms`
          } as MenuCssStyle
        }
        aria-hidden="true"
      >
        <span className="temple__halo-ring temple__halo-ring--outer" />
        <span className="temple__halo-ring temple__halo-ring--middle" />
        <span className="temple__halo-ring temple__halo-ring--inner" />
      </div>
      <section className="temple__title menu-reveal menu-reveal--two">
        <span className="temple__title-kicker">AERIAL LITURGY / 05</span>
        <h1>
          VOID
          <span>STRIKE</span>
        </h1>
        <p>Enter the chord. Hold the line. Return as something sharper.</p>
        <div className="temple__signature">
          <Sparkles className="size-4" />
          <span>THE LAST LIGHT HAS A FREQUENCY</span>
        </div>
      </section>

      <nav className="temple__actions menu-reveal menu-reveal--three" aria-label="Temple menu">
        {canContinue ? (
          <TempleAction
            autoFocus
            icon={<ArrowDownToLine className="size-4" />}
            onClick={handlers.onContinue}
            tone="primary"
          >
            <small>RETURN TO THE CHORD</small>
            <strong>{getContinueLabel(continueTarget)}</strong>
          </TempleAction>
        ) : null}
        <TempleAction
          autoFocus={!canContinue}
          icon={<CircleDot className="size-4" />}
          onClick={handlers.onPlay}
          tone={canContinue ? "normal" : "primary"}
        >
          <small>BEGIN DESCENT</small>
          <strong>PLAY THE NEXT WAVE</strong>
        </TempleAction>
        <TempleAction
          icon={<Archive className="size-4" />}
          onClick={handlers.onArchive}
        >
          <small>KEEP THE RECORD</small>
          <strong>ARCHIVE</strong>
        </TempleAction>
        <TempleAction icon={<LogOut className="size-4" />} onClick={handlers.onQuit}>
          <small>SEVER CONNECTION</small>
          <strong>QUIT</strong>
        </TempleAction>
      </nav>
    </main>

    <footer className="temple__footer menu-reveal menu-reveal--four">
      <span>◌</span>
      <span>QUIET SYSTEMS / BRIGHT WEAPONS / NO IDOLS</span>
      <span>◌</span>
    </footer>
  </div>
);

export const MainMenuVariation = ({
  variationId,
  onSelectVariation,
  ...props
}: MainMenuVariationFrameProps) => {
  const definition = getMenuVariationDefinition(variationId);

  useEffect(() => {
    document.title = `${GAME_TITLE} / ${definition.shortName}`;

    return () => {
      document.title = GAME_TITLE;
    };
  }, [definition.shortName]);

  return (
    <ScreenCenter
      className="menu-variation-screen"
      contentClassName="h-full w-full"
    >
      <div
        className={cn(
          "menu-variation-root",
          IS_MENU_DECK_ENABLED && "menu-variation-root--with-deck"
        )}
        data-menu-variation={definition.id}
        style={getThemeStyle(definition)}
      >
        {variationId === MENU_VARIATION_IDS.SPACEPORT ? (
          <SpaceportVariation {...props} />
        ) : null}
        {variationId === MENU_VARIATION_IDS.SALVAGE ? (
          <SalvageVariation {...props} />
        ) : null}
        {variationId === MENU_VARIATION_IDS.ANOMALY ? (
          <AnomalyVariation {...props} />
        ) : null}
        {variationId === MENU_VARIATION_IDS.WARFRONT ? (
          <WarfrontVariation {...props} />
        ) : null}
        {variationId === MENU_VARIATION_IDS.TEMPLE ? (
          <TempleVariation {...props} />
        ) : null}
        {IS_MENU_DECK_ENABLED ? (
          <MenuDeck
            onSelectVariation={onSelectVariation}
            variationId={variationId}
          />
        ) : null}
      </div>
    </ScreenCenter>
  );
};
