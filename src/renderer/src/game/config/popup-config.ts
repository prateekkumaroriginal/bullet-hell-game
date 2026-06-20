import { ENEMY_TYPE_IDS, type EnemyTypeId } from "./enemy-config";
import { SKILL_IDS, type SkillId } from "./skill-config";

export const POPUP_STORAGE_KEY = "bullet-hell-game:seen-popups";
export const POPUP_MODAL_DISMISSAL_FALLBACK_DELAY_MS = 1000;
export const POPUP_TOAST_DURATION_MS = 4200;
export const POPUP_MAX_TOAST_COUNT = 3;

export const POPUP_MODES = {
  MODAL: "modal",
  TOAST: "toast",
} as const;

export type PopupMode =
  (typeof POPUP_MODES)[keyof typeof POPUP_MODES];

export const POPUP_IDS = {
  CONTROLS: "controls.basic",
  ENEMY_CHASER: "enemy.chaser.first-seen",
  ENEMY_RUSHER: "enemy.rusher.first-seen",
  ENEMY_TANK: "enemy.tank.first-seen",
  SKILL_RAPID_FIRE: "skill.rapid-fire.picked",
  SKILL_HEAVY_SHOT: "skill.heavy-shot.picked",
  SKILL_FLEET_FOOTED: "skill.fleet-footed.picked",
  SKILL_MAGNET_CORE: "skill.magnet-core.picked",
  SKILL_REINFORCED_HULL: "skill.reinforced-hull.picked",
} as const;

export type PopupId = (typeof POPUP_IDS)[keyof typeof POPUP_IDS];

export type PopupDefinition = {
  id: PopupId;
  mode: PopupMode;
  eyebrow: string;
  title: string;
  body: string;
  presentation?: PopupPresentation;
};

export const POPUP_VISUALS = {
  CONTROLS: "controls",
  CHASER: "chaser",
  RUSHER: "rusher",
  TANK: "tank"
} as const;

export type PopupVisual =
  (typeof POPUP_VISUALS)[keyof typeof POPUP_VISUALS];

export const ENEMY_TYPE_BY_POPUP_VISUAL = {
  [POPUP_VISUALS.CHASER]: ENEMY_TYPE_IDS.CHASER,
  [POPUP_VISUALS.RUSHER]: ENEMY_TYPE_IDS.RUSHER,
  [POPUP_VISUALS.TANK]: ENEMY_TYPE_IDS.TANK
} as const satisfies Partial<Record<PopupVisual, EnemyTypeId>>;

export const POPUP_ENEMY_PREVIEW_SIZE = 320;
export const POPUP_ENEMY_PREVIEW_SCALE = 4;

export const POPUP_METADATA_ICONS = {
  SPEED: "speed",
  BEHAVIOR: "behavior",
  THREAT: "threat"
} as const;

export type PopupMetadataIcon =
  (typeof POPUP_METADATA_ICONS)[keyof typeof POPUP_METADATA_ICONS];

export type PopupMetadata = {
  label: string;
  value: string;
  icon: PopupMetadataIcon;
  tone: "cyan" | "violet" | "rose";
};

export type PopupPresentation = {
  visual: PopupVisual;
  metadata?: readonly PopupMetadata[];
};

export type PopupState = PopupDefinition & {
  shownAtMs: number;
};

