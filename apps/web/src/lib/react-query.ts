import { QueryClient } from '@tanstack/react-query';
import type { AxiosError } from 'axios';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      retry: (failureCount, error) => {
        const axiosError = error as AxiosError;
        const status = axiosError.response?.status;
        if (status === 401 || status === 403) return false;
        return failureCount < 3;
      },
    },
  },
});

export const QueryKey = {
  USER: ['user'],
  USER_INFO: () => [...QueryKey.USER, 'info'],
  TICKETS: ['tickets'],
  TICKET_LIST: () => [...QueryKey.TICKETS, 'list'],
  TICKET_DETAIL: (ticketId: string) => [
    ...QueryKey.TICKETS,
    'detail',
    ticketId,
  ],
  TICKET_COMMENTS: (ticketId: string) => [
    ...QueryKey.TICKETS,
    'comments',
    ticketId,
  ],
  REQUEST_TYPES: () => [...QueryKey.TICKETS, 'request-types'],
  ADMIN_TICKETS: ['admin-tickets'],
  ADMIN_TICKET_LIST: () => [...QueryKey.ADMIN_TICKETS, 'list'],
  ADMIN_TICKET_DETAIL: (ticketId: string) => [
    ...QueryKey.ADMIN_TICKETS,
    'detail',
    ticketId,
  ],
  ADMIN_TICKET_COMMENTS: (ticketId: string) => [
    ...QueryKey.ADMIN_TICKETS,
    'comments',
    ticketId,
  ],
} as const;
