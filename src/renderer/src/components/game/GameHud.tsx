import type { CSSProperties } from "react";
import { Crosshair, Heart } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { useGameUiState } from "@/game/state/use-game-ui-state";

const HEALTH_PERCENT_MULTIPLIER = 100;
const MIN_HEALTH_PERCENT = 0;
const MAX_HEALTH_PERCENT = 100;
const LOW_HEALTH_PERCENT = 40;
const HP_BAR_SLANT_PERCENT = "3.6%";
const HP_BAR_CLIP_PATH =
  "polygon(var(--hp-bar-slant) 0, 100% 0, calc(100% - var(--hp-bar-slant)) 100%, 0 100%)";

export const GameHud = () => {
  const {
    playerHealth: { current, max },
    wave,
  } = useGameUiState();
  const healthPercent = Math.min(
    MAX_HEALTH_PERCENT,
    Math.max(MIN_HEALTH_PERCENT, (current / max) * HEALTH_PERCENT_MULTIPLIER),
  );
  const isLowHealth = healthPercent < LOW_HEALTH_PERCENT;
  const healthFillClassName = isLowHealth
    ? "[&_[data-slot=progress-indicator]]:bg-rose-400 [&_[data-slot=progress-indicator]]:shadow-[0_0_16px_rgba(255,64,112,0.78)]"
    : "[&_[data-slot=progress-indicator]]:bg-emerald-300 [&_[data-slot=progress-indicator]]:shadow-[0_0_16px_rgba(94,242,168,0.72)]";

  return (
    <div className="pointer-events-none absolute inset-0 z-10 text-white">
      <section className="absolute left-7 top-12 flex w-[min(38rem,calc(100vw-3.5rem))] items-center gap-6 max-md:left-4 max-md:top-4 max-md:w-[min(24rem,calc(100vw-2rem))] max-md:gap-4">
        <div className="relative grid size-20 shrink-0 place-items-center rounded-full border border-emerald-300/40 bg-emerald-950/35 shadow-[0_0_28px_rgba(94,242,168,0.34),inset_0_0_24px_rgba(94,242,168,0.14)] max-md:size-14">
          <div className="absolute inset-1 rounded-full border border-emerald-300/20" />
          <div className="absolute -inset-2 rounded-full border border-emerald-400/20 [clip-path:polygon(0_0,68%_0,68%_100%,0_100%)]" />
          <Heart className="size-9 fill-emerald-300 text-emerald-100 drop-shadow-[0_0_12px_rgba(94,242,168,0.9)] max-md:size-6" />
        </div>

        <div className="min-w-0 flex-1 pt-1">
          <div className="mb-1 flex items-end gap-3 pl-2">
            <span className="text-sm font-black uppercase tracking-[0.18em] text-emerald-300 drop-shadow-[0_0_8px_rgba(94,242,168,0.72)] max-md:text-xs">
              HP
            </span>
            <span className="font-mono text-sm tabular-nums text-emerald-50/90 max-md:text-xs">
              {current} / {max}
            </span>
          </div>

          <div
            className="relative"
            style={
              {
                "--hp-bar-slant": HP_BAR_SLANT_PERCENT,
                marginLeft: `calc(0.5rem - ${HP_BAR_SLANT_PERCENT})`,
              } as CSSProperties
            }
          >
            <Progress
              aria-label="Player health"
              className={`h-5 rounded-none bg-emerald-950/42 [clip-path:var(--hp-bar-clip)] [&_[data-slot=progress-indicator]]:rounded-none max-md:h-4 ${healthFillClassName}`}
              style={
                {
                  "--hp-bar-clip": HP_BAR_CLIP_PATH,
                  "--hp-bar-slant": HP_BAR_SLANT_PERCENT,
                } as CSSProperties
              }
              value={healthPercent}
            />
            <svg
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 h-full w-full overflow-visible drop-shadow-[0_0_10px_rgba(255,64,112,0.8)]"
              preserveAspectRatio="none"
              viewBox="0 0 100 100"
            >
              <polygon
                className="fill-transparent stroke-emerald-300/80"
                points="3.6,0 100,0 96.4,100 0,100"
                vectorEffect="non-scaling-stroke"
              />
            </svg>
          </div>
        </div>
      </section>

      <section className="absolute right-7 top-8 flex items-start gap-5 max-md:left-4 max-md:right-auto max-md:top-28 max-md:gap-4">
        <div className="w-48 max-md:w-40">
          <div className="flex items-end justify-center gap-4">
            <span className="pb-1 text-sm font-black uppercase tracking-[0.28em] text-cyan-300 drop-shadow-[0_0_8px_rgba(45,255,231,0.9)] max-md:text-xs">
              Wave
            </span>
            <div className="font-mono text-4xl font-black leading-none tracking-wide text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.35)] max-md:text-3xl">
              {wave.isComplete ? (
                "Clear"
              ) : (
                <>
                  {wave.current}
                  <span className="mx-3 text-cyan-300">/</span>
                  {wave.total}
                </>
              )}
            </div>
          </div>

          <div className="mt-3 h-px w-full bg-cyan-300/70 shadow-[0_0_12px_rgba(45,255,231,0.85)]">
            <span className="block size-1.5 -translate-y-[0.1875rem] rounded-full bg-cyan-200 shadow-[0_0_10px_rgba(45,255,231,1)]" />
          </div>

          <div className="mt-3 flex items-center justify-center gap-4 text-rose-400">
            <div className="relative grid size-7 place-items-center text-rose-400 drop-shadow-[0_0_8px_rgba(255,64,112,0.9)]">
              <span className="absolute left-0 top-0 size-2 border-l border-t border-rose-400" />
              <span className="absolute right-0 top-0 size-2 border-r border-t border-rose-400" />
              <span className="absolute bottom-0 left-0 size-2 border-b border-l border-rose-400" />
              <span className="absolute bottom-0 right-0 size-2 border-b border-r border-rose-400" />
              <Crosshair className="size-4 stroke-[3]" />
            </div>
            <span className="font-mono text-2xl font-black leading-none tracking-wide text-rose-300 drop-shadow-[0_0_8px_rgba(255,64,112,0.75)] max-md:text-xl">
              {wave.enemiesRemaining}
            </span>
            <span className="text-sm font-black uppercase tracking-[0.24em] text-rose-400 drop-shadow-[0_0_8px_rgba(255,64,112,0.75)] max-md:text-xs">
              Left
            </span>
          </div>
        </div>

        <div className="relative mt-1 grid size-16 shrink-0 place-items-center rounded-full border border-rose-400/45 bg-rose-950/35 text-rose-300 shadow-[0_0_24px_rgba(255,64,112,0.36),inset_0_0_22px_rgba(255,64,112,0.12)] max-md:size-12">
          <div className="absolute inset-2 rounded-full border border-rose-400/25" />
          <div className="absolute inset-4 rounded-full bg-rose-400/16 shadow-[0_0_16px_rgba(255,64,112,0.55)]" />
          <Crosshair className="relative size-8 stroke-[2.5] drop-shadow-[0_0_12px_rgba(255,64,112,0.95)] max-md:size-6" />
        </div>
      </section>

      <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-black/24 to-transparent" />
    </div>
  );
};
