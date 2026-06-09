import Phaser from "phaser";
import {
  WAVE_ADVANCE_DELAY_MS,
  WAVE_DEFINITIONS,
} from "../config/game-config";
import { setWaveState } from "../state/game-ui-state";
import { EnemyController } from "./EnemyController";

type WaveDefinition = (typeof WAVE_DEFINITIONS)[number];

export class WaveController {
  private currentWaveIndex = 0;
  private spawnedEnemyCount = 0;
  private isWaitingForNextWave = false;
  private isComplete = false;
  private lastPublishedWaveState?: {
    current: number;
    total: number;
    enemiesRemaining: number;
    isComplete: boolean;
  };
  private spawnTimer?: Phaser.Time.TimerEvent;
  private advanceTimer?: Phaser.Time.TimerEvent;

  constructor(
    private readonly scene: Phaser.Scene,
    private readonly enemyController: EnemyController,
  ) {
    this.startCurrentWave();
  }

  update(): void {
    this.publishWaveState();

    if (this.isComplete || this.isWaitingForNextWave) {
      return;
    }

    if (!this.hasCurrentWaveFinished()) {
      return;
    }

    this.finishCurrentWave();
  }

  destroy(): void {
    this.spawnTimer?.remove();
    this.advanceTimer?.remove();
  }

  private startCurrentWave(): void {
    this.spawnedEnemyCount = 0;
    this.isWaitingForNextWave = false;
    this.spawnTimer?.remove();
    this.spawnTimer = undefined;
    this.publishWaveState();
    this.spawnEnemyForCurrentWave();

    const currentWave = this.getCurrentWave();

    if (this.spawnedEnemyCount >= currentWave.enemyCount) {
      return;
    }

    this.spawnTimer = this.scene.time.addEvent({
      delay: currentWave.spawnCooldownMs,
      callback: this.spawnEnemyForCurrentWave,
      callbackScope: this,
      loop: true,
    });
  }

  private spawnEnemyForCurrentWave(): void {
    const currentWave = this.getCurrentWave();

    if (this.spawnedEnemyCount >= currentWave.enemyCount) {
      this.spawnTimer?.remove();
      this.spawnTimer = undefined;
      return;
    }

    this.enemyController.spawnEnemy();
    this.spawnedEnemyCount += 1;
    this.publishWaveState();

    if (this.spawnedEnemyCount >= currentWave.enemyCount) {
      this.spawnTimer?.remove();
      this.spawnTimer = undefined;
    }
  }

  private finishCurrentWave(): void {
    const nextWaveIndex = this.currentWaveIndex + 1;

    if (nextWaveIndex >= WAVE_DEFINITIONS.length) {
      this.isComplete = true;
      this.publishWaveState();
      return;
    }

    this.isWaitingForNextWave = true;
    this.advanceTimer = this.scene.time.delayedCall(
      WAVE_ADVANCE_DELAY_MS,
      () => {
        this.currentWaveIndex = nextWaveIndex;
        this.advanceTimer = undefined;
        this.startCurrentWave();
      },
    );
  }

  private hasCurrentWaveFinished(): boolean {
    return (
      this.spawnedEnemyCount >= this.getCurrentWave().enemyCount &&
      this.enemyController.activeEnemyCount === 0
    );
  }

  private getCurrentWave(): WaveDefinition {
    const currentWave = WAVE_DEFINITIONS[this.currentWaveIndex];

    if (!currentWave) {
      throw new Error(`Missing wave definition at index ${this.currentWaveIndex}.`);
    }

    return currentWave;
  }

  private publishWaveState(): void {
    const currentWave = this.getCurrentWave();
    const enemiesRemaining =
      currentWave.enemyCount -
      this.spawnedEnemyCount +
      this.enemyController.activeEnemyCount;

    const nextWaveState = {
      current: this.currentWaveIndex + 1,
      total: WAVE_DEFINITIONS.length,
      enemiesRemaining: Math.max(0, enemiesRemaining),
      isComplete: this.isComplete,
    };

    if (
      this.lastPublishedWaveState &&
      this.lastPublishedWaveState.current === nextWaveState.current &&
      this.lastPublishedWaveState.total === nextWaveState.total &&
      this.lastPublishedWaveState.enemiesRemaining === nextWaveState.enemiesRemaining &&
      this.lastPublishedWaveState.isComplete === nextWaveState.isComplete
    ) {
      return;
    }

    this.lastPublishedWaveState = nextWaveState;
    setWaveState(nextWaveState);
  }
}
