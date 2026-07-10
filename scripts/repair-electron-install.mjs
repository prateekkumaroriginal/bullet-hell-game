import { existsSync, readFileSync, rmSync } from "node:fs"
import { spawnSync } from "node:child_process"
import { dirname, join } from "node:path"
import { createRequire } from "node:module"
import process from "node:process"

const ELECTRON_PACKAGE_NAME = "electron"
const ELECTRON_PACKAGE_FILE_NAME = "package.json"
const ELECTRON_INSTALL_FILE_NAME = "install.js"
const ELECTRON_RUNTIME_DIRECTORY_NAME = "dist"
const ELECTRON_RUNTIME_PATH_FILE_NAME = "path.txt"
const ELECTRON_VERSION_ARGUMENT = "--version"
const REPAIR_FAILURE_EXIT_CODE = 1
const MINIMUM_ELECTRON_INSTALL_NODE_MAJOR_VERSION = 22
const MINIMUM_ELECTRON_INSTALL_NODE_MINOR_VERSION = 12

const ELECTRON_EXECUTABLE_PATH_BY_PLATFORM = {
  darwin: join("Electron.app", "Contents", "MacOS", "Electron"),
  freebsd: "electron",
  linux: "electron",
  mas: join("Electron.app", "Contents", "MacOS", "Electron"),
  openbsd: "electron",
  win32: "electron.exe"
}

const require = createRequire(import.meta.url)
const electronPackageJsonPath = require.resolve(
  `${ELECTRON_PACKAGE_NAME}/${ELECTRON_PACKAGE_FILE_NAME}`
)
const electronPackageDirectory = dirname(electronPackageJsonPath)
const electronRuntimeDirectory = join(
  electronPackageDirectory,
  ELECTRON_RUNTIME_DIRECTORY_NAME
)
const electronRuntimePathFile = join(
  electronPackageDirectory,
  ELECTRON_RUNTIME_PATH_FILE_NAME
)
const electronInstallScript = join(
  electronPackageDirectory,
  ELECTRON_INSTALL_FILE_NAME
)
const electronPackage = JSON.parse(readFileSync(electronPackageJsonPath, "utf8"))
const expectedElectronExecutablePath = ELECTRON_EXECUTABLE_PATH_BY_PLATFORM[process.platform]
const [nodeMajorVersion, nodeMinorVersion] = process.versions.node
  .split(".")
  .map(Number)

const hasSupportedNodeVersion =
  nodeMajorVersion > MINIMUM_ELECTRON_INSTALL_NODE_MAJOR_VERSION ||
  (nodeMajorVersion === MINIMUM_ELECTRON_INSTALL_NODE_MAJOR_VERSION &&
    nodeMinorVersion >= MINIMUM_ELECTRON_INSTALL_NODE_MINOR_VERSION)

if (!hasSupportedNodeVersion) {
  throw new Error(
    `Electron runtime repair requires Node ${MINIMUM_ELECTRON_INSTALL_NODE_MAJOR_VERSION}.${MINIMUM_ELECTRON_INSTALL_NODE_MINOR_VERSION} or newer. Current Node is ${process.versions.node}.`
  )
}

if (!expectedElectronExecutablePath) {
  throw new Error(
    `Electron runtime repair is unsupported on platform ${process.platform}.`
  )
}

function getInstalledElectronExecutablePath() {
  const recordedExecutablePath = existsSync(electronRuntimePathFile)
    ? readFileSync(electronRuntimePathFile, "utf8").trim()
    : expectedElectronExecutablePath

  return join(electronRuntimeDirectory, recordedExecutablePath)
}

function runCommand(command, argumentsList) {
  const result = spawnSync(command, argumentsList, {
    cwd: electronPackageDirectory,
    env: process.env,
    stdio: "inherit",
    windowsHide: true
  })

  if (result.error) {
    throw result.error
  }

  if (result.status !== 0) {
    throw new Error(`${command} exited with code ${result.status ?? REPAIR_FAILURE_EXIT_CODE}.`)
  }
}

let electronExecutablePath = getInstalledElectronExecutablePath()

if (!existsSync(electronExecutablePath)) {
  console.log(`Repairing Electron ${electronPackage.version} in ${electronPackageDirectory}`)

  rmSync(electronRuntimeDirectory, {
    force: true,
    recursive: true
  })
  rmSync(electronRuntimePathFile, {
    force: true
  })

  runCommand(process.execPath, [electronInstallScript])
  electronExecutablePath = getInstalledElectronExecutablePath()
}

if (!existsSync(electronExecutablePath)) {
  throw new Error(
    `Electron repair completed without creating the runtime executable at ${electronExecutablePath}.`
  )
}

runCommand(electronExecutablePath, [ELECTRON_VERSION_ARGUMENT])
console.log(`Electron runtime is ready at ${electronExecutablePath}`)
