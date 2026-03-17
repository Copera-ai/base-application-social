import path from "node:path";
import { fileURLToPath } from "node:url";

import cors from "@fastify/cors";
import multipart from "@fastify/multipart";
import { createLogger, GracefulShutdown } from "common/api-utils";
import Fastify, { type FastifyInstance } from "fastify";
import { bootstrap } from "fastify-decorators";
import fastifyIp from "fastify-ip";

import { userTokenHook } from "~/utils/hooks/Token/user.js";

import { ErrorHandle } from "../utils/hooks/ErrorHandle/index.js";

const logger = createLogger(`Server`);

export let fastify: FastifyInstance;

export async function startServer(version: string) {
  fastify = Fastify({
    trustProxy: true,
    bodyLimit: 15_000_000,
  });

  fastify.get("/health", (_, reply) => {
    reply.send(`api v${version} is up`);
  });

  fastify.get("/api/health", (_, reply) => {
    reply.send(`api v${version} is up`);
  });

  fastify
    .register(multipart, {
      limits: {
        fileSize: 1_000_000_000_000,
      },
      throwFileSizeLimit: true,
    })
    .register(cors, {
      origin: "*",
      methods: ["GET", "HEAD", "POST", "OPTIONS", "PUT", "DELETE", "PATCH"],
      hook: "onRequest",
      preflightContinue: false,
      optionsSuccessStatus: 204,
      credentials: false,
      exposedHeaders: null,
      allowedHeaders: null,
      maxAge: null,
      preflight: true,
      strictPreflight: true,
    })
    .register(fastifyIp)
    .decorate("user", null)
    .decorateRequest("user", null)
    .addHook("onRequest", async (request) => {
      (request.raw as any).startTime = Date.now();
    })
    .addHook("preHandler", userTokenHook)
    .addHook("onResponse", async (request, reply) => {
      const latency = Date.now() - (request.raw as any).startTime;
      if (request.method !== "OPTIONS") {
        logger.info(
          `${latency}ms - ${request.ip} "${request.method} ${
            request.url
          } ${(reply.raw as any)._header.split(" ")[0]}" ${
            reply.statusCode
          } ${reply.getHeader("content-length")} "${
            request.headers["user-agent"]
          }"`,
        );
      }
    })
    .setErrorHandler(ErrorHandle)
    .register(bootstrap, {
      directory: path.resolve(
        path.dirname(fileURLToPath(import.meta.url)),
        "../service",
      ),
      mask: /\.controller\.js$/,
      prefix: "/api",
    });

  const port = process.env.PORT || 3000;
  const NODE_ENV = process.env.NODE_ENV || "Unknown";

  await fastify
    .listen({
      port: parseInt(port as string, 10),
      host: "0.0.0.0",
    })
    .catch((err) => {
      logger.error(err.errors || err);
    });

  await fastify.ready();

  const startDuration =
    Date.now() - parseInt(process.env.START_TIME as string, 10);

  logger.info(
    `Running on port ${port} and environment ${NODE_ENV} in ${startDuration}ms`,
  );

  process?.send?.("ready");

  return fastify;
}

GracefulShutdown.listen(async () => {
  await fastify.close();
  logger.warn(`Server closed by the end of service`);
});
