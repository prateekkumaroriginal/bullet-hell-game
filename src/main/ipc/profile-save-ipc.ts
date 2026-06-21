import { app, ipcMain } from "electron";
import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { randomUUID } from "node:crypto";
import { PROFILE_SAVE_CHANNELS } from "../../shared/ipc-channels";
import {
  SAVE_DIRECTORY_NAME,
  SAVE_FILE_NAMES,
} from "../../shared/save-config";
import {
  type LoadProfileSaveResult,
  type ProfileSave,
  profileSaveSchema,
} from "../../shared/save-types";

const JSON_INDENT_SPACES = 2;

export function registerProfileSaveIpcHandlers(): void {
  ipcMain.handle(PROFILE_SAVE_CHANNELS.LOAD, loadProfileSave);
  ipcMain.handle(PROFILE_SAVE_CHANNELS.WRITE, (_, save: ProfileSave) =>
    writeProfileSave(save),
  );
}

async function loadProfileSave(): Promise<LoadProfileSaveResult> {
  try {
    const fileText = await readFile(getProfileSavePath(), "utf8");
    const parsedSave = JSON.parse(fileText) as unknown;
    const result = profileSaveSchema.safeParse(parsedSave);

    if (!result.success) {
      return {
        ok: false,
        reason: "invalid"
      };
    }

    return {
      ok: true,
      save: result.data
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

async function writeProfileSave(save: ProfileSave): Promise<void> {
  const result = profileSaveSchema.safeParse(save);

  if (!result.success) {
    throw new Error("Cannot write invalid profile save.");
  }

  const savePath = getProfileSavePath();
  const tempSavePath = `${savePath}.${randomUUID()}.tmp`;

  await mkdir(dirname(savePath), { recursive: true });
  await writeFile(
    tempSavePath,
    `${JSON.stringify(result.data, null, JSON_INDENT_SPACES)}\n`,
    "utf8",
  );
  await rename(tempSavePath, savePath);
}

function getProfileSavePath(): string {
  return join(
    app.getPath("userData"),
    SAVE_DIRECTORY_NAME,
    SAVE_FILE_NAMES.PROFILE,
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
