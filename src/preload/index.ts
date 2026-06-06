import { contextBridge } from "electron";

const electronApi = {
  platform: process.platform,
} as const;

contextBridge.exposeInMainWorld("electron", electronApi);
