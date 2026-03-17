import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { LoadingScreen } from 'src/components/LoadingScreen';

import { useAuth } from '../hooks/useAuth';

interface AdminGuardProps {
  children: React.ReactNode;
}

export function AdminGuard({ children }: AdminGuardProps) {
  const navigate = useNavigate();
  const { user, isLoading } = useAuth();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    if (isLoading) return;

    if (!user || user.role !== 'admin') {
      navigate('/', { replace: true });
      return;
    }

    setIsChecking(false);
  }, [user, isLoading, navigate]);

  if (isChecking || isLoading) {
    return <LoadingScreen />;
  }

  return <>{children}</>;
}
