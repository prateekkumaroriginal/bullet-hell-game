import { useEffect, useMemo, useState, type ComponentType } from "react";
import {
  ChevronsRight,
  Crosshair,
  Gauge,
  LockKeyhole,
  Magnet,
  Orbit,
  ShieldPlus,
  Skull,
  Wind,
  Zap
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  ENEMY_DEFINITIONS,
  ENEMY_PREVIEW_SCALE,
  ENEMY_PREVIEW_SIZE,
  ENEMY_STROKE_WIDTH,
  type EnemyDefinition,
  type EnemyTypeId
} from "@/game/config/enemy-config";
import {
  SKILL_DEFINITIONS,
  SKILL_IDS,
  SKILL_MAX_STACK_COUNT,
  type SkillDefinition,
  type SkillId
} from "@/game/config/skill-config";
import { loadProfileSave } from "@/game/save/profile-save-service";
import { GAME_SESSION_PHASES } from "@/game/state/game-session-state";
import { useGameUiStore } from "@/game/state/use-game-ui-store";
import { cn } from "@/lib/utils";
import { ScreenButton } from "./ScreenPrimitives";

const ARCHIVE_TABS = {
  ENEMIES: "enemies",
  SKILLS: "skills"
} as const;

type ArchiveTab = (typeof ARCHIVE_TABS)[keyof typeof ARCHIVE_TABS];
type SkillIcon = ComponentType<{ className?: string }>;
type IntelTone = "cyan" | "violet" | "rose";

const PERCENT_CONVERSION_FACTOR = 100;
const ENEMY_DEFINITION_LIST = Object.values(ENEMY_DEFINITIONS);
const FIRST_ENEMY_ID = ENEMY_DEFINITION_LIST[0].id;
const FIRST_SKILL_ID = SKILL_DEFINITIONS[0].id;

const SKILL_ICON_BY_ID = {
  [SKILL_IDS.RAPID_FIRE]: Zap,
  [SKILL_IDS.HEAVY_SHOT]: Gauge,
  [SKILL_IDS.FLEET_FOOTED]: Wind,
  [SKILL_IDS.MAGNET_CORE]: Magnet,
  [SKILL_IDS.REINFORCED_HULL]: ShieldPlus
} as const satisfies Record<SkillId, SkillIcon>;

const INTEL_TONE_CLASSES = {
  cyan: "text-cyan-300",
  violet: "text-violet-300",
  rose: "text-rose-400"
} as const satisfies Record<IntelTone, string>;

const toCssHexColor = (color: number): string =>
  `#${color.toString(16).padStart(6, "0")}`;

const EnemyVisual = ({
  enemy,
  isLocked = false
}: {
  enemy: EnemyDefinition;
  isLocked?: boolean;
}) => {
  const center = ENEMY_PREVIEW_SIZE / 2;

  return (
    <svg
      aria-hidden="true"
      className={cn(
        "h-full w-full overflow-visible transition duration-300",
        isLocked && "opacity-20 grayscale"
      )}
      viewBox={`0 0 ${ENEMY_PREVIEW_SIZE} ${ENEMY_PREVIEW_SIZE}`}
    >
      <circle
        cx={center}
        cy={center}
        fill={isLocked ? "#11151b" : toCssHexColor(enemy.fillColor)}
        r={enemy.radius * ENEMY_PREVIEW_SCALE}
        stroke={
          isLocked ? "#5f6878" : toCssHexColor(enemy.strokeColor)
        }
        strokeWidth={ENEMY_STROKE_WIDTH * ENEMY_PREVIEW_SCALE}
      />
    </svg>
  );
};

const ArchiveTabButton = ({
  isActive,
  label,
  onClick
}: {
  isActive: boolean;
  label: string;
  onClick: () => void;
}) => (
  <Button
    className={cn(
      "h-12 flex-1 rounded-[6px] border border-zinc-400/25 bg-zinc-950/45 text-sm font-black uppercase tracking-[0.2em] text-zinc-500 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] hover:border-zinc-300/45 hover:bg-white/[0.04] hover:text-zinc-200",
      isActive &&
        "border-sky-100/70 bg-sky-100/[0.08] text-sky-50 shadow-[0_0_18px_rgba(186,230,253,0.12),inset_0_0_20px_rgba(186,230,253,0.06),inset_0_1px_0_rgba(255,255,255,0.1)] hover:border-sky-100/70 hover:bg-sky-100/[0.08] hover:text-sky-50"
    )}
    onClick={onClick}
    variant="ghost"
  >
    {label}
  </Button>
);

