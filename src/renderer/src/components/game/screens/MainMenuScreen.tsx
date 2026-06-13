import {
  GAME_TITLE,
  MENU_BUTTONS,
} from "@/game/config/screen-ui-config";
import { GAME_SESSION_PHASES } from "@/game/state/game-session-state";
import { useGameUiStore } from "@/game/state/use-game-ui-store";
import {
  ScreenButton,
  ScreenCenter,
  ScreenMenuGrid,
  ScreenTitle,
} from "./ScreenPrimitives";
import { quitToDesktop } from "./screen-actions";

export const MainMenuScreen = () => {
  const setGameSessionPhase = useGameUiStore(
    (state) => state.setGameSessionPhase,
  );

  return (
    <ScreenCenter>
      <div className="flex flex-col items-center gap-10">
        <ScreenTitle variant="main">{GAME_TITLE}</ScreenTitle>
        <ScreenMenuGrid variant="main">
          <ScreenButton
            autoFocus
            onClick={() => {
              setGameSessionPhase(GAME_SESSION_PHASES.STAGE_SELECT);
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
};
