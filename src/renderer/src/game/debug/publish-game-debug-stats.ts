import {
  BULLET_DEFAULT_DAMAGE,
  BULLET_FIRE_COOLDOWN_MS,
} from "../config/bullet-config";
import { DEBUG_STATS_UPDATE_INTERVAL_MS } from "../config/debug-config";
import {
  EXPERIENCE_ORB_ATTRACT_RADIUS,
  EXPERIENCE_ORB_COLLECT_RADIUS,
} from "../config/experience-config";
import { PLAYER_RADIUS } from "../config/player-config";
import {
  MIN_FIRE_COOLDOWN_MULTIPLIER,
  SKILL_DEFINITIONS,
  type SkillRuntimeModifiers,
} from "../config/skill-config";
import { type StageId } from "../config/stage-config";
import { MILLISECONDS_PER_SECOND } from "../config/time-config";
import { getWaveEnemyCount, type WaveDefinition } from "../config/wave-config";
import { type GameSessionPhase } from "../state/game-session-state";
import { type AimController } from "../systems/AimController";
import { type Bullet } from "../systems/BulletPool";
import { type EnemyController } from "../systems/EnemyController";
import { type Enemy } from "../systems/EnemyPool";
import { type ExperienceOrbPool } from "../systems/ExperienceOrbPool";
import { type PlayerController } from "../systems/PlayerController";
import { type PlayerProgressionController } from "../systems/PlayerProgressionController";
import { type SkillController } from "../systems/SkillController";
import { type WaveController } from "../systems/WaveController";
import { type WeaponController } from "../systems/WeaponController";
import {
  emitDebugStatsChanged,
  type DebugStatsCategory,
} from "./debug-stats-events";

type PublishGameDebugStatsInput = {
  aimController?: AimController;
  delta: number;
  displayObjectCount: number;
  enemyController?: EnemyController;
  experienceOrbPool?: ExperienceOrbPool;
  fps: number;
  gameTimeMs: number;
  isPaused: boolean;
  playerController?: PlayerController;
  playerProgressionController?: PlayerProgressionController;
  renderer: unknown;
  selectedStageId: StageId | null;
  sessionPhase: GameSessionPhase;
  skillController?: SkillController;
  skillModifiers: SkillRuntimeModifiers;
  waveController?: WaveController;
  weaponController?: WeaponController;
};

type DebugBulletPoolInternals = {
  activeBullets: readonly Bullet[];
  bullets: readonly Bullet[];
  freeBulletIndexes: readonly number[];
};

type DebugEnemyControllerInternals = {
  enemyPool: {
    activeEnemies: readonly Enemy[];
    enemies: readonly Enemy[];
  };
};

type DebugExperienceOrbPoolInternals = {
  activeOrbs: readonly unknown[];
  orbs: readonly unknown[];
};

type DebugPlayerControllerInternals = {
  invulnerabilityTimerMs: number;
};

type DebugWaveControllerInternals = {
  currentWaveIndex: number;
  enemyController: EnemyController;
  isComplete: boolean;
  isWaitingForNextWave: boolean;
  spawnedEnemyCount: number;
  waveDefinitions: readonly WaveDefinition[];
};

type DebugWeaponControllerInternals = {
  bulletPool: DebugBulletPoolInternals;
  fireCooldownRemainingMs: number;
};

const STAT_DECIMAL_PRECISION = 2;
const BYTES_PER_KILOBYTE = 1024;
const BYTES_PER_MEGABYTE = BYTES_PER_KILOBYTE * BYTES_PER_KILOBYTE;
let debugStatsElapsedMs = DEBUG_STATS_UPDATE_INTERVAL_MS;

function formatNumber(value: number): string {
  return Number.isInteger(value)
    ? String(value)
    : value.toFixed(STAT_DECIMAL_PRECISION);
}

function formatBoolean(value: boolean): string {
  return value ? "true" : "false";
}

function formatNullable(value: string | number | null | undefined): string {
  return value === null || value === undefined ? "none" : String(value);
}

function getActiveEnemies(enemyController?: EnemyController): readonly Enemy[] {
  return (
    (enemyController as unknown as DebugEnemyControllerInternals | undefined)
      ?.enemyPool.activeEnemies ?? []
  );
}

