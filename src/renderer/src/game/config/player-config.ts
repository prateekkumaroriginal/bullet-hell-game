import playerSpaceshipUrl from "../../../../../assets/spaceship.png?url";

export const PLAYER_START_X = 640;
export const PLAYER_START_Y = 560;
export const PLAYER_SIZE = 28;
export const PLAYER_RADIUS = PLAYER_SIZE / 2;
export const PLAYER_TEXTURE_KEY = "player-spaceship";
export const PLAYER_TEXTURE_URL = playerSpaceshipUrl;
export const PLAYER_DISPLAY_SIZE = 56;
export const PLAYER_BULLET_MUZZLE_OFFSET = PLAYER_DISPLAY_SIZE / 2;
export const PLAYER_SPRITE_FORWARD_ROTATION_OFFSET_RADIANS = Math.PI / 2;
export const PLAYER_MOVE_SPEED = 360;
export const PLAYER_MAX_HEALTH = 100;
export const PLAYER_ENEMY_CONTACT_DAMAGE = 20;
export const PLAYER_DAMAGE_INVULNERABILITY_MS = 900;
