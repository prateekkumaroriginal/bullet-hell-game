import {
  Archive,
  Check,
  ChevronRight,
  CircleDot,
  Dock,
  Gauge,
  Hammer,
  Play,
  Power,
  ShieldCheck,
  Wrench
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

const SHIPYARD_SYSTEMS = [
  ["HULL INTEGRITY", "CHECKED", Check],
  ["WEAPON MOUNTS", "CHECKED", ShieldCheck],
  ["DOCKING CLAMPS", "RELEASED", Dock],
  ["LAUNCH VECTOR", "PENDING", ChevronRight]
] as const;

export const NeonShipyardMenu = ({
  actions
}: {
  actions: MainMenuActions;
}) => (
  <MainMenuStage variant={MAIN_MENU_VARIANTS.SHIPYARD}>
    <MainMenuNavigation
      className="main-menu-shipyard"
      label="Neon shipyard launch bay menu"
    >
      <header className="shipyard__header">
        <div className="shipyard__bay-mark">
          <span className="shipyard__bay-number">04</span>
          <div>
            <span>ORBITAL SHIPYARD / EAST RING</span>
            <strong>NEON LAUNCH BAY</strong>
          </div>
        </div>
        <div className="shipyard__header-status">
          <MenuStatusLight label="BAY PRESSURIZED" />
          <span>SHIFT / NIGHT CREW</span>
        </div>
      </header>

      <main className="shipyard__body">
        <section className="shipyard__launch-panel">
          <div className="shipyard__launch-heading">
            <span className="shipyard__eyebrow">CRAFT STATUS / VS-01</span>
            <h1>READY TO LAUNCH</h1>
          </div>
          <div className="shipyard__readiness">
            <div className="shipyard__readiness-ring" aria-hidden="true">
              <span>96</span>
              <small>%</small>
            </div>
            <div>
              <span>BUILD COMPLETION</span>
              <strong>HARDPOINTS LOCKED</strong>
            </div>
          </div>
          <div className="shipyard__launch-rule" aria-hidden="true">
            <span />
          </div>
          <MainMenuActionButton
            autoFocus={!actions.canContinue}
            className="shipyard__launch-button"
            onClick={actions.onPlay}
          >
            <Play aria-hidden="true" />
            <span>
              <small>CONFIRM FLIGHT PLAN</small>
              <strong>RELEASE TO SORTIE</strong>
            </span>
            <ChevronRight aria-hidden="true" />
          </MainMenuActionButton>
          {actions.canContinue && (
            <MainMenuActionButton
              autoFocus
              className="shipyard__continue-button"
              onClick={actions.onContinue}
            >
              <CircleDot aria-hidden="true" />
              <span>RESUME IN-PROGRESS SORTIE</span>
            </MainMenuActionButton>
          )}
        </section>

        <section className="shipyard__systems-panel">
          <div className="shipyard__panel-heading">
            <span>SYSTEMS CHECK</span>
            <span>04 / 04</span>
          </div>
          <div className="shipyard__system-list">
            {SHIPYARD_SYSTEMS.map(([label, value, Icon]) => (
              <div className="shipyard__system-row" key={label}>
                <Icon aria-hidden="true" />
                <span>{label}</span>
                <strong data-state={value.toLowerCase()}>{value}</strong>
              </div>
            ))}
          </div>
          <div className="shipyard__crew-note">
            <Hammer aria-hidden="true" />
            <span>GROUND CREW HAS CLEARED YOUR DECK.</span>
          </div>
        </section>

        <aside className="shipyard__dock-panel">
          <div className="shipyard__dock-icon">
            <Wrench aria-hidden="true" />
          </div>
          <span className="shipyard__eyebrow">DOCK MANIFEST</span>
          <strong>VS-01 / VOID STRIKE</strong>
          <span>FRAME: LIGHT STRIKE CRAFT</span>
          <span>LOADOUT: STANDARD</span>
          <div className="shipyard__dock-metrics">
            <div>
              <Gauge aria-hidden="true" />
              <span>THRUST</span>
              <strong>72</strong>
            </div>
            <div>
              <ShieldCheck aria-hidden="true" />
              <span>HULL</span>
              <strong>100</strong>
            </div>
          </div>
        </aside>
      </main>

      <footer className="shipyard__footer">
        <div className="shipyard__footer-actions">
          <MainMenuActionButton onClick={actions.onArchive}>
            <Archive aria-hidden="true" />
            <span>SHIPYARD LOG</span>
          </MainMenuActionButton>
          <MainMenuActionButton onClick={actions.onQuit}>
            <Power aria-hidden="true" />
            <span>CLOSE BAY</span>
          </MainMenuActionButton>
        </div>
        <div className="shipyard__key-hints">
          <MenuKeyHint label="select">ENTER</MenuKeyHint>
          <MenuKeyHint label="back">ESC</MenuKeyHint>
        </div>
      </footer>
    </MainMenuNavigation>
  </MainMenuStage>
);
