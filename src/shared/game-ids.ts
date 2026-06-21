export const ENEMY_TYPE_IDS = {
  CHASER: "chaser",
  RUSHER: "rusher",
  TANK: "tank"
} as const;

export type EnemyTypeId = (typeof ENEMY_TYPE_IDS)[keyof typeof ENEMY_TYPE_IDS];

export const SKILL_IDS = {
  RAPID_FIRE: "rapidFire",
  HEAVY_SHOT: "heavyShot",
  FLEET_FOOTED: "fleetFooted",
  MAGNET_CORE: "magnetCore",
  REINFORCED_HULL: "reinforcedHull"
} as const;

export type SkillId = (typeof SKILL_IDS)[keyof typeof SKILL_IDS];
