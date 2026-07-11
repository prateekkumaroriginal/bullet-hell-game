import type { MainMenuVariant } from "@/game/config/main-menu-config";

export type MainMenuActionHandler = () => void | Promise<void>;

export type MainMenuActions = {
  canContinue: boolean;
  onContinue: MainMenuActionHandler;
  onPlay: () => void;
  onArchive: () => void;
  onQuit: () => void;
};

export type MainMenuVariantProps = {
  actions: MainMenuActions;
  onSelectVariation: (variant: MainMenuVariant) => void;
  selectedVariant: MainMenuVariant;
};
