import { Avatar, AvatarFallback } from 'src/components/ui/avatar';
import { cn } from 'src/lib/utils';

interface UserAvatarProps {
  name: string;
  className?: string;
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

export function UserAvatar({ name, className }: UserAvatarProps) {
  return (
    <Avatar className={cn('h-8 w-8', className)}>
      <AvatarFallback className="bg-primary/10 text-primary text-xs font-medium">
        {getInitials(name)}
      </AvatarFallback>
    </Avatar>
  );
}
