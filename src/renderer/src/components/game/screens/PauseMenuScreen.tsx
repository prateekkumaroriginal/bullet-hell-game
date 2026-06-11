import { MENU_BUTTONS } from "@/game/config/screen-ui-config";
import {
  emitGameplayCommand,
  GAMEPLAY_COMMANDS,
} from "@/game/events/gameplay-commands";
import { useGameUiStore } from "@/game/state/use-game-ui-store";
import {
  ScreenButton,
  ScreenCenter,
  ScreenTitle,
  StageDivider,
} from "./ScreenPrimitives";
import { quitToDesktop } from "./screen-actions";

export const PauseMenuScreen = () => {
  const wave = useGameUiStore((state) => state.wave);

  return (
    <ScreenCenter>
      <ScreenTitle className="mb-7 text-5xl max-md:text-4xl">
        PAUSED
      </ScreenTitle>
      <div className="grid w-[min(29rem,calc(100vw-3rem))] gap-3">
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
        <ScreenButton onClick={quitToDesktop}>{MENU_BUTTONS.pause[3]}</ScreenButton>
      </div>
      <StageDivider label={`WAVE ${wave.current}`} />
    </ScreenCenter>
  );
};
