import { Skull } from "lucide-react";
import { GAME_OVER_STATS } from "@/game/config/screen-ui-config";
import { useGameUiStore } from "@/game/state/use-game-ui-store";
import { ResultScreen } from "./ResultScreen";

export const GameOverScreen = () => {
  const wave = useGameUiStore((state) => state.wave);

  return (
    <ResultScreen
      icon={<Skull className="size-20 fill-zinc-200 text-zinc-100" />}
      stats={GAME_OVER_STATS}
      subtitle={`YOU SURVIVED WAVE ${wave.current}`}
      title="GAME OVER"
    />
  );
};
