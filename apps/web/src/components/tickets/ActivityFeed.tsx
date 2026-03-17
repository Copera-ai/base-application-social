import { Loader2 } from 'lucide-react';
import { useAuth } from 'src/auth/hooks/useAuth';
import { ScrollArea } from 'src/components/ui/scroll-area';
import { Separator } from 'src/components/ui/separator';
import { useTicketComments } from 'src/hooks/useTickets';
import type { Activity, RowComment, Ticket } from 'src/types/ticket';

import { ActivityItem } from './ActivityItem';
import { CommentInput } from './CommentInput';

const INTEGRATION_EMAIL = 'integration@copera.ai';

function generateActivities(ticket: Ticket): Activity[] {
  const activities: Activity[] = [
    {
      id: `${ticket._id}-created`,
      type: 'created',
      content: ticket.details || 'Created this request.',
      userName: 'You',
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

function commentToActivity(
  comment: RowComment,
  authenticatedUserName?: string,
): Activity {
  const isIntegration = comment.author.email === INTEGRATION_EMAIL;
  const userName = isIntegration
    ? 'You'
    : comment.author.name || comment.author.email || 'Unknown';

  return {
    id: comment._id,
    type: 'comment',
    content: comment.content || '',
    userName,
    createdAt: comment.createdAt,
  };
}

interface ActivityFeedProps {
  ticket: Ticket;
  ticketId: string;
}

export function ActivityFeed({ ticket, ticketId }: ActivityFeedProps) {
  const { user } = useAuth();
  const { data: commentsData, isLoading: isLoadingComments } =
    useTicketComments(ticketId);

  const generated = generateActivities(ticket);
  const commentActivities = (commentsData?.items || []).map((c) =>
    commentToActivity(c, user?.name),
  );

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
      <CommentInput ticketId={ticketId} />
    </div>
  );
}
