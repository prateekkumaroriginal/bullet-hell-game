/// <reference types="vite/client" />

import {
  type ActiveRunSaveApi,
  type ProfileSaveApi,
} from "../../shared/save-types";
import { type AppSettingsApi } from "../../shared/settings-types";

declare global {
  interface Window {
    electron?: {
      platform: NodeJS.Platform;
      requestQuit: () => Promise<void>;
      activeRunSave: ActiveRunSaveApi;
      profileSave: ProfileSaveApi;
      settings: AppSettingsApi;
    };
  }
}

export {};
