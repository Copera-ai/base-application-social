import type {
  CommentPagination,
  CreateCommentParams,
  CreateTicketParams,
  RequestTypeOption,
  RowComment,
  Ticket,
} from 'src/types/ticket';

import { axios } from './api';

export async function listRequestTypes(): Promise<RequestTypeOption[]> {
  const { data } = await axios.get<RequestTypeOption[]>(
    '/tickets/request-types',
  );
  return data;
}

export async function createTicket(
  params: CreateTicketParams,
): Promise<Ticket> {
  const { data } = await axios.post<Ticket>('/tickets', params);
  return data;
}

export async function listTickets(): Promise<Ticket[]> {
  const { data } = await axios.get<Ticket[]>('/tickets');
  return data;
}

export async function getTicket(ticketId: string): Promise<Ticket> {
  const { data } = await axios.get<Ticket>(`/tickets/${ticketId}`);
  return data;
}

export async function listComments(
  ticketId: string,
): Promise<CommentPagination> {
  const { data } = await axios.get<CommentPagination>(
    `/tickets/${ticketId}/comments`,
  );
  return data;
}

export async function createComment(
  ticketId: string,
  params: CreateCommentParams,
): Promise<RowComment> {
  const { data } = await axios.post<RowComment>(
    `/tickets/${ticketId}/comments`,
    params,
  );
  return data;
}

export async function listAllTickets(): Promise<Ticket[]> {
  const { data } = await axios.get<Ticket[]>('/admin/tickets');
  return data;
}

export async function getTicketAdmin(ticketId: string): Promise<Ticket> {
  const { data } = await axios.get<Ticket>(`/admin/tickets/${ticketId}`);
  return data;
}

export async function listCommentsAdmin(
  ticketId: string,
): Promise<CommentPagination> {
  const { data } = await axios.get<CommentPagination>(
    `/admin/tickets/${ticketId}/comments`,
  );
  return data;
}

export * as TicketRequests from './ticket.requests';
