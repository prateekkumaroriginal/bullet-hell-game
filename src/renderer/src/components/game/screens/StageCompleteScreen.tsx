import { Trophy } from "lucide-react";
import { getStageCompleteStats } from "@/game/config/screen-ui-config";
import { useGameUiStore } from "@/game/state/use-game-ui-store";
import { ResultScreen } from "./ResultScreen";

export const StageCompleteScreen = () => {
  const totalWaves = useGameUiStore((state) => state.gameSession.totalWaves);

  return (
    <ResultScreen
      icon={<Trophy className="size-20 fill-zinc-200 text-zinc-100" />}
      stats={getStageCompleteStats(totalWaves)}
      subtitle="ALL WAVES CLEARED"
      title="STAGE COMPLETE"
    />
  );
};
