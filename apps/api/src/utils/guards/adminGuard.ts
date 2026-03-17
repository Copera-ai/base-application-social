import { HTTP403Error, HttpErrorCode } from "common/api-utils";
import type { FastifyRequest } from "fastify";

import { COPERA_CONFIG } from "~/config.js";
import { copera } from "~/infra/copera.js";

export async function adminGuard(request: FastifyRequest): Promise<void> {
  const userId = request.user?.userId;

  if (!userId) {
    throw new HTTP403Error("Access denied", {
      code: HttpErrorCode.FORBIDDEN,
    });
  }

  const row = await copera.board.getTableRow({
    boardId: COPERA_CONFIG.boardId,
    tableId: COPERA_CONFIG.usersTable.usersTableId,
    rowId: userId,
  });

  if ("error" in row) {
    throw new HTTP403Error("Access denied", {
      code: HttpErrorCode.FORBIDDEN,
    });
  }

  const roleValue = row.columns.find(
    (c) => c.columnId === COPERA_CONFIG.usersTable.roleColumnId,
  )?.value as string | undefined;

  if (roleValue !== COPERA_CONFIG.usersTable.roleOptions.admin) {
    throw new HTTP403Error("Access denied", {
      code: HttpErrorCode.FORBIDDEN,
    });
  }
}
