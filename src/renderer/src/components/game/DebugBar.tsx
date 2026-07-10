import { useEffect, useState } from "react";
import {
  Bug,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Crosshair,
  MessageSquareMore,
  Palette,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger
} from "@/components/ui/collapsible";
import { Switch } from "@/components/ui/switch";
import {
  onDebugStatsChanged,
  type DebugStatsChangedPayload
} from "@/game/debug/debug-stats-events";
import {
  isDebugHitboxOverlayVisible,
  setDebugHitboxOverlayVisible
} from "@/game/debug/debug-hitbox-events";
import { POPUP_IDS } from "@/game/config/popup-config";
import {
  MAIN_MENU_VARIANT_OPTIONS,
  MAIN_MENU_VARIANT_STEP,
  type MainMenuVariant,
} from "@/game/config/screen-ui-config";
import { GAME_SESSION_PHASES } from "@/game/state/game-session-state";
import { showPopup } from "@/game/state/popup-ui-service";
import { useGameUiStore } from "@/game/state/use-game-ui-store";

const DEBUG_PANEL_WIDTH_CLASS = "w-80 max-w-[calc(100vw-1rem)]";
const HITBOX_SWITCH_ID = "debug-hitbox-overlay-switch";
const INITIAL_OPEN_CATEGORY_NAMES = new Set<string>();
const debugBarUiState = {
  isStatsVisible: false,
  isHitboxOverlayVisible: isDebugHitboxOverlayVisible(),
  openCategoryNames: INITIAL_OPEN_CATEGORY_NAMES
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
  const gamePhase = useGameUiStore((state) => state.gameSession.phase);
  const mainMenuVariant = useGameUiStore((state) => state.mainMenuVariant);
  const setMainMenuVariant = useGameUiStore(
    (state) => state.setMainMenuVariant,
  );
  const [isStatsVisible, setIsStatsVisible] = useState(
    debugBarUiState.isStatsVisible
  );
  const [isHitboxOverlayVisible, setIsHitboxOverlayVisible] = useState(
    debugBarUiState.isHitboxOverlayVisible
  );
  const [debugStats, setDebugStats] = useState(INITIAL_DEBUG_STATS);
  const [openCategoryNames, setOpenCategoryNames] = useState<ReadonlySet<string>>(
    () => new Set(debugBarUiState.openCategoryNames)
  );

  const mainMenuVariantIndex = MAIN_MENU_VARIANT_OPTIONS.findIndex(
    (option) => option.id === mainMenuVariant,
  );

  const setVariantByOffset = (offset: number) => {
    const nextIndex =
      (mainMenuVariantIndex + offset + MAIN_MENU_VARIANT_OPTIONS.length) %
      MAIN_MENU_VARIANT_OPTIONS.length;
    const nextVariant = MAIN_MENU_VARIANT_OPTIONS[nextIndex]?.id;

    if (nextVariant) {
      setMainMenuVariant(nextVariant);
    }
  };

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
          className={`pointer-events-auto flex max-h-[calc(100vh-4.5rem)] ${DEBUG_PANEL_WIDTH_CLASS} flex-col gap-1 overflow-y-auto border border-slate-400/25 bg-zinc-950/82 p-2 shadow-[0_0_22px_rgba(0,0,0,0.52)] backdrop-blur-sm`}
        >
          {gamePhase === GAME_SESSION_PHASES.IDLE ? (
            <div className="flex flex-col gap-2 border border-white/10 bg-white/[0.045] p-2">
              <div className="flex items-center gap-2 px-1 text-cyan-100">
                <Palette className="size-3.5 shrink-0" />
                <span className="font-mono text-[0.7rem] uppercase tracking-[0.12em] max-md:text-[0.65rem]">
                  Main menu variations
                </span>
              </div>
              <div className="flex items-center gap-1">
                <Button
                  aria-label="Previous main menu variation"
                  className="size-8 rounded-none border-white/10 bg-white/[0.045] p-0 text-cyan-100 hover:bg-cyan-300/10"
                  onClick={() => {
                    setVariantByOffset(-MAIN_MENU_VARIANT_STEP);
                  }}
                  size="icon"
                  type="button"
                  variant="outline"
                >
                  <ChevronLeft className="size-3.5" />
                </Button>
                <select
                  aria-label="Main menu variation"
                  className="h-8 min-w-0 flex-1 appearance-none rounded-none border border-white/10 bg-zinc-950/65 px-2 font-mono text-[0.68rem] uppercase tracking-[0.08em] text-cyan-50 outline-none focus:border-cyan-200/70"
                  onChange={(event) => {
                    setMainMenuVariant(event.target.value as MainMenuVariant);
                  }}
                  value={mainMenuVariant}
                >
                  {MAIN_MENU_VARIANT_OPTIONS.map((option) => (
                    <option key={option.id} value={option.id}>
                      {option.index} / {option.name}
                    </option>
                  ))}
                </select>
                <Button
                  aria-label="Next main menu variation"
                  className="size-8 rounded-none border-white/10 bg-white/[0.045] p-0 text-cyan-100 hover:bg-cyan-300/10"
                  onClick={() => {
                    setVariantByOffset(MAIN_MENU_VARIANT_STEP);
                  }}
                  size="icon"
                  type="button"
                  variant="outline"
                >
                  <ChevronRight className="size-3.5" />
                </Button>
              </div>
              <span className="px-1 font-mono text-[0.62rem] text-zinc-400">
                {MAIN_MENU_VARIANT_OPTIONS[mainMenuVariantIndex]?.summary}
              </span>
            </div>
          ) : null}

          <div className="flex items-center justify-between gap-3 border border-white/10 bg-white/[0.045] px-3 py-2">
            <label
              className="flex min-w-0 flex-1 items-center gap-2 font-mono text-[0.7rem] uppercase tracking-[0.12em] text-cyan-100 max-md:text-[0.65rem]"
              htmlFor={HITBOX_SWITCH_ID}
            >
              <Crosshair className="size-3.5 shrink-0" />
              <span className="truncate">Hitboxes</span>
            </label>
            <Switch
              checked={isHitboxOverlayVisible}
              className="data-checked:bg-cyan-300 data-unchecked:bg-zinc-700"
              id={HITBOX_SWITCH_ID}
              onCheckedChange={(nextValue) => {
                debugBarUiState.isHitboxOverlayVisible = nextValue;
                setDebugHitboxOverlayVisible(nextValue);
                setIsHitboxOverlayVisible(nextValue);
              }}
              size="sm"
            />
          </div>

          <Button
            className="pointer-events-auto flex h-auto w-full justify-start gap-2 rounded-none border-white/10 bg-white/[0.045] px-3 py-2 font-mono text-[0.7rem] uppercase tracking-[0.12em] text-cyan-100 hover:bg-cyan-300/10 max-md:text-[0.65rem]"
            disabled={gamePhase !== GAME_SESSION_PHASES.PLAYING}
            onClick={() => {
              showPopup(POPUP_IDS.CONTROLS);
            }}
            type="button"
            variant="outline"
          >
            <MessageSquareMore className="size-3.5" />
            Sample popup
          </Button>

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
