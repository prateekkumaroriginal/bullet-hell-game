import { MAIN_MENU_VARIANTS } from "@/game/config/main-menu-config";
import { MinimalMainMenu } from "./MainMenuPrimitives";
import type { MainMenuActions } from "./main-menu-types";

export const BlackMarketBountyMenu = ({ actions }: { actions: MainMenuActions }) => (
  <MinimalMainMenu actions={actions} variant={MAIN_MENU_VARIANTS.BLACK_MARKET} />
);
