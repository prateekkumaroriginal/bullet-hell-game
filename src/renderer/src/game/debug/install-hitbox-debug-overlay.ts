import Phaser from "phaser";
import { HitboxDebugOverlay } from "./HitboxDebugOverlay";
import {
  isDebugHitboxOverlayVisible,
  onDebugHitboxOverlayChanged
} from "./debug-hitbox-events";
import { type EnemyController } from "../systems/EnemyController";
import { type PlayerController } from "../systems/PlayerController";
import { type WeaponController } from "../systems/WeaponController";

type HitboxDebugOverlayInput = {
  enemyController?: EnemyController;
  playerController?: PlayerController;
  weaponController?: WeaponController;
};

export function installHitboxDebugOverlay(
  scene: Phaser.Scene,
  getInput: () => HitboxDebugOverlayInput
): () => void {
  const overlay = new HitboxDebugOverlay(scene);
  const updateOverlay = () => {
    overlay.update(getInput());
  };
  const unsubscribe = onDebugHitboxOverlayChanged(({ isVisible }) => {
    overlay.setEnabled(isVisible);
    updateOverlay();
  });

  overlay.setEnabled(isDebugHitboxOverlayVisible());
  updateOverlay();
  scene.events.on(Phaser.Scenes.Events.UPDATE, updateOverlay);

  return () => {
    scene.events.off(Phaser.Scenes.Events.UPDATE, updateOverlay);
    unsubscribe();
    overlay.destroy();
  };
}
