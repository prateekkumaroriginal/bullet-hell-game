import type { ReactNode } from "react";
import {
  MAIN_MENU_VARIATIONS,
  type MainMenuVariantId
} from "@/game/config/main-menu-config";
import { CommandMapMenu } from "./main-menu/CommandMapMenu";
import { RetroArcadeMenu } from "./main-menu/RetroArcadeMenu";
import { RogueAiMenu } from "./main-menu/RogueAiMenu";
import { SmugglerManifestMenu } from "./main-menu/SmugglerManifestMenu";
import { SquadRosterMenu } from "./main-menu/SquadRosterMenu";
import type { MainMenuVariantProps } from "./main-menu/main-menu-types";

type MainMenuVariantComponent = (props: MainMenuVariantProps) => ReactNode;

const MAIN_MENU_VARIANT_COMPONENTS = {
  [MAIN_MENU_VARIATIONS.RETRO]: RetroArcadeMenu,
  [MAIN_MENU_VARIATIONS.COMMAND]: CommandMapMenu,
  [MAIN_MENU_VARIATIONS.SMUGGLER]: SmugglerManifestMenu,
  [MAIN_MENU_VARIATIONS.SQUAD]: SquadRosterMenu,
  [MAIN_MENU_VARIATIONS.ROGUE]: RogueAiMenu
} as const satisfies Record<MainMenuVariantId, MainMenuVariantComponent>;

export const MainMenuVariant = ({
  actions,
  variant
}: MainMenuVariantProps & { variant: MainMenuVariantId }) => {
  const ActiveVariant = MAIN_MENU_VARIANT_COMPONENTS[variant];

  return <ActiveVariant actions={actions} />;
};
