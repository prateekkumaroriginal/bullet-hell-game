import {
  ArrowDown,
  ArrowUp,
  Magnet,
  Rocket,
  ShieldPlus,
  Wind,
  Zap,
  type LucideIcon
} from "lucide-react";
import {
  SKILL_IDS,
  type SkillId
} from "@/game/config/skill-config";
import {
  emitGameplayCommand,
  GAMEPLAY_COMMANDS
} from "@/game/events/gameplay-commands";
import { useGameUiStore } from "@/game/state/use-game-ui-store";
import { ScreenCenter, ScreenTitle, StageDivider } from "./ScreenPrimitives";

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

type SkillCardVisual = {
  accent: "amber" | "cyan" | "violet" | "rose" | "lime";
  direction: "down" | "up";
  Icon: LucideIcon;
};

const SKILL_CARD_VISUAL_BY_ID = {
  [SKILL_IDS.RAPID_FIRE]: {
    accent: "rose",
    direction: "down",
    Icon: Zap
  },
  [SKILL_IDS.HEAVY_SHOT]: {
    accent: "amber",
    direction: "up",
    Icon: Rocket
  },
  [SKILL_IDS.FLEET_FOOTED]: {
    accent: "cyan",
    direction: "up",
    Icon: Wind
  },
  [SKILL_IDS.MAGNET_CORE]: {
    accent: "violet",
    direction: "up",
    Icon: Magnet
  },
  [SKILL_IDS.REINFORCED_HULL]: {
    accent: "lime",
    direction: "up",
    Icon: ShieldPlus
  }
} as const satisfies Record<SkillId, SkillCardVisual>;

const getEffectLabel = (summary: string): string =>
  summary
    .replace(/\s+(increased|decreased|expanded|reduced)\.$/i, "")
    .replace(/\.$/, "");

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
          {skillSelection.choices.map((choice, choiceIndex) => {
            const { accent, direction, Icon } = SKILL_CARD_VISUAL_BY_ID[choice.id];
            const DirectionIcon = direction === "up" ? ArrowUp : ArrowDown;

            return (
              <button
                autoFocus={choiceIndex === FIRST_SKILL_CARD_INDEX}
                className="skill-selection-card group"
                data-accent={accent}
                data-skill-card="true"
                key={choice.id}
                onClick={() => {
                  emitGameplayCommand(GAMEPLAY_COMMANDS.SELECT_SKILL, {
                    skillId: choice.id
                  });
                }}
                onMouseEnter={(event) => {
                  event.currentTarget.focus();
                }}
                tabIndex={choiceIndex === FIRST_SKILL_CARD_INDEX ? 0 : -1}
                type="button"
              >
                <span aria-hidden="true" className="skill-selection-card__focus-frame">
                  <span className="skill-selection-card__focus-top skill-selection-card__focus-top--left" />
                  <span className="skill-selection-card__focus-top skill-selection-card__focus-top--right" />
                </span>
                <span aria-hidden="true" className="skill-selection-card__focus-marker">
                  <svg viewBox="0 0 36 18">
                    <path d="M5 4L18 14L31 4" />
                  </svg>
                </span>
                <span aria-hidden="true" className="skill-selection-card__focus-floor" />

                <span className="skill-selection-card__stacks">
                  {Array.from({ length: 5 }, (_, stackIndex) => (
                    <span
                      className="skill-selection-card__stack"
                      data-filled={stackIndex <= choice.stackCount}
                      key={stackIndex}
                    />
                  ))}
                </span>

                <span className="skill-selection-card__visual" aria-hidden="true">
                  <Icon className="skill-selection-card__icon" strokeWidth={0.8} />
                </span>

                <span className="skill-selection-card__copy">
                  <span className="skill-selection-card__name">{choice.name}</span>
                  <span aria-hidden="true" className="skill-selection-card__rule" />
                  <span className="skill-selection-card__effect">
                    <DirectionIcon aria-hidden="true" strokeWidth={2} />
                    {getEffectLabel(choice.summary)}
                  </span>
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </ScreenCenter>
  );
};
