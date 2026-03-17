import { useNavigate, useSearchParams } from 'react-router';
import { Iconify } from 'src/components/iconify/iconify';
import { Breadcrumbs } from 'src/components/layout/Breadcrumbs';
import { CreateTicketForm } from 'src/components/tickets/CreateTicketForm';
import { getPortalById } from 'src/data/portals';

export default function TicketNew() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const portalId = searchParams.get('portal');
  const portal = portalId ? getPortalById(portalId) : null;

  const breadcrumbs = [
    { label: 'Home', href: '/' },
    ...(portal ? [{ label: portal.title }] : [{ label: 'New Request' }]),
  ];

  return (
    <main className="mx-auto max-w-3xl px-4 py-6 sm:px-6">
      <Breadcrumbs items={breadcrumbs} className="mb-6" />

      {portal && (
        <div className="mb-8 flex items-center gap-4">
          <div
            className="flex h-12 w-12 items-center justify-center rounded-2xl"
            style={{ backgroundColor: `${portal.color}15` }}
          >
            <Iconify
              icon={portal.icon}
              width={24}
              height={24}
              style={{ color: portal.color }}
            />
          </div>
          <div>
            <h1 className="text-xl font-semibold text-foreground">
              {portal.title}
            </h1>
            <p className="text-sm text-muted-foreground">
              {portal.description}
            </p>
          </div>
        </div>
      )}

      {!portal && (
        <h1 className="mb-6 text-xl font-semibold text-foreground">
          New Request
        </h1>
      )}

      <div className="rounded-xl border border-border bg-card p-6">
        <CreateTicketForm
          portalId={portalId}
          onSuccess={(ticket) => navigate(`/tickets/${ticket._id}`)}
        />
      </div>
    </main>
  );
}
