import { app, ipcMain } from "electron";
import { APP_QUIT_CHANNEL } from "../../shared/ipc-channels";

export function registerAppIpcHandlers(): void {
  ipcMain.handle(APP_QUIT_CHANNEL, () => {
    app.quit();
  });
}
