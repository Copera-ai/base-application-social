import { HTTP400Error, HTTP401Error, HttpErrorCode } from "common/api-utils";

import { COPERA_CONFIG } from "~/config.js";
import { copera } from "~/infra/copera.js";
import { createUserToken } from "~/utils/TokenUtils.js";

async function createUserAccessToken(rowId: string) {
  const accessToken = await createUserToken({
    userId: rowId,
  });

  return accessToken;
}

type LoginUserProps = {
  email: string;
  password: string;
};
export async function loginUser({ email, password }: LoginUserProps) {
  const row = await copera.board.authenticateTableRow({
    boardId: COPERA_CONFIG.boardId,
    tableId: COPERA_CONFIG.usersTable.usersTableId,
    identifierColumnId: COPERA_CONFIG.usersTable.identifierColumnId,
    identifierColumnValue: email,
    passwordColumnId: COPERA_CONFIG.usersTable.passwordColumnId,
    passwordColumnValue: password,
  });

  if ("error" in row) {
    if ((row as any).responseCode === 401) {
      throw new HTTP401Error("Invalid email or password", {
        code: HttpErrorCode.UNAUTHORIZED,
      });
    }
    if ((row as any).responseCode === 400) {
      throw new HTTP400Error("Invalid email or password", {
        code: HttpErrorCode.INVALID,
      });
    }
    throw new HTTP400Error("Invalid email or password", {
      code: HttpErrorCode.INVALID,
    });
  }

  if (!row) {
    throw new HTTP401Error("Invalid email or password", {
      code: HttpErrorCode.UNAUTHORIZED,
    });
  }

  const accessToken = await createUserAccessToken(row._id);

  return { accessToken };
}

export * as SystemService from "./system.service.js";
