import { ChevronDown, SlidersHorizontal, Volume2, X } from "lucide-react";
import { useEffect, useState } from "react";
import {
  AUDIO_SOUND_DEFINITIONS,
  type AudioSoundVariation,
  UI_AUDIO_EVENT_DEFINITIONS,
  UI_AUDIO_EVENTS,
  type UiAudioEvent
} from "@/audio/audio-catalog";
import { audio } from "@/audio/audio-controller";
import {
  markUiFocusIntent,
  playUiFocusForElement
} from "@/audio/audio-interactions";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger
} from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";
import { type UiSoundSelections } from "../../../../shared/settings-types";

const INITIAL_OPEN_SOUND_EVENT_NAMES = new Set<UiAudioEvent>([
  UI_AUDIO_EVENTS.FOCUS,
  UI_AUDIO_EVENTS.SELECT
]);
const SOUND_VARIATION_DISPLAY_OFFSET = 1;
const SOUND_VARIATION_DIGIT_COUNT = 2;

export const FloatingSoundSelector = () => {
  const [isPanelOpen, setIsPanelOpen] = useState(true);
  const [selections, setSelections] = useState<UiSoundSelections>(
    () => audio.getSettings().uiSoundSelections
  );
  const [openEventNames, setOpenEventNames] = useState<ReadonlySet<UiAudioEvent>>(
    INITIAL_OPEN_SOUND_EVENT_NAMES
  );

  useEffect(() => {
    let isMounted = true;

    void audio.initialize().then((settings) => {
      if (isMounted) {
        setSelections(settings.uiSoundSelections);
      }
    });

    return () => {
      isMounted = false;
    };
  }, []);

  const handleVariationSelect = (
    eventName: UiAudioEvent,
    variation: AudioSoundVariation
  ) => {
    audio.setUiSoundVariation(eventName, variation.index);
    setSelections((currentSelections) => ({
      ...currentSelections,
      [eventName]: variation.index
    }));
    audio.playUi(eventName, { ignoreCooldown: true });
  };

  return (
    <div className="pointer-events-none fixed right-4 top-4 z-[80] flex max-h-[calc(100vh-2rem)] max-w-[calc(100vw-2rem)] flex-col items-end gap-2">
      <button
        aria-label={isPanelOpen ? "Hide sound selector" : "Show sound selector"}
        className="pointer-events-auto grid size-11 place-items-center border border-cyan-100/40 bg-zinc-950/88 text-cyan-100 shadow-[0_0_18px_rgba(103,232,249,0.18),inset_0_1px_0_rgba(255,255,255,0.08)] outline-none transition-colors hover:border-cyan-100/75 hover:bg-cyan-100/[0.08] focus-visible:ring-3 focus-visible:ring-cyan-100/25"
        onClick={() => {
          setIsPanelOpen((currentIsPanelOpen) => !currentIsPanelOpen);
          audio.playUi(
            isPanelOpen ? UI_AUDIO_EVENTS.PANEL_CLOSE : UI_AUDIO_EVENTS.PANEL_OPEN
          );
        }}
        onFocus={(event) => {
          playUiFocusForElement(event.currentTarget);
        }}
        onPointerDown={() => {
          markUiFocusIntent();
        }}
        onPointerEnter={() => {
          markUiFocusIntent();
        }}
        type="button"
      >
        {isPanelOpen ? <X className="size-4" /> : <SlidersHorizontal className="size-4" />}
      </button>

      {isPanelOpen ? (
        <aside className="pointer-events-auto flex w-[min(42rem,calc(100vw-2rem))] min-h-0 flex-col gap-3 overflow-hidden border border-zinc-400/25 bg-zinc-950/88 p-3 text-zinc-100 shadow-[0_18px_45px_rgba(0,0,0,0.55),inset_0_1px_0_rgba(255,255,255,0.07)] backdrop-blur-md">
          <div className="flex shrink-0 items-center justify-between gap-3 border-b border-zinc-400/15 pb-3">
            <div className="flex min-w-0 items-center gap-3">
              <span className="grid size-9 shrink-0 place-items-center border border-cyan-100/30 bg-cyan-100/[0.06] text-cyan-100">
                <SlidersHorizontal className="size-4" />
              </span>
              <div className="flex min-w-0 flex-col gap-1">
                <span className="truncate text-xs font-black uppercase tracking-[0.18em] text-zinc-50">
                  Sound Selector
                </span>
                <span className="truncate text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-zinc-400">
                  Audition final UI effects
                </span>
              </div>
            </div>
          </div>

          <div className="flex min-h-0 flex-col gap-2 overflow-y-auto pr-1">
            {UI_AUDIO_EVENT_DEFINITIONS.map((eventDefinition) => {
              const soundDefinition =
                AUDIO_SOUND_DEFINITIONS[eventDefinition.soundId];
              const selectedVariationIndex =
                selections[eventDefinition.eventName];
              const selectedVariation =
                soundDefinition.variations.find(
                  (variation) => variation.index === selectedVariationIndex
                ) ?? soundDefinition.variations[0];
              const isOpen = openEventNames.has(eventDefinition.eventName);

              return (
                <Collapsible
                  key={eventDefinition.eventName}
                  onOpenChange={(nextIsOpen) => {
                    setOpenEventNames((currentOpenEventNames) => {
                      const nextOpenEventNames = new Set(currentOpenEventNames);

                      if (nextIsOpen) {
                        nextOpenEventNames.add(eventDefinition.eventName);
                      } else {
                        nextOpenEventNames.delete(eventDefinition.eventName);
                      }

                      return nextOpenEventNames;
                    });
                    audio.playUi(
                      nextIsOpen
                        ? UI_AUDIO_EVENTS.PANEL_OPEN
                        : UI_AUDIO_EVENTS.PANEL_CLOSE
                    );
                  }}
                  open={isOpen}
                >
                  <div className="flex flex-col gap-2 border border-zinc-400/20 bg-black/28 p-2 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]">
                    <CollapsibleTrigger asChild>
                      <button
                        className="group flex min-h-12 w-full items-center justify-between gap-3 text-left outline-none focus-visible:ring-3 focus-visible:ring-zinc-100/25"
                        onFocus={(event) => {
                          playUiFocusForElement(event.currentTarget);
                        }}
                        onPointerDown={() => {
                          markUiFocusIntent();
                        }}
                        onPointerEnter={() => {
                          markUiFocusIntent();
                        }}
                        type="button"
                      >
                        <span className="flex min-w-0 items-center gap-3">
                          <span className="grid size-8 shrink-0 place-items-center border border-cyan-100/25 bg-cyan-100/[0.05] text-cyan-100">
                            <Volume2 className="size-3.5" />
                          </span>
                          <span className="flex min-w-0 flex-col gap-0.5">
                            <span className="truncate text-xs font-black uppercase tracking-[0.16em] text-zinc-50">
                              {eventDefinition.label}
                            </span>
                            <span className="truncate text-[0.7rem] font-semibold text-zinc-400">
                              {selectedVariation.name}
                            </span>
                          </span>
                        </span>
                        <span className="flex shrink-0 items-center gap-3">
                          <span className="hidden text-[0.65rem] font-black uppercase tracking-[0.16em] text-cyan-100/80 sm:inline">
                            {formatVariationNumber(selectedVariation.index)}
                          </span>
                          <ChevronDown
                            className={cn(
                              "size-4 text-zinc-300 transition-transform",
                              isOpen ? "rotate-180" : ""
                            )}
                          />
                        </span>
                      </button>
                    </CollapsibleTrigger>

                    <CollapsibleContent>
                      <div className="flex gap-2 overflow-x-auto pb-1 pt-1">
                        {soundDefinition.variations.map((variation) => (
                          <SoundVariationButton
                            eventName={eventDefinition.eventName}
                            isSelected={variation.index === selectedVariationIndex}
                            key={variation.index}
                            onSelect={() => {
                              handleVariationSelect(
                                eventDefinition.eventName,
                                variation
                              );
                            }}
                            variation={variation}
                          />
                        ))}
                      </div>
                    </CollapsibleContent>
                  </div>
                </Collapsible>
              );
            })}
          </div>
        </aside>
      ) : null}
    </div>
  );
};

