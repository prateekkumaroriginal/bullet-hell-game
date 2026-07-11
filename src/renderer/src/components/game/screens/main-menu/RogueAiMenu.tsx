import { MinimalMainMenu } from "./main-menu-primitives";
import type { MainMenuVariantProps } from "./main-menu-types";

export const RogueAiMenu = ({ actions }: MainMenuVariantProps) => (
  <MinimalMainMenu
    actions={actions}
    ariaLabel="Rogue AI breach terminal main menu"
    className="minimal-main-menu--rogue"
  />
);
