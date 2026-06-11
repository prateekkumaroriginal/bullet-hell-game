import { contextBridge, ipcRenderer } from "electron";

const electronApi = {
  platform: process.platform,
  quit: () => ipcRenderer.invoke("app:quit"),
} as const;

contextBridge.exposeInMainWorld("electron", electronApi);
