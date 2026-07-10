import {
  Archive,
  BadgeCheck,
  Check,
  ChevronRight,
  KeyRound,
  LockKeyhole,
  Play,
  Power,
  ShieldCheck
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

const CLEARANCE_STEPS = [
  ["IDENTITY", "VERIFIED"],
  ["CARGO", "DECLARED"],
  ["WEAPONS", "RESTRICTED"],
  ["TRANSIT", "AWAITING AUTHORIZATION"]
] as const;

export const OrbitalElevatorMenu = ({
  actions
}: {
  actions: MainMenuActions;
}) => (
  <MainMenuStage variant={MAIN_MENU_VARIANTS.ORBITAL_ELEVATOR}>
    <MainMenuNavigation
      className="main-menu-orbital-elevator"
      label="Orbital elevator clearance menu"
    >
      <header className="orbital-elevator__header">
        <div>
          <span className="orbital-elevator__eyebrow">
            <ShieldCheck aria-hidden="true" /> TRANSIT AUTHORITY / EARTH ORBIT
          </span>
          <h1>ACCESS CONTROL</h1>
        </div>
        <div className="orbital-elevator__header-status">
          <MenuStatusLight label="SECURITY LEVEL 04" tone="danger" />
          <span>GATE: NORTH SPINE</span>
        </div>
      </header>

      <main className="orbital-elevator__body">
        <aside className="orbital-elevator__clearance-seal">
          <div className="orbital-elevator__seal-ring">
            <KeyRound aria-hidden="true" />
            <span>04</span>
          </div>
          <span className="orbital-elevator__seal-label">ACCESS REQUEST</span>
          <strong>PENDING</strong>
          <span className="orbital-elevator__seal-note">ONE PILOT / ONE TRANSIT WINDOW</span>
        </aside>

        <section className="orbital-elevator__dossier">
          <div className="orbital-elevator__dossier-heading">
            <div>
              <span className="orbital-elevator__eyebrow">CLEARANCE DOSSIER / VS-01</span>
              <h2>VOID STRIKE</h2>
            </div>
            <BadgeCheck aria-hidden="true" />
          </div>

          <div className="orbital-elevator__identity-grid">
            <div>
              <span>OPERATOR</span>
              <strong>UNREGISTERED PILOT</strong>
            </div>
            <div>
              <span>DESTINATION</span>
              <strong>OUTER RIM</strong>
            </div>
            <div>
              <span>ACCESS CLASS</span>
              <strong>STRIKE / TEMPORARY</strong>
            </div>
            <div>
              <span>WINDOW</span>
              <strong>OPEN</strong>
            </div>
          </div>

          <div className="orbital-elevator__protocol">
            <div className="orbital-elevator__protocol-heading">
              <span>CLEARANCE PROTOCOL</span>
              <span>3 / 4 COMPLETE</span>
            </div>
            <div className="orbital-elevator__protocol-list">
              {CLEARANCE_STEPS.map(([label, value], index) => (
                <div className="orbital-elevator__protocol-row" key={label}>
                  <span className="orbital-elevator__protocol-index">0{index + 1}</span>
                  <span>{label}</span>
                  <strong data-state={value === "AWAITING AUTHORIZATION" ? "pending" : "complete"}>
                    {value === "AWAITING AUTHORIZATION" ? <LockKeyhole aria-hidden="true" /> : <Check aria-hidden="true" />}
                    {value}
                  </strong>
                </div>
              ))}
            </div>
          </div>

          <div className="orbital-elevator__actions">
            {actions.canContinue && (
              <MainMenuActionButton
                autoFocus
                className="orbital-elevator__action orbital-elevator__action--continue"
                onClick={actions.onContinue}
              >
                <Archive aria-hidden="true" />
                <span>RESUME CLEARED RUN</span>
                <ChevronRight aria-hidden="true" />
              </MainMenuActionButton>
            )}
            <MainMenuActionButton
              autoFocus={!actions.canContinue}
              className="orbital-elevator__action orbital-elevator__action--primary"
              onClick={actions.onPlay}
            >
              <Play aria-hidden="true" />
              <span>AUTHORIZE TRANSIT</span>
              <ChevronRight aria-hidden="true" />
            </MainMenuActionButton>
            <div className="orbital-elevator__secondary-actions">
              <MainMenuActionButton onClick={actions.onArchive}>
                <Archive aria-hidden="true" />
                <span>VIEW RECORDS</span>
              </MainMenuActionButton>
              <MainMenuActionButton onClick={actions.onQuit}>
                <Power aria-hidden="true" />
                <span>REVOKE SESSION</span>
              </MainMenuActionButton>
            </div>
          </div>
        </section>
      </main>

      <footer className="orbital-elevator__footer">
        <span>ALL TRANSIT IS MONITORED / NO EXCEPTIONS</span>
        <div className="orbital-elevator__key-hints">
          <MenuKeyHint label="move">↑ ↓</MenuKeyHint>
          <MenuKeyHint label="authorize">ENTER</MenuKeyHint>
          <MenuKeyHint label="deny">ESC</MenuKeyHint>
        </div>
      </footer>
    </MainMenuNavigation>
  </MainMenuStage>
);
