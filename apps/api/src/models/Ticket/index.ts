import { getModelForClass } from "@typegoose/typegoose";

import { ITicket } from "./Ticket.js";

export const Ticket = getModelForClass(ITicket);
