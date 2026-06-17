import { type CSSProperties, useEffect } from "react";
import {
  emitGameplayCommand,
  GAMEPLAY_COMMANDS,
} from "@/game/events/gameplay-commands";
import { SCREEN_BACKDROP } from "@/game/config/screen-ui-config";
import {
  GAME_SESSION_PHASES,
  type GameSessionPhase,
} from "@/game/state/game-session-state";
import { useGameUiStore } from "@/game/state/use-game-ui-store";
import {
  OVERLAY_SCREENS,
  type OverlayScreen,
  SCREEN_COMPONENTS,
} from "./screens/screen-registry";

const SESSION_PHASE_SCREEN_MAP = {
  [GAME_SESSION_PHASES.IDLE]: OVERLAY_SCREENS.MAIN,
  [GAME_SESSION_PHASES.STAGE_SELECT]: OVERLAY_SCREENS.STAGE_SELECT,
  [GAME_SESSION_PHASES.PLAYING]: OVERLAY_SCREENS.MAIN,
  [GAME_SESSION_PHASES.POPUP]: OVERLAY_SCREENS.MAIN,
  [GAME_SESSION_PHASES.SKILL_SELECT]: OVERLAY_SCREENS.SKILL_SELECT,
  [GAME_SESSION_PHASES.PAUSED]: OVERLAY_SCREENS.PAUSE,
  [GAME_SESSION_PHASES.GAME_OVER]: OVERLAY_SCREENS.GAME_OVER,
  [GAME_SESSION_PHASES.STAGE_COMPLETE]: OVERLAY_SCREENS.STAGE_COMPLETE,
} satisfies Record<GameSessionPhase, OverlayScreen>;

const screenBackdropStyle = {
  borderColor: `rgb(82 82 91 / ${SCREEN_BACKDROP.BORDER_OPACITY})`,
  background: [
    `radial-gradient(circle at ${SCREEN_BACKDROP.RADIAL_CENTER.x} ${SCREEN_BACKDROP.RADIAL_CENTER.y}, rgba(185,198,210,${SCREEN_BACKDROP.RADIAL_OPACITY}), transparent ${SCREEN_BACKDROP.RADIAL_FADE_STOP})`,
    `linear-gradient(rgba(10,14,17,${SCREEN_BACKDROP.GRADIENT_OPACITY_TOP}), rgba(3,5,7,${SCREEN_BACKDROP.GRADIENT_OPACITY_BOTTOM}))`,
  ].join(","),
} satisfies CSSProperties;

const smallGridStyle = {
  backgroundImage: [
    `linear-gradient(rgba(160,180,190,${SCREEN_BACKDROP.GRID_OPACITY_BRIGHT}) 1px, transparent 1px)`,
    `linear-gradient(90deg, rgba(160,180,190,${SCREEN_BACKDROP.GRID_OPACITY_BRIGHT}) 1px, transparent 1px)`,
  ].join(","),
  backgroundSize: `${SCREEN_BACKDROP.GRID_SMALL_SIZE}px ${SCREEN_BACKDROP.GRID_SMALL_SIZE}px`,
} satisfies CSSProperties;

const largeGridStyle = {
  backgroundImage: [
    `linear-gradient(rgba(255,255,255,${SCREEN_BACKDROP.GRID_OPACITY_DIM}) 1px, transparent 1px)`,
    `linear-gradient(90deg, rgba(255,255,255,${SCREEN_BACKDROP.GRID_OPACITY_DIM}) 1px, transparent 1px)`,
  ].join(","),
  backgroundSize: `${SCREEN_BACKDROP.GRID_LARGE_SIZE}px ${SCREEN_BACKDROP.GRID_LARGE_SIZE}px`,
} satisfies CSSProperties;

const shadowStyle = {
  boxShadow: `inset 0 0 ${SCREEN_BACKDROP.SHADOW_BLUR}px rgba(0,0,0,${SCREEN_BACKDROP.SHADOW_OPACITY})`,
} satisfies CSSProperties;

const ScreenBackdrop = () => (
  <div
    className="pointer-events-none absolute inset-0 border"
    style={screenBackdropStyle}
  >
    <div className="absolute inset-0" style={smallGridStyle} />
    <div className="absolute inset-0" style={largeGridStyle} />
    <div className="absolute inset-0" style={shadowStyle} />
  </div>
);

export const GameScreens = () => {
  const gamePhase = useGameUiStore((state) => state.gameSession.phase);
  const activeScreen = SESSION_PHASE_SCREEN_MAP[gamePhase];

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") {
        return;
      }

      if (gamePhase === GAME_SESSION_PHASES.PLAYING) {
        emitGameplayCommand(GAMEPLAY_COMMANDS.PAUSE_GAME, undefined);
        return;
      }

      if (gamePhase === GAME_SESSION_PHASES.PAUSED) {
        emitGameplayCommand(GAMEPLAY_COMMANDS.RESUME_GAME, undefined);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [gamePhase]);

  if (
    gamePhase === GAME_SESSION_PHASES.PLAYING ||
    gamePhase === GAME_SESSION_PHASES.POPUP
  ) {
    return null;
  }

  const ActiveScreen = SCREEN_COMPONENTS[activeScreen];

  return (
    <div
      className="absolute inset-0 overflow-hidden text-zinc-100"
      style={{ zIndex: SCREEN_BACKDROP.Z_INDEX }}
    >
      <ScreenBackdrop />
      <ActiveScreen />
    </div>
  );
};
