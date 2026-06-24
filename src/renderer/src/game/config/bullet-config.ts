export const BULLET_POOL_SIZE = 96;
export const BULLET_SPEED = 520;
export const BULLET_DEFAULT_DAMAGE = 1;
export const BULLET_FIRE_COOLDOWN_MS = 1000;
export const BULLET_DESPAWN_PADDING = 32;
export const BULLET_DEFAULT_DIRECTION_X = 0;
export const BULLET_DEFAULT_DIRECTION_Y = -1;
export const BULLET_HIT_RADIUS = 5;

export type BulletTrailStreak = {
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  alpha: number;
};

export type BulletSpark = {
  x: number;
  y: number;
  alpha: number;
};

export const BULLET_PROJECTILE_DESIGN = {
  texture: {
    key: "player-plasma-projectile-green-small",
    width: 48,
    height: 20
  },
  colors: {
    glow: 0x63ff3f,
    core: 0x8bff5c,
    trail: 0x37ff2f,
    shadow: 0x0d1b12
  },
  alpha: {
    outerGlow: 0.24,
    midGlow: 0.42,
    body: 0.76,
    core: 0.88,
    trail: 0.3,
    streak: 0.45
  },
  body: {
    x: 27,
    y: 10,
    width: 30,
    height: 12
  },
  glow: {
    outer: {
      width: 42,
      height: 18
    },
    mid: {
      width: 35,
      height: 14
    }
  },
  core: {
    width: 22,
    height: 6
  },
  nose: {
    x: 45,
    topY: 7,
    bottomY: 13
  },
  trail: {
    endX: 22,
    width: 22,
    height: 11,
    streakWidth: 1,
    sparkSize: 1,
    streaks: [
      { startX: 1, startY: 6, endX: 19, endY: 7, alpha: 0.38 },
      { startX: 1, startY: 10, endX: 22, endY: 10, alpha: 0.5 },
      { startX: 4, startY: 15, endX: 18, endY: 12, alpha: 0.28 },
      { startX: 9, startY: 3, endX: 26, endY: 5, alpha: 0.24 }
    ] satisfies readonly BulletTrailStreak[],
    sparks: [
      { x: 6, y: 5, alpha: 0.36 },
      { x: 8, y: 10, alpha: 0.56 },
      { x: 11, y: 16, alpha: 0.3 },
      { x: 14, y: 6, alpha: 0.7 },
      { x: 17, y: 11, alpha: 0.46 },
      { x: 20, y: 4, alpha: 0.34 }
    ] satisfies readonly BulletSpark[]
  }
} as const;
