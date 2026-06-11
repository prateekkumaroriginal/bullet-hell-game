import {
  GAME_TITLE,
  MENU_BUTTONS,
  SCREEN_PRIMARY_STAGE_ID,
} from "@/game/config/screen-ui-config";
import {
  emitGameplayCommand,
  GAMEPLAY_COMMANDS,
} from "@/game/events/gameplay-commands";
import { ScreenButton, ScreenCenter, ScreenTitle } from "./ScreenPrimitives";
import { quitToDesktop } from "./screen-actions";

export const MainMenuScreen = () => (
  <ScreenCenter>
    <ScreenTitle className="mb-10 text-7xl max-md:text-5xl">
      {GAME_TITLE}
    </ScreenTitle>
    <div className="grid w-[min(31rem,calc(100vw-3rem))] gap-3">
      <ScreenButton
        autoFocus
        onClick={() => {
          emitGameplayCommand(GAMEPLAY_COMMANDS.START_GAME, {
            selectedStageId: SCREEN_PRIMARY_STAGE_ID,
          });
        }}
      >
        {MENU_BUTTONS.main[0]}
      </ScreenButton>
      <ScreenButton onClick={quitToDesktop}>{MENU_BUTTONS.main[1]}</ScreenButton>
    </div>
  </ScreenCenter>
);
