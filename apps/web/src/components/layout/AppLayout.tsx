import { Suspense } from 'react';
import { Outlet, useLocation } from 'react-router';
import { AuthGuard } from 'src/auth/guard/AuthGuard';
import { LoadingScreen } from 'src/components/LoadingScreen';

import { Navbar } from './Navbar';

export function AppLayout() {
  const { pathname } = useLocation();

  return (
    <AuthGuard>
      <div className="min-h-screen bg-muted/30">
        <Navbar />
        <Suspense key={pathname} fallback={<LoadingScreen />}>
          <Outlet />
        </Suspense>
      </div>
    </AuthGuard>
  );
}
