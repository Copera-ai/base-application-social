import { HTTP400Error, HTTPClientError, HttpErrorCode } from "common/api-utils";
import type { FastifyReply, FastifyRequest } from "fastify";
import { ValidationError } from "yup";
import { ZodError } from "zod";

import * as ErrorHandlerService from "./ErrorHandler.js";

export async function ErrorHandle(
  error: Error,
  request: FastifyRequest,
  reply: FastifyReply,
): Promise<void> {
  if (error instanceof ValidationError || error instanceof ZodError) {
    return ErrorHandlerService.clientError(
      request,
      reply,
      new HTTP400Error(error.message, { code: HttpErrorCode.INVALID }),
    );
  }
  return error instanceof HTTPClientError
    ? ErrorHandlerService.clientError(request, reply, error)
    : ErrorHandlerService.serverError(request, reply, error);
}
