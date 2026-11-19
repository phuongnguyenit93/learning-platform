import { useCallback, useEffect, useRef, useState } from 'react';
import { getCurrentUser, getGoogleLoginConfig, logoutCurrentUser, type AuthUser } from '../data/auth';

type AuthStatus = 'loading' | 'authenticated' | 'anonymous' | 'unavailable';

interface AuthState {
  status: AuthStatus;
  user: AuthUser | null;
  googleLoginEnabled: boolean | null;
}

export function useAuth() {
  const [state, setState] = useState<AuthState>({
    status: 'loading',
    user: null,
    googleLoginEnabled: null,
  });
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [logoutFailed, setLogoutFailed] = useState(false);
  const requestController = useRef<AbortController | null>(null);

  const refresh = useCallback(() => {
    requestController.current?.abort();
    const controller = new AbortController();
    requestController.current = controller;
    setState((current) => ({
      ...current,
      status: current.user ? 'authenticated' : 'loading',
    }));

    void Promise.allSettled([
      getGoogleLoginConfig(controller.signal),
      getCurrentUser(controller.signal),
    ]).then(([configResult, userResult]) => {
      if (controller.signal.aborted) return;

      const googleLoginEnabled = configResult.status === 'fulfilled' ? configResult.value : null;
      if (userResult.status !== 'fulfilled') {
        setState({ status: 'unavailable', user: null, googleLoginEnabled });
        return;
      }

      const user = userResult.value;
      setState({
        status: user ? 'authenticated' : googleLoginEnabled === null ? 'unavailable' : 'anonymous',
        user,
        googleLoginEnabled,
      });
    });
  }, []);

  useEffect(() => {
    refresh();
    return () => requestController.current?.abort();
  }, [refresh]);

  const logout = useCallback(async () => {
    if (isLoggingOut) return;
    setIsLoggingOut(true);
    setLogoutFailed(false);
    try {
      await logoutCurrentUser();
      requestController.current?.abort();
      setState((current) => ({
        ...current,
        user: null,
        status: current.googleLoginEnabled === null ? 'unavailable' : 'anonymous',
      }));
    } catch {
      setLogoutFailed(true);
    } finally {
      setIsLoggingOut(false);
    }
  }, [isLoggingOut]);

  return { ...state, isLoggingOut, logoutFailed, logout, refresh };
}
