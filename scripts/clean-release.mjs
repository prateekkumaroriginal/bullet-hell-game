import { rmSync } from "node:fs";
import { resolve } from "node:path";

rmSync(resolve("release"), {
  force: true,
  recursive: true,
});
