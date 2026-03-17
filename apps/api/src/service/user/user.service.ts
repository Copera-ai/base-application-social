import {
  type DefaultProps,
  HTTP401Error,
  HttpErrorCode,
} from "common/api-utils";

import { COPERA_CONFIG } from "~/config.js";
import { copera } from "~/infra/copera.js";

export async function getUserInfo({ userId }: DefaultProps) {
  const row = await copera.board.getTableRow({
    boardId: COPERA_CONFIG.boardId,
    tableId: COPERA_CONFIG.usersTable.usersTableId,
    rowId: userId,
  });

  if ("error" in row) {
    throw new HTTP401Error("User not found", {
      code: HttpErrorCode.UNAUTHORIZED,
    });
  }

  const userName = row.columns.find(
    (c) => c.columnId === COPERA_CONFIG.usersTable.nameColumnId,
  )?.value;

  const userEmail = row.columns.find(
    (c) => c.columnId === COPERA_CONFIG.usersTable.identifierColumnId,
  )?.value;

  const roleValue = row.columns.find(
    (c) => c.columnId === COPERA_CONFIG.usersTable.roleColumnId,
  )?.value as string | undefined;

  const role =
    roleValue === COPERA_CONFIG.usersTable.roleOptions.admin ? "admin" : "user";

  return {
    _id: row._id,
    email: userEmail,
    name: userName,
    role,
  };
}

export * as UserService from "./user.service.js";
