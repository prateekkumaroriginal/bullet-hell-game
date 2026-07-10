import spaceportNightlifeUrl from "../../../../../assets/menu/spaceport-nightlife.png?url";
import salvageRigUrl from "../../../../../assets/menu/salvage-rig.png?url";
import anomalyLabUrl from "../../../../../assets/menu/anomaly-lab.png?url";
import warfrontUrl from "../../../../../assets/menu/warfront.png?url";
import astralSynthTempleUrl from "../../../../../assets/menu/astral-synth-temple.png?url";

export const MENU_VARIATION_IDS = {
  SPACEPORT: "spaceport",
  SALVAGE: "salvage",
  ANOMALY: "anomaly",
  WARFRONT: "warfront",
  TEMPLE: "temple"
} as const;

export type MenuVariationId =
  (typeof MENU_VARIATION_IDS)[keyof typeof MENU_VARIATION_IDS];

export type MenuVariationTheme = {
  accent: string;
  accentBright: string;
  accentMuted: string;
  ink: string;
  paper: string;
  panel: string;
  displayFont: string;
  bodyFont: string;
};

export type MenuVariationDefinition = {
  id: MenuVariationId;
  index: string;
  name: string;
  shortName: string;
  premise: string;
  artUrl: string;
  theme: MenuVariationTheme;
};

export const MENU_VARIATION_QUERY_PARAM = "menu";
export const MENU_VARIATION_KEY_BY_INDEX: Readonly<Record<string, MenuVariationId>> = {
  "1": MENU_VARIATION_IDS.SPACEPORT,
  "2": MENU_VARIATION_IDS.SALVAGE,
  "3": MENU_VARIATION_IDS.ANOMALY,
  "4": MENU_VARIATION_IDS.WARFRONT,
  "5": MENU_VARIATION_IDS.TEMPLE
};

export const MENU_VARIATION_COUNT = Object.keys(MENU_VARIATION_KEY_BY_INDEX).length;
export const MENU_STAGE_LABEL_WIDTH = 2;
export const MENU_ART_OPACITY = 0.82;
export const MENU_ART_BLUR_PX = 0;
export const MENU_ART_TRANSITION_MS = 280;
export const MENU_REVEAL_DURATION_MS = 620;
export const MENU_REVEAL_STAGGER_MS = 80;
export const MENU_ANOMALY_ROTATION_DURATION_MS = 18000;
export const MENU_TEMPLE_PULSE_DURATION_MS = 5200;

export const MENU_VARIATION_DEFINITIONS = [
  {
    id: MENU_VARIATION_IDS.SPACEPORT,
    index: "01",
    name: "Spaceport Nightlife Mission Board",
    shortName: "Nightlife",
    premise: "Electric city-night social hub for unlicensed launches.",
    artUrl: spaceportNightlifeUrl,
    theme: {
      accent: "#f43fba",
      accentBright: "#ffd0f1",
      accentMuted: "#f18ccf",
      ink: "#130914",
      paper: "#fff8fd",
      panel: "#1b0b1b",
      displayFont: "'Arial Narrow', 'Trebuchet MS', sans-serif",
      bodyFont: "'Geist Variable', sans-serif"
    }
  },
  {
    id: MENU_VARIATION_IDS.SALVAGE,
    index: "02",
    name: "Salvage Rig Locker Room",
    shortName: "Salvage",
    premise: "A blue-collar prep bay where every bolt earns another sortie.",
    artUrl: salvageRigUrl,
    theme: {
      accent: "#ff9e3d",
      accentBright: "#ffe0a8",
      accentMuted: "#a8dfff",
      ink: "#090d0e",
      paper: "#f6f3e9",
      panel: "#13191a",
      displayFont: "'Courier New', monospace",
      bodyFont: "'Arial Narrow', 'Trebuchet MS', sans-serif"
    }
  },
  {
    id: MENU_VARIATION_IDS.ANOMALY,
    index: "03",
    name: "Deep-Space Anomaly Lab",
    shortName: "Anomaly",
    premise: "Science, ritual, and one impossible signal that answers back.",
    artUrl: anomalyLabUrl,
    theme: {
      accent: "#b9f5ff",
      accentBright: "#f0fdff",
      accentMuted: "#b8a7ff",
      ink: "#061115",
      paper: "#eefbfa",
      panel: "#09181d",
      displayFont: "Georgia, 'Times New Roman', serif",
      bodyFont: "'Geist Variable', sans-serif"
    }
  },
  {
    id: MENU_VARIATION_IDS.WARFRONT,
    index: "04",
    name: "Planetary Siege Warfront",
    shortName: "Warfront",
    premise: "A conflict bulletin built to turn fear into forward motion.",
    artUrl: warfrontUrl,
    theme: {
      accent: "#ff3e4f",
      accentBright: "#fff4e7",
      accentMuted: "#62bdff",
      ink: "#130d0d",
      paper: "#fff5ea",
      panel: "#181112",
      displayFont: "'Arial Black', 'Arial Narrow', sans-serif",
      bodyFont: "'Arial Narrow', 'Trebuchet MS', sans-serif"
    }
  },
  {
    id: MENU_VARIATION_IDS.TEMPLE,
    index: "05",
    name: "Astral Synth Temple",
    shortName: "Temple",
    premise: "A refined cyber-mystic threshold for the next descent.",
    artUrl: astralSynthTempleUrl,
    theme: {
      accent: "#d6c4ff",
      accentBright: "#fff9f0",
      accentMuted: "#f2b8dc",
      ink: "#090815",
      paper: "#fcf5ff",
      panel: "#111125",
      displayFont: "'Palatino Linotype', Palatino, Georgia, serif",
      bodyFont: "'Geist Variable', sans-serif"
    }
  }
] as const satisfies readonly MenuVariationDefinition[];

export const DEFAULT_MENU_VARIATION_ID = MENU_VARIATION_IDS.SPACEPORT;

export function isMenuVariationId(value: string | null): value is MenuVariationId {
  return MENU_VARIATION_DEFINITIONS.some((definition) => definition.id === value);
}

export function getMenuVariationDefinition(
  variationId: MenuVariationId
): MenuVariationDefinition {
  const definition = MENU_VARIATION_DEFINITIONS.find(
    (candidate) => candidate.id === variationId
  );

  if (!definition) {
    throw new Error(`Missing menu variation definition for ${variationId}.`);
  }

  return definition;
}

export function getMenuVariationIdFromSearch(search: string): MenuVariationId {
  const requestedVariation = new URLSearchParams(search).get(
    MENU_VARIATION_QUERY_PARAM
  );

  return isMenuVariationId(requestedVariation)
    ? requestedVariation
    : DEFAULT_MENU_VARIATION_ID;
}
