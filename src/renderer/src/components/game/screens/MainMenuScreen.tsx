import {
  GAME_TITLE,
  MENU_BUTTONS,
  SCREEN_PRIMARY_STAGE_ID,
} from "@/game/config/screen-ui-config";
import {
  emitGameplayCommand,
  GAMEPLAY_COMMANDS,
} from "@/game/events/gameplay-commands";
import {
  ScreenButton,
  ScreenCenter,
  ScreenMenuGrid,
  ScreenTitle,
} from "./ScreenPrimitives";
import { quitToDesktop } from "./screen-actions";

export const MainMenuScreen = () => (
  <ScreenCenter>
    <div className="flex flex-col items-center gap-10">
      <ScreenTitle variant="main">{GAME_TITLE}</ScreenTitle>
      <ScreenMenuGrid variant="main">
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
        <ScreenButton onClick={quitToDesktop}>
          {MENU_BUTTONS.main[1]}
        </ScreenButton>
      </ScreenMenuGrid>
    </div>
  </ScreenCenter>
);
