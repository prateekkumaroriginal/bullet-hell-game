import { MENU_BUTTONS } from "@/game/config/screen-ui-config";
import {
  emitGameplayCommand,
  GAMEPLAY_COMMANDS,
} from "@/game/events/gameplay-commands";
import { useGameUiStore } from "@/game/state/use-game-ui-store";
import {
  ScreenButton,
  ScreenCenter,
  ScreenMenuGrid,
  ScreenTitle,
  StageDivider,
} from "./ScreenPrimitives";
import { quitToDesktop } from "./screen-actions";

export const PauseMenuScreen = () => {
  const wave = useGameUiStore((state) => state.wave);

  return (
    <ScreenCenter>
      <div className="flex flex-col items-center gap-9">
        <div className="flex flex-col items-center gap-7">
          <ScreenTitle>PAUSED</ScreenTitle>
          <ScreenMenuGrid>
            <ScreenButton
              autoFocus
              onClick={() => {
                emitGameplayCommand(GAMEPLAY_COMMANDS.RESUME_GAME, undefined);
              }}
            >
              {MENU_BUTTONS.pause[0]}
            </ScreenButton>
            <ScreenButton
              onClick={() => {
                emitGameplayCommand(GAMEPLAY_COMMANDS.RESTART_GAME, undefined);
              }}
            >
              {MENU_BUTTONS.pause[1]}
            </ScreenButton>
            <ScreenButton
              onClick={() => {
                emitGameplayCommand(GAMEPLAY_COMMANDS.RETURN_TO_MENU, undefined);
              }}
            >
              {MENU_BUTTONS.pause[2]}
            </ScreenButton>
            <ScreenButton onClick={quitToDesktop}>
              {MENU_BUTTONS.pause[3]}
            </ScreenButton>
          </ScreenMenuGrid>
        </div>
        <StageDivider label={`WAVE ${wave.current}`} />
      </div>
    </ScreenCenter>
  );
};
