export const BULLET_POOL_SIZE = 96;
export const BULLET_SPEED = 1000;
export const BULLET_DEFAULT_DAMAGE = 1;
export const BULLET_FIRE_COOLDOWN_MS = 1000;
export const BULLET_DESPAWN_PADDING = 32;
export const BULLET_DEFAULT_DIRECTION_X = 0;
export const BULLET_DEFAULT_DIRECTION_Y = -1;
export const BULLET_HIT_RADIUS = 5;

export const BULLET_PROJECTILE_DESIGN = {
  textures: {
    body: {
      key: "player-energy-capsule-body-v2",
      width: 78,
      height: 14,
      originX: 0.8205128205128205,
      originY: 0.5
    },
    tail: {
      key: "player-energy-capsule-beam-tail-v1",
      width: 98,
      height: 14,
      originX: 1,
      originY: 0.5
    }
  },
  colors: {
    glow: 0x5dff17,
    rim: 0x96ff23,
    body: 0x2fd915,
    core: 0x0f7c19,
    highlight: 0xc8ff3d,
    trail: 0x38ff20
  },
  alpha: {
    outerGlow: 0.22,
    innerGlow: 0.44,
    body: 0.78,
    core: 0.64,
    rim: 0.95,
    highlight: 0.78,
    capHighlight: 0.5,
    trailGlow: 0.2,
    trail: 0.82,
    trailCore: 0.58
  },
  trail: {
    y: 7,
    startX: 0,
    endX: 98,
    attachOffsetX: -10,
    glowWidth: 10,
    beamWidth: 3,
    coreWidth: 1,
    growDurationMs: 90,
    spawnScaleX: 0.04,
    spawnAlpha: 0.2,
    fadeSegments: [
      { startX: 0, endX: 22, alphaScale: 0.12 },
      { startX: 14, endX: 45, alphaScale: 0.24 },
      { startX: 37, endX: 71, alphaScale: 0.44 },
      { startX: 63, endX: 98, alphaScale: 0.78 }
    ]
  },
  glow: {
    outer: {
      x: 51,
      y: 2,
      width: 26,
      height: 10,
      radius: 5
    },
    inner: {
      x: 54,
      y: 4,
      width: 20,
      height: 6,
      radius: 3
    }
  },
  body: {
    x: 55,
    y: 4,
    width: 18,
    height: 6,
    radius: 3
  },
  core: {
    x: 58,
    y: 5,
    width: 12,
    height: 4,
    radius: 2
  },
  rim: {
    x: 54,
    y: 3,
    width: 20,
    height: 8,
    radius: 4,
    lineWidth: 1
  },
  highlights: {
    top: {
      x: 59,
      y: 5,
      width: 10,
      height: 1
    },
    bottom: {
      x: 59,
      y: 10,
      width: 11,
      height: 1
    },
    rightCap: {
      x: 70,
      y: 5,
      width: 1,
      height: 4
    },
    leftCap: {
      x: 55,
      y: 5,
      width: 1,
      height: 4
    }
  }
} as const;
