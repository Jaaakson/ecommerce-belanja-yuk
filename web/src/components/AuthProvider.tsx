import { useCallback, useState, type ReactNode } from 'react';
import { api, toApiError, tokenStorage, unwrap } from '../api/client';
import type { AuthResponse, UserSummary } from '../api/types';
import { AuthContext, type RegisterPayload } from '../lib/auth';

const USER_KEY = 'belanjayuk.user';

/** Reads the persisted session synchronously so the first render is already correct. */
function restoreSession(): UserSummary | null {
  const token = tokenStorage.read();
  const cached = localStorage.getItem(USER_KEY);

  if (!token || !cached) {
    tokenStorage.clear();
    localStorage.removeItem(USER_KEY);
    return null;
  }

  try {
    return JSON.parse(cached) as UserSummary;
  } catch {
    localStorage.removeItem(USER_KEY);
    return null;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserSummary | null>(restoreSession);

  const persist = useCallback((result: AuthResponse, remember: boolean) => {
    // "Ingat saya" extends the stored lifetime; without it the session ends
    // when the token itself expires.
    const expiresAt = remember
      ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
      : result.expiresAt;

    tokenStorage.write(result.token, expiresAt);
    localStorage.setItem(USER_KEY, JSON.stringify(result.user));
    setUser(result.user);
  }, []);

  const login = useCallback(
    async (identifier: string, password: string, remember: boolean) => {
      try {
        const result = await unwrap<AuthResponse>(
          api.post('/auth/login', { identifier, password }),
        );
        persist(result, remember);
      } catch (error) {
        throw toApiError(error);
      }
    },
    [persist],
  );

  const register = useCallback(
    async (payload: RegisterPayload) => {
      try {
        const result = await unwrap<AuthResponse>(api.post('/auth/register', payload));
        persist(result, true);
      } catch (error) {
        throw toApiError(error);
      }
    },
    [persist],
  );

  const logout = useCallback(() => {
    tokenStorage.clear();
    localStorage.removeItem(USER_KEY);
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated: user !== null, login, register, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}
