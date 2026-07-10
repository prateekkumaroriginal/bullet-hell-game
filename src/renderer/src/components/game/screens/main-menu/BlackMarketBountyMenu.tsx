import {
  ArrowUpRight,
  Crosshair,
  FileSearch,
  Play,
  Power,
  Skull,
  Terminal
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

export const BlackMarketBountyMenu = ({
  actions
}: {
  actions: MainMenuActions;
}) => (
  <MainMenuStage variant={MAIN_MENU_VARIANTS.BLACK_MARKET}>
    <MainMenuNavigation
      className="main-menu-black-market"
      label="Black-market bounty terminal menu"
    >
      <header className="black-market__header">
        <div>
          <span className="black-market__eyebrow">
            <Terminal aria-hidden="true" /> BROKER NODE 7 / UNLICENSED ACCESS
          </span>
          <h1 className="black-market__title">
            BOUNTY <span>EXCHANGE</span>
          </h1>
        </div>
        <div className="black-market__header-status">
          <MenuStatusLight label="MARKET LIVE" tone="danger" />
          <span>ENCRYPTION: BROKEN</span>
        </div>
      </header>

      <div className="black-market__body">
        <aside className="black-market__command-rail">
          <span className="black-market__rail-label">COMMANDS</span>
          <div className="black-market__rail-actions">
            {actions.canContinue && (
              <MainMenuActionButton
                autoFocus
                className="black-market__rail-action black-market__rail-action--continue"
                onClick={actions.onContinue}
              >
                <ArrowUpRight aria-hidden="true" />
                <span>REOPEN CONTRACT</span>
              </MainMenuActionButton>
            )}
            <MainMenuActionButton
              className="black-market__rail-action black-market__rail-action--archive"
              onClick={actions.onArchive}
            >
              <FileSearch aria-hidden="true" />
              <span>CASE FILES</span>
            </MainMenuActionButton>
            <MainMenuActionButton
              className="black-market__rail-action"
              onClick={actions.onQuit}
            >
              <Power aria-hidden="true" />
              <span>CLOSE TERMINAL</span>
            </MainMenuActionButton>
          </div>
          <div className="black-market__rail-note">
            <span>NO REFUNDS</span>
            <span>NO WITNESSES</span>
          </div>
        </aside>

        <article className="black-market__contract">
          <div className="black-market__contract-header">
            <div>
              <span className="black-market__contract-kicker">ACTIVE LISTING / 0001</span>
              <h2>NULL WRAITH</h2>
            </div>
            <span className="black-market__threat-stamp">HIGH RISK</span>
          </div>

          <div className="black-market__target-panel">
            <div className="black-market__target-visual" aria-hidden="true">
              <div className="black-market__target-scanline" />
              <Crosshair />
              <span>NO IMAGE</span>
            </div>
            <div className="black-market__target-data">
              <div>
                <span>ALIAS</span>
                <strong>NULL WRAITH</strong>
              </div>
              <div>
                <span>LAST SEEN</span>
                <strong>SECTOR 07-G</strong>
              </div>
              <div>
                <span>BOUNTY</span>
                <strong>CLASSIFIED</strong>
              </div>
              <div>
                <span>PAYMENT</span>
                <strong>ON CONFIRMATION</strong>
              </div>
            </div>
          </div>

          <div className="black-market__contract-terms">
            <div className="black-market__term-heading">
              <span>TERMINAL READOUT</span>
              <span>THREAT / SEVERE</span>
            </div>
            <p>
              The board is thin tonight. Take the cleanest contract, keep your
              comms dark, and leave nothing that can be traced back to this node.
            </p>
            <div className="black-market__threat-meter" aria-label="High threat">
              <span />
              <span />
              <span />
              <span />
              <span />
              <span />
            </div>
          </div>

          <MainMenuActionButton
            autoFocus={!actions.canContinue}
            className="black-market__deploy-button"
            onClick={actions.onPlay}
          >
            <Play aria-hidden="true" />
            <span>
              <small>OPEN THE BOARD / SELECT A TARGET</small>
              <strong>ACCEPT CONTRACT</strong>
            </span>
            <ArrowUpRight aria-hidden="true" />
          </MainMenuActionButton>
        </article>
      </div>

      <footer className="black-market__footer">
        <span>
          <Skull aria-hidden="true" /> ALL DEALS FINAL
        </span>
        <div className="black-market__key-hints">
          <MenuKeyHint label="move">↑ ↓</MenuKeyHint>
          <MenuKeyHint label="select">ENTER</MenuKeyHint>
          <MenuKeyHint label="disconnect">ESC</MenuKeyHint>
        </div>
        <span>SESSION ID / 7F-NULL</span>
      </footer>
    </MainMenuNavigation>
  </MainMenuStage>
);
