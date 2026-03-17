import { createLogger, type UserProps } from "common/api-utils";
import type { SignOptions } from "jsonwebtoken";
import jwt from "jsonwebtoken";

import { getPublicRoutes } from "./decorators/isPublic.decorator.js";
import { Env } from "./Env.js";
import * as TokenCrypt from "./TokenCrypt.js";

const { sign, verify } = jwt;

const PK = Env.app.token;

async function _createToken(
  key: string,
  content: Record<string, any>,
  expiresIn: SignOptions["expiresIn"] = "90d",
): Promise<string> {
  const encryptedContent = await TokenCrypt.encrypt(
    String(key),
    JSON.stringify(content),
  );
  const token = sign(
    {
      token: encryptedContent,
    },
    PK,
    {
      expiresIn,
    },
  );
  return TokenCrypt.encrypt(String(key), token);
}

type TCreateUserTokenProps = Required<Pick<UserProps, "userId">>;
export async function createUserToken(
  tokenContent: TCreateUserTokenProps,
): Promise<string> {
  return _createToken(tokenContent.userId.toString(), tokenContent);
}

export async function validateToken<T>({ token }: { token: string }): Promise<{
  valid: boolean;
  expired: boolean;
  data?: T;
}> {
  const jwToken = await TokenCrypt.decrypt(token);

  const invalid = (expired = false) => ({
    valid: false,
    expired,
    data: undefined,
  });
  const valid = (info: T) => ({
    valid: true,
    expired: false,
    data: info,
  });

  if (!jwToken) return invalid(false);

  try {
    const jwtData: any = verify(jwToken, PK);

    if (!jwtData.token) return invalid(false);
    const data = await TokenCrypt.decrypt(jwtData.token);
    const userData: T = JSON.parse(data);
    return valid(userData);
  } catch (error) {
    return invalid(false);
  }
}

let PUBLIC_ROUTES: string[];

const logger = createLogger("TokenUtils");

async function publicRoutes() {
  if (!PUBLIC_ROUTES) {
    PUBLIC_ROUTES = await getPublicRoutes();
    logger.info(PUBLIC_ROUTES);
  }

  return PUBLIC_ROUTES.map((route) => `/api${route}`);
}

export async function needValidate(url: string): Promise<boolean> {
  const routes = await publicRoutes();

  const whitelist = ["/health", "/api/health", ...routes];

  const whiteListEndsWidth = [];

  for (const wlUrl of whitelist) if (url.startsWith(wlUrl)) return false;

  for (const wlUrl of whiteListEndsWidth) if (url.endsWith(wlUrl)) return false;

  return true;
}
