export const APP_QUIT_CHANNEL = "app:quit";

export const ACTIVE_RUN_SAVE_CHANNELS = {
  HAS: "active-run-save:has",
  LOAD: "active-run-save:load",
  WRITE: "active-run-save:write",
  DELETE: "active-run-save:delete",
} as const;

export const PROFILE_SAVE_CHANNELS = {
  LOAD: "profile-save:load",
  WRITE: "profile-save:write",
} as const;
