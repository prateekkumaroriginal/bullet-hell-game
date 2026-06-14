import Phaser from "phaser";
import { type StageId } from "../config/stage-config";
import { type PlayerProgressionChangedPayload } from "./gameplay-events";

export const GAMEPLAY_COMMANDS = {
  START_GAME: "game-command:start",
  PAUSE_GAME: "game-command:pause",
  RESUME_GAME: "game-command:resume",
  RESTART_GAME: "game-command:restart",
  RETURN_TO_MENU: "game-command:return-to-menu",
  RETURN_TO_STAGE_SELECT: "game-command:return-to-stage-select",
} as const;

export type GameplayCommandName =
  (typeof GAMEPLAY_COMMANDS)[keyof typeof GAMEPLAY_COMMANDS];

export type StartGameCommandPayload = {
  selectedStageId: StageId;
  startingWave?: number;
  startingPlayerHealth?: number;
  startingPlayerProgression?: PlayerProgressionChangedPayload;
};

export type GameplayCommandPayloads = {
  [GAMEPLAY_COMMANDS.START_GAME]: StartGameCommandPayload;
  [GAMEPLAY_COMMANDS.PAUSE_GAME]: undefined;
  [GAMEPLAY_COMMANDS.RESUME_GAME]: undefined;
  [GAMEPLAY_COMMANDS.RESTART_GAME]: undefined;
  [GAMEPLAY_COMMANDS.RETURN_TO_MENU]: undefined;
  [GAMEPLAY_COMMANDS.RETURN_TO_STAGE_SELECT]: undefined;
};

type GameplayCommandListener<CommandName extends GameplayCommandName> = (
  payload: GameplayCommandPayloads[CommandName],
) => void;

const gameplayCommands = new Phaser.Events.EventEmitter();

export function emitGameplayCommand<CommandName extends GameplayCommandName>(
  commandName: CommandName,
  payload: GameplayCommandPayloads[CommandName],
): void {
  gameplayCommands.emit(commandName, payload);
}

export function onGameplayCommand<CommandName extends GameplayCommandName>(
  commandName: CommandName,
  listener: GameplayCommandListener<CommandName>,
): () => void {
  gameplayCommands.on(commandName, listener);

  return () => {
    gameplayCommands.off(commandName, listener);
  };
}
