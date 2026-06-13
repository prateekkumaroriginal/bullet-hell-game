import { app, BrowserWindow } from "electron";
import { join } from "node:path";
import {
  ELECTRON_WINDOW_HEIGHT,
  ELECTRON_WINDOW_MIN_HEIGHT,
  ELECTRON_WINDOW_MIN_WIDTH,
  ELECTRON_WINDOW_WIDTH,
} from "./config/electron-window";
import { registerActiveRunSaveIpcHandlers } from "./ipc/active-run-save-ipc";
import { registerAppIpcHandlers } from "./ipc/app-ipc";
import { registerProfileSaveIpcHandlers } from "./ipc/profile-save-ipc";

const createMainWindow = (): void => {
  const mainWindow = new BrowserWindow({
    width: ELECTRON_WINDOW_WIDTH,
    height: ELECTRON_WINDOW_HEIGHT,
    minWidth: ELECTRON_WINDOW_MIN_WIDTH,
    minHeight: ELECTRON_WINDOW_MIN_HEIGHT,
    show: false,
    autoHideMenuBar: true,
    webPreferences: {
      preload: join(__dirname, "../preload/index.mjs"),
      sandbox: false,
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  mainWindow.once("ready-to-show", () => {
    mainWindow.show();
  });

  if (process.env.ELECTRON_RENDERER_URL) {
    void mainWindow.loadURL(process.env.ELECTRON_RENDERER_URL);
    return;
  }

  void mainWindow.loadFile(join(__dirname, "../renderer/index.html"));
};

void app.whenReady().then(() => {
  registerAppIpcHandlers();
  registerActiveRunSaveIpcHandlers();
  registerProfileSaveIpcHandlers();

  createMainWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createMainWindow();
    }
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
