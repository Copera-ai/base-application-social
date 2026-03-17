import { createLogger } from "./logger.js";

const logger = createLogger("GracefulShutdown");

const functions = new Set<ListenFunction>();

type ListenFunction = () => Promise<void>;

for (const sig of ["SIGTERM", "SIGHUP", "SIGINT", "SIGUSR2"] as const) {
  process.once(sig, async () => {
    await exit(sig);
  });
}

let isExiting = false;

async function exit(code: string) {
  if (code) logger.warn(`Gracefully exiting from ${code}`);

  if (isExiting) {
    logger.warn("Graceful exit already in progress");
    return;
  }

  isExiting = true;

  try {
    await Promise.all(Array.from(functions).map((fn) => fn()));
    logger.warn("Gracefully exited");
    process.exit(0);
  } catch (err) {
    logger.error(err);
    process.exit(1);
  }
}

export const GracefulShutdown = {
  listen(fn: ListenFunction) {
    functions.add(fn);
  },
};
