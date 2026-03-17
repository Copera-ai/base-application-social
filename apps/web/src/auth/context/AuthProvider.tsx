import { useCallback, useEffect, useMemo, useState } from 'react';
import { SystemRequests } from 'src/requests/system.requests';
import { UserRequests } from 'src/requests/user.requests';
import { Session } from 'src/utils/session';

import type { AuthState } from '../types';
import { AuthContext } from './auth-context';

interface AuthProviderProps {
  children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [state, setState] = useState<AuthState>({
    user: null,
    loading: true,
  });

  const checkUserSession = useCallback(async () => {
    try {
      if (Session.isAuthenticated()) {
        const user = await UserRequests.getUserInfo();
        setState({ user, loading: false });
      } else {
        setState({ user: null, loading: false });
      }
    } catch (error) {
      console.error('Failed to check user session:', error);
      Session.logout();
      setState({ user: null, loading: false });
    }
  }, []);

  const signIn = useCallback(
    async (email: string, password: string) => {
      const { accessToken } = await SystemRequests.signIn({ email, password });
      Session.setSessionToken(accessToken);
      await checkUserSession();
    },
    [checkUserSession],
  );

  const signOut = useCallback(async () => {
    Session.logout();
    setState({ user: null, loading: false });
  }, []);

  useEffect(() => {
    checkUserSession();
  }, [checkUserSession]);

  const value = useMemo(
    () => ({
      user: state.user,
      isLoading: state.loading,
      isAuthenticated: !!state.user,
      signIn,
      signOut,
      checkUserSession,
    }),
    [state.user, state.loading, signIn, signOut, checkUserSession],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
