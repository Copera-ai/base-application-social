import { HTTP400Error, HttpErrorCode } from "common/api-utils";

import { COPERA_CONFIG } from "~/config.js";
import { copera } from "~/infra/copera.js";
import { Ticket } from "~/models/Ticket/index.js";

export type CreateTicketProps = {
  userId: string;
  title: string;
  details?: string;
  requestType?: string;
};

export async function createTicket({
  userId,
  title,
  details,
  requestType,
}: CreateTicketProps) {
  const columns = [
    {
      columnId: COPERA_CONFIG.ticketsTable.titleColumnId,
      value: title,
    },
    {
      columnId: COPERA_CONFIG.ticketsTable.detailsColumnId,
      value: details || "",
    },
    {
      columnId: COPERA_CONFIG.ticketsTable.userColumnId,
      value: [userId],
    },
  ];

  if (requestType) {
    columns.push({
      columnId: COPERA_CONFIG.ticketsTable.requestTypeColumnId,
      value: requestType,
    });
  }

  const row = await copera.board.createTableRow({
    boardId: COPERA_CONFIG.boardId,
    tableId: COPERA_CONFIG.ticketsTable.ticketsTableId,
    columns,
  });

  if ("error" in row) {
    throw new Error("Failed to create ticket in Copera");
  }

  const ticket = await Ticket.create({
    coperaRowId: row._id,
    title,
    details: details || "",
    userId,
  });

  return {
    _id: ticket._id,
    coperaRowId: ticket.coperaRowId,
    title: ticket.title,
    details: ticket.details,
    userId: ticket.userId,
    createdAt: ticket.createdAt,
    updatedAt: ticket.updatedAt,
  };
}

export type ListTicketsProps = {
  userId: string;
};

export async function listTickets({ userId }: ListTicketsProps) {
  const tickets = await Ticket.find({ userId }).sort({ createdAt: -1 }).lean();

  return tickets.map((ticket) => ({
    _id: ticket._id,
    coperaRowId: ticket.coperaRowId,
    title: ticket.title,
    details: ticket.details,
    userId: ticket.userId,
    createdAt: ticket.createdAt,
    updatedAt: ticket.updatedAt,
  }));
}

export type GetTicketProps = {
  userId: string;
  ticketId: string;
};

export async function getTicket({ userId, ticketId }: GetTicketProps) {
  const ticket = await Ticket.findOne({ _id: ticketId, userId }).lean();

  if (!ticket) {
    throw new HTTP400Error("Ticket not found", {
      code: HttpErrorCode.NOT_FOUND,
    });
  }

  const [row, tableDetails] = await Promise.all([
    copera.board.getTableRow({
      boardId: COPERA_CONFIG.boardId,
      tableId: COPERA_CONFIG.ticketsTable.ticketsTableId,
      rowId: ticket.coperaRowId,
    }),
    copera.board.getBoardTable({
      boardId: COPERA_CONFIG.boardId,
      tableId: COPERA_CONFIG.ticketsTable.ticketsTableId,
    }),
  ]);

  let coperaTitle = ticket.title;
  let coperaDetails = ticket.details;
  let coperaStatusValue = null;
  let coperaRequestTypeValue = null;

  if (!("error" in row)) {
    const titleColumn = row.columns.find(
      (c) => c.columnId === COPERA_CONFIG.ticketsTable.titleColumnId,
    );
    const detailsColumn = row.columns.find(
      (c) => c.columnId === COPERA_CONFIG.ticketsTable.detailsColumnId,
    );
    const statusColumn = row.columns.find(
      (c) => c.columnId === COPERA_CONFIG.ticketsTable.statusColumnId,
    );
    const requestTypeColumn = row.columns.find(
      (c) => c.columnId === COPERA_CONFIG.ticketsTable.requestTypeColumnId,
    );

    if (titleColumn?.value) coperaTitle = titleColumn.value as string;
    if (detailsColumn?.value) coperaDetails = detailsColumn.value as string;
    if (statusColumn?.value) coperaStatusValue = statusColumn.value as string;
    if (requestTypeColumn?.value)
      coperaRequestTypeValue = requestTypeColumn.value as string;
  }

  let coperaStatus = null;
  let coperaRequestType = null;
  if (!("error" in tableDetails)) {
    const statusColumn = tableDetails.columns.find(
      (c) => c.columnId === COPERA_CONFIG.ticketsTable.statusColumnId,
    );
    if (statusColumn?.options) {
      const statusOption = statusColumn.options.find(
        (o) => o.optionId === coperaStatusValue,
      );
      if (statusOption)
        coperaStatus = {
          label: statusOption.label as string,
          color: statusOption.color as string,
        };
    }

    const requestTypeCol = tableDetails.columns.find(
      (c) => c.columnId === COPERA_CONFIG.ticketsTable.requestTypeColumnId,
    );
    if (requestTypeCol?.options) {
      const requestTypeOption = requestTypeCol.options.find(
        (o) => o.optionId === coperaRequestTypeValue,
      );
      if (requestTypeOption)
        coperaRequestType = {
          label: requestTypeOption.label as string,
          color: requestTypeOption.color as string,
        };
    }
  }

  return {
    _id: ticket._id,
    coperaRowId: ticket.coperaRowId,
    title: coperaTitle,
    details: coperaDetails,
    userId: ticket.userId,
    status: coperaStatus,
    requestType: coperaRequestType,
    createdAt: ticket.createdAt,
    updatedAt: ticket.updatedAt,
  };
}

