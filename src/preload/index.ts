import { contextBridge, ipcRenderer } from "electron";
import { APP_QUIT_CHANNEL } from "../shared/ipc-channels";

const electronApi = {
  platform: process.platform,
  requestQuit: (): Promise<void> => ipcRenderer.invoke(APP_QUIT_CHANNEL),
} as const;

contextBridge.exposeInMainWorld("electron", electronApi);
