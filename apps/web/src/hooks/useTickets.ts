import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { QueryKey } from 'src/lib/react-query';
import { TicketRequests } from 'src/requests/ticket.requests';
import type {
  CreateCommentParams,
  CreateTicketParams,
  Ticket,
} from 'src/types/ticket';

export function useTicketList() {
  return useQuery({
    queryKey: QueryKey.TICKET_LIST(),
    queryFn: TicketRequests.listTickets,
    refetchOnWindowFocus: true,
  });
}

export function useTicketDetail(ticketId: string | null) {
  return useQuery({
    queryKey: QueryKey.TICKET_DETAIL(ticketId || ''),
    queryFn: () => TicketRequests.getTicket(ticketId!),
    enabled: !!ticketId,
    refetchOnWindowFocus: true,
  });
}

export function useTicketComments(ticketId: string | null) {
  return useQuery({
    queryKey: QueryKey.TICKET_COMMENTS(ticketId || ''),
    queryFn: () => TicketRequests.listComments(ticketId!),
    enabled: !!ticketId,
  });
}

export function useCreateComment(ticketId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: CreateCommentParams) =>
      TicketRequests.createComment(ticketId, params),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: QueryKey.TICKET_COMMENTS(ticketId),
      });
    },
  });
}

export function useRequestTypes() {
  return useQuery({
    queryKey: QueryKey.REQUEST_TYPES(),
    queryFn: TicketRequests.listRequestTypes,
    staleTime: Infinity,
  });
}

export function useAdminTicketList() {
  return useQuery({
    queryKey: QueryKey.ADMIN_TICKET_LIST(),
    queryFn: TicketRequests.listAllTickets,
    refetchOnWindowFocus: true,
  });
}

export function useAdminTicketDetail(ticketId: string | null) {
  return useQuery({
    queryKey: QueryKey.ADMIN_TICKET_DETAIL(ticketId || ''),
    queryFn: () => TicketRequests.getTicketAdmin(ticketId!),
    enabled: !!ticketId,
    refetchOnWindowFocus: true,
  });
}

export function useAdminTicketComments(ticketId: string | null) {
  return useQuery({
    queryKey: QueryKey.ADMIN_TICKET_COMMENTS(ticketId || ''),
    queryFn: () => TicketRequests.listCommentsAdmin(ticketId!),
    enabled: !!ticketId,
  });
}

export function useCreateTicket() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: CreateTicketParams) =>
      TicketRequests.createTicket(params),
    onSuccess: (newTicket) => {
      queryClient.setQueryData<Ticket[]>(QueryKey.TICKET_LIST(), (old) => {
        if (!old) return [newTicket];
        return [newTicket, ...old];
      });
      queryClient.invalidateQueries({ queryKey: QueryKey.TICKET_LIST() });
    },
  });
}
