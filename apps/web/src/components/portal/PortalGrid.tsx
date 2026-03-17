import { portals } from 'src/data/portals';

import { PortalCard } from './PortalCard';

export function PortalGrid() {
  return (
    <div>
      <h2 className="mb-4 text-lg font-semibold text-foreground">
        What do you need help with?
      </h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {portals.map((portal) => (
          <PortalCard key={portal.id} portal={portal} />
        ))}
      </div>
    </div>
  );
}
