import { app, ipcMain } from "electron";
import { mkdir, readFile, rename, rm, stat, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { randomUUID } from "node:crypto";
import { ACTIVE_RUN_SAVE_CHANNELS } from "../../shared/ipc-channels";
import {
  SAVE_DIRECTORY_NAME,
  SAVE_FILE_NAMES,
} from "../../shared/save-config";
import {
  activeRunSaveSchema,
  type ActiveRunSave,
  type LoadActiveRunSaveResult,
} from "../../shared/save-types";

const JSON_INDENT_SPACES = 2;

export function registerActiveRunSaveIpcHandlers(): void {
  ipcMain.handle(ACTIVE_RUN_SAVE_CHANNELS.HAS, hasActiveRunSave);
  ipcMain.handle(ACTIVE_RUN_SAVE_CHANNELS.LOAD, loadActiveRunSave);
  ipcMain.handle(ACTIVE_RUN_SAVE_CHANNELS.WRITE, (_, save: ActiveRunSave) =>
    writeActiveRunSave(save),
  );
  ipcMain.handle(ACTIVE_RUN_SAVE_CHANNELS.DELETE, deleteActiveRunSave);
}

async function hasActiveRunSave(): Promise<boolean> {
  try {
    const fileStats = await stat(getActiveRunSavePath());

    return fileStats.isFile();
  } catch {
    return false;
  }
}

async function loadActiveRunSave(): Promise<LoadActiveRunSaveResult> {
  try {
    const fileText = await readFile(getActiveRunSavePath(), "utf8");
    const parsedSave = JSON.parse(fileText) as unknown;

    if (!isActiveRunSave(parsedSave)) {
      return {
        ok: false,
        reason: "invalid",
      };
    }

    return {
      ok: true,
      save: parsedSave,
    };
  } catch (error) {
    if (isFileMissingError(error)) {
      return {
        ok: false,
        reason: "missing",
      };
    }

    return {
      ok: false,
      reason: "invalid",
    };
  }
}

async function writeActiveRunSave(save: ActiveRunSave): Promise<void> {
  if (!isActiveRunSave(save)) {
    throw new Error("Cannot write invalid active run save.");
  }

  const savePath = getActiveRunSavePath();
  const tempSavePath = `${savePath}.${randomUUID()}.tmp`;

  await mkdir(dirname(savePath), { recursive: true });
  await writeFile(
    tempSavePath,
    `${JSON.stringify(save, null, JSON_INDENT_SPACES)}\n`,
    "utf8",
  );
  await rename(tempSavePath, savePath);
}

async function deleteActiveRunSave(): Promise<void> {
  await rm(getActiveRunSavePath(), { force: true });
}

function getActiveRunSavePath(): string {
  return join(
    app.getPath("userData"),
    SAVE_DIRECTORY_NAME,
    SAVE_FILE_NAMES.ACTIVE_RUN,
  );
}

function isActiveRunSave(value: unknown): value is ActiveRunSave {
  return activeRunSaveSchema.safeParse(value).success;
}

function isFileMissingError(error: unknown): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    error.code === "ENOENT"
  );
}
