import { UserAvatar } from 'src/components/shared/UserAvatar';
import { formatRelativeTime } from 'src/lib/format';
import type { Activity } from 'src/types/ticket';

function stripHtmlTags(html: string): string {
  return html.replace(/<[^>]*>/g, '').trim();
}

interface ActivityItemProps {
  activity: Activity;
}

export function ActivityItem({ activity }: ActivityItemProps) {
  const displayContent =
    activity.type === 'comment'
      ? stripHtmlTags(activity.content)
      : activity.content;

  return (
    <div className="flex gap-3 py-4">
      <UserAvatar name={activity.userName} className="mt-0.5 shrink-0" />
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-foreground">
            {activity.userName}
          </span>
          <span className="text-xs text-muted-foreground">
            {formatRelativeTime(activity.createdAt)}
          </span>
        </div>
        <p className="mt-1 text-sm text-foreground/80 whitespace-pre-wrap">
          {displayContent}
        </p>
      </div>
    </div>
  );
}
