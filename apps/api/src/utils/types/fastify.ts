import type { DefaultProps, UserProps } from "common/api-utils";
import type { FastifyRequest as Req, FastifyReply as Res } from "fastify";

declare module "fastify" {
  interface FastifyRequest {
    user?: Pick<UserProps, "userId">;
  }
}

export type { Req, Res };

export type { DefaultProps };
