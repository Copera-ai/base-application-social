import { HTTP401Error, HttpErrorCode, type UserProps } from "common/api-utils";
import type { FastifyRequest } from "fastify";

import * as TokenUtils from "../../TokenUtils.js";

export async function userTokenHook(request: FastifyRequest): Promise<void> {
  const { url } = request;

  if (
    request.method === "OPTIONS" ||
    (url && !(await TokenUtils.needValidate(url)))
  )
    return;

  const invalid = (expired = false) => {
    throw new HTTP401Error(`${expired ? "Expired" : "Invalid"} session`, {
      code: HttpErrorCode.UNAUTHORIZED,
    });
  };

  const { authorization } = request.headers;

  if (!authorization) return invalid(false);

  const { valid, expired, data } = await TokenUtils.validateToken<UserProps>({
    token: authorization,
  });

  if (!valid) return invalid(expired);

  request.user = data as UserProps;
}
