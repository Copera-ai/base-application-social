import { lazy } from 'react';
import type { RouteObject } from 'react-router';
import { AppLayout } from 'src/components/layout/AppLayout';
import SignIn from 'src/pages/sign-in';

const PortalHome = lazy(() => import('src/pages/portal-home'));
const TicketNew = lazy(() => import('src/pages/ticket-new'));
const TicketDetail = lazy(() => import('src/pages/ticket-detail'));
const AdminTickets = lazy(() => import('src/pages/admin-tickets'));
const AdminTicketDetail = lazy(() => import('src/pages/admin-ticket-detail'));

export const routesSection: RouteObject[] = [
  {
    path: '/',
    element: <AppLayout />,
    children: [
      { index: true, element: <PortalHome /> },
      { path: 'tickets/new', element: <TicketNew /> },
      { path: 'tickets/:ticketId', element: <TicketDetail /> },
      { path: 'admin/tickets', element: <AdminTickets /> },
      { path: 'admin/tickets/:ticketId', element: <AdminTicketDetail /> },
    ],
  },
  { path: '/sign-in', element: <SignIn /> },
];