export const POPUP_DEFINITIONS = {
  [POPUP_IDS.CONTROLS]: {
    id: POPUP_IDS.CONTROLS,
    mode: POPUP_MODES.MODAL,
    eyebrow: "Pilot Briefing",
    title: "Keep moving",
    body: "Move with WASD or arrow keys. Aim with the cursor. Your weapon fires toward your aim automatically.",
    presentation: {
      visual: POPUP_VISUALS.CONTROLS
    }
  },
  [POPUP_IDS.ENEMY_CHASER]: {
    id: POPUP_IDS.ENEMY_CHASER,
    mode: POPUP_MODES.MODAL,
    eyebrow: "Enemy Intel",
    title: "Chaser",
    body: "Tracks directly toward you. Circle wide before the arena gets crowded.",
    presentation: {
      visual: POPUP_VISUALS.CHASER,
      metadata: [
        {
          label: "Speed",
          value: "Fast",
          icon: POPUP_METADATA_ICONS.SPEED,
          tone: "cyan"
        },
        {
          label: "Behavior",
          value: "Tracks player",
          icon: POPUP_METADATA_ICONS.BEHAVIOR,
          tone: "violet"
        },
        {
          label: "Threat",
          value: "Moderate",
          icon: POPUP_METADATA_ICONS.THREAT,
          tone: "rose"
        }
      ]
    }
  },
  [POPUP_IDS.ENEMY_RUSHER]: {
    id: POPUP_IDS.ENEMY_RUSHER,
    mode: POPUP_MODES.MODAL,
    eyebrow: "Enemy Intel",
    title: "Rusher",
    body: "Fast and fragile. Clear space early so it cannot force a panic turn.",
    presentation: {
      visual: POPUP_VISUALS.RUSHER,
      metadata: [
        {
          label: "Speed",
          value: "Very fast",
          icon: POPUP_METADATA_ICONS.SPEED,
          tone: "cyan"
        },
        {
          label: "Behavior",
          value: "Rushes player",
          icon: POPUP_METADATA_ICONS.BEHAVIOR,
          tone: "violet"
        },
        {
          label: "Threat",
          value: "High",
          icon: POPUP_METADATA_ICONS.THREAT,
          tone: "rose"
        }
      ]
    }
  },
  [POPUP_IDS.ENEMY_TANK]: {
    id: POPUP_IDS.ENEMY_TANK,
    mode: POPUP_MODES.MODAL,
    eyebrow: "Enemy Intel",
    title: "Tank",
    body: "Slow, heavy, and worth more experience. Kite it while thinning the smaller enemies.",
    presentation: {
      visual: POPUP_VISUALS.TANK,
      metadata: [
        {
          label: "Speed",
          value: "Slow",
          icon: POPUP_METADATA_ICONS.SPEED,
          tone: "cyan"
        },
        {
          label: "Behavior",
          value: "Absorbs fire",
          icon: POPUP_METADATA_ICONS.BEHAVIOR,
          tone: "violet"
        },
        {
          label: "Threat",
          value: "Severe",
          icon: POPUP_METADATA_ICONS.THREAT,
          tone: "rose"
        }
      ]
    }
  },
  [POPUP_IDS.SKILL_RAPID_FIRE]: {
    id: POPUP_IDS.SKILL_RAPID_FIRE,
    mode: POPUP_MODES.TOAST,
    eyebrow: "Skill Online",
    title: "Rapid Fire",
    body: "Your weapon cycles faster. More shots means more pressure, but aim still matters.",
  },
  [POPUP_IDS.SKILL_HEAVY_SHOT]: {
    id: POPUP_IDS.SKILL_HEAVY_SHOT,
    mode: POPUP_MODES.TOAST,
    eyebrow: "Skill Online",
    title: "Heavy Shot",
    body: "Each hit lands harder. Strong against tougher targets and crowded lanes.",
  },
  [POPUP_IDS.SKILL_FLEET_FOOTED]: {
    id: POPUP_IDS.SKILL_FLEET_FOOTED,
    mode: POPUP_MODES.TOAST,
    eyebrow: "Skill Online",
    title: "Fleet Footed",
    body: "Your movement speed is up. Use the extra pace to keep escape routes open.",
  },
  [POPUP_IDS.SKILL_MAGNET_CORE]: {
    id: POPUP_IDS.SKILL_MAGNET_CORE,
    mode: POPUP_MODES.TOAST,
    eyebrow: "Skill Online",
    title: "Magnet Core",
    body: "Experience orbs pull in from farther away. Safer collection means faster scaling.",
  },
  [POPUP_IDS.SKILL_REINFORCED_HULL]: {
    id: POPUP_IDS.SKILL_REINFORCED_HULL,
    mode: POPUP_MODES.TOAST,
    eyebrow: "Skill Online",
    title: "Reinforced Hull",
    body: "Maximum health increased. It gives breathing room, not permission to stop dodging.",
  },
} as const satisfies Record<PopupId, PopupDefinition>;

export const ENEMY_POPUP_ID_BY_TYPE = {
  [ENEMY_TYPE_IDS.CHASER]: POPUP_IDS.ENEMY_CHASER,
  [ENEMY_TYPE_IDS.RUSHER]: POPUP_IDS.ENEMY_RUSHER,
  [ENEMY_TYPE_IDS.TANK]: POPUP_IDS.ENEMY_TANK,
} as const satisfies Record<EnemyTypeId, PopupId>;

export const SKILL_POPUP_ID_BY_SKILL = {
  [SKILL_IDS.RAPID_FIRE]: POPUP_IDS.SKILL_RAPID_FIRE,
  [SKILL_IDS.HEAVY_SHOT]: POPUP_IDS.SKILL_HEAVY_SHOT,
  [SKILL_IDS.FLEET_FOOTED]: POPUP_IDS.SKILL_FLEET_FOOTED,
  [SKILL_IDS.MAGNET_CORE]: POPUP_IDS.SKILL_MAGNET_CORE,
  [SKILL_IDS.REINFORCED_HULL]: POPUP_IDS.SKILL_REINFORCED_HULL,
} as const satisfies Record<SkillId, PopupId>;
