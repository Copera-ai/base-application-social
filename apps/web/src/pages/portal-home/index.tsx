import { Clock, ExternalLink } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Link } from 'react-router';
import { HeroBanner } from 'src/components/portal/HeroBanner';
import { PortalGrid } from 'src/components/portal/PortalGrid';
import { RecentTickets } from 'src/components/portal/RecentTickets';
import { SearchBar } from 'src/components/portal/SearchBar';
import { TicketStatusBadge } from 'src/components/tickets/TicketStatusBadge';
import { useTicketList } from 'src/hooks/useTickets';
import { formatRelativeTime } from 'src/lib/format';

function SearchResults({
  query,
  tickets,
}: {
  query: string;
  tickets: ReturnType<typeof useTicketList>['data'];
}) {
  const filtered = useMemo(() => {
    if (!tickets || !query.trim()) return [];
    const q = query.toLowerCase();
    return tickets.filter(
      (t) =>
        t.title.toLowerCase().includes(q) ||
        t.details?.toLowerCase().includes(q),
    );
  }, [tickets, query]);

  if (filtered.length === 0) {
    return (
      <div className="py-12 text-center">
        <p className="text-muted-foreground">
          No requests found matching &quot;{query}&quot;
        </p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="mb-4 text-lg font-semibold text-foreground">
        Search results ({filtered.length})
      </h2>
      <div className="rounded-xl border border-border bg-card">
        {filtered.map((ticket, index) => (
          <Link
            key={ticket._id}
            to={`/tickets/${ticket._id}`}
            className={`group flex items-center justify-between gap-4 px-5 py-3.5 transition-colors hover:bg-muted/50 ${
              index < filtered.length - 1 ? 'border-b border-border' : ''
            }`}
          >
            <div className="flex items-center gap-3 min-w-0">
              <ExternalLink className="h-4 w-4 shrink-0 text-muted-foreground group-hover:text-primary" />
              <div className="min-w-0">
                <p className="text-sm font-medium truncate group-hover:text-primary">
                  {ticket.title}
                </p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <Clock className="h-3 w-3 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">
                    {formatRelativeTime(ticket.createdAt)}
                  </span>
                </div>
              </div>
            </div>
            <TicketStatusBadge status={ticket.status} />
          </Link>
        ))}
      </div>
    </div>
  );
}

export default function PortalHome() {
  const [search, setSearch] = useState('');
  const { data: tickets = [] } = useTicketList();

  const isSearching = search.trim().length > 0;

  return (
    <div>
      <HeroBanner />
      <SearchBar
        value={search}
        onChange={setSearch}
        className="relative z-10"
      />

      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
        <div className="space-y-10">
          {isSearching ? (
            <SearchResults query={search} tickets={tickets} />
          ) : (
            <>
              <PortalGrid />
              <RecentTickets tickets={tickets} />
            </>
          )}
        </div>
      </main>
    </div>
  );
}
