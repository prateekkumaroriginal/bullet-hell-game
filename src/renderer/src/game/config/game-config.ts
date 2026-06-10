export const GAME_DESIGN_WIDTH = 1280;
export const GAME_DESIGN_HEIGHT = 720;
export const GAME_BACKGROUND_COLOR = "#101318";
export const GAME_FPS_TARGET = 60;
export const GAME_FPS_MIN = 30;
export const MILLISECONDS_PER_SECOND = 1000;

export const PLAYER_START_X = 640;
export const PLAYER_START_Y = 560;
export const PLAYER_SIZE = 28;
export const PLAYER_RADIUS = PLAYER_SIZE / 2;
export const PLAYER_MOVE_SPEED = 360;
export const PLAYER_MAX_HEALTH = 100;
export const PLAYER_ENEMY_CONTACT_DAMAGE = 20;
export const PLAYER_DAMAGE_INVULNERABILITY_MS = 900;
export const PLAYER_FILL_COLOR = 0x5df2a8;
export const PLAYER_STROKE_COLOR = 0xd7ffe8;
export const PLAYER_STROKE_WIDTH = 2;

export const BULLET_POOL_SIZE = 96;
export const BULLET_WIDTH = 16;
export const BULLET_HEIGHT = 6;
export const BULLET_SPEED = 520;
export const BULLET_FILL_COLOR = 0xffe66d;
export const BULLET_STROKE_COLOR = 0xffffff;
export const BULLET_STROKE_WIDTH = 1;
export const BULLET_DEFAULT_DAMAGE = 1;
export const BULLET_FIRE_COOLDOWN_MS = 1000;
export const BULLET_DESPAWN_PADDING = 32;
export const BULLET_DEFAULT_DIRECTION_X = 0;
export const BULLET_DEFAULT_DIRECTION_Y = -1;
export const BULLET_HIT_RADIUS = BULLET_WIDTH / 2;

export const ENEMY_POOL_SIZE = 48;
export const ENEMY_RADIUS = 18;
export const ENEMY_MOVE_SPEED = 95;
export const ENEMY_MAX_HEALTH = 2;
export const ENEMY_SEPARATION_RADIUS = ENEMY_RADIUS * 2.35;
export const ENEMY_SEPARATION_STRENGTH = 0.5;
export const ENEMY_OVERLAP_FALLBACK_DISTANCE = 1;
export const ENEMY_FILL_COLOR = 0xff5c7a;
export const ENEMY_STROKE_COLOR = 0xffd6df;
export const ENEMY_STROKE_WIDTH = 2;

export const WAVE_ADVANCE_DELAY_MS = 1600;
export const WAVE_ANNOUNCEMENT_DURATION_MS = 1800;
export const WAVE_DEFINITIONS = [
  {
    enemyCount: 4,
    spawnCooldownMs: 900,
  },
  {
    enemyCount: 7,
    spawnCooldownMs: 800,
  },
  {
    enemyCount: 10,
    spawnCooldownMs: 700,
  },
] as const;

export const AIM_GUIDE_LENGTH = 120;
export const AIM_GUIDE_START_OFFSET = PLAYER_RADIUS + 10;
export const AIM_GUIDE_DOT_RADIUS = 2;
export const AIM_GUIDE_DOT_SPACING = 18;
export const AIM_GUIDE_COLOR = 0xeaf2ff;
export const AIM_GUIDE_ALPHA = 0.72;

export const ARENA_BORDER_COLOR = 0x34404a;
export const ARENA_BORDER_ALPHA = 0.7;
export const ARENA_BORDER_WIDTH = 2;

export const GRID_SPACING = 48;
export const GRID_COLOR = 0x24303a;
export const GRID_ALPHA = 0.32;
export const GRID_LINE_WIDTH = 1;
