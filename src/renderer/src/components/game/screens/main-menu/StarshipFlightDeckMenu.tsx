import { MAIN_MENU_VARIANTS } from "@/game/config/main-menu-config";
import { MinimalMainMenu, type MinimalMainMenuProps } from "./MainMenuPrimitives";

export const StarshipFlightDeckMenu = (props: Omit<MinimalMainMenuProps, "variant">) => (
  <MinimalMainMenu {...props} variant={MAIN_MENU_VARIANTS.FLIGHT_DECK} />
);
