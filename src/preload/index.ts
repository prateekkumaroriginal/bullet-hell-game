import { contextBridge, ipcRenderer } from "electron";
import {
  ACTIVE_RUN_SAVE_CHANNELS,
  APP_QUIT_CHANNEL,
  PROFILE_SAVE_CHANNELS,
} from "../shared/ipc-channels";
import {
  type ActiveRunSave,
  type ActiveRunSaveApi,
  type LoadActiveRunSaveResult,
  type LoadProfileSaveResult,
  type ProfileSave,
  type ProfileSaveApi,
} from "../shared/save-types";

const electronApi = {
  platform: process.platform,
  requestQuit: (): Promise<void> => ipcRenderer.invoke(APP_QUIT_CHANNEL),
  activeRunSave: {
    hasActiveRunSave: (): Promise<boolean> =>
      ipcRenderer.invoke(ACTIVE_RUN_SAVE_CHANNELS.HAS),
    loadActiveRunSave: (): Promise<LoadActiveRunSaveResult> =>
      ipcRenderer.invoke(ACTIVE_RUN_SAVE_CHANNELS.LOAD),
    writeActiveRunSave: (save: ActiveRunSave): Promise<void> =>
      ipcRenderer.invoke(ACTIVE_RUN_SAVE_CHANNELS.WRITE, save),
    deleteActiveRunSave: (): Promise<void> =>
      ipcRenderer.invoke(ACTIVE_RUN_SAVE_CHANNELS.DELETE),
  } satisfies ActiveRunSaveApi,
  profileSave: {
    loadProfileSave: (): Promise<LoadProfileSaveResult> =>
      ipcRenderer.invoke(PROFILE_SAVE_CHANNELS.LOAD),
    writeProfileSave: (save: ProfileSave): Promise<void> =>
      ipcRenderer.invoke(PROFILE_SAVE_CHANNELS.WRITE, save),
  } satisfies ProfileSaveApi,
} as const;

contextBridge.exposeInMainWorld("electron", electronApi);
