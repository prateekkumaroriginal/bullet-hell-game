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
  SKILL_STAR_COUNT,
  SKILL_IDS,
  type SkillId
} from "@/game/config/skill-config";
import { type SkillSelectionState } from "@/game/state/use-game-ui-store";

type SkillCardVisual = {
  accent: "amber" | "cyan" | "violet" | "rose" | "lime";
  direction: "down" | "up";
  Icon: LucideIcon;
};

type SkillSelectionChoice = NonNullable<SkillSelectionState>["choices"][number];

type SkillCardProps = {
  autoFocus: boolean;
  choice: SkillSelectionChoice;
  isTabStop: boolean;
  onSelect: (skillId: SkillId) => void;
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

const SkillCardHalo = () => (
  <span aria-hidden="true" className="skill-selection-card__focus-frame">
    <svg viewBox="0 0 268 408" preserveAspectRatio="xMidYMid meet">
      <path
        d="M0 389.84V25.8402C0 15.899 8.05888 7.84016 18 7.84016H115.327L118.327 11.8402H18C10.268 11.8402 4 18.1082 4 25.8402V389.84C4 397.572 10.268 403.84 18 403.84H250C257.732 403.84 264 397.572 264 389.84V25.8402C264 18.1082 257.732 11.8402 250 11.8402H148.621L151.621 7.84016H250C259.941 7.84017 268 15.899 268 25.8402V389.84C268 399.781 259.941 407.84 250 407.84H18C8.05887 407.84 0 399.781 0 389.84Z"
        fill="currentColor"
      />
      <path
        d="M141.737 0.449581C142.593 -0.248134 143.853 -0.119571 144.551 0.73669C145.249 1.59298 145.12 2.85341 144.264 3.55114L137.29 12.4916C136.187 13.3907 134.843 15.8402 133.5 15.8402C132.157 15.8401 130.814 13.3906 129.71 12.4916L122.737 3.55114C121.88 2.85341 121.752 1.59298 122.45 0.73669C123.147 -0.119571 124.408 -0.248134 125.264 0.449581L132.237 9.39099C132.972 9.99036 134.028 9.99036 134.764 9.39099L141.737 0.449581Z"
        fill="currentColor"
      />
    </svg>
  </span>
);

export const SkillCard = ({
  autoFocus,
  choice,
  isTabStop,
  onSelect
}: SkillCardProps) => {
  const { accent, direction, Icon } = SKILL_CARD_VISUAL_BY_ID[choice.id];
  const DirectionIcon = direction === "up" ? ArrowUp : ArrowDown;

  return (
    <button
      autoFocus={autoFocus}
      className="skill-selection-card group"
      data-accent={accent}
      data-skill-card="true"
      onClick={() => {
        onSelect(choice.id);
      }}
      onMouseEnter={(event) => {
        event.currentTarget.focus();
      }}
      tabIndex={isTabStop ? 0 : -1}
      type="button"
    >
      <SkillCardHalo />
      <span aria-hidden="true" className="skill-selection-card__focus-floor" />

      <span className="skill-selection-card__panel">
        <span className="skill-selection-card__stacks">
          {Array.from({ length: SKILL_STAR_COUNT }, (_, stackIndex) => (
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
      </span>
    </button>
  );
};
