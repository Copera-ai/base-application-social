import { useParams } from 'react-router';
import { Breadcrumbs } from 'src/components/layout/Breadcrumbs';
import { ActivityFeed } from 'src/components/tickets/ActivityFeed';
import { TicketSidebar } from 'src/components/tickets/TicketSidebar';
import { TicketStatusBadge } from 'src/components/tickets/TicketStatusBadge';
import { Skeleton } from 'src/components/ui/skeleton';
import { useTicketDetail } from 'src/hooks/useTickets';

function TicketDetailSkeleton() {
  return (
    <main className="mx-auto max-w-5xl px-4 py-6 sm:px-6">
      <Skeleton className="mb-6 h-4 w-48" />
      <Skeleton className="mb-2 h-8 w-96" />
      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-12">
        <div className="lg:col-span-8 space-y-4">
          <Skeleton className="h-24" />
          <Skeleton className="h-24" />
        </div>
        <div className="lg:col-span-4">
          <Skeleton className="h-64" />
        </div>
      </div>
    </main>
  );
}

export default function TicketDetail() {
  const { ticketId } = useParams<{ ticketId: string }>();
  const { data: ticket, isLoading, error } = useTicketDetail(ticketId || null);

  if (isLoading) return <TicketDetailSkeleton />;

  if (error || !ticket) {
    return (
      <main className="mx-auto max-w-5xl px-4 py-6 sm:px-6">
        <Breadcrumbs
          items={[{ label: 'Home', href: '/' }, { label: 'Error' }]}
          className="mb-6"
        />
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="rounded-full bg-destructive/10 p-4 mb-4">
            <svg
              className="h-8 w-8 text-destructive"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <p className="text-lg font-medium text-foreground">
            Failed to load request
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            The request you&apos;re looking for could not be found.
          </p>
        </div>
      </main>
    );
  }

  const breadcrumbs = [{ label: 'Home', href: '/' }, { label: ticket.title }];

  return (
    <main className="mx-auto max-w-5xl px-4 py-6 sm:px-6">
      <Breadcrumbs items={breadcrumbs} className="mb-6" />

      <div className="mb-6 flex items-start justify-between gap-4">
        <h1 className="text-xl font-semibold text-foreground">
          {ticket.title}
        </h1>
        <TicketStatusBadge status={ticket.status} />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <div className="lg:col-span-8">
          <div className="rounded-xl border border-border bg-card p-5">
            <ActivityFeed ticket={ticket} ticketId={ticketId!} />
          </div>
        </div>
        <div className="lg:col-span-4">
          <TicketSidebar ticket={ticket} />
        </div>
      </div>
    </main>
  );
}
