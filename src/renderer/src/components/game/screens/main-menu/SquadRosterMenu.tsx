import { MinimalMainMenu } from "./main-menu-primitives";
import type { MainMenuVariantProps } from "./main-menu-types";

export const SquadRosterMenu = ({ actions }: MainMenuVariantProps) => (
  <MinimalMainMenu actions={actions} ariaLabel="Main menu" />
);
