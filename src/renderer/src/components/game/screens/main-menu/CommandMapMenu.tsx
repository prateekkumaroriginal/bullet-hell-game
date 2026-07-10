import {
  Archive,
  ChevronRight,
  Crosshair,
  LockKeyhole,
  Power,
  Radio,
  RotateCw,
  ShieldCheck,
  Target
} from "lucide-react";
import { GAME_TITLE } from "@/game/config/screen-ui-config";
import {
  getContinueStatus,
  MenuControl,
  MenuFrame
} from "./main-menu-primitives";
import type { MainMenuVariantProps } from "./main-menu-types";

export const CommandMapMenu = ({ actions }: MainMenuVariantProps) => {
  const continueStatus = getContinueStatus(actions.continueTarget);

  return (
    <MenuFrame ariaLabel="Militarized command map main menu" className="main-menu-frame--command">
      <header className="command-header">
        <div className="command-title-lockup">
          <div className="command-classification">
            <span className="command-classification-line" />
            <span>ORBITAL DEFENSE NETWORK // CLASSIFIED</span>
          </div>
          <h1>{GAME_TITLE}</h1>
          <span className="command-title-subtitle">TACTICAL FLIGHT COMMAND</span>
        </div>
        <div className="command-clock" aria-label="Command room status">
          <span>SECTOR 07 / NIGHT SIDE</span>
          <strong>03:17:26</strong>
          <span className="command-clock-status"><span className="command-status-dot" /> SECURE LINK</span>
        </div>
      </header>

      <div className="command-body">
        <section aria-label="Mission briefing" className="command-briefing-panel">
          <div className="command-panel-heading">
            <span>MISSION CONTROL</span>
            <span className="command-panel-heading-code">BRF-04</span>
          </div>
          <div className="command-alert-strip">
            <ShieldCheck className="size-4" />
            <span>ALL STATIONS REPORT // SORTIE WINDOW OPEN</span>
          </div>
          <div className="command-mission-name">
            <span>OPERATION</span>
            <strong>BLACKSTAR / FIRST CONTACT</strong>
          </div>
          <div className="command-route-map" aria-hidden="true">
            <div className="command-route-line command-route-line--main" />
            <div className="command-route-line command-route-line--branch" />
            <span className="command-route-point command-route-point--origin" />
            <span className="command-route-point command-route-point--mid" />
            <span className="command-route-point command-route-point--target" />
            <span className="command-route-label command-route-label--origin">HOME</span>
            <span className="command-route-label command-route-label--target">BLACKSTAR</span>
          </div>
          <div className="command-intel-grid">
            <div>
              <span>THREAT VECTOR</span>
              <strong>RED / RISING</strong>
            </div>
            <div>
              <span>ESCORT</span>
              <strong>NONE</strong>
            </div>
            <div>
              <span>RETURN PATH</span>
              <strong>UNMAPPED</strong>
            </div>
          </div>
        </section>

        <aside aria-label="Sector telemetry" className="command-telemetry-panel">
          <div className="command-radar" aria-hidden="true">
            <div className="command-radar-ring command-radar-ring--outer" />
            <div className="command-radar-ring command-radar-ring--inner" />
            <div className="command-radar-crosshair command-radar-crosshair--horizontal" />
            <div className="command-radar-crosshair command-radar-crosshair--vertical" />
            <span className="command-radar-sweep" />
            <span className="command-radar-blip command-radar-blip--one" />
            <span className="command-radar-blip command-radar-blip--two" />
            <span className="command-radar-blip command-radar-blip--three" />
          </div>
          <div className="command-telemetry-copy">
            <span>TACTICAL OVERVIEW</span>
            <strong>7 CONTACTS // 2 HOSTILE</strong>
            <p>Sector geometry is unstable. Launch before the route closes.</p>
          </div>
          <div className="command-telemetry-footer">
            <span><Radio className="size-3.5" /> LINKED</span>
            <span>MAP REV. 12</span>
          </div>
        </aside>

        <nav aria-label="Command orders" className="command-order-panel">
          <div className="command-order-heading">
            <span>ISSUE ORDER</span>
            <span>ARROW KEYS / ENTER</span>
          </div>
          {actions.continueTarget ? (
            <MenuControl
              actionId="continue"
              autoFocus
              className="command-order command-order--continue"
              onClick={actions.onContinue}
            >
              <span className="command-order-code">R-01</span>
              <span className="command-order-copy">
                <strong>RESUME SORTIE</strong>
                <small>{continueStatus.title} // {continueStatus.detail}</small>
              </span>
              <RotateCw className="command-order-icon" />
              <ChevronRight className="command-order-arrow" />
            </MenuControl>
          ) : null}
          <MenuControl
            actionId="play"
            autoFocus={!actions.continueTarget}
            className="command-order command-order--primary"
            onClick={actions.onPlay}
          >
            <span className="command-order-code">{actions.continueTarget ? "N-02" : "N-01"}</span>
            <span className="command-order-copy">
              <strong>START NEW SORTIE</strong>
              <small>SELECT A SECTOR AND DEPLOY THE FIGHTER</small>
            </span>
            <Target className="command-order-icon" />
            <ChevronRight className="command-order-arrow" />
          </MenuControl>
          <MenuControl
            actionId="archive"
            className="command-order"
            onClick={actions.onArchive}
          >
            <span className="command-order-code">{actions.continueTarget ? "A-03" : "A-02"}</span>
            <span className="command-order-copy">
              <strong>OPEN ARCHIVE</strong>
              <small>REVIEW KNOWN CONTACTS AND SYSTEMS</small>
            </span>
            <LockKeyhole className="command-order-icon" />
            <ChevronRight className="command-order-arrow" />
          </MenuControl>
          <MenuControl
            actionId="quit"
            className="command-order command-order--quit"
            onClick={actions.onQuit}
          >
            <span className="command-order-code">{actions.continueTarget ? "X-04" : "X-03"}</span>
            <span className="command-order-copy">
              <strong>DISENGAGE</strong>
              <small>TERMINATE COMMAND LINK</small>
            </span>
            <Power className="command-order-icon" />
            <ChevronRight className="command-order-arrow" />
          </MenuControl>
        </nav>
      </div>

      <footer className="command-footer">
        <span><Crosshair className="size-3.5" /> COMMANDER ACCESS: PILOT</span>
        <span>MISSION CLOCK RUNNING / AUTONOMOUS SYSTEMS STANDBY</span>
      </footer>
    </MenuFrame>
  );
};
