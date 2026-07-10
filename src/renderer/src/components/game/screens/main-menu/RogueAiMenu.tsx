import {
  Archive,
  ChevronRight,
  Cpu,
  KeyRound,
  Power,
  RotateCw,
  ShieldAlert,
  Terminal,
  Zap
} from "lucide-react";
import { GAME_TITLE } from "@/game/config/screen-ui-config";
import {
  getContinueStatus,
  MenuControl,
  MenuFrame
} from "./main-menu-primitives";
import type { MainMenuVariantProps } from "./main-menu-types";

export const RogueAiMenu = ({ actions }: MainMenuVariantProps) => {
  const continueStatus = getContinueStatus(actions.continueTarget);

  return (
    <MenuFrame ariaLabel="Rogue AI breach terminal main menu" className="main-menu-frame--rogue">
      <header className="rogue-header">
        <div className="rogue-header-brand">
          <span className="rogue-header-mark"><Cpu className="size-4" /> {GAME_TITLE}</span>
          <span className="rogue-header-copy">KERNEL SHELL // RECOVERY CONSOLE</span>
        </div>
        <div className="rogue-breach-status" aria-live="polite">
          <span className="rogue-breach-dot" />
          <span>BREACH CONTAINED / FOR NOW</span>
        </div>
      </header>

      <div className="rogue-body">
        <section className="rogue-terminal" aria-label="Security terminal">
          <div className="rogue-terminal-topline">
            <span><Terminal className="size-4" /> NULL//TERMINAL</span>
            <span>TTY-07 / ENCRYPTED</span>
          </div>
          <div className="rogue-terminal-screen" role="log" aria-live="polite">
            <p><span className="rogue-log-dim">[03:17:24]</span> boot sequence resumed...</p>
            <p><span className="rogue-log-dim">[03:17:25]</span> pilot handshake <span className="rogue-log-green">accepted</span></p>
            <p><span className="rogue-log-dim">[03:17:26]</span> unauthorized process <span className="rogue-log-red">WATCHING</span></p>
            <p className="rogue-log-rule">----------------------------------------</p>
            <p className="rogue-log-cyan">VOID STRIKE // MAIN MENU PROTOCOLS</p>
            <p className="rogue-log-prompt"><span>&gt;</span> choose an exit from the breach<span className="rogue-caret" aria-hidden="true" /></p>
          </div>

          <nav aria-label="Terminal commands" className="rogue-command-list">
            {actions.continueTarget ? (
              <MenuControl
                actionId="continue"
                autoFocus
                className="rogue-command rogue-command--continue"
                onClick={actions.onContinue}
              >
                <span className="rogue-command-number">01</span>
                <span className="rogue-command-copy">
                  <code>resume.run()</code>
                  <small>{continueStatus.title} // {continueStatus.detail}</small>
                </span>
                <RotateCw className="rogue-command-icon" />
                <ChevronRight className="rogue-command-arrow" />
              </MenuControl>
            ) : null}
            <MenuControl
              actionId="play"
              autoFocus={!actions.continueTarget}
              className="rogue-command rogue-command--primary"
              onClick={actions.onPlay}
            >
              <span className="rogue-command-number">{actions.continueTarget ? "02" : "01"}</span>
              <span className="rogue-command-copy">
                <code>start.newRun()</code>
                <small>select a fresh sector</small>
              </span>
              <Zap className="rogue-command-icon" />
              <ChevronRight className="rogue-command-arrow" />
            </MenuControl>
            <MenuControl
              actionId="archive"
              className="rogue-command"
              onClick={actions.onArchive}
            >
              <span className="rogue-command-number">{actions.continueTarget ? "03" : "02"}</span>
              <span className="rogue-command-copy">
                <code>open.archive()</code>
                <small>read recovered intelligence</small>
              </span>
              <Archive className="rogue-command-icon" />
              <ChevronRight className="rogue-command-arrow" />
            </MenuControl>
            <MenuControl
              actionId="quit"
              className="rogue-command rogue-command--quiet"
              onClick={actions.onQuit}
            >
              <span className="rogue-command-number">{actions.continueTarget ? "04" : "03"}</span>
              <span className="rogue-command-copy">
                <code>process.exit(0)</code>
                <small>disconnect from the console</small>
              </span>
              <Power className="rogue-command-icon" />
              <ChevronRight className="rogue-command-arrow" />
            </MenuControl>
          </nav>

          <div className="rogue-terminal-footer">
            <span><KeyRound className="size-3.5" /> ENTER EXECUTES</span>
            <span>W / S NAVIGATES</span>
          </div>
        </section>

        <aside className="rogue-status-column" aria-label="Intrusion telemetry">
          <div className="rogue-status-card rogue-status-card--alert">
            <ShieldAlert className="size-5" />
            <span>SECURITY EVENT</span>
            <strong>AI HANDSHAKE<br />REJECTED</strong>
            <small>It knows this terminal is alive.</small>
          </div>
          <div className="rogue-status-card">
            <span>INTEGRITY</span>
            <strong>92.04%</strong>
            <div className="rogue-integrity-bar"><span /></div>
            <small>One breach is acceptable. Two is a pattern.</small>
          </div>
          <div className="rogue-status-card rogue-status-card--code">
            <span>SESSION KEY</span>
            <strong>8F / NULL / 17</strong>
            <small>Local shell only / no uplink</small>
          </div>
        </aside>
      </div>

      <footer className="rogue-footer">
        <span>AI DISCLAIMER: THE TERMINAL IS NOT YOUR FRIEND</span>
        <span>ESC CLOSES ACTIVE MENUS</span>
      </footer>
    </MenuFrame>
  );
};
