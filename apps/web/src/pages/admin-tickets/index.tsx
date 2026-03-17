import { Clock, ExternalLink, ShieldCheck, User } from 'lucide-react';
import { Link } from 'react-router';
import { AdminGuard } from 'src/auth/guard/AdminGuard';
import { Breadcrumbs } from 'src/components/layout/Breadcrumbs';
import { TicketStatusBadge } from 'src/components/tickets/TicketStatusBadge';
import { Skeleton } from 'src/components/ui/skeleton';
import { useAdminTicketList } from 'src/hooks/useTickets';
import { formatRelativeTime } from 'src/lib/format';

function AdminTicketsSkeleton() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 5 }).map((_, i) => (
        <Skeleton key={i} className="h-16" />
      ))}
    </div>
  );
}

export default function AdminTickets() {
  const { data: tickets, isLoading } = useAdminTicketList();

  return (
    <AdminGuard>
      <main className="mx-auto max-w-5xl px-4 py-6 sm:px-6">
        <Breadcrumbs
          items={[
            { label: 'Home', href: '/' },
            { label: 'Admin - All Requests' },
          ]}
          className="mb-6"
        />

        <div className="mb-6 flex items-center gap-2">
          <ShieldCheck className="h-5 w-5 text-primary" />
          <h1 className="text-xl font-semibold text-foreground">
            All Requests
          </h1>
        </div>

        {isLoading ? (
          <AdminTicketsSkeleton />
        ) : !tickets?.length ? (
          <div className="rounded-xl border border-border bg-card py-16 text-center">
            <p className="text-muted-foreground">No requests found.</p>
          </div>
        ) : (
          <div className="rounded-xl border border-border bg-card">
            {tickets.map((ticket, index) => (
              <Link
                key={ticket._id}
                to={`/admin/tickets/${ticket._id}`}
                className={`group flex items-center justify-between gap-4 px-5 py-3.5 transition-colors hover:bg-muted/50 ${
                  index < tickets.length - 1 ? 'border-b border-border' : ''
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <ExternalLink className="h-4 w-4 shrink-0 text-muted-foreground group-hover:text-primary" />
                  <div className="min-w-0">
                    <p className="text-sm font-medium truncate group-hover:text-primary">
                      {ticket.title}
                    </p>
                    <div className="flex items-center gap-3 mt-0.5">
                      {ticket.user?.name && (
                        <div className="flex items-center gap-1">
                          <User className="h-3 w-3 text-muted-foreground" />
                          <span className="text-xs text-muted-foreground">
                            {ticket.user.name}
                          </span>
                        </div>
                      )}
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">
                          {formatRelativeTime(ticket.createdAt)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <TicketStatusBadge status={ticket.status} />
              </Link>
            ))}
          </div>
        )}
      </main>
    </AdminGuard>
  );
}
