import { Controller, GET, Hook } from "fastify-decorators";

import { adminGuard } from "~/utils/guards/adminGuard.js";
import type { Req } from "~/utils/types/index.js";

import { TicketService } from "./ticket.service.js";

@Controller("/admin/tickets")
export default class AdminTicketController {
  @Hook("preHandler")
  async checkAdmin(req: Req) {
    await adminGuard(req);
  }

  @GET("/")
  async listAllTickets() {
    return TicketService.listAllTickets();
  }

  @GET("/:ticketId")
  async getTicket(req: Req) {
    const { ticketId } = req.params as { ticketId: string };

    return TicketService.getTicketAdmin({ ticketId });
  }

  @GET("/:ticketId/comments")
  async listComments(req: Req) {
    const { ticketId } = req.params as { ticketId: string };
    const { after } = req.query as { after?: string };

    return TicketService.listCommentsAdmin({ ticketId, after });
  }
}
