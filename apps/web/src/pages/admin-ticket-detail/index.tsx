import { Loader2 } from 'lucide-react';
import { useParams } from 'react-router';
import { AdminGuard } from 'src/auth/guard/AdminGuard';
import { Breadcrumbs } from 'src/components/layout/Breadcrumbs';
import { ActivityItem } from 'src/components/tickets/ActivityItem';
import { TicketSidebar } from 'src/components/tickets/TicketSidebar';
import { TicketStatusBadge } from 'src/components/tickets/TicketStatusBadge';
import { ScrollArea } from 'src/components/ui/scroll-area';
import { Separator } from 'src/components/ui/separator';
import { Skeleton } from 'src/components/ui/skeleton';
import {
  useAdminTicketComments,
  useAdminTicketDetail,
} from 'src/hooks/useTickets';
import type { Activity, RowComment, Ticket } from 'src/types/ticket';

function AdminTicketDetailSkeleton() {
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

function generateActivities(ticket: Ticket): Activity[] {
  const requesterName = ticket.user?.name || ticket.user?.email || 'Requester';
  const activities: Activity[] = [
    {
      id: `${ticket._id}-created`,
      type: 'created',
      content: ticket.details || 'Created this request.',
      userName: requesterName,
      createdAt: ticket.createdAt,
    },
  ];

  if (ticket.status && ticket.updatedAt !== ticket.createdAt) {
    activities.push({
      id: `${ticket._id}-status`,
      type: 'status_change',
      content: `Status changed to "${ticket.status.label}".`,
      userName: 'System',
      createdAt: ticket.updatedAt,
    });
  }

  return activities;
}

function commentToActivity(comment: RowComment): Activity {
  return {
    id: comment._id,
    type: 'comment',
    content: comment.content || '',
    userName: comment.author.name || comment.author.email || 'Unknown',
    createdAt: comment.createdAt,
  };
}

function AdminActivityFeed({
  ticket,
  ticketId,
}: {
  ticket: Ticket;
  ticketId: string;
}) {
  const { data: commentsData, isLoading: isLoadingComments } =
    useAdminTicketComments(ticketId);

  const generated = generateActivities(ticket);
  const commentActivities = (commentsData?.items || []).map(commentToActivity);

  const allActivities = [...generated, ...commentActivities].sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
  );

  return (
    <div className="flex h-full flex-col">
      <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider px-1">
        Activity
      </h3>

      <ScrollArea className="mt-3 flex-1">
        <div className="divide-y divide-border">
          {allActivities.map((activity) => (
            <ActivityItem key={activity.id} activity={activity} />
          ))}
        </div>
        {isLoadingComments && (
          <div className="flex items-center justify-center py-4">
            <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
          </div>
        )}
      </ScrollArea>

      <Separator className="my-4" />
      <p className="text-xs text-muted-foreground text-center">
        Admin view — read-only
      </p>
    </div>
  );
}

export default function AdminTicketDetail() {
  const { ticketId } = useParams<{ ticketId: string }>();
  const {
    data: ticket,
    isLoading,
    error,
  } = useAdminTicketDetail(ticketId || null);

  return (
    <AdminGuard>
      {isLoading ? (
        <AdminTicketDetailSkeleton />
      ) : error || !ticket ? (
        <main className="mx-auto max-w-5xl px-4 py-6 sm:px-6">
          <Breadcrumbs
            items={[
              { label: 'Home', href: '/' },
              { label: 'Admin', href: '/admin/tickets' },
              { label: 'Error' },
            ]}
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
      ) : (
        <main className="mx-auto max-w-5xl px-4 py-6 sm:px-6">
          <Breadcrumbs
            items={[
              { label: 'Home', href: '/' },
              { label: 'Admin', href: '/admin/tickets' },
              { label: ticket.title },
            ]}
            className="mb-6"
          />

          <div className="mb-6 flex items-start justify-between gap-4">
            <h1 className="text-xl font-semibold text-foreground">
              {ticket.title}
            </h1>
            <TicketStatusBadge status={ticket.status} />
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
            <div className="lg:col-span-8">
              <div className="rounded-xl border border-border bg-card p-5">
                <AdminActivityFeed ticket={ticket} ticketId={ticketId!} />
              </div>
            </div>
            <div className="lg:col-span-4">
              <TicketSidebar ticket={ticket} />
            </div>
          </div>
        </main>
      )}
    </AdminGuard>
  );
}
