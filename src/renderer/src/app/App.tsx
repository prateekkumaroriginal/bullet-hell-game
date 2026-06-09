import { GameCanvas } from "@/components/game/GameCanvas";
import { GameHud } from "@/components/game/GameHud";

export const App = () => {
  return (
    <main className="relative h-screen w-screen overflow-hidden bg-black">
      <GameCanvas />
      <GameHud />
    </main>
  );
};
