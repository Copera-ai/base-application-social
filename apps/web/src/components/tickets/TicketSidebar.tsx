import { Separator } from 'src/components/ui/separator';
import { formatDateTime } from 'src/lib/format';
import type { Ticket } from 'src/types/ticket';

import { TicketStatusBadge } from './TicketStatusBadge';

interface TicketSidebarProps {
  ticket: Ticket;
}

export function TicketSidebar({ ticket }: TicketSidebarProps) {
  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <div className="space-y-5">
        <div>
          <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
            Status
          </h4>
          <TicketStatusBadge status={ticket.status} />
        </div>

        <Separator />

        <div>
          <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
            Request type
          </h4>
          {ticket.requestType ? (
            <TicketStatusBadge status={ticket.requestType} />
          ) : (
            <p className="text-sm text-muted-foreground">Not set</p>
          )}
        </div>

        <Separator />

        {ticket.user && (
          <>
            <div>
              <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
                Requester
              </h4>
              <p className="text-sm text-foreground">
                {ticket.user.name || ticket.user.email || 'Unknown'}
              </p>
              {ticket.user.name && ticket.user.email && (
                <p className="text-xs text-muted-foreground mt-0.5">
                  {ticket.user.email}
                </p>
              )}
            </div>
            <Separator />
          </>
        )}

        <div>
          <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
            Request ID
          </h4>
          <p className="text-sm text-foreground font-mono">
            {ticket.coperaRowId}
          </p>
        </div>

        <Separator />

        <div>
          <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
            Created
          </h4>
          <p className="text-sm text-foreground">
            {formatDateTime(ticket.createdAt)}
          </p>
        </div>

        {ticket.updatedAt !== ticket.createdAt && (
          <>
            <Separator />
            <div>
              <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
                Last updated
              </h4>
              <p className="text-sm text-foreground">
                {formatDateTime(ticket.updatedAt)}
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
