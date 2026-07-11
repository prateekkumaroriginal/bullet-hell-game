import { MinimalMainMenu } from "./main-menu-primitives";
import type { MainMenuVariantProps } from "./main-menu-types";

export const SmugglerManifestMenu = ({ actions }: MainMenuVariantProps) => (
  <MinimalMainMenu
    actions={actions}
    ariaLabel="Smuggler cargo manifest main menu"
    className="minimal-main-menu--smuggler"
  />
);