function getEnemyPoolSize(enemyController?: EnemyController): number {
  return (
    (enemyController as unknown as DebugEnemyControllerInternals | undefined)
      ?.enemyPool.enemies.length ?? 0
  );
}

function getEnemiesTouchingPlayer(input: PublishGameDebugStatsInput): number {
  const player = input.playerController?.gameObject;

  if (!player) {
    return 0;
  }

  return getActiveEnemies(input.enemyController).filter((enemy) => {
    const hitDistance = enemy.radius + PLAYER_RADIUS;
    const deltaX = enemy.x - player.x;
    const deltaY = enemy.y - player.y;

    return deltaX * deltaX + deltaY * deltaY <= hitDistance * hitDistance;
  }).length;
}

function getBulletPool(
  weaponController?: WeaponController,
): DebugBulletPoolInternals | undefined {
  return (weaponController as unknown as DebugWeaponControllerInternals | undefined)
    ?.bulletPool;
}

function getExperienceOrbPool(
  experienceOrbPool?: ExperienceOrbPool,
): DebugExperienceOrbPoolInternals | undefined {
  return experienceOrbPool as unknown as
    | DebugExperienceOrbPoolInternals
    | undefined;
}

function getFireCooldownMs(skillModifiers: SkillRuntimeModifiers): number {
  return (
    BULLET_FIRE_COOLDOWN_MS *
    Math.max(MIN_FIRE_COOLDOWN_MULTIPLIER, skillModifiers.fireCooldownMultiplier)
  );
}

function getMemoryUsedMb(): string {
  const performanceWithMemory = performance as Performance & {
    memory?: {
      usedJSHeapSize: number;
    };
  };

  if (!performanceWithMemory.memory) {
    return "unavailable";
  }

  return formatNumber(
    performanceWithMemory.memory.usedJSHeapSize / BYTES_PER_MEGABYTE,
  );
}

function getRendererDrawCalls(renderer: unknown): string {
  const rendererWithStats = renderer as {
    drawCount?: number;
    renderStats?: {
      drawCalls?: number;
    };
  };

  return formatNullable(
    rendererWithStats.drawCount ?? rendererWithStats.renderStats?.drawCalls,
  );
}

function getWaveStats(waveController?: WaveController): {
  currentWaveEnemyCount: number;
  currentWaveKilledCount: number;
  currentWaveNumber: number;
  currentWaveSpawnCount: number;
  enemiesRemaining: number;
  isCurrentWaveComplete: boolean;
  totalWaves: number;
} {
  const waveInternals =
    waveController as unknown as DebugWaveControllerInternals | undefined;

  if (!waveController || !waveInternals) {
    return {
      currentWaveEnemyCount: 0,
      currentWaveKilledCount: 0,
      currentWaveNumber: 0,
      currentWaveSpawnCount: 0,
      enemiesRemaining: 0,
      isCurrentWaveComplete: false,
      totalWaves: 0,
    };
  }

  const currentWave = waveInternals.waveDefinitions[waveInternals.currentWaveIndex];
  const currentWaveEnemyCount = currentWave ? getWaveEnemyCount(currentWave) : 0;
  const activeEnemyCount = waveInternals.enemyController.activeEnemyCount;
  const enemiesRemaining = Math.max(
    0,
    currentWaveEnemyCount - waveInternals.spawnedEnemyCount + activeEnemyCount,
  );
  const isCurrentWaveComplete =
    waveInternals.isComplete ||
    (!waveInternals.isWaitingForNextWave &&
      waveInternals.spawnedEnemyCount >= currentWaveEnemyCount &&
      activeEnemyCount === 0);

  return {
    currentWaveEnemyCount,
    currentWaveKilledCount: Math.max(
      0,
      waveInternals.spawnedEnemyCount - activeEnemyCount,
    ),
    currentWaveNumber: waveInternals.currentWaveIndex + 1,
    currentWaveSpawnCount: waveInternals.spawnedEnemyCount,
    enemiesRemaining,
    isCurrentWaveComplete,
    totalWaves: waveInternals.waveDefinitions.length,
  };
}

