import { createLogger, type HTTPClientError } from "common/api-utils";
import { type FastifyReply, type FastifyRequest } from "fastify";

import { Env } from "~/utils/Env.js";

const logger = createLogger(`ErrorHandler`);

export async function clientError(
  _request: FastifyRequest,
  reply: FastifyReply,
  error: HTTPClientError,
): Promise<void> {
  reply
    .status(error.statusCode)
    .send({ message: error.message || error, ...(error.info || {}) });
}

export async function serverError(
  request: FastifyRequest,
  reply: FastifyReply,
  error: Error,
): Promise<void> {
  const msg = error.stack ? `\n ${error.stack}` : ` - ${error}`;

  logger.error(`${new Date()} - ${request.method} - ${request.url} ${msg}`);

  const message =
    Env.nodeEnv === "production"
      ? "Internal Server Error"
      : error?.message || error;

  reply.status(500).send({ message });
}
