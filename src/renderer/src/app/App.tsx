import { lazy, Suspense } from "react";
import { GameCanvas } from "@/components/game/GameCanvas";
import { GameHud } from "@/components/game/GameHud";
import { Popups } from "@/components/game/Popups";
import { GameScreens } from "@/components/game/GameScreens";
import { isDebugStatsEnabled } from "@/game/config/debug-config";
import {
  GAME_SESSION_PHASES,
  type GameSessionPhase,
} from "@/game/state/game-session-state";
import { useGameUiStore } from "@/game/state/use-game-ui-store";

const DebugBar = import.meta.env.DEV
  ? lazy(() =>
      import("@/components/game/DebugBar").then((module) => ({
        default: module.DebugBar,
      })),
    )
  : null;

const DEBUG_BAR_GAME_PHASES: readonly GameSessionPhase[] = [
  GAME_SESSION_PHASES.PLAYING,
  GAME_SESSION_PHASES.PAUSED,
  GAME_SESSION_PHASES.GAME_OVER,
];

const HUD_GAME_PHASES: readonly GameSessionPhase[] = [
  GAME_SESSION_PHASES.PLAYING,
  GAME_SESSION_PHASES.POPUP,
  GAME_SESSION_PHASES.PAUSED,
];

export const App = () => {
  const gamePhase = useGameUiStore((state) => state.gameSession.phase);
  const shouldShowHud = HUD_GAME_PHASES.includes(gamePhase);
  const shouldShowDebugBar = isDebugStatsEnabled() && DEBUG_BAR_GAME_PHASES.includes(gamePhase);

  return (
    <main className="relative h-screen w-screen overflow-hidden bg-black">
      <GameCanvas />
      {shouldShowHud ? <GameHud /> : null}
      {shouldShowDebugBar && DebugBar && (
        <Suspense fallback={null}>
          <DebugBar />
        </Suspense>
      )}
      <Popups />
      <GameScreens />
    </main>
  );
};
