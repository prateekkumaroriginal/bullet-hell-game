import { Star } from "lucide-react";
import { SKILL_STAR_COUNT } from "@/game/config/skill-config";
import { cn } from "@/lib/utils";

const STAR_INDEX_OFFSET = 1;

export const SkillStars = ({
  stackCount,
  className,
}: {
  stackCount: number;
  className?: string;
}) => (
  <span
    aria-label={`${stackCount} of ${SKILL_STAR_COUNT} skill stacks`}
    className={cn("flex items-center gap-1", className)}
  >
    {Array.from({ length: SKILL_STAR_COUNT }, (_, starIndex) => {
      const isFilled = starIndex + STAR_INDEX_OFFSET <= stackCount;

      return (
        <Star
          aria-hidden="true"
          className={cn(
            "size-4 stroke-[2.5]",
            isFilled
              ? "fill-cyan-200 text-cyan-100 drop-shadow-[0_0_8px_rgba(45,255,231,0.8)]"
              : "fill-transparent text-cyan-900/70",
          )}
          key={starIndex}
        />
      );
    })}
  </span>
);