function SoundVariationButton({
  eventName,
  isSelected,
  onSelect,
  variation
}: {
  eventName: UiAudioEvent;
  isSelected: boolean;
  onSelect: () => void;
  variation: AudioSoundVariation;
}) {
  return (
    <button
      aria-label={`${eventName} ${variation.name}`}
      aria-pressed={isSelected}
      className={cn(
        "flex h-14 w-32 shrink-0 flex-col justify-center gap-1 border bg-black/25 px-2.5 text-left outline-none transition-colors focus-visible:ring-3 focus-visible:ring-zinc-100/25",
        isSelected
          ? "border-cyan-100/75 bg-cyan-100/[0.08] text-cyan-50 shadow-[0_0_14px_rgba(103,232,249,0.14),inset_0_1px_0_rgba(255,255,255,0.1)]"
          : "border-zinc-500/25 text-zinc-300 hover:border-zinc-200/55 hover:bg-white/[0.05]"
      )}
      onClick={onSelect}
      onFocus={(event) => {
        playUiFocusForElement(event.currentTarget);
      }}
      onPointerDown={() => {
        markUiFocusIntent();
      }}
      onPointerEnter={() => {
        markUiFocusIntent();
      }}
      type="button"
    >
      <span className="text-[0.62rem] font-black uppercase tracking-[0.16em] text-cyan-100/75">
        {formatVariationNumber(variation.index)}
      </span>
      <span className="truncate text-[0.72rem] font-black uppercase tracking-[0.08em]">
        {variation.name}
      </span>
    </button>
  );
}

function formatVariationNumber(index: number): string {
  return String(index + SOUND_VARIATION_DISPLAY_OFFSET).padStart(
    SOUND_VARIATION_DIGIT_COUNT,
    "0"
  );
}
