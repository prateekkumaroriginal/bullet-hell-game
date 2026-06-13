import Phaser from "phaser";
import {
  WAVE_ANNOUNCEMENT_DURATION_MS,
  WAVE_ADVANCE_DELAY_MS,
  type WaveDefinition,
} from "../config/wave-config";
import {
  emitGameplayEvent,
  GAMEPLAY_EVENTS,
} from "../events/gameplay-events";
import { EnemyController } from "./EnemyController";
import { type GameplayController } from "./GameplayController";

export class WaveController implements GameplayController {
  private currentWaveIndex = 0;
  private spawnedEnemyCount = 0;
  private isWaitingForNextWave = false;
  private isAnnouncingWave = false;
  private isComplete = false;
  private announcementId = 0;
  private lastPublishedWaveState?: {
    current: number;
    total: number;
    enemiesRemaining: number;
    isComplete: boolean;
  };
  private spawnTimer?: Phaser.Time.TimerEvent;
  private advanceTimer?: Phaser.Time.TimerEvent;
  private announcementTimer?: Phaser.Time.TimerEvent;

  constructor(
    private readonly scene: Phaser.Scene,
    private readonly enemyController: EnemyController,
    private readonly waveDefinitions: readonly WaveDefinition[],
    private readonly onWaveComplete: (nextWaveNumber: number) => void,
    private readonly onStageComplete: () => void,
    startingWaveNumber: number,
  ) {
    this.currentWaveIndex = startingWaveNumber - 1;
    this.startCurrentWave();
  }

  get currentWaveNumber(): number {
    return this.currentWaveIndex + 1;
  }

  get totalWaves(): number {
    return this.waveDefinitions.length;
  }

  update(_: number): void {
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
    this.announcementTimer?.remove();
  }

  private startCurrentWave(): void {
    this.spawnedEnemyCount = 0;
    this.isWaitingForNextWave = false;
    this.isAnnouncingWave = true;
    this.spawnTimer?.remove();
    this.announcementTimer?.remove();
    this.spawnTimer = undefined;
    this.announcementTimer = undefined;
    this.publishWaveState();
    this.showWaveAnnouncement();

    this.announcementTimer = this.scene.time.delayedCall(
      WAVE_ANNOUNCEMENT_DURATION_MS,
      () => {
        this.isAnnouncingWave = false;
        this.announcementTimer = undefined;
        this.hideWaveAnnouncement();
        this.beginCurrentWaveSpawns();
      },
    );
  }

  private beginCurrentWaveSpawns(): void {
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

    if (nextWaveIndex >= this.waveDefinitions.length) {
      this.isComplete = true;
      this.publishWaveState();
      this.onStageComplete();
      return;
    }

    this.isWaitingForNextWave = true;
    this.onWaveComplete(nextWaveIndex + 1);
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
      !this.isAnnouncingWave &&
      this.spawnedEnemyCount >= this.getCurrentWave().enemyCount &&
      this.enemyController.activeEnemyCount === 0
    );
  }

  private getCurrentWave(): WaveDefinition {
    const currentWave = this.waveDefinitions[this.currentWaveIndex];

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
      total: this.totalWaves,
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
    emitGameplayEvent(GAMEPLAY_EVENTS.WAVE_CHANGED, nextWaveState);
  }

  private showWaveAnnouncement(): void {
    this.announcementId += 1;

    emitGameplayEvent(GAMEPLAY_EVENTS.WAVE_ANNOUNCEMENT_CHANGED, {
      id: this.announcementId,
      waveNumber: this.currentWaveIndex + 1,
      totalWaves: this.totalWaves,
      isVisible: true,
    });
  }

  private hideWaveAnnouncement(): void {
    emitGameplayEvent(GAMEPLAY_EVENTS.WAVE_ANNOUNCEMENT_CHANGED, {
      id: this.announcementId,
      waveNumber: this.currentWaveIndex + 1,
      totalWaves: this.totalWaves,
      isVisible: false,
    });
  }
}
