import {
  emitGameplayCommand,
  GAMEPLAY_COMMANDS
} from "@/game/events/gameplay-commands";
import { useGameUiStore } from "@/game/state/use-game-ui-store";
import { ScreenCenter, ScreenTitle, StageDivider } from "./ScreenPrimitives";
import { SkillCard } from "./SkillCard";

const SKILL_CARD_SELECTOR = "[data-skill-card='true']:not([aria-disabled='true'])";
const SKILL_NAVIGATION_KEYS = new Set([
  "ArrowRight",
  "d",
  "D",
  "ArrowLeft",
  "a",
  "A"
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
        className="flex w-[min(58rem,calc(100vw-3rem))] flex-col items-center gap-8"
        onKeyDown={(event) => {
          if (!SKILL_NAVIGATION_KEYS.has(event.key)) {
            return;
          }

          const cards = Array.from(
            event.currentTarget.querySelectorAll<HTMLButtonElement>(SKILL_CARD_SELECTOR)
          );

          if (cards.length === 0) {
            return;
          }

          event.preventDefault();

          const focusedCardIndex = cards.indexOf(
            document.activeElement as HTMLButtonElement
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
        <div className="flex flex-col items-center gap-4 text-center">
          <ScreenTitle>LEVEL {skillSelection.offeredAtLevel}</ScreenTitle>
          <StageDivider label="CHOOSE ONE SKILL" />
        </div>

        <div className="grid w-full grid-cols-3 place-items-center gap-5 max-md:grid-cols-1">
          {skillSelection.choices.map((choice, choiceIndex) => (
            <SkillCard
              autoFocus={choiceIndex === FIRST_SKILL_CARD_INDEX}
              choice={choice}
              isTabStop={choiceIndex === FIRST_SKILL_CARD_INDEX}
              key={choice.id}
              onSelect={(skillId) => {
                emitGameplayCommand(GAMEPLAY_COMMANDS.SELECT_SKILL, {
                  skillId
                });
              }}
            />
          ))}
        </div>
      </div>
    </ScreenCenter>
  );
};