const ArchiveCard = ({
  children,
  isLocked,
  isSelected,
  label,
  onClick
}: {
  children: React.ReactNode;
  isLocked: boolean;
  isSelected: boolean;
  label: string;
  onClick: () => void;
}) => (
  <button
    aria-label={isLocked ? "Undiscovered archive entry" : label}
    className={cn(
      "group relative flex min-h-40 flex-col items-center justify-between gap-3 overflow-hidden rounded-[6px] border border-zinc-500/20 bg-zinc-950/48 p-4 text-zinc-100 outline-none transition duration-200 shadow-[inset_0_1px_0_rgba(255,255,255,0.035)]",
      isLocked
        ? "cursor-not-allowed"
        : "hover:border-zinc-300/45 hover:bg-white/[0.04] focus-visible:border-zinc-50 focus-visible:ring-3 focus-visible:ring-zinc-100/25",
      isSelected &&
        "border-sky-100/70 bg-sky-100/[0.08] shadow-[0_0_18px_rgba(186,230,253,0.12),inset_0_0_20px_rgba(186,230,253,0.06),inset_0_1px_0_rgba(255,255,255,0.1)] hover:border-sky-100/70 hover:bg-sky-100/[0.08]"
    )}
    disabled={isLocked}
    onClick={onClick}
    type="button"
  >
    {children}
    <span
      className={cn(
        "text-center text-xs font-black uppercase tracking-[0.16em]",
        isLocked ? "text-zinc-600" : "text-zinc-100"
      )}
    >
      {isLocked ? "???" : label}
    </span>
  </button>
);

const LockedDetail = ({ message }: { message: string }) => (
  <div className="flex h-full min-h-80 flex-col items-center justify-center gap-6 text-center">
    <div className="grid size-28 place-items-center rounded-full border border-zinc-500/20 bg-zinc-950/50 text-zinc-600 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
      <LockKeyhole className="size-10 stroke-[1.5]" />
    </div>
    <div className="flex flex-col gap-2">
      <span className="text-2xl font-black uppercase tracking-[0.2em] text-zinc-500">
        Undiscovered
      </span>
      <span className="text-sm font-semibold text-zinc-600">
        {message}
      </span>
    </div>
  </div>
);

const IntelRow = ({
  icon: Icon,
  label,
  tone = "cyan",
  value
}: {
  icon: SkillIcon;
  label: string;
  tone?: IntelTone;
  value: string;
}) => {
  const toneClassName = INTEL_TONE_CLASSES[tone];

  return (
  <div className="flex min-h-12 items-center gap-3 rounded-lg border border-white/10 bg-white/[0.025] px-4 py-2">
    <Icon className={cn("size-5 shrink-0", toneClassName)} />
    <span className={cn("text-xs font-black uppercase tracking-[0.18em]", toneClassName)}>
      {label}
    </span>
    <span className="flex-1 text-right text-xs font-black uppercase tracking-[0.08em] text-zinc-100">
      {value}
    </span>
  </div>
  );
};

const EnemyDetail = ({ enemy }: { enemy: EnemyDefinition }) => (
  <div className="flex h-full min-h-0 flex-col gap-6">
    <div className="flex min-h-0 flex-1 items-center gap-7 max-lg:flex-col">
      <div className="relative grid aspect-square w-[min(46%,18rem)] shrink-0 place-items-center max-lg:w-44">
        <div className="absolute inset-4 rounded-full border border-sky-100/10" />
        <div className="absolute inset-10 rounded-full border border-dashed border-zinc-100/10" />
        <EnemyVisual enemy={enemy} />
      </div>
      <div className="flex min-w-0 flex-1 flex-col gap-5">
        <div className="flex items-center gap-3 text-xs font-black uppercase tracking-[0.26em] text-sky-100/80">
          <Crosshair className="size-5" /> Enemy intel
        </div>
        <h2 className="text-5xl font-black uppercase leading-none tracking-[0.1em] text-white max-xl:text-4xl">
          {enemy.name}
        </h2>
        <div className="h-px w-full bg-gradient-to-r from-zinc-200/55 to-transparent" />
        <p className="text-base font-medium leading-7 text-zinc-300">
          {enemy.intel.description}
        </p>
      </div>
    </div>
    <div className="flex flex-col gap-2">
      <IntelRow icon={ChevronsRight} label="Speed" tone="cyan" value={enemy.intel.speed} />
      <IntelRow icon={Orbit} label="Behavior" tone="violet" value={enemy.intel.behavior} />
      <IntelRow icon={Skull} label="Threat" tone="rose" value={enemy.intel.threat} />
    </div>
  </div>
);

