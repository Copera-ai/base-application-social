import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { createLogger } from "common/api-utils";

import { startServer } from "./infra/server.js";

const logger = createLogger("router");

const pack = JSON.parse(
  fs.readFileSync(
    path.resolve(
      path.dirname(fileURLToPath(import.meta.url)),
      "../package.json",
    ),
    "utf-8",
  ),
);

export async function router(): Promise<void> {
  logger.info(`Starting project: ${pack.name}`);

  await startServer(pack.version);
}
