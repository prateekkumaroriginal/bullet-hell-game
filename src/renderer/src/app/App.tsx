import { GameCanvas } from "@/components/game/GameCanvas";

export const App = () => {
  return (
    <main className="h-screen w-screen overflow-hidden bg-black">
      <GameCanvas />
    </main>
  );
};
