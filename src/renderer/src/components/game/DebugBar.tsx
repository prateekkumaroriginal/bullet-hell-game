import { useEffect, useState } from "react";
import { Bug, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger
} from "@/components/ui/collapsible";
import {
  onDebugStatsChanged,
  type DebugStatsChangedPayload,
} from "@/game/debug/debug-stats-events";

const DEBUG_PANEL_WIDTH_CLASS = "w-80 max-w-[calc(100vw-1rem)]";
const INITIAL_OPEN_CATEGORY_NAMES = new Set<string>();
const debugBarUiState = {
  isStatsVisible: false,
  openCategoryNames: INITIAL_OPEN_CATEGORY_NAMES,
};

const INITIAL_DEBUG_STATS: DebugStatsChangedPayload = {
  categories: [
    {
      name: "Summary",
      stats: [],
    },
  ],
};

export const DebugBar = () => {
  const [isStatsVisible, setIsStatsVisible] = useState(
    debugBarUiState.isStatsVisible,
  );
  const [debugStats, setDebugStats] = useState(INITIAL_DEBUG_STATS);
  const [openCategoryNames, setOpenCategoryNames] = useState<ReadonlySet<string>>(
    () => new Set(debugBarUiState.openCategoryNames),
  );

  useEffect(() => onDebugStatsChanged(setDebugStats), []);

  return (
    <aside className="absolute right-4 top-4 z-30 flex w-fit flex-col items-end gap-2 font-mono text-[0.7rem] text-zinc-100 max-md:right-2 max-md:top-2 max-md:text-[0.65rem]">
      <div className="pointer-events-auto flex size-10 items-center justify-center border border-slate-400/25 bg-zinc-950/82 shadow-[0_0_18px_rgba(0,0,0,0.48)] backdrop-blur-sm">
        <Button
          aria-label={isStatsVisible ? "Hide debug stats" : "Show debug stats"}
          className="size-8 rounded-none border-white/10 bg-white/[0.045] p-0 text-cyan-100 hover:bg-cyan-300/10"
          onClick={() => {
            setIsStatsVisible((currentValue) => {
              const nextValue = !currentValue;

              debugBarUiState.isStatsVisible = nextValue;

              return nextValue;
            });
          }}
          size="icon"
          type="button"
          variant="outline"
        >
          <Bug className="size-3.5" />
        </Button>
      </div>

      {isStatsVisible ? (
        <div
          className={`pointer-events-none flex max-h-[calc(100vh-4.5rem)] ${DEBUG_PANEL_WIDTH_CLASS} flex-col gap-1 overflow-y-auto border border-slate-400/25 bg-zinc-950/82 p-2 shadow-[0_0_22px_rgba(0,0,0,0.52)] backdrop-blur-sm`}
        >
          {debugStats.categories.map((category) => {
            const isCategoryOpen = openCategoryNames.has(category.name);

            return (
            <Collapsible
              className="border border-white/10 bg-white/[0.045]"
              key={category.name}
              onOpenChange={(isOpen) => {
                setOpenCategoryNames((currentOpenCategoryNames) => {
                  const nextOpenCategoryNames = new Set(
                    currentOpenCategoryNames
                  );

                  if (isOpen) {
                    nextOpenCategoryNames.add(category.name);
                  } else {
                    nextOpenCategoryNames.delete(category.name);
                  }

                  debugBarUiState.openCategoryNames = nextOpenCategoryNames;

                  return nextOpenCategoryNames;
                });
              }}
              open={isCategoryOpen}
            >
              <CollapsibleTrigger asChild>
                <Button
                  className="pointer-events-auto flex h-auto w-full justify-between gap-4 rounded-none px-2 py-1.5 font-mono text-[0.7rem] text-cyan-100 max-md:text-[0.65rem]"
                  type="button"
                  variant="ghost"
                >
                  <span className="truncate uppercase tracking-[0.16em]">
                    {category.name}
                  </span>
                  <ChevronDown
                    className={`size-3.5 shrink-0 transition ${
                      isCategoryOpen ? "rotate-180" : ""
                    }`}
                  />
                </Button>
              </CollapsibleTrigger>

              <CollapsibleContent>
                <div className="flex flex-col gap-1 border-t border-white/10 p-1">
                  {category.stats.map((stat) => (
                    <div
                      className="grid grid-cols-[minmax(0,1fr)_max-content] items-center justify-between gap-4 bg-black/20 px-2 py-1"
                      key={stat.prop}
                    >
                      <span className="truncate text-zinc-400">{stat.prop}</span>
                      <span className="truncate text-right font-bold text-white">
                        {stat.value}
                      </span>
                    </div>
                  ))}
                </div>
              </CollapsibleContent>
            </Collapsible>
            );
          })}
        </div>
      ) : null}
    </aside>
  );
};
