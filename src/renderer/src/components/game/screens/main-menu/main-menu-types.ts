import type { ContinueTarget } from "@/game/save/continue-target-service";

export type MainMenuActions = {
  continueTarget: ContinueTarget | null;
  onContinue: () => void;
  onPlay: () => void;
  onArchive: () => void;
  onQuit: () => void;
};

export type MainMenuActionId = "continue" | "play" | "archive" | "quit";

export type MainMenuVariantProps = {
  actions: MainMenuActions;
};
