import { yup } from "common/api-utils";
import { Controller, GET, POST } from "fastify-decorators";

import type { Req } from "~/utils/types/index.js";

import { TicketService } from "./ticket.service.js";

@Controller("/tickets")
export default class TicketController {
  @POST("/")
  async createTicket(req: Req) {
    const { title, details, requestType } = await yup
      .object({
        title: yup.string().required().min(1).max(500),
        details: yup.string().optional().max(5000),
        requestType: yup.string().optional(),
      })
      .validate(req.body);

    const { userId } = req.user;

    return TicketService.createTicket({
      userId,
      title,
      details,
      requestType,
    });
  }

  @GET("/")
  async listTickets(req: Req) {
    const { userId } = req.user;

    return TicketService.listTickets({ userId });
  }

  @GET("/request-types")
  async listRequestTypes() {
    return TicketService.listRequestTypes();
  }

  @GET("/:ticketId")
  async getTicket(req: Req) {
    const { ticketId } = req.params as { ticketId: string };

    const { userId } = req.user;

    return TicketService.getTicket({
      userId,
      ticketId,
    });
  }

  @GET("/:ticketId/comments")
  async listComments(req: Req) {
    const { ticketId } = req.params as { ticketId: string };
    const { after } = req.query as { after?: string };

    const { userId } = req.user;

    return TicketService.listComments({
      userId,
      ticketId,
      after,
    });
  }

  @POST("/:ticketId/comments")
  async createComment(req: Req) {
    const { ticketId } = req.params as { ticketId: string };

    const { content } = await yup
      .object({
        content: yup.string().required().min(1).max(5000),
      })
      .validate(req.body);

    const { userId } = req.user;

    return TicketService.createComment({
      userId,
      ticketId,
      content,
    });
  }
}
