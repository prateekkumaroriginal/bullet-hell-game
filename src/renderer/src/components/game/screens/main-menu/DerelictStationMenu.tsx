import {
  Archive,
  AudioLines,
  CircleAlert,
  FileSearch,
  Power,
  Radio,
  ScanLine
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

const DISTRESS_WAVEFORM = ["short", "tall", "medium", "short", "tall", "long", "medium", "short"] as const;

export const DerelictStationMenu = ({
  actions
}: {
  actions: MainMenuActions;
}) => (
  <MainMenuStage variant={MAIN_MENU_VARIANTS.DERELICT_STATION}>
    <MainMenuNavigation
      className="main-menu-derelict-station"
      label="Derelict station distress broadcast menu"
    >
      <header className="derelict-station__header">
        <div className="derelict-station__signal-id">
          <span className="derelict-station__signal-mark">
            <Radio aria-hidden="true" />
          </span>
          <div>
            <span>VOID STRIKE / RECEIVER 09</span>
            <strong>INCOMING TRANSMISSION</strong>
          </div>
        </div>
        <div className="derelict-station__header-status">
          <MenuStatusLight label="SIGNAL UNSTABLE" tone="danger" />
          <span>ORIGIN: UNKNOWN</span>
        </div>
      </header>

      <main className="derelict-station__body">
        <div className="derelict-station__broadcast-line" aria-hidden="true" />
        <section className="derelict-station__broadcast-window">
          <div className="derelict-station__broadcast-copy">
            <div className="derelict-station__broadcast-meta">
              <span>CHANNEL 09 / DECRYPTED</span>
              <span>00:17:42:08</span>
            </div>
            <span className="derelict-station__broadcast-label">DISTRESS BEACON</span>
            <blockquote>
              “If this reaches anyone, do not answer. The station is not empty.”
            </blockquote>
            <p>
              A dead relay has been repeating the same fragment for six hours.
              Trace the signal before the dark side of the ring turns it off.
            </p>
            <div className="derelict-station__broadcast-source">
              <CircleAlert aria-hidden="true" />
              <span>TRANSMISSION ORIGIN / DERELICT STATION K-19</span>
            </div>
          </div>

          <div className="derelict-station__signal-column">
            <div className="derelict-station__signal-icon">
              <AudioLines aria-hidden="true" />
            </div>
            <div className="derelict-station__waveform" aria-hidden="true">
              {DISTRESS_WAVEFORM.map((height, index) => (
                <span
                  className={`derelict-station__waveform-bar derelict-station__waveform-bar--${height}`}
                  key={`${height}-${index}`}
                />
              ))}
            </div>
            <span className="derelict-station__signal-caption">LISTENING</span>
            <span className="derelict-station__signal-code">R-09 / 441.7</span>
          </div>
        </section>

        <div className="derelict-station__actions">
          {actions.canContinue && (
            <MainMenuActionButton
              autoFocus
              className="derelict-station__action derelict-station__action--continue"
              onClick={actions.onContinue}
            >
              <ScanLine aria-hidden="true" />
              <span>
                <small>RETURN TO LAST SIGNAL</small>
                <strong>RECONNECT</strong>
              </span>
            </MainMenuActionButton>
          )}
          <MainMenuActionButton
            autoFocus={!actions.canContinue}
            className="derelict-station__action derelict-station__action--primary"
            onClick={actions.onPlay}
          >
            <Radio aria-hidden="true" />
            <span>
              <small>FOLLOW THE TRANSMISSION</small>
              <strong>TRACE SIGNAL</strong>
            </span>
          </MainMenuActionButton>
          <MainMenuActionButton
            className="derelict-station__action"
            onClick={actions.onArchive}
          >
            <FileSearch aria-hidden="true" />
            <span>
              <small>REVIEW RECOVERED DATA</small>
              <strong>EVIDENCE LOG</strong>
            </span>
          </MainMenuActionButton>
          <MainMenuActionButton
            className="derelict-station__action"
            onClick={actions.onQuit}
          >
            <Power aria-hidden="true" />
            <span>
              <small>END RECEIVER SESSION</small>
              <strong>CUT FEED</strong>
            </span>
          </MainMenuActionButton>
        </div>
      </main>

      <footer className="derelict-station__footer">
        <span>
          <Archive aria-hidden="true" /> INCIDENT FILE / UNVERIFIED
        </span>
        <div className="derelict-station__key-hints">
          <MenuKeyHint label="move">← →</MenuKeyHint>
          <MenuKeyHint label="listen">ENTER</MenuKeyHint>
          <MenuKeyHint label="abort">ESC</MenuKeyHint>
        </div>
      </footer>
    </MainMenuNavigation>
  </MainMenuStage>
);
