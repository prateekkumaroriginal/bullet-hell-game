import retroArcadeBackgroundUrl from "../../../../../assets/menu/retro-arcade.png?url";
import commandMapBackgroundUrl from "../../../../../assets/menu/command-map.png?url";
import smugglerCargoBackgroundUrl from "../../../../../assets/menu/smuggler-cargo.png?url";
import squadRosterBackgroundUrl from "../../../../../assets/menu/squad-roster.png?url";
import rogueTerminalBackgroundUrl from "../../../../../assets/menu/rogue-terminal.png?url";

export const MAIN_MENU_VARIATIONS = {
  RETRO: "retro",
  COMMAND: "command",
  SMUGGLER: "smuggler",
  SQUAD: "squad",
  ROGUE: "rogue"
} as const;

export type MainMenuVariantId =
  (typeof MAIN_MENU_VARIATIONS)[keyof typeof MAIN_MENU_VARIATIONS];

export const MAIN_MENU_VARIANT_IDS = [
  MAIN_MENU_VARIATIONS.RETRO,
  MAIN_MENU_VARIATIONS.COMMAND,
  MAIN_MENU_VARIATIONS.SMUGGLER,
  MAIN_MENU_VARIATIONS.SQUAD,
  MAIN_MENU_VARIATIONS.ROGUE
] as const satisfies readonly MainMenuVariantId[];

export type MainMenuVariantDefinition = {
  id: MainMenuVariantId;
  name: string;
  shortName: string;
  premise: string;
  backgroundUrl: string;
};

export const MAIN_MENU_VARIATION_DEFINITIONS = {
  [MAIN_MENU_VARIATIONS.RETRO]: {
    id: MAIN_MENU_VARIATIONS.RETRO,
    name: "Retro CRT Arcade",
    shortName: "CRT ATTRACT",
    premise: "An action cabinet caught in its own demo loop.",
    backgroundUrl: retroArcadeBackgroundUrl
  },
  [MAIN_MENU_VARIATIONS.COMMAND]: {
    id: MAIN_MENU_VARIATIONS.COMMAND,
    name: "Militarized Command Map",
    shortName: "COMMAND MAP",
    premise: "A tactical sector room that turns a menu into a sortie order.",
    backgroundUrl: commandMapBackgroundUrl
  },
  [MAIN_MENU_VARIATIONS.SMUGGLER]: {
    id: MAIN_MENU_VARIATIONS.SMUGGLER,
    name: "Smuggler's Cargo Manifest",
    shortName: "CARGO MANIFEST",
    premise: "A contraband ledger where every action feels one scan away.",
    backgroundUrl: smugglerCargoBackgroundUrl
  },
  [MAIN_MENU_VARIATIONS.SQUAD]: {
    id: MAIN_MENU_VARIATIONS.SQUAD,
    name: "Holographic Squad Roster",
    shortName: "SQUAD ROSTER",
    premise: "A character-forward briefing room for a one-ship strike team.",
    backgroundUrl: squadRosterBackgroundUrl
  },
  [MAIN_MENU_VARIATIONS.ROGUE]: {
    id: MAIN_MENU_VARIATIONS.ROGUE,
    name: "Rogue AI Breach Terminal",
    shortName: "BREACH TERMINAL",
    premise: "A precise security intrusion that keeps the controls legible.",
    backgroundUrl: rogueTerminalBackgroundUrl
  }
} as const satisfies Record<MainMenuVariantId, MainMenuVariantDefinition>;

export const DEFAULT_MAIN_MENU_VARIANT = MAIN_MENU_VARIATIONS.RETRO;

export function isMainMenuVariantId(
  value: string | null
): value is MainMenuVariantId {
  return value !== null && MAIN_MENU_VARIANT_IDS.includes(value as MainMenuVariantId);
}

export function readMainMenuVariant(): MainMenuVariantId {
  const queryVariant = new URLSearchParams(window.location.search).get("menu");

  if (isMainMenuVariantId(queryVariant)) {
    return queryVariant;
  }

  const configuredVariant = import.meta.env.VITE_MAIN_MENU_VARIANT;

  if (isMainMenuVariantId(configuredVariant)) {
    return configuredVariant;
  }

  return DEFAULT_MAIN_MENU_VARIANT;
}
