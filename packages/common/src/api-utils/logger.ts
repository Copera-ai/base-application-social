import pino, { type Logger as PinoLogger } from "pino";

const rootLogger = pino({
  level: process.env.LOG_LEVEL || "info",
  transport: {
    targets: [
      {
        target: "pino-pretty",
        options: {
          colorize: true,
          translateTime: "SYS:standard",
          ignore: "pid,hostname",
          messageFormat: "{msg}",
        },
      },
    ],
  },
  base: undefined,
});

export type Logger = PinoLogger;

export const createLogger = (name: string): Logger =>
  rootLogger.child({ name });
