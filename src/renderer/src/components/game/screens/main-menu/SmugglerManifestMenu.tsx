import {
  Archive,
  ChevronRight,
  ClipboardList,
  KeyRound,
  PackageOpen,
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

export const SmugglerManifestMenu = ({ actions }: MainMenuVariantProps) => {
  const continueStatus = getContinueStatus(actions.continueTarget);

  return (
    <MenuFrame ariaLabel="Smuggler cargo manifest main menu" className="main-menu-frame--smuggler">
      <header className="smuggler-header">
        <div className="smuggler-brand">
          <span className="smuggler-brand-mark"><PackageOpen className="size-4" /> CARGO-9</span>
          <span className="smuggler-brand-copy">{GAME_TITLE} // PRIVATE FLIGHT RECORD</span>
        </div>
        <div className="smuggler-header-state">
          <span className="smuggler-state-dot" />
          <span>NO CUSTOMS LINK</span>
        </div>
      </header>

      <div className="smuggler-body">
        <section className="smuggler-cover" aria-label="Manifest cover">
          <div className="smuggler-stamp">UNREGISTERED / PRIORITY</div>
          <p className="smuggler-cover-kicker">CAPTAIN'S COPY // DO NOT DUPLICATE</p>
          <h1 className="smuggler-title">
            <span>CARGO</span>
            <span>MANIFEST</span>
          </h1>
          <p className="smuggler-cover-summary">
            Everything aboard is replaceable. The pilot is not.
          </p>
          <div className="smuggler-route-card">
            <div>
              <span>ORIGIN</span>
              <strong>DUST DOCK 09</strong>
            </div>
            <ChevronRight className="size-4" />
            <div>
              <span>DESTINATION</span>
              <strong>UNDECLARED</strong>
            </div>
          </div>
          <div className="smuggler-cover-footnote">
            <KeyRound className="size-4" />
            <span>HOLD THE LINE // NEVER INSPECT THE BLACK BOX</span>
          </div>
        </section>

        <aside aria-label="Ship inventory and menu" className="smuggler-ledger">
          <div className="smuggler-ledger-header">
            <div>
              <span>FLIGHT LEDGER</span>
              <strong>VS-017 / VOID STRIKE</strong>
            </div>
            <ClipboardList className="size-5" />
          </div>
          <div className="smuggler-ledger-rule" />
          <div className="smuggler-inventory" aria-label="Ship inventory">
            <div className="smuggler-inventory-heading">
              <span>INVENTORY</span>
              <span>WEIGHT</span>
            </div>
            <div className="smuggler-inventory-row">
              <span><span className="smuggler-inventory-bar smuggler-inventory-bar--full" /> REACTOR COILS</span>
              <strong>04.8</strong>
            </div>
            <div className="smuggler-inventory-row">
              <span><span className="smuggler-inventory-bar smuggler-inventory-bar--medium" /> PHASE DUST</span>
              <strong>01.6</strong>
            </div>
            <div className="smuggler-inventory-row smuggler-inventory-row--secret">
              <span><span className="smuggler-inventory-bar smuggler-inventory-bar--low" /> UNDECLARED</span>
              <strong>????</strong>
            </div>
          </div>
          <div className="smuggler-urgency">
            <Radio className="size-4" />
            <span>DOCKING WINDOW</span>
            <strong>00:47</strong>
          </div>

          <nav aria-label="Manifest actions" className="smuggler-action-list">
            {actions.continueTarget ? (
              <MenuControl
                actionId="continue"
                autoFocus
                className="smuggler-action smuggler-action--continue"
                onClick={actions.onContinue}
              >
                <span className="smuggler-action-code">A1</span>
                <span className="smuggler-action-copy">
                  <strong>RESUME RUN</strong>
                  <small>{continueStatus.title} / {continueStatus.detail}</small>
                </span>
                <RotateCw className="smuggler-action-icon" />
              </MenuControl>
            ) : null}
            <MenuControl
              actionId="play"
              autoFocus={!actions.continueTarget}
              className="smuggler-action smuggler-action--primary"
              onClick={actions.onPlay}
            >
              <span className="smuggler-action-code">{actions.continueTarget ? "B2" : "A1"}</span>
              <span className="smuggler-action-copy">
                <strong>NEW JOB</strong>
                <small>BOOK A CLEAN RUN / NO QUESTIONS</small>
              </span>
              <ChevronRight className="smuggler-action-icon" />
            </MenuControl>
            <MenuControl
              actionId="archive"
              className="smuggler-action"
              onClick={actions.onArchive}
            >
              <span className="smuggler-action-code">{actions.continueTarget ? "C3" : "B2"}</span>
              <span className="smuggler-action-copy">
                <strong>BLACK BOX</strong>
                <small>OPEN THE CAPTAIN'S ARCHIVE</small>
              </span>
              <Archive className="smuggler-action-icon" />
            </MenuControl>
            <MenuControl
              actionId="quit"
              className="smuggler-action smuggler-action--quiet"
              onClick={actions.onQuit}
            >
              <span className="smuggler-action-code">{actions.continueTarget ? "D4" : "C3"}</span>
              <span className="smuggler-action-copy">
                <strong>DROP OUT</strong>
                <small>CLOSE THE LEDGER</small>
              </span>
              <Power className="smuggler-action-icon" />
            </MenuControl>
          </nav>
          <div className="smuggler-ledger-footer">
            <span>PAYMENT: UNTRACEABLE</span>
            <span>SEAL: BROKEN</span>
          </div>
        </aside>
      </div>

      <footer className="smuggler-footer">
        <span>PRIVATEER LICENSE // VOID AFTER DELIVERY</span>
        <span>USE W / S OR ARROWS TO BROWSE</span>
      </footer>
    </MenuFrame>
  );
};
