import { Clock, ExternalLink } from 'lucide-react';
import { Link } from 'react-router';
import { Badge } from 'src/components/ui/badge';
import { formatRelativeTime } from 'src/lib/format';
import type { Ticket } from 'src/types/ticket';

function getContrastColor(hexColor: string): string {
  const hex = hexColor.replace('#', '');
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.5 ? '#000000' : '#ffffff';
}

interface RecentTicketsProps {
  tickets: Ticket[];
}

export function RecentTickets({ tickets }: RecentTicketsProps) {
  if (tickets.length === 0) return null;

  const recent = tickets.slice(0, 5);

  return (
    <div>
      <h2 className="mb-4 text-lg font-semibold text-foreground">
        Your recent requests
      </h2>
      <div className="rounded-xl border border-border bg-card">
        {recent.map((ticket, index) => (
          <Link
            key={ticket._id}
            to={`/tickets/${ticket._id}`}
            className={`group flex items-center justify-between gap-4 px-5 py-3.5 transition-colors hover:bg-muted/50 ${
              index < recent.length - 1 ? 'border-b border-border' : ''
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
            {ticket.status && (
              <Badge
                className="shrink-0"
                style={{
                  backgroundColor: ticket.status.color,
                  color: getContrastColor(ticket.status.color),
                  borderColor: 'transparent',
                }}
              >
                {ticket.status.label}
              </Badge>
            )}
          </Link>
        ))}
      </div>
    </div>
  );
}
