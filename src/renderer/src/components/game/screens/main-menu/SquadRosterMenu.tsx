import {
  Archive,
  ChevronRight,
  Crosshair,
  Radio,
  RotateCw,
  ScanLine,
  Shield,
  Sparkles,
  Unplug
} from "lucide-react";
import { GAME_TITLE } from "@/game/config/screen-ui-config";
import {
  getContinueStatus,
  MenuControl,
  MenuFrame
} from "./main-menu-primitives";
import type { MainMenuVariantProps } from "./main-menu-types";

const SQUAD_ROSTER = [
  {
    callsign: "KITE",
    role: "VECTOR PILOT",
    status: "FLIGHT READY",
    tone: "cyan"
  },
  {
    callsign: "MORROW",
    role: "SYSTEMS / GUNNER",
    status: "REMOTE LINK",
    tone: "blue"
  },
  {
    callsign: "ION",
    role: "SIGNAL / EYE",
    status: "STANDBY",
    tone: "violet"
  }
] as const;

export const SquadRosterMenu = ({ actions }: MainMenuVariantProps) => {
  const continueStatus = getContinueStatus(actions.continueTarget);

  return (
    <MenuFrame ariaLabel="Holographic squad roster main menu" className="main-menu-frame--squad">
      <header className="squad-header">
        <div className="squad-header-brand">
          <span className="squad-header-mark"><Crosshair className="size-4" /> {GAME_TITLE}</span>
          <span className="squad-header-copy">SQUADRON BRIEFING // LAUNCH BAY 03</span>
        </div>
        <div className="squad-header-status">
          <Radio className="size-4" />
          <span>BRIEFING 04 / LINK STABLE</span>
        </div>
      </header>

      <div className="squad-body">
        <section className="squad-briefing" aria-label="Squad briefing">
          <span className="squad-kicker">ROSTER // ONE SHIP / NO BACKUP</span>
          <h1 className="squad-title">
            <span>ONE SHIP.</span>
            <span>NO BACKUP.</span>
          </h1>
          <p className="squad-summary">
            Three names on the glass. One flight line in the dark. Choose the run, then make the room remember you.
          </p>

          <div className="squad-roster-list" aria-label="Squad roster">
            {SQUAD_ROSTER.map((pilot, index) => (
              <div className={`squad-roster-card squad-roster-card--${pilot.tone}`} key={pilot.callsign}>
                <span className="squad-roster-number">0{index + 1}</span>
                <span className="squad-roster-avatar" aria-hidden="true">
                  <span />
                </span>
                <span className="squad-roster-copy">
                  <strong>{pilot.callsign}</strong>
                  <small>{pilot.role}</small>
                </span>
                <span className="squad-roster-status">{pilot.status}</span>
              </div>
            ))}
          </div>

          <div className="squad-briefing-note">
            <Shield className="size-4" />
            <span>FORMATION LOCKED // PILOT AUTHORITY REQUIRED</span>
          </div>

          <nav aria-label="Squad actions" className="squad-action-panel">
            {actions.continueTarget ? (
              <MenuControl
                actionId="continue"
                autoFocus
                className="squad-action squad-action--continue"
                onClick={actions.onContinue}
              >
                <span className="squad-action-copy">
                  <small>RECONNECT LINK</small>
                  <strong>RESUME {continueStatus.title}</strong>
                  <span>{continueStatus.detail}</span>
                </span>
                <RotateCw className="squad-action-icon" />
              </MenuControl>
            ) : null}
            <MenuControl
              actionId="play"
              autoFocus={!actions.continueTarget}
              className="squad-action squad-action--primary"
              onClick={actions.onPlay}
            >
              <span className="squad-action-copy">
                <small>AUTHORIZE FLIGHT</small>
                <strong>DEPLOY THE SQUAD</strong>
                <span>Choose a sector and enter the dark</span>
              </span>
              <ChevronRight className="squad-action-icon" />
            </MenuControl>
            <div className="squad-action-row">
              <MenuControl
                actionId="archive"
                className="squad-action squad-action--small"
                onClick={actions.onArchive}
              >
                <Archive className="size-4" />
                <span>ARCHIVE</span>
              </MenuControl>
              <MenuControl
                actionId="quit"
                className="squad-action squad-action--small squad-action--quiet"
                onClick={actions.onQuit}
              >
                <Unplug className="size-4" />
                <span>SEVER LINK</span>
              </MenuControl>
            </div>
          </nav>
        </section>

        <section className="squad-hologram" aria-label="Holographic squad hangar">
          <div className="squad-hologram-header">
            <span><ScanLine className="size-4" /> LIVE HOLOGRAPH</span>
            <span>HGR-03</span>
          </div>
          <div className="squad-hologram-wash" aria-hidden="true" />
          <div className="squad-hologram-scan" aria-hidden="true" />
          <div className="squad-hologram-caption">
            <span>THE LINEUP</span>
            <strong>STRIKE WING / NULL SECTOR</strong>
          </div>
          <div className="squad-hologram-footer">
            <span><Sparkles className="size-3.5" /> LIGHT-FIELD CALIBRATED</span>
            <span>FACES ARE OPTIONAL / COURAGE IS NOT</span>
          </div>
        </section>
      </div>

      <footer className="squad-footer">
        <span>ACCESSIBILITY: TAB TO MOVE / ENTER TO CONFIRM</span>
        <span>HANGAR AIR // 22.4%</span>
      </footer>
    </MenuFrame>
  );
};
