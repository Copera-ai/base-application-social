process.env.START_TIME = Date.now().toString();

import { MongoDB } from "common/core";
import "reflect-metadata";

import { Env } from "./utils/Env.js";

(async () => {
  await Promise.all([
    MongoDB.connect(process.pid.toString(), Env.database.uri),
  ]);

  const { router } = await import("./router.js");
  router();
})();
