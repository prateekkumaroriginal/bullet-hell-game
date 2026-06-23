import { existsSync, statSync } from "node:fs"
import { chmodSync, chownSync } from "node:fs"
import { spawnSync } from "node:child_process"
import { dirname, join } from "node:path"
import { fileURLToPath } from "node:url"
import { createRequire } from "node:module"
import process from "node:process"

const SUID_SANDBOX_MODE = 0o4755
const ROOT_USER_ID = 0
const ROOT_GROUP_ID = 0
const PERMISSION_MASK = 0o7777

const require = createRequire(import.meta.url)
const scriptPath = fileURLToPath(import.meta.url)
const electronEntryPath = require.resolve("electron")
const electronPackagePath = dirname(electronEntryPath)
const chromeSandboxPath = join(electronPackagePath, "dist", "chrome-sandbox")

if (!existsSync(chromeSandboxPath)) {
  console.error(`Electron sandbox helper was not found at ${chromeSandboxPath}`)
  process.exitCode = 1
} else if (process.getuid?.() !== ROOT_USER_ID) {
  const sudoResult = spawnSync("sudo", [process.execPath, scriptPath], {
    stdio: "inherit"
  })

  process.exitCode = sudoResult.status ?? 1
} else {
  chownSync(chromeSandboxPath, ROOT_USER_ID, ROOT_GROUP_ID)
  chmodSync(chromeSandboxPath, SUID_SANDBOX_MODE)

  const sandboxStats = statSync(chromeSandboxPath)
  const sandboxMode = sandboxStats.mode & PERMISSION_MASK

  if (sandboxStats.uid !== ROOT_USER_ID || sandboxMode !== SUID_SANDBOX_MODE) {
    console.error(`Failed to configure Electron sandbox helper at ${chromeSandboxPath}`)
    process.exitCode = 1
  } else {
    console.log(`Configured Electron sandbox helper: ${chromeSandboxPath}`)
  }
}
