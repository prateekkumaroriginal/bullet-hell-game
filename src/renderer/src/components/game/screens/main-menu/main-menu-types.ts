export type MainMenuActionHandler = () => void | Promise<void>;

export type MainMenuActions = {
  canContinue: boolean;
  onContinue: MainMenuActionHandler;
  onPlay: () => void;
  onArchive: () => void;
  onQuit: () => void;
};
