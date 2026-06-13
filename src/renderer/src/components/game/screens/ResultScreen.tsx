import { RotateCcw } from "lucide-react";
import type { ReactNode } from "react";
import {
  emitGameplayCommand,
  GAMEPLAY_COMMANDS,
} from "@/game/events/gameplay-commands";
import {
  ScreenButton,
  ScreenCenter,
  ScreenTitle,
} from "./ScreenPrimitives";

type ResultScreenProps = {
  actions?: ReactNode;
  icon: ReactNode;
  stats: readonly (readonly [string, string])[];
  subtitle: string;
  title: string;
};

export const ResultScreen = ({
  actions,
  icon,
  stats,
  subtitle,
  title,
}: ResultScreenProps) => (
  <ScreenCenter>
    <ScreenTitle className="mb-6 text-6xl max-md:text-4xl">
      {title}
    </ScreenTitle>
    <div className="mb-4 grid place-items-center text-zinc-100 drop-shadow-[0_0_22px_rgba(225,235,245,0.74)]">
      {icon}
    </div>
    <p className="mb-5 text-center text-2xl font-black tracking-[0.14em] text-zinc-200 max-md:text-lg">
      {subtitle}
    </p>
    <div className="mb-5 w-[min(32rem,calc(100vw-3rem))] border border-zinc-500/35 bg-zinc-950/42 p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]">
      {stats.map(([label, value]) => (
        <div
          className="flex items-center justify-between gap-8 border-b border-zinc-500/20 py-3 last:border-b-0"
          key={label}
        >
          <span className="font-bold tracking-[0.12em] text-zinc-200">
            {label}
          </span>
          <span
            className="min-w-28 border-l border-zinc-500/28 pl-8 text-right font-mono text-2xl text-zinc-100"
          >
            {value}
          </span>
        </div>
      ))}
    </div>
    {actions ?? (
      <div className="grid w-[min(40rem,calc(100vw-3rem))] grid-cols-2 gap-5 max-md:grid-cols-1">
        <ScreenButton
          onClick={() => {
            emitGameplayCommand(GAMEPLAY_COMMANDS.RESTART_GAME, undefined);
          }}
        >
          <RotateCcw className="mr-3 size-5" />
          RESTART
        </ScreenButton>
        <ScreenButton
          onClick={() => {
            emitGameplayCommand(GAMEPLAY_COMMANDS.RETURN_TO_MENU, undefined);
          }}
        >
          MAIN MENU
        </ScreenButton>
      </div>
    )}
  </ScreenCenter>
);
