import { Skull } from "lucide-react";
import { getGameOverStats } from "@/game/config/screen-ui-config";
import { useGameUiStore } from "@/game/state/use-game-ui-store";
import { ResultScreen } from "./ResultScreen";

export const GameOverScreen = () => {
  const gameSession = useGameUiStore((state) => state.gameSession);

  return (
    <ResultScreen
      icon={<Skull className="size-20 fill-zinc-200 text-zinc-100" />}
      stats={getGameOverStats(gameSession.currentWave, gameSession.totalWaves)}
      subtitle={`YOU REACHED WAVE ${gameSession.currentWave}`}
      title="GAME OVER"
    />
  );
};
