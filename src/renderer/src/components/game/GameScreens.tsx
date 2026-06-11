import { useEffect } from "react";
import {
  emitGameplayCommand,
  GAMEPLAY_COMMANDS,
} from "@/game/events/gameplay-commands";
import {
  GAME_SESSION_PHASES,
  type GameSessionPhase,
} from "@/game/state/game-session-state";
import { useGameUiStore } from "@/game/state/use-game-ui-store";
import {
  OVERLAY_SCREENS,
  type OverlayScreen,
  SCREEN_COMPONENTS,
} from "./screens/screen-registry";

const SESSION_PHASE_SCREEN_MAP = {
  [GAME_SESSION_PHASES.IDLE]: OVERLAY_SCREENS.MAIN,
  [GAME_SESSION_PHASES.PLAYING]: OVERLAY_SCREENS.MAIN,
  [GAME_SESSION_PHASES.PAUSED]: OVERLAY_SCREENS.PAUSE,
  [GAME_SESSION_PHASES.GAME_OVER]: OVERLAY_SCREENS.GAME_OVER,
  [GAME_SESSION_PHASES.STAGE_COMPLETE]: OVERLAY_SCREENS.STAGE_COMPLETE,
} satisfies Record<GameSessionPhase, OverlayScreen>;

const ScreenBackdrop = () => (
  <div className="pointer-events-none absolute inset-0 border border-zinc-600/50 bg-[radial-gradient(circle_at_50%_42%,rgba(185,198,210,0.12),transparent_34%),linear-gradient(rgba(10,14,17,0.82),rgba(3,5,7,0.94))]">
    <div className="absolute inset-0 bg-[linear-gradient(rgba(160,180,190,0.075)_1px,transparent_1px),linear-gradient(90deg,rgba(160,180,190,0.075)_1px,transparent_1px)] bg-[size:42px_42px]" />
    <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:168px_168px]" />
    <div className="absolute inset-0 shadow-[inset_0_0_140px_rgba(0,0,0,0.92)]" />
  </div>
);

export const GameScreens = () => {
  const gamePhase = useGameUiStore((state) => state.gameSession.phase);
  const activeScreen = SESSION_PHASE_SCREEN_MAP[gamePhase];

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") {
        return;
      }

      if (gamePhase === GAME_SESSION_PHASES.PLAYING) {
        emitGameplayCommand(GAMEPLAY_COMMANDS.PAUSE_GAME, undefined);
        return;
      }

      if (gamePhase === GAME_SESSION_PHASES.PAUSED) {
        emitGameplayCommand(GAMEPLAY_COMMANDS.RESUME_GAME, undefined);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [gamePhase]);

  if (gamePhase === GAME_SESSION_PHASES.PLAYING) {
    return null;
  }

  const ActiveScreen = SCREEN_COMPONENTS[activeScreen];

  return (
    <div className="absolute inset-0 z-20 overflow-hidden text-zinc-100">
      <ScreenBackdrop />
      <ActiveScreen />
    </div>
  );
};
