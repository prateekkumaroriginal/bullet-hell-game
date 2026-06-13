/// <reference types="vite/client" />

import {
  type ActiveRunSaveApi,
  type ProfileSaveApi,
} from "../../shared/save-types";

declare global {
  interface Window {
    electron?: {
      platform: NodeJS.Platform;
      requestQuit: () => Promise<void>;
      activeRunSave: ActiveRunSaveApi;
      profileSave: ProfileSaveApi;
    };
  }
}

export {};