export type ListCommentsProps = {
  userId: string;
  ticketId: string;
  after?: string;
};

export async function listComments({
  userId,
  ticketId,
  after,
}: ListCommentsProps) {
  const ticket = await Ticket.findOne({ _id: ticketId, userId }).lean();

  if (!ticket) {
    throw new HTTP400Error("Ticket not found", {
      code: HttpErrorCode.NOT_FOUND,
    });
  }

  const result = await copera.board.listRowComments({
    boardId: COPERA_CONFIG.boardId,
    tableId: COPERA_CONFIG.ticketsTable.ticketsTableId,
    rowId: ticket.coperaRowId,
    visibility: "all",
    after,
  });

  if ("error" in result) {
    return {
      items: [],
      pageInfo: {
        endCursor: null,
        startCursor: null,
        hasNextPage: false,
        hasPreviousPage: false,
      },
    };
  }

  return result;
}

export type CreateCommentProps = {
  userId: string;
  ticketId: string;
  content: string;
};

export async function createComment({
  userId,
  ticketId,
  content,
}: CreateCommentProps) {
  const ticket = await Ticket.findOne({ _id: ticketId, userId }).lean();

  if (!ticket) {
    throw new HTTP400Error("Ticket not found", {
      code: HttpErrorCode.NOT_FOUND,
    });
  }

  const result = await copera.board.createRowComment({
    boardId: COPERA_CONFIG.boardId,
    tableId: COPERA_CONFIG.ticketsTable.ticketsTableId,
    rowId: ticket.coperaRowId,
    content,
    visibility: "external",
  });

  if ("error" in result) {
    throw new HTTP400Error("Failed to create comment", {
      code: HttpErrorCode.INVALID,
    });
  }

  return result;
}

async function resolveUserInfo(userId: string) {
  const row = await copera.board.getTableRow({
    boardId: COPERA_CONFIG.boardId,
    tableId: COPERA_CONFIG.usersTable.usersTableId,
    rowId: userId,
  });

  if ("error" in row) {
    return { name: null, email: null };
  }

  const name =
    (row.columns.find(
      (c) => c.columnId === COPERA_CONFIG.usersTable.nameColumnId,
    )?.value as string) || null;

  const email =
    (row.columns.find(
      (c) => c.columnId === COPERA_CONFIG.usersTable.identifierColumnId,
    )?.value as string) || null;

  return { name, email };
}

export async function listAllTickets() {
  const tickets = await Ticket.find({}).sort({ createdAt: -1 }).lean();

  const uniqueUserIds = [...new Set(tickets.map((t) => t.userId))];
  const userInfos = await Promise.all(
    uniqueUserIds.map(async (uid) => ({
      uid,
      info: await resolveUserInfo(uid),
    })),
  );
  const userMap = new Map(userInfos.map(({ uid, info }) => [uid, info]));

  return tickets.map((ticket) => ({
    _id: ticket._id,
    coperaRowId: ticket.coperaRowId,
    title: ticket.title,
    details: ticket.details,
    userId: ticket.userId,
    user: userMap.get(ticket.userId) || { name: null, email: null },
    createdAt: ticket.createdAt,
    updatedAt: ticket.updatedAt,
  }));
}

export type GetTicketAdminProps = {
  ticketId: string;
};