const getSkillEffect = (skill: SkillDefinition): string => {
  const delta = skill.modifierDelta;

  if (delta.fireCooldownMultiplierDelta !== 0) {
    return `${delta.fireCooldownMultiplierDelta * PERCENT_CONVERSION_FACTOR}% fire cooldown per stack`;
  }

  if (delta.bulletDamageBonus !== 0) {
    return `+${delta.bulletDamageBonus} bullet damage per stack`;
  }

  if (delta.moveSpeedMultiplierDelta !== 0) {
    return `+${delta.moveSpeedMultiplierDelta * PERCENT_CONVERSION_FACTOR}% movement speed per stack`;
  }

  if (delta.experienceCollectRadiusBonus !== 0) {
    return `+${delta.experienceCollectRadiusBonus} collect / +${delta.experienceAttractRadiusBonus} attract range`;
  }

  return `+${delta.maxHealthBonus} maximum health per stack`;
};

const SkillDetail = ({ skill }: { skill: SkillDefinition }) => {
  const Icon = SKILL_ICON_BY_ID[skill.id];

  return (
    <div className="flex h-full min-h-0 flex-col justify-center gap-8">
      <div className="flex items-center gap-6">
        <div className="grid size-24 shrink-0 place-items-center rounded-[6px] border border-zinc-400/30 bg-zinc-950/55 text-sky-100 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]">
          <Icon className="size-11" />
        </div>
        <div className="flex min-w-0 flex-col gap-3">
          <span className="text-xs font-black uppercase tracking-[0.26em] text-sky-100/80">
            Skill record
          </span>
          <h2 className="text-5xl font-black uppercase leading-none tracking-[0.08em] text-white max-xl:text-4xl">
            {skill.name}
          </h2>
        </div>
      </div>
      <div className="flex flex-col gap-5 border-y border-white/10 py-6">
        <div className="flex flex-col gap-2">
          <span className="text-xs font-black uppercase tracking-[0.2em] text-sky-100/80">
            Summary
          </span>
          <span className="text-lg font-bold text-zinc-100">{skill.summary}</span>
        </div>
        <div className="flex flex-col gap-2">
          <span className="text-xs font-black uppercase tracking-[0.2em] text-sky-100/80">
            Detail
          </span>
          <span className="text-base leading-7 text-zinc-300">{skill.detail}</span>
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <IntelRow icon={Zap} label="Upgrade effect" tone="cyan" value={getSkillEffect(skill)} />
        <IntelRow
          icon={ShieldPlus}
          label="Maximum stacks"
          tone="violet"
          value={`${SKILL_MAX_STACK_COUNT}`}
        />
      </div>
    </div>
  );
};

