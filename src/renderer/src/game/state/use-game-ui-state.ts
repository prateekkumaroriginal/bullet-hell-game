import { useSyncExternalStore } from "react";
import {
  getGameUiStateSnapshot,
  subscribeToGameUiState,
} from "./game-ui-state";

export function useGameUiState() {
  return useSyncExternalStore(
    subscribeToGameUiState,
    getGameUiStateSnapshot,
    getGameUiStateSnapshot,
  );
}
