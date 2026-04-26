import { useSyncExternalStore, useCallback } from 'react';
import {
  login,
  register,
  logout,
  getAuthToken,
  getCurrentUser,
} from '../lib/apiClient';

type AuthUser = { id: string; email: string; name: string };

let listeners: Array<() => void> = [];
let cachedSnapshot = {
  token: getAuthToken(),
  user: getCurrentUser() as AuthUser | null,
};

function emitChange() {
  cachedSnapshot = { token: getAuthToken(), user: getCurrentUser() };
  for (const listener of listeners) listener();
}

function subscribe(listener: () => void) {
  listeners.push(listener);
  return () => {
    listeners = listeners.filter(l => l !== listener);
  };
}

function getSnapshot() {
  return cachedSnapshot;
}

export function useAuth() {
  const { token, user } = useSyncExternalStore(subscribe, getSnapshot);
  const isAuthenticated = !!token;

  const doLogin = useCallback(async (email: string, password: string) => {
    const result = await login(email, password);
    emitChange();
    return result;
  }, []);

  const doRegister = useCallback(
    async (email: string, password: string, name: string) => {
      const result = await register(email, password, name);
      emitChange();
      return result;
    },
    []
  );

  const doLogout = useCallback(() => {
    logout();
    emitChange();
  }, []);

  return {
    isAuthenticated,
    user,
    login: doLogin,
    register: doRegister,
    logout: doLogout,
  };
}