function createSkillStackStats(
  skillController?: SkillController,
): DebugStatsCategory["stats"] {
  return SKILL_DEFINITIONS.map((skill) => {
    const learnedSkill = skillController?.learnedSkills.find(
      (candidate) => candidate.id === skill.id,
    );

    return {
      prop: `${skill.id}Stacks`,
      value: String(learnedSkill?.stackCount ?? 0),
    };
  });
}

export function publishGameDebugStats(input: PublishGameDebugStatsInput): void {
  debugStatsElapsedMs += input.delta;

  if (debugStatsElapsedMs < DEBUG_STATS_UPDATE_INTERVAL_MS) {
    return;
  }

  debugStatsElapsedMs = 0;

  const player = input.playerController?.gameObject;
  const progression = input.playerProgressionController?.progression;
  const bulletPool = getBulletPool(input.weaponController);
  const experienceOrbPool = getExperienceOrbPool(input.experienceOrbPool);
  const aimDirection = input.aimController?.direction;
  const activeBulletCount = bulletPool?.activeBullets.length ?? 0;
  const bulletPoolSize = bulletPool?.bullets.length ?? 0;
  const fireCooldownMs = getFireCooldownMs(input.skillModifiers);
  const fireCooldownRemainingMs =
    (input.weaponController as unknown as DebugWeaponControllerInternals | undefined)
      ?.fireCooldownRemainingMs ?? 0;
  const shotsPerSecond =
    fireCooldownMs > 0 ? MILLISECONDS_PER_SECOND / fireCooldownMs : 0;
  const bulletDamage =
    BULLET_DEFAULT_DAMAGE + input.skillModifiers.bulletDamageBonus;
  const xpToNextLevel = progression
    ? progression.experienceToNextLevel - progression.experience
    : 0;
  const waveStats = getWaveStats(input.waveController);
  const invulnerabilityRemainingMs =
    (input.playerController as unknown as DebugPlayerControllerInternals | undefined)
      ?.invulnerabilityTimerMs ?? 0;

  const categories: DebugStatsCategory[] = [
    {
      name: "Summary",
      stats: [
        { prop: "phase", value: input.sessionPhase },
        {
          prop: "health",
          value: `${input.playerController?.health ?? 0}/${input.playerController?.maxHealth ?? 0}`,
        },
        { prop: "level", value: String(progression?.level ?? 0) },
        {
          prop: "xp",
          value: `${progression?.experience ?? 0}/${progression?.experienceToNextLevel ?? 0}`,
        },
        { prop: "xpToNextLevel", value: String(xpToNextLevel) },
        { prop: "activeBullets", value: `${activeBulletCount}/${bulletPoolSize}` },
        {
          prop: "activeEnemies",
          value: String(input.enemyController?.activeEnemyCount ?? 0),
        },
        {
          prop: "enemiesTouchingPlayer",
          value: String(getEnemiesTouchingPlayer(input)),
        },
        {
          prop: "activeXpOrbs",
          value: String(experienceOrbPool?.activeOrbs.length ?? 0),
        },
        { prop: "fps", value: formatNumber(input.fps) },
      ],
    },
    {
      name: "Player",
      stats: [
        { prop: "playerX", value: formatNumber(player?.x ?? 0) },
        { prop: "playerY", value: formatNumber(player?.y ?? 0) },
        { prop: "health", value: String(input.playerController?.health ?? 0) },
        {
          prop: "maxHealth",
          value: String(input.playerController?.maxHealth ?? 0),
        },
        { prop: "level", value: String(progression?.level ?? 0) },
        { prop: "xp", value: String(progression?.experience ?? 0) },
        { prop: "xpToNextLevel", value: String(xpToNextLevel) },
        {
          prop: "moveSpeedMultiplier",
          value: formatNumber(input.skillModifiers.moveSpeedMultiplier),
        },
        {
          prop: "canTakeDamage",
          value: formatBoolean(input.playerController?.canTakeDamage ?? false),
        },
        {
          prop: "invulnerabilityRemainingMs",
          value: formatNumber(invulnerabilityRemainingMs),
        },
      ],
    },
    {
      name: "Weapons / Bullets",
      stats: [
        { prop: "activeBullets", value: String(activeBulletCount) },
        { prop: "bulletPoolSize", value: String(bulletPoolSize) },
        { prop: "freeBullets", value: String(bulletPool?.freeBulletIndexes.length ?? 0) },
        { prop: "bulletDamage", value: formatNumber(bulletDamage) },
        { prop: "fireCooldownMs", value: formatNumber(fireCooldownMs) },
        {
          prop: "fireCooldownRemainingMs",
          value: formatNumber(fireCooldownRemainingMs),
        },
        { prop: "shotsPerSecond", value: formatNumber(shotsPerSecond) },
        {
          prop: "fireCooldownMultiplier",
          value: formatNumber(input.skillModifiers.fireCooldownMultiplier),
        },
        { prop: "aimDirectionX", value: formatNumber(aimDirection?.x ?? 0) },
        { prop: "aimDirectionY", value: formatNumber(aimDirection?.y ?? 0) },
      ],
    },
    {
      name: "Enemies / Waves",
      stats: [
        { prop: "wave", value: String(waveStats.currentWaveNumber) },
        { prop: "totalWaves", value: String(waveStats.totalWaves) },
        { prop: "enemiesRemaining", value: String(waveStats.enemiesRemaining) },
        {
          prop: "activeEnemies",
          value: String(input.enemyController?.activeEnemyCount ?? 0),
        },
        { prop: "enemyPoolSize", value: String(getEnemyPoolSize(input.enemyController)) },
        {
          prop: "waveComplete",
          value: formatBoolean(waveStats.isCurrentWaveComplete),
        },
        {
          prop: "currentWaveSpawnCount",
          value: String(waveStats.currentWaveSpawnCount),
        },
        {
          prop: "currentWaveKilledCount",
          value: String(waveStats.currentWaveKilledCount),
        },
        {
          prop: "currentWaveEnemyCount",
          value: String(waveStats.currentWaveEnemyCount),
        },
        {
          prop: "enemiesTouchingPlayer",
          value: String(getEnemiesTouchingPlayer(input)),
        },
      ],
    },
    {
      name: "XP Orbs",
      stats: [
        {
          prop: "activeXpOrbs",
          value: String(experienceOrbPool?.activeOrbs.length ?? 0),
        },
        { prop: "xpOrbPoolSize", value: String(experienceOrbPool?.orbs.length ?? 0) },
        {
          prop: "xpCollectRadius",
          value: formatNumber(
            EXPERIENCE_ORB_COLLECT_RADIUS +
              input.skillModifiers.experienceCollectRadiusBonus,
          ),
        },
        {
          prop: "xpAttractRadius",
          value: formatNumber(
            EXPERIENCE_ORB_ATTRACT_RADIUS +
              input.skillModifiers.experienceAttractRadiusBonus,
          ),
        },
        {
          prop: "xpCollectRadiusBonus",
          value: formatNumber(input.skillModifiers.experienceCollectRadiusBonus),
        },
        {
          prop: "xpAttractRadiusBonus",
          value: formatNumber(input.skillModifiers.experienceAttractRadiusBonus),
        },
      ],
    },
    {
      name: "Skills",
      stats: [
        {
          prop: "learnedSkillCount",
          value: String(input.skillController?.learnedSkills.length ?? 0),
        },
        ...createSkillStackStats(input.skillController),
        {
          prop: "maxHealthBonus",
          value: formatNumber(input.skillModifiers.maxHealthBonus),
        },
      ],
    },
    {
      name: "Session",
      stats: [
        { prop: "phase", value: input.sessionPhase },
        { prop: "selectedStageId", value: formatNullable(input.selectedStageId) },
        { prop: "currentWave", value: String(waveStats.currentWaveNumber) },
        { prop: "isPaused", value: formatBoolean(input.isPaused) },
        { prop: "gameTimeMs", value: formatNumber(input.gameTimeMs) },
        { prop: "deltaMs", value: formatNumber(input.delta) },
        { prop: "timeScale", value: String(input.isPaused ? 0 : 1) },
      ],
    },
    {
      name: "Performance",
      stats: [
        { prop: "fps", value: formatNumber(input.fps) },
        { prop: "deltaMs", value: formatNumber(input.delta) },
        { prop: "activeGameObjects", value: String(input.displayObjectCount) },
        { prop: "rendererDrawCalls", value: getRendererDrawCalls(input.renderer) },
        { prop: "memoryUsedMb", value: getMemoryUsedMb() },
      ],
    },
  ];

  emitDebugStatsChanged({ categories });
}
