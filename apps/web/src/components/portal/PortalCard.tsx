import { Link } from 'react-router';
import { Iconify } from 'src/components/iconify/iconify';
import type { Portal } from 'src/types/portal';

interface PortalCardProps {
  portal: Portal;
}

export function PortalCard({ portal }: PortalCardProps) {
  return (
    <Link
      to={portal.href}
      className="group flex flex-col items-center rounded-xl border border-border bg-card p-6 text-center transition-all hover:shadow-md hover:border-primary/30"
    >
      <div
        className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl"
        style={{ backgroundColor: `${portal.color}15` }}
      >
        <Iconify
          icon={portal.icon}
          width={28}
          height={28}
          style={{ color: portal.color }}
        />
      </div>
      <h3 className="text-sm font-semibold text-primary group-hover:underline">
        {portal.title}
      </h3>
      <p className="mt-1.5 text-xs text-muted-foreground line-clamp-2 leading-relaxed">
        {portal.description}
      </p>
    </Link>
  );
}
