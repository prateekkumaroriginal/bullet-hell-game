import flightDeckBackgroundUrl from "../../../../../assets/menu/flight-deck-background.png?url";
import blackMarketBackgroundUrl from "../../../../../assets/menu/black-market-background.png?url";
import derelictStationBackgroundUrl from "../../../../../assets/menu/derelict-station-background.png?url";
import shipyardBackgroundUrl from "../../../../../assets/menu/shipyard-background.png?url";
import orbitalElevatorBackgroundUrl from "../../../../../assets/menu/orbital-elevator-background.png?url";

export const MAIN_MENU_VARIANTS = {
  FLIGHT_DECK: "flight-deck",
  BLACK_MARKET: "black-market",
  DERELICT_STATION: "derelict-station",
  SHIPYARD: "shipyard",
  ORBITAL_ELEVATOR: "orbital-elevator"
} as const;

export type MainMenuVariant =
  (typeof MAIN_MENU_VARIANTS)[keyof typeof MAIN_MENU_VARIANTS];

export type MainMenuVariantOption = {
  id: MainMenuVariant;
  displayNumber: string;
  shortLabel: string;
  label: string;
  backgroundUrl: string;
  backgroundPosition: string;
  accent: string;
};

export const MAIN_MENU_VARIANT_OPTIONS = [
  {
    id: MAIN_MENU_VARIANTS.FLIGHT_DECK,
    displayNumber: "01",
    shortLabel: "FLIGHT DECK",
    label: "STARSHIP FLIGHT DECK",
    backgroundUrl: flightDeckBackgroundUrl,
    backgroundPosition: "center center",
    accent: "#a6ecff"
  },
  {
    id: MAIN_MENU_VARIANTS.BLACK_MARKET,
    displayNumber: "02",
    shortLabel: "BOUNTY TERMINAL",
    label: "BLACK-MARKET BOUNTY TERMINAL",
    backgroundUrl: blackMarketBackgroundUrl,
    backgroundPosition: "center center",
    accent: "#f0ad4e"
  },
  {
    id: MAIN_MENU_VARIANTS.DERELICT_STATION,
    displayNumber: "03",
    shortLabel: "DISTRESS BROADCAST",
    label: "DERELICT STATION DISTRESS BROADCAST",
    backgroundUrl: derelictStationBackgroundUrl,
    backgroundPosition: "center center",
    accent: "#ff5e62"
  },
  {
    id: MAIN_MENU_VARIANTS.SHIPYARD,
    displayNumber: "04",
    shortLabel: "LAUNCH BAY",
    label: "NEON SHIPYARD LAUNCH BAY",
    backgroundUrl: shipyardBackgroundUrl,
    backgroundPosition: "center center",
    accent: "#ff3cae"
  },
  {
    id: MAIN_MENU_VARIANTS.ORBITAL_ELEVATOR,
    displayNumber: "05",
    shortLabel: "CLEARANCE",
    label: "ORBITAL ELEVATOR CLEARANCE",
    backgroundUrl: orbitalElevatorBackgroundUrl,
    backgroundPosition: "center center",
    accent: "#e45b5e"
  }
] as const satisfies readonly MainMenuVariantOption[];

export const MAIN_MENU_DEFAULT_VARIANT = MAIN_MENU_VARIANTS.FLIGHT_DECK;

export const MAIN_MENU_QUERY_KEYS = {
  VARIANT: "menuVariant"
} as const;

export function isMainMenuVariant(
  value: string | null | undefined
): value is MainMenuVariant {
  return MAIN_MENU_VARIANT_OPTIONS.some((option) => option.id === value);
}

export function getMainMenuVariantOption(
  variant: MainMenuVariant
): MainMenuVariantOption {
  const option = MAIN_MENU_VARIANT_OPTIONS.find((candidate) => candidate.id === variant);

  if (!option) {
    throw new Error(`Missing main menu variant definition for ${variant}.`);
  }

  return option;
}

export function getMainMenuVariant(): MainMenuVariant {
  const queryVariant =
    typeof window === "undefined"
      ? null
      : new URLSearchParams(window.location.search).get(
          MAIN_MENU_QUERY_KEYS.VARIANT
        );

  if (isMainMenuVariant(queryVariant)) {
    return queryVariant;
  }

  const configuredVariant = import.meta.env.VITE_MAIN_MENU_VARIANT;

  if (isMainMenuVariant(configuredVariant)) {
    return configuredVariant;
  }

  return MAIN_MENU_DEFAULT_VARIANT;
}