export const ArchiveScreen = () => {
  const [activeTab, setActiveTab] = useState<ArchiveTab>(ARCHIVE_TABS.ENEMIES);
  const [discoveredEnemyIds, setDiscoveredEnemyIds] = useState<readonly EnemyTypeId[]>([]);
  const [unlockedSkillIds, setUnlockedSkillIds] = useState<readonly SkillId[]>([]);
  const [selectedEnemyId, setSelectedEnemyId] = useState<EnemyTypeId>(FIRST_ENEMY_ID);
  const [selectedSkillId, setSelectedSkillId] = useState<SkillId>(FIRST_SKILL_ID);
  const setGameSessionPhase = useGameUiStore((state) => state.setGameSessionPhase);

  useEffect(() => {
    let isMounted = true;

    void loadProfileSave().then((result) => {
      if (!isMounted || !result.ok) {
        return;
      }

      setDiscoveredEnemyIds(result.save.discoveredEnemyIds);
      setUnlockedSkillIds(result.save.unlockedSkillIds);
      setSelectedEnemyId(result.save.discoveredEnemyIds[0] ?? FIRST_ENEMY_ID);
      setSelectedSkillId(result.save.unlockedSkillIds[0] ?? FIRST_SKILL_ID);
    });

    return () => {
      isMounted = false;
    };
  }, []);

  const selectedEnemy = ENEMY_DEFINITIONS[selectedEnemyId];
  const selectedSkill = useMemo(
    () => SKILL_DEFINITIONS.find((skill) => skill.id === selectedSkillId) ?? SKILL_DEFINITIONS[0],
    [selectedSkillId]
  );
  const isSelectedEnemyUnlocked = discoveredEnemyIds.includes(selectedEnemyId);
  const isSelectedSkillUnlocked = unlockedSkillIds.includes(selectedSkillId);

  return (
    <section className="relative z-10 flex h-full flex-col gap-5 px-7 py-6 max-md:px-4 max-md:py-4">
      <header>
        <h1 className="text-5xl font-black uppercase leading-none tracking-[0.14em] text-white max-md:text-4xl">
          Archive
        </h1>
      </header>

      <div className="flex min-h-0 flex-1 gap-5 max-lg:flex-col">
        <div className="flex min-h-0 flex-[0.9] flex-col gap-3">
          <div className="flex gap-2">
            <ArchiveTabButton
              isActive={activeTab === ARCHIVE_TABS.ENEMIES}
              label="Enemies"
              onClick={() => setActiveTab(ARCHIVE_TABS.ENEMIES)}
            />
            <ArchiveTabButton
              isActive={activeTab === ARCHIVE_TABS.SKILLS}
              label="Skills"
              onClick={() => setActiveTab(ARCHIVE_TABS.SKILLS)}
            />
          </div>

          <div className="grid min-h-0 flex-1 grid-cols-3 content-start gap-3 overflow-y-auto rounded-[8px] border border-zinc-500/20 bg-zinc-950/42 p-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.035)] max-xl:grid-cols-2 max-lg:grid-cols-5 max-md:grid-cols-3">
            {activeTab === ARCHIVE_TABS.ENEMIES
              ? ENEMY_DEFINITION_LIST.map((enemy) => {
                  const isLocked = !discoveredEnemyIds.includes(enemy.id);

                  return (
                    <ArchiveCard
                      isLocked={isLocked}
                      isSelected={!isLocked && selectedEnemyId === enemy.id}
                      key={enemy.id}
                      label={enemy.name}
                      onClick={() => setSelectedEnemyId(enemy.id)}
                    >
                      <div className="relative grid size-24 place-items-center">
                        <EnemyVisual enemy={enemy} isLocked={isLocked} />
                        {isLocked && (
                          <span className="absolute grid size-11 place-items-center rounded-full border border-zinc-500/25 bg-zinc-950/88 text-zinc-500 shadow-[0_4px_14px_rgba(0,0,0,0.45)]">
                            <LockKeyhole className="size-6 stroke-[1.7]" />
                          </span>
                        )}
                      </div>
                    </ArchiveCard>
                  );
                })
              : SKILL_DEFINITIONS.map((skill) => {
                  const isLocked = !unlockedSkillIds.includes(skill.id);
                  const Icon = SKILL_ICON_BY_ID[skill.id];

                  return (
                    <ArchiveCard
                      isLocked={isLocked}
                      isSelected={!isLocked && selectedSkillId === skill.id}
                      key={skill.id}
                      label={skill.name}
                      onClick={() => setSelectedSkillId(skill.id)}
                    >
                      <div
                        className={cn(
                          "grid size-20 place-items-center rounded-[6px] border border-zinc-400/25 bg-zinc-950/50 text-sky-100 transition",
                          isLocked && "rounded-full border-zinc-700/40 bg-black/20 text-zinc-600"
                        )}
                      >
                        {isLocked ? (
                          <LockKeyhole className="size-7 stroke-[1.7]" />
                        ) : (
                          <Icon className="size-9" />
                        )}
                      </div>
                    </ArchiveCard>
                  );
                })}
          </div>
        </div>

        <div className="min-h-0 flex-[1.1] overflow-y-auto rounded-[8px] border border-zinc-500/20 bg-zinc-950/48 p-7 shadow-[inset_0_1px_0_rgba(255,255,255,0.035)] max-md:p-5">
          {activeTab === ARCHIVE_TABS.ENEMIES ? (
            isSelectedEnemyUnlocked ? (
              <EnemyDetail enemy={selectedEnemy} />
            ) : (
              <LockedDetail message="Encounter this enemy to reveal its archive entry." />
            )
          ) : isSelectedSkillUnlocked ? (
            <SkillDetail skill={selectedSkill} />
          ) : (
            <LockedDetail message="Choose this skill to reveal its archive entry." />
          )}
        </div>
      </div>

      <footer className="flex items-center justify-between gap-5">
        <ScreenButton
          className="h-12 min-w-44"
          onClick={() => setGameSessionPhase(GAME_SESSION_PHASES.IDLE)}
        >
          BACK
        </ScreenButton>
        <span className="text-xs font-black uppercase tracking-[0.18em] text-zinc-600">
          {activeTab === ARCHIVE_TABS.ENEMIES
            ? `${discoveredEnemyIds.length} / ${ENEMY_DEFINITION_LIST.length} discovered`
            : `${unlockedSkillIds.length} / ${SKILL_DEFINITIONS.length} unlocked`}
        </span>
      </footer>
    </section>
  );
};
