import {
  Archive,
  ChevronRight,
  Gamepad2,
  Power,
  Radio,
  RotateCw
} from "lucide-react";
import { GAME_TITLE } from "@/game/config/screen-ui-config";
import {
  getContinueStatus,
  MenuControl,
  MenuFrame
} from "./main-menu-primitives";
import type { MainMenuVariantProps } from "./main-menu-types";

export const RetroArcadeMenu = ({ actions }: MainMenuVariantProps) => {
  const continueStatus = getContinueStatus(actions.continueTarget);

  return (
    <MenuFrame ariaLabel="Retro CRT arcade main menu" className="main-menu-frame--retro">
      <div aria-hidden="true" className="retro-attract-stripe" />
      <header className="retro-header">
        <div className="retro-brand-lockup">
          <div className="retro-brand-mark">
            <Gamepad2 className="size-5" />
            <span>VS / 88</span>
          </div>
          <span className="retro-kicker">{GAME_TITLE} // HYPERSPACE DIVISION</span>
          <h1 className="retro-title">
            <span>VOID</span>
            <span>STRIKE</span>
          </h1>
          <span className="retro-subtitle">THE LAST RUN IS ALWAYS THE LOUDEST</span>
        </div>

        <div className="retro-scoreboard" aria-label="Arcade status">
          <div className="retro-scoreboard-row">
            <span>HIGH SCORE</span>
            <strong>0088420</strong>
          </div>
          <div className="retro-scoreboard-row">
            <span>BEST PILOT</span>
            <strong>V. NULL</strong>
          </div>
          <div className="retro-scoreboard-row retro-scoreboard-row--active">
            <Radio className="size-3.5" />
            <span>LIVE FEED</span>
          </div>
        </div>
      </header>

      <div className="retro-main-grid">
        <section aria-label="Arcade attract mode" className="retro-demo-card">
          <div className="retro-demo-topline">
            <span className="retro-demo-dot" />
            <span>ATTRACT MODE</span>
            <span className="retro-demo-topline-spacer" />
            <span>DEMO 04</span>
          </div>
          <div className="retro-demo-graphic">
            <div className="retro-orbit retro-orbit--outer" />
            <div className="retro-orbit retro-orbit--inner" />
            <div className="retro-target">
              <span className="retro-target-core" />
            </div>
            <div className="retro-demo-signal retro-demo-signal--one" />
            <div className="retro-demo-signal retro-demo-signal--two" />
            <div className="retro-demo-copy">
              <span>INSERT<br />COURAGE</span>
              <strong>00:47</strong>
            </div>
          </div>
          <div className="retro-demo-footer">
            <span>PLAYER ONE // READY</span>
            <RotateCw className="size-4" />
            <span>LOOPING COMBAT REEL</span>
          </div>
        </section>

        <nav aria-label="Arcade actions" className="retro-action-deck">
          <div className="retro-action-heading">
            <span>SELECT YOUR RUN</span>
            <span>1P</span>
          </div>
          {actions.continueTarget ? (
            <MenuControl
              actionId="continue"
              autoFocus
              className="retro-action retro-action--continue"
              onClick={actions.onContinue}
            >
              <span className="retro-action-index">01</span>
              <span className="retro-action-copy">
                <strong>CONTINUE</strong>
                <small>{continueStatus.detail}</small>
              </span>
              <ChevronRight className="retro-action-arrow" />
            </MenuControl>
          ) : null}
          <MenuControl
            actionId="play"
            autoFocus={!actions.continueTarget}
            className="retro-action retro-action--primary"
            onClick={actions.onPlay}
          >
            <span className="retro-action-index">{actions.continueTarget ? "02" : "01"}</span>
            <span className="retro-action-copy">
              <strong>PLAY</strong>
              <small>START A FRESH SECTOR RUN</small>
            </span>
            <ChevronRight className="retro-action-arrow" />
          </MenuControl>
          <MenuControl
            actionId="archive"
            className="retro-action"
            onClick={actions.onArchive}
          >
            <span className="retro-action-index">{actions.continueTarget ? "03" : "02"}</span>
            <span className="retro-action-copy">
              <strong>ARCHIVE</strong>
              <small>VIEW ENEMY + SKILL RECORDS</small>
            </span>
            <Archive className="retro-action-arrow" />
          </MenuControl>
          <MenuControl
            actionId="quit"
            className="retro-action retro-action--quiet"
            onClick={actions.onQuit}
          >
            <span className="retro-action-index">{actions.continueTarget ? "04" : "03"}</span>
            <span className="retro-action-copy">
              <strong>QUIT</strong>
              <small>RETURN TO DESKTOP</small>
            </span>
            <Power className="retro-action-arrow" />
          </MenuControl>
        </nav>
      </div>

      <footer className="retro-footer">
        <span className="retro-footer-prompt"><span className="retro-footer-caret">&gt;</span> ENTER / SPACE TO LOCK</span>
        <span>BUILD 0.1 // CRT SIGNAL NOMINAL</span>
      </footer>
    </MenuFrame>
  );
};
