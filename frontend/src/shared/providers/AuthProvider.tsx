import React, { createContext, useContext, useEffect, useMemo, useState, useCallback } from 'react';
import { authApi } from '@/features/auth/services/authApi';
import type { AuthUser, LoginCredentials } from '@/features/auth/types/auth.types';
import { setAuthToken } from '@/shared/services/apiClient';

/**
 * Auth context shape
 */
interface AuthContextValue {
  user: AuthUser | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isInitializing: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const ACCESS_TOKEN_KEY = 'accessToken';
const AUTH_USER_KEY = 'authUser';

/**
 * AuthProvider
 * Manages authentication state and integrates with the API client
 */
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);

  /**
   * Hydrate auth state from localStorage on first load
   */
  useEffect(() => {
    try {
      const storedToken = localStorage.getItem(ACCESS_TOKEN_KEY);
      const storedUser = localStorage.getItem(AUTH_USER_KEY);

      if (storedToken && storedUser) {
        const parsedUser = JSON.parse(storedUser) as AuthUser;
        setUser(parsedUser);
        setAccessToken(storedToken);
        setAuthToken(storedToken);
      }
    } catch {
      // Ignore hydration errors and start with clean state
      setUser(null);
      setAccessToken(null);
      setAuthToken(null);
    } finally {
      setIsInitializing(false);
    }
  }, []);

  /**
   * Login implementation
   * Only manages auth state; UI-level hooks/components handle toasts
   */
  const login = useCallback(async (credentials: LoginCredentials): Promise<void> => {
    const result = await authApi.login(credentials);

    setUser(result.user);
    setAccessToken(result.accessToken);
    setAuthToken(result.accessToken);

    localStorage.setItem(ACCESS_TOKEN_KEY, result.accessToken);
    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(result.user));
  }, []);

  /**
   * Logout implementation
   */
  const logout = useCallback(async (): Promise<void> => {
    try {
      await authApi.logout();
    } catch {
      // Ignore logout API errors, still clear local state
    } finally {
      setUser(null);
      setAccessToken(null);
      setAuthToken(null);
      localStorage.removeItem(ACCESS_TOKEN_KEY);
      localStorage.removeItem(AUTH_USER_KEY);
    }
  }, []);

  const value: AuthContextValue = useMemo(
    () => ({
      user,
      accessToken,
      isAuthenticated: Boolean(user && accessToken),
      isInitializing,
      login,
      logout,
    }),
    [user, accessToken, isInitializing, login, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

/**
 * Hook to access auth context
 */
export const useAuth = (): AuthContextValue => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return ctx;
};
