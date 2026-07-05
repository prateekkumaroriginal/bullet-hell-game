import { app, ipcMain } from "electron";
import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import { randomUUID } from "node:crypto";
import { dirname, join } from "node:path";
import { APP_SETTINGS_CHANNELS } from "../../shared/ipc-channels";
import { JSON_INDENT_SPACES } from "../../shared/save-config";
import {
  SETTINGS_DIRECTORY_NAME,
  SETTINGS_FILE_NAME
} from "../../shared/settings-config";
import {
  appSettingsSchema,
  type AppSettings,
  type LoadAppSettingsResult
} from "../../shared/settings-types";

export function registerAppSettingsIpcHandlers(): void {
  ipcMain.handle(APP_SETTINGS_CHANNELS.LOAD, loadSettings);
  ipcMain.handle(APP_SETTINGS_CHANNELS.WRITE, (_, settings: AppSettings) =>
    writeSettings(settings)
  );
}

async function loadSettings(): Promise<LoadAppSettingsResult> {
  try {
    const fileText = await readFile(getSettingsPath(), "utf8");
    const parsedSettings = JSON.parse(fileText) as unknown;
    const result = appSettingsSchema.safeParse(parsedSettings);

    if (!result.success) {
      return {
        ok: false,
        reason: "invalid"
      };
    }

    return {
      ok: true,
      settings: result.data
    };
  } catch (error) {
    if (isFileMissingError(error)) {
      return {
        ok: false,
        reason: "missing"
      };
    }

    return {
      ok: false,
      reason: "invalid"
    };
  }
}

async function writeSettings(settings: AppSettings): Promise<void> {
  const result = appSettingsSchema.safeParse(settings);

  if (!result.success) {
    throw new Error("Cannot write invalid app settings.");
  }

  const settingsPath = getSettingsPath();
  const tempSettingsPath = `${settingsPath}.${randomUUID()}.tmp`;

  await mkdir(dirname(settingsPath), { recursive: true });
  await writeFile(
    tempSettingsPath,
    `${JSON.stringify(result.data, null, JSON_INDENT_SPACES)}\n`,
    "utf8"
  );
  await rename(tempSettingsPath, settingsPath);
}

function getSettingsPath(): string {
  return join(
    app.getPath("userData"),
    SETTINGS_DIRECTORY_NAME,
    SETTINGS_FILE_NAME
  );
}

function isFileMissingError(error: unknown): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    error.code === "ENOENT"
  );
}

