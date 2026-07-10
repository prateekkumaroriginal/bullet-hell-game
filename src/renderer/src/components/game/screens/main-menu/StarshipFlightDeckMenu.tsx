import {
  Activity,
  Archive,
  Crosshair,
  Gauge,
  Orbit,
  Play,
  Power,
  Radio,
  ShieldCheck,
  Target
} from "lucide-react";
import { MAIN_MENU_VARIANTS } from "@/game/config/main-menu-config";
import type { MainMenuActions } from "./main-menu-types";
import {
  MainMenuActionButton,
  MainMenuNavigation,
  MainMenuStage,
  MenuKeyHint,
  MenuStatusLight
} from "./MainMenuPrimitives";

export const StarshipFlightDeckMenu = ({
  actions
}: {
  actions: MainMenuActions;
}) => (
  <MainMenuStage variant={MAIN_MENU_VARIANTS.FLIGHT_DECK}>
    <MainMenuNavigation
      className="main-menu-flight-deck"
      label="Starship flight deck menu"
    >
      <header className="flight-deck__header">
        <div className="flight-deck__masthead">
          <span className="flight-deck__eyebrow">
            <Radio aria-hidden="true" /> FLIGHT DECK / PRE-FLIGHT
          </span>
          <h1 className="flight-deck__title">
            <span>VOID</span>
            <span className="flight-deck__title-accent">STRIKE</span>
          </h1>
        </div>

        <div className="flight-deck__header-readout">
          <MenuStatusLight label="COCKPIT ONLINE" />
          <span>LOCAL TIME 23:41:08</span>
          <span>VECTOR / OUTER RIM</span>
        </div>
      </header>

      <div className="flight-deck__body">
        <aside className="flight-deck__instrument flight-deck__instrument--left">
          <span className="flight-deck__instrument-label">AIRFRAME</span>
          <strong className="flight-deck__airframe">VS-01</strong>
          <span className="flight-deck__instrument-note">PILOTED STRIKE CRAFT</span>

          <div className="flight-deck__readout-list">
            <div>
              <span>HULL</span>
              <strong>100%</strong>
            </div>
            <div>
              <span>REACTOR</span>
              <strong>NOMINAL</strong>
            </div>
            <div>
              <span>ORDNANCE</span>
              <strong>READY</strong>
            </div>
          </div>

          <div className="flight-deck__radar" aria-hidden="true">
            <div className="flight-deck__radar-ring flight-deck__radar-ring--outer" />
            <div className="flight-deck__radar-ring flight-deck__radar-ring--inner" />
            <span className="flight-deck__radar-sweep" />
            <span className="flight-deck__radar-blip flight-deck__radar-blip--one" />
            <span className="flight-deck__radar-blip flight-deck__radar-blip--two" />
            <Crosshair className="flight-deck__radar-crosshair" />
          </div>
        </aside>

        <section className="flight-deck__console">
          <div className="flight-deck__console-heading">
            <div>
              <span className="flight-deck__console-kicker">MISSION CONTROL</span>
              <h2>SELECT FLIGHT PATH</h2>
            </div>
            <span className="flight-deck__console-code">NODE 7 / MANUAL</span>
          </div>

          <div className="flight-deck__command-grid">
            {actions.canContinue && (
              <MainMenuActionButton
                autoFocus
                className="flight-deck__command flight-deck__command--continue"
                onClick={actions.onContinue}
              >
                <Activity aria-hidden="true" />
                <span>
                  <small>RESUME LAST FLIGHT</small>
                  <strong>CONTINUE</strong>
                </span>
                <span className="flight-deck__command-arrow">↗</span>
              </MainMenuActionButton>
            )}

            <MainMenuActionButton
              autoFocus={!actions.canContinue}
              className="flight-deck__command flight-deck__command--primary"
              onClick={actions.onPlay}
            >
              <Play aria-hidden="true" />
              <span>
                <small>NEW MISSION VECTOR</small>
                <strong>SCRAMBLE</strong>
              </span>
              <span className="flight-deck__command-arrow">↗</span>
            </MainMenuActionButton>
          </div>

          <div className="flight-deck__secondary-actions">
            <MainMenuActionButton
              className="flight-deck__secondary-action"
              onClick={actions.onArchive}
            >
              <Archive aria-hidden="true" />
              <span>SHIP LOG</span>
            </MainMenuActionButton>
            <MainMenuActionButton
              className="flight-deck__secondary-action"
              onClick={actions.onQuit}
            >
              <Power aria-hidden="true" />
              <span>POWER DOWN</span>
            </MainMenuActionButton>
          </div>
        </section>

        <aside className="flight-deck__instrument flight-deck__instrument--right">
          <div className="flight-deck__instrument-icon">
            <Orbit aria-hidden="true" />
          </div>
          <span className="flight-deck__instrument-label">NAVIGATION LOCK</span>
          <strong>OUTER RIM</strong>
          <span className="flight-deck__instrument-note">12.4 AU / CLEAR LANE</span>

          <div className="flight-deck__telemetry">
            <div>
              <Gauge aria-hidden="true" />
              <span>THRUST</span>
              <strong>72%</strong>
            </div>
            <div>
              <ShieldCheck aria-hidden="true" />
              <span>SHIELD</span>
              <strong>ARMED</strong>
            </div>
            <div>
              <Target aria-hidden="true" />
              <span>LOCK</span>
              <strong>STANDBY</strong>
            </div>
          </div>
        </aside>
      </div>

      <footer className="flight-deck__footer">
        <span>VOID STRIKE / PILOT CONSOLE</span>
        <div className="flight-deck__key-hints">
          <MenuKeyHint label="navigate">WASD</MenuKeyHint>
          <MenuKeyHint label="confirm">ENTER</MenuKeyHint>
          <MenuKeyHint label="exit">ESC</MenuKeyHint>
        </div>
      </footer>
    </MainMenuNavigation>
  </MainMenuStage>
);