export async function getTicketAdmin({ ticketId }: GetTicketAdminProps) {
  const ticket = await Ticket.findOne({ _id: ticketId }).lean();

  if (!ticket) {
    throw new HTTP400Error("Ticket not found", {
      code: HttpErrorCode.NOT_FOUND,
    });
  }

  const [row, tableDetails, userInfo] = await Promise.all([
    copera.board.getTableRow({
      boardId: COPERA_CONFIG.boardId,
      tableId: COPERA_CONFIG.ticketsTable.ticketsTableId,
      rowId: ticket.coperaRowId,
    }),
    copera.board.getBoardTable({
      boardId: COPERA_CONFIG.boardId,
      tableId: COPERA_CONFIG.ticketsTable.ticketsTableId,
    }),
    resolveUserInfo(ticket.userId),
  ]);

  let coperaTitle = ticket.title;
  let coperaDetails = ticket.details;
  let coperaStatusValue = null;
  let coperaRequestTypeValue = null;

  if (!("error" in row)) {
    const titleColumn = row.columns.find(
      (c) => c.columnId === COPERA_CONFIG.ticketsTable.titleColumnId,
    );
    const detailsColumn = row.columns.find(
      (c) => c.columnId === COPERA_CONFIG.ticketsTable.detailsColumnId,
    );
    const statusColumn = row.columns.find(
      (c) => c.columnId === COPERA_CONFIG.ticketsTable.statusColumnId,
    );
    const requestTypeColumn = row.columns.find(
      (c) => c.columnId === COPERA_CONFIG.ticketsTable.requestTypeColumnId,
    );

    if (titleColumn?.value) coperaTitle = titleColumn.value as string;
    if (detailsColumn?.value) coperaDetails = detailsColumn.value as string;
    if (statusColumn?.value) coperaStatusValue = statusColumn.value as string;
    if (requestTypeColumn?.value)
      coperaRequestTypeValue = requestTypeColumn.value as string;
  }

  let coperaStatus = null;
  let coperaRequestType = null;
  if (!("error" in tableDetails)) {
    const statusColumn = tableDetails.columns.find(
      (c) => c.columnId === COPERA_CONFIG.ticketsTable.statusColumnId,
    );
    if (statusColumn?.options) {
      const statusOption = statusColumn.options.find(
        (o) => o.optionId === coperaStatusValue,
      );
      if (statusOption)
        coperaStatus = {
          label: statusOption.label as string,
          color: statusOption.color as string,
        };
    }

    const requestTypeCol = tableDetails.columns.find(
      (c) => c.columnId === COPERA_CONFIG.ticketsTable.requestTypeColumnId,
    );
    if (requestTypeCol?.options) {
      const requestTypeOption = requestTypeCol.options.find(
        (o) => o.optionId === coperaRequestTypeValue,
      );
      if (requestTypeOption)
        coperaRequestType = {
          label: requestTypeOption.label as string,
          color: requestTypeOption.color as string,
        };
    }
  }

  return {
    _id: ticket._id,
    coperaRowId: ticket.coperaRowId,
    title: coperaTitle,
    details: coperaDetails,
    userId: ticket.userId,
    user: userInfo,
    status: coperaStatus,
    requestType: coperaRequestType,
    createdAt: ticket.createdAt,
    updatedAt: ticket.updatedAt,
  };
}

export type ListCommentsAdminProps = {
  ticketId: string;
  after?: string;
};

export async function listCommentsAdmin({
  ticketId,
  after,
}: ListCommentsAdminProps) {
  const ticket = await Ticket.findOne({ _id: ticketId }).lean();

  if (!ticket) {
    throw new HTTP400Error("Ticket not found", {
      code: HttpErrorCode.NOT_FOUND,
    });
  }

  const result = await copera.board.listRowComments({
    boardId: COPERA_CONFIG.boardId,
    tableId: COPERA_CONFIG.ticketsTable.ticketsTableId,
    rowId: ticket.coperaRowId,
    visibility: "all",
    after,
  });

  if ("error" in result) {
    return {
      items: [],
      pageInfo: {
        endCursor: null,
        startCursor: null,
        hasNextPage: false,
        hasPreviousPage: false,
      },
    };
  }

  return result;
}

export function listRequestTypes() {
  return COPERA_CONFIG.ticketsTable.requestTypeOptions;
}

export * as TicketService from "./ticket.service.js";
