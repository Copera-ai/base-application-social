import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { LoadingScreen } from 'src/components/LoadingScreen';
import { CONFIG } from 'src/config';

import { useAuth } from '../hooks/useAuth';

interface AuthGuardProps {
  children: React.ReactNode;
}

export function AuthGuard({ children }: AuthGuardProps) {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { isAuthenticated, isLoading } = useAuth();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    if (isLoading) return;

    if (!isAuthenticated) {
      const returnTo = encodeURIComponent(pathname);
      navigate(`${CONFIG.auth.signInPath}?returnTo=${returnTo}`, {
        replace: true,
      });
      return;
    }

    setIsChecking(false);
  }, [isAuthenticated, isLoading, navigate, pathname]);

  if (isChecking || isLoading) {
    return <LoadingScreen />;
  }

  return <>{children}</>;
}
