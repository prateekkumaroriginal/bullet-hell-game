import Phaser from "phaser";
import { type SkillId, type SkillStackState } from "../config/skill-config";
import { type StageId } from "../config/stage-config";
import { type PlayerProgressionChangedPayload } from "./gameplay-events";

export const GAMEPLAY_COMMANDS = {
  START_GAME: "game-command:start",
  PAUSE_GAME: "game-command:pause",
  RESUME_GAME: "game-command:resume",
  RESTART_GAME: "game-command:restart",
  RETURN_TO_MENU: "game-command:return-to-menu",
  RETURN_TO_STAGE_SELECT: "game-command:return-to-stage-select",
  SELECT_SKILL: "game-command:select-skill",
  BLOCK_GAMEPLAY_FOR_POPUP: "game-command:block-gameplay-for-popup",
  COMPLETE_POPUP_DISMISSAL: "game-command:complete-popup-dismissal",
} as const;

export type GameplayCommandName =
  (typeof GAMEPLAY_COMMANDS)[keyof typeof GAMEPLAY_COMMANDS];

export type StartGameCommandPayload = {
  selectedStageId: StageId;
  startingWave?: number;
  startingPlayerHealth?: number;
  startingPlayerProgression?: PlayerProgressionChangedPayload;
  startingSkillStacks?: readonly SkillStackState[];
};

export type SelectSkillCommandPayload = {
  skillId: SkillId;
};

export type GameplayCommandPayloads = {
  [GAMEPLAY_COMMANDS.START_GAME]: StartGameCommandPayload;
  [GAMEPLAY_COMMANDS.PAUSE_GAME]: undefined;
  [GAMEPLAY_COMMANDS.RESUME_GAME]: undefined;
  [GAMEPLAY_COMMANDS.RESTART_GAME]: undefined;
  [GAMEPLAY_COMMANDS.RETURN_TO_MENU]: undefined;
  [GAMEPLAY_COMMANDS.RETURN_TO_STAGE_SELECT]: undefined;
  [GAMEPLAY_COMMANDS.SELECT_SKILL]: SelectSkillCommandPayload;
  [GAMEPLAY_COMMANDS.BLOCK_GAMEPLAY_FOR_POPUP]: undefined;
  [GAMEPLAY_COMMANDS.COMPLETE_POPUP_DISMISSAL]: undefined;
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
