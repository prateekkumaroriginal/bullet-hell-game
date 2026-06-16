import { Zap } from "lucide-react";
import {
  emitGameplayCommand,
  GAMEPLAY_COMMANDS,
} from "@/game/events/gameplay-commands";
import { useGameUiStore } from "@/game/state/use-game-ui-store";
import { ScreenCenter, ScreenTitle, StageDivider } from "./ScreenPrimitives";
import { SkillStars } from "./SkillStars";

const SKILL_CARD_SELECTOR = "[data-skill-card='true']:not(:disabled)";
const SKILL_NAVIGATION_KEYS = new Set([
  "ArrowRight",
  "d",
  "D",
  "ArrowLeft",
  "a",
  "A",
]);
const FORWARD_SKILL_NAVIGATION_KEYS = new Set(["ArrowRight", "d", "D"]);
const FIRST_SKILL_CARD_INDEX = 0;
const MISSING_SKILL_CARD_INDEX = -1;
const NEXT_SKILL_CARD_STEP = 1;

export const SkillSelectScreen = () => {
  const skillSelection = useGameUiStore((state) => state.skillSelection);

  if (!skillSelection) {
    return null;
  }

  return (
    <ScreenCenter>
      <div
        className="flex w-[min(62rem,calc(100vw-3rem))] flex-col items-center gap-9"
        onKeyDown={(event) => {
          if (!SKILL_NAVIGATION_KEYS.has(event.key)) {
            return;
          }

          const cards = Array.from(
            event.currentTarget.querySelectorAll<HTMLButtonElement>(
              SKILL_CARD_SELECTOR,
            ),
          );

          if (cards.length === 0) {
            return;
          }

          event.preventDefault();

          const focusedCardIndex = cards.indexOf(
            document.activeElement as HTMLButtonElement,
          );
          const startingCardIndex =
            focusedCardIndex === MISSING_SKILL_CARD_INDEX
              ? FIRST_SKILL_CARD_INDEX
              : focusedCardIndex;
          const direction = FORWARD_SKILL_NAVIGATION_KEYS.has(event.key)
            ? NEXT_SKILL_CARD_STEP
            : -NEXT_SKILL_CARD_STEP;
          const nextCardIndex =
            (startingCardIndex + direction + cards.length) % cards.length;

          cards[nextCardIndex]?.focus();
        }}
      >
        <div className="flex flex-col items-center gap-5 text-center">
          <ScreenTitle>LEVEL {skillSelection.offeredAtLevel}</ScreenTitle>
          <StageDivider label="CHOOSE ONE SKILL" />
        </div>

        <div className="grid w-full grid-cols-3 gap-4 max-md:grid-cols-1">
          {skillSelection.choices.map((choice, choiceIndex) => (
            <button
              autoFocus={choiceIndex === FIRST_SKILL_CARD_INDEX}
              className="group relative flex min-h-72 flex-col justify-between overflow-hidden border border-cyan-200/30 bg-zinc-950/78 p-5 text-left text-zinc-100 shadow-[0_0_24px_rgba(45,255,231,0.16),inset_0_0_20px_rgba(45,255,231,0.06)] outline-none transition hover:border-cyan-200/70 hover:bg-cyan-950/32 focus-visible:border-cyan-100 focus-visible:shadow-[0_0_34px_rgba(45,255,231,0.42),inset_0_0_24px_rgba(45,255,231,0.1)]"
              data-skill-card="true"
              key={choice.id}
              onClick={() => {
                emitGameplayCommand(GAMEPLAY_COMMANDS.SELECT_SKILL, {
                  skillId: choice.id,
                });
              }}
              onMouseEnter={(event) => {
                event.currentTarget.focus();
              }}
              type="button"
            >
              <span className="absolute inset-x-0 top-0 h-px bg-cyan-100/70 shadow-[0_0_14px_rgba(45,255,231,0.9)]" />
              <span className="flex items-start justify-between gap-4">
                <span className="grid size-12 shrink-0 place-items-center border border-cyan-200/40 bg-cyan-950/45 text-cyan-100 shadow-[0_0_16px_rgba(45,255,231,0.28)]">
                  <Zap className="size-6 fill-cyan-200/30 stroke-[2.5]" />
                </span>
                <SkillStars stackCount={choice.stackCount} />
              </span>

              <span className="flex flex-col gap-4">
                <span className="text-3xl font-black uppercase leading-none tracking-[0.08em] text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.24)]">
                  {choice.name}
                </span>
                <span className="text-base font-black uppercase tracking-[0.12em] text-cyan-100">
                  {choice.summary}
                </span>
                <span className="text-sm font-semibold leading-6 text-zinc-300">
                  {choice.detail}
                </span>
              </span>

              <span className="flex items-center gap-3 text-xs font-black uppercase tracking-[0.2em] text-cyan-200/80">
                <span className="h-px flex-1 bg-cyan-200/30" />
                Select
              </span>
            </button>
          ))}
        </div>
      </div>
    </ScreenCenter>
  );
};
