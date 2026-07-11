import { MinimalMainMenu } from "./main-menu-primitives";
import type { MainMenuVariantProps } from "./main-menu-types";

export const RetroArcadeMenu = ({ actions }: MainMenuVariantProps) => (
  <MinimalMainMenu
    actions={actions}
    ariaLabel="Retro arcade main menu"
    className="minimal-main-menu--retro"
  />
);
