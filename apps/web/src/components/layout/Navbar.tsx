import { ShieldCheck } from 'lucide-react';
import { Link } from 'react-router';
import { useAuth } from 'src/auth/hooks/useAuth';

import { UserMenu } from './UserMenu';

export function Navbar() {
  const { user } = useAuth();

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-card">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-6">
          <Link to="/" className="flex items-center gap-2.5">
            <img
              src="/logo/simbolo_transp_dark.png"
              alt="Logo"
              className="h-7 w-7"
            />
            <span className="text-base font-semibold text-foreground">
              Help Center
            </span>
          </Link>

          {user?.role === 'admin' && (
            <Link
              to="/admin/tickets"
              className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              <ShieldCheck className="h-4 w-4" />
              Admin
            </Link>
          )}
        </div>

        <UserMenu />
      </div>
    </header>
  );
}
