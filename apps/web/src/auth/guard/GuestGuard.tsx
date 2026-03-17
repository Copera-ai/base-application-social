import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router';
import { LoadingScreen } from 'src/components/LoadingScreen';
import { CONFIG } from 'src/config';

import { useAuth } from '../hooks/useAuth';

interface GuestGuardProps {
  children: React.ReactNode;
}

export function GuestGuard({ children }: GuestGuardProps) {
  const { isAuthenticated, isLoading } = useAuth();
  const [searchParams] = useSearchParams();
  const [isChecking, setIsChecking] = useState(true);

  const returnTo = searchParams.get('returnTo') || CONFIG.auth.redirectPath;

  useEffect(() => {
    if (isLoading) return;

    if (isAuthenticated) {
      window.location.href = returnTo;
      return;
    }

    setIsChecking(false);
  }, [isAuthenticated, isLoading, returnTo]);

  if (isChecking || isLoading) {
    return <LoadingScreen />;
  }

  return <>{children}</>;
}
