import { useEffect, useRef } from "react";
import type Phaser from "phaser";
import { createGame } from "@/game/create-game";

export const GameCanvas = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const gameRef = useRef<Phaser.Game | null>(null);

  useEffect(() => {
    if (!containerRef.current || gameRef.current) {
      return;
    }

    gameRef.current = createGame(containerRef.current);

    return () => {
      gameRef.current?.destroy(true);
      gameRef.current = null;
    };
  }, []);

  return (
    <div
      className="h-full w-full overflow-hidden bg-black"
      ref={containerRef}
    />
  );
};
