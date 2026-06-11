import { GameCanvas } from "@/components/game/GameCanvas";
import { GameHud } from "@/components/game/GameHud";
import { GameScreens } from "@/components/game/GameScreens";
import { GAME_SESSION_PHASES } from "@/game/state/game-session-state";
import { useGameUiStore } from "@/game/state/use-game-ui-store";

export const App = () => {
  const gamePhase = useGameUiStore((state) => state.gameSession.phase);
  const shouldShowHud =
    gamePhase === GAME_SESSION_PHASES.PLAYING ||
    gamePhase === GAME_SESSION_PHASES.PAUSED;

  return (
    <main className="relative h-screen w-screen overflow-hidden bg-black">
      <GameCanvas />
      {shouldShowHud ? <GameHud /> : null}
      <GameScreens />
    </main>
  );
};
