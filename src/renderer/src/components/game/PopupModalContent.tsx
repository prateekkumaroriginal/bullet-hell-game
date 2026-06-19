import type { ReactNode } from "react";
import {
  ChevronsRight,
  Crosshair,
  Keyboard,
  Orbit,
  ShieldAlert,
  Skull
} from "lucide-react";
import {
  ENEMY_TYPE_BY_POPUP_VISUAL,
  POPUP_METADATA_ICONS,
  POPUP_ENEMY_PREVIEW_SCALE,
  POPUP_ENEMY_PREVIEW_SIZE,
  type PopupMetadata,
  type PopupState,
  type PopupVisual
} from "@/game/config/popup-config";
import {
  ENEMY_DEFINITIONS,
  ENEMY_STROKE_WIDTH
} from "@/game/config/enemy-config";
import {
  DialogDescription,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";

const METADATA_TONE_CLASSES = {
  cyan: "text-cyan-300",
  violet: "text-violet-300",
  rose: "text-rose-400"
} as const;

const METADATA_ICON_BY_TYPE = {
  [POPUP_METADATA_ICONS.SPEED]: ChevronsRight,
  [POPUP_METADATA_ICONS.BEHAVIOR]: Orbit,
  [POPUP_METADATA_ICONS.THREAT]: Skull
} as const;

type PopupModalContentProps = {
  footer: ReactNode;
  popup: PopupState;
};

const toCssHexColor = (color: number): string =>
  `#${color.toString(16).padStart(6, "0")}`;

const isEnemyPopupVisual = (
  visual: PopupVisual
): visual is keyof typeof ENEMY_TYPE_BY_POPUP_VISUAL =>
  visual in ENEMY_TYPE_BY_POPUP_VISUAL;

const EnemyPreview = ({
  visual
}: {
  visual: keyof typeof ENEMY_TYPE_BY_POPUP_VISUAL;
}) => {
  const enemyDefinition = ENEMY_DEFINITIONS[ENEMY_TYPE_BY_POPUP_VISUAL[visual]];
  const center = POPUP_ENEMY_PREVIEW_SIZE / 2;

  return (
    <svg
      aria-label={`${enemyDefinition.id} enemy`}
      className="h-full w-full overflow-visible"
      role="img"
      viewBox={`0 0 ${POPUP_ENEMY_PREVIEW_SIZE} ${POPUP_ENEMY_PREVIEW_SIZE}`}
    >
      <circle
        cx={center}
        cy={center}
        fill={toCssHexColor(enemyDefinition.fillColor)}
        r={enemyDefinition.radius * POPUP_ENEMY_PREVIEW_SCALE}
        stroke={toCssHexColor(enemyDefinition.strokeColor)}
        strokeWidth={ENEMY_STROKE_WIDTH * POPUP_ENEMY_PREVIEW_SCALE}
      />
    </svg>
  );
};

const PopupVisualPanel = ({ visual }: { visual?: PopupVisual }) => (
  <div className="popup-intel-visual relative grid min-h-0 flex-[0.9] place-items-center overflow-hidden rounded-[1.35rem] max-md:min-h-64 max-md:flex-none">
    {visual && isEnemyPopupVisual(visual) ? (
      <div className="relative aspect-square w-[min(82%,19rem)] drop-shadow-[0_0_2rem_rgba(255,49,95,0.28)]">
        <EnemyPreview visual={visual} />
      </div>
    ) : (
      <div className="relative flex flex-col items-center gap-5 text-cyan-200">
        <div className="relative grid size-32 place-items-center rounded-full border border-cyan-300/35 bg-cyan-950/35 shadow-[0_0_2.5rem_rgba(34,211,238,0.2)]">
          <div className="absolute inset-3 rounded-full border border-dashed border-cyan-300/25" />
          <Keyboard className="size-14 stroke-[1.4]" />
        </div>
        <span className="text-xs font-black uppercase tracking-[0.32em] text-cyan-300/70">Flight controls</span>
      </div>
    )}
  </div>
);

const MetadataRow = ({ item }: { item: PopupMetadata }) => {
  const Icon = METADATA_ICON_BY_TYPE[item.icon];
  const toneClassName = METADATA_TONE_CLASSES[item.tone];

  return (
    <div className="flex min-h-12 items-center gap-3 rounded-lg border border-white/10 bg-white/[0.025] px-4 py-2">
      <Icon className={`size-5 shrink-0 ${toneClassName}`} />
      <span className={`text-xs font-black uppercase tracking-[0.18em] ${toneClassName}`}>
        {item.label}
      </span>
      <span className="min-w-0 flex-1 text-right text-xs font-bold uppercase tracking-[0.06em] text-zinc-100">
        {item.value}
      </span>
    </div>
  );
};

export const PopupModalContent = ({ footer, popup }: PopupModalContentProps) => (
  <div className="flex min-h-0 flex-1 gap-9 max-md:flex-col max-md:gap-5">
    <PopupVisualPanel visual={popup.presentation?.visual} />
    <div className="flex min-w-0 flex-[1.1] flex-col gap-8 max-md:gap-5">
      <div className="flex flex-col gap-6 max-md:gap-4">
        <DialogHeader className="min-w-0 gap-4 text-left">
          <div className="flex items-center gap-3 text-sm font-black uppercase tracking-[0.28em] text-cyan-300 drop-shadow-[0_0_0.75rem_rgba(34,211,238,0.4)]">
            <Crosshair className="size-5 stroke-[1.8]" />
            {popup.eyebrow}
          </div>
          <DialogTitle className="text-6xl font-black uppercase leading-none tracking-[0.08em] text-white drop-shadow-[0_0_1.25rem_rgba(255,255,255,0.12)] max-lg:text-5xl max-md:text-4xl">
            {popup.title}
          </DialogTitle>
          <div className="flex items-center gap-2">
            <span className="h-px flex-1 bg-gradient-to-r from-cyan-300/80 to-cyan-300/15" />
            <span className="size-1 rotate-45 bg-cyan-300" />
            <span className="size-1 rotate-45 bg-cyan-300/60" />
          </div>
          <DialogDescription className="text-lg leading-8 text-zinc-200 max-md:text-base max-md:leading-7">
            {popup.body}
          </DialogDescription>
        </DialogHeader>

        {popup.presentation?.metadata && (
          <div className="flex flex-col gap-2">
            {popup.presentation.metadata.map((item) => (
              <MetadataRow item={item} key={item.label} />
            ))}
          </div>
        )}

        {!popup.presentation?.metadata && (
          <div className="flex items-center gap-3 rounded-lg border border-cyan-300/15 bg-cyan-300/[0.04] px-4 py-3 text-sm text-cyan-100/80">
            <ShieldAlert className="size-5 shrink-0 text-cyan-300" />
            Stay mobile. The weapon system handles firing automatically.
          </div>
        )}
      </div>
      {footer}
    </div>
  </div>
);
