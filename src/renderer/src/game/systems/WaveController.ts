import Phaser from "phaser";
import {
  ENEMY_INTRO_DELAY_MS,
  type EnemyTypeId,
} from "../config/enemy-config";
import {
  getWaveEnemyCount,
  WAVE_ANNOUNCEMENT_DURATION_MS,
  WAVE_ADVANCE_DELAY_MS,
  type WaveSpawnDefinition,
  type WaveDefinition,
} from "../config/wave-config";
import {
  emitGameplayEvent,
  GAMEPLAY_EVENTS,
} from "../events/gameplay-events";
import { EnemyController } from "./EnemyController";
import { type EnemySpawnToken } from "./EnemyPool";
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
  private readonly spawnTimers: Phaser.Time.TimerEvent[] = [];
  private readonly enemyIntroTimers: Phaser.Time.TimerEvent[] = [];
  private readonly introducedEnemyTypeIds = new Set<EnemyTypeId>();
  private advanceTimer?: Phaser.Time.TimerEvent;
  private announcementTimer?: Phaser.Time.TimerEvent;

  constructor(
    private readonly scene: Phaser.Scene,
    private readonly enemyController: EnemyController,
    private readonly waveDefinitions: readonly WaveDefinition[],
    private readonly onWaveComplete: (nextWaveNumber: number) => void,
    private readonly onStageComplete: () => void,
    private readonly onEnemyIntroReady: (enemyTypeId: EnemyTypeId) => boolean,
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
    this.clearSpawnTimers();
    this.clearEnemyIntroTimers();
    this.advanceTimer?.remove();
    this.announcementTimer?.remove();
  }

  private startCurrentWave(): void {
    this.spawnedEnemyCount = 0;
    this.isWaitingForNextWave = false;
    this.isAnnouncingWave = true;
    this.clearSpawnTimers();
    this.announcementTimer?.remove();
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
    const currentWave = this.getCurrentWave();

    for (const spawnDefinition of currentWave.spawns) {
      this.scheduleSpawnDefinition(spawnDefinition, currentWave.spawnCooldownMs);
    }
  }

  private scheduleSpawnDefinition(
    spawnDefinition: WaveSpawnDefinition,
    defaultSpawnCooldownMs: number,
  ): void {
    if (spawnDefinition.count <= 0) {
      return;
    }

    const spawnCooldownMs =
      spawnDefinition.spawnCooldownMs ?? defaultSpawnCooldownMs;
    let spawnedGroupEnemyCount = 0;

    const spawnEnemyForDefinition = (): void => {
      if (spawnedGroupEnemyCount >= spawnDefinition.count) {
        return;
      }

      const enemySpawnToken = this.enemyController.spawnEnemy(
        spawnDefinition.enemyTypeId
      );

      if (!enemySpawnToken) {
        return;
      }

      spawnedGroupEnemyCount += 1;
      this.spawnedEnemyCount += 1;
      this.scheduleEnemyIntro(enemySpawnToken);
      this.publishWaveState();
    };

    const startSpawnLoop = (): void => {
      spawnEnemyForDefinition();

      if (spawnedGroupEnemyCount >= spawnDefinition.count) {
        return;
      }

      const spawnTimer = this.scene.time.addEvent({
        delay: spawnCooldownMs,
        callback: () => {
          spawnEnemyForDefinition();
          if (spawnedGroupEnemyCount >= spawnDefinition.count) {
            this.removeSpawnTimer(spawnTimer);
          }
        },
        loop: true,
      });

      this.trackSpawnTimer(spawnTimer);
    };

    if (spawnDefinition.delayMs === undefined) {
      startSpawnLoop();
      return;
    }

    const delayTimer = this.scene.time.delayedCall(spawnDefinition.delayMs, () => {
      this.removeSpawnTimer(delayTimer);
      startSpawnLoop();
    });

    this.trackSpawnTimer(delayTimer);
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

  private scheduleEnemyIntro(enemySpawnToken: EnemySpawnToken): void {
    const enemyTypeId = enemySpawnToken.typeId;

    if (this.introducedEnemyTypeIds.has(enemyTypeId)) {
      return;
    }

    const introTimer = this.scene.time.delayedCall(
      ENEMY_INTRO_DELAY_MS,
      () => {
        this.removeEnemyIntroTimer(introTimer);

        if (
          this.introducedEnemyTypeIds.has(enemyTypeId) ||
          !this.enemyController.isEnemySpawnActive(enemySpawnToken)
        ) {
          return;
        }

        if (this.onEnemyIntroReady(enemyTypeId)) {
          this.introducedEnemyTypeIds.add(enemyTypeId);
        }
      }
    );

    this.enemyIntroTimers.push(introTimer);
  }

  private hasCurrentWaveFinished(): boolean {
    return (
      !this.isAnnouncingWave &&
      this.spawnedEnemyCount >= getWaveEnemyCount(this.getCurrentWave()) &&
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

  private clearSpawnTimers(): void {
    for (const spawnTimer of this.spawnTimers) {
      spawnTimer.remove();
    }

    this.spawnTimers.length = 0;
  }

  private clearEnemyIntroTimers(): void {
    for (const introTimer of this.enemyIntroTimers) {
      introTimer.remove();
    }

    this.enemyIntroTimers.length = 0;
  }

  private removeEnemyIntroTimer(introTimer: Phaser.Time.TimerEvent): void {
    introTimer.remove();

    const introTimerIndex = this.enemyIntroTimers.indexOf(introTimer);

    if (introTimerIndex !== -1) {
      this.enemyIntroTimers.splice(introTimerIndex, 1);
    }
  }

  private trackSpawnTimer(spawnTimer: Phaser.Time.TimerEvent): void {
    this.spawnTimers.push(spawnTimer);
  }

  private removeSpawnTimer(spawnTimer: Phaser.Time.TimerEvent): void {
    spawnTimer.remove();

    const spawnTimerIndex = this.spawnTimers.indexOf(spawnTimer);

    if (spawnTimerIndex === -1) {
      return;
    }

    this.spawnTimers.splice(spawnTimerIndex, 1);
  }

  private publishWaveState(): void {
    const currentWave = this.getCurrentWave();
    const enemiesRemaining =
      getWaveEnemyCount(currentWave) -
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
