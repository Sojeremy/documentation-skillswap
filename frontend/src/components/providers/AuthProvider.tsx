/**
 * Authentification context
 * -> useAuth() fonction: can be call from anywhere in the application to access the context states and methods
 * example of use: const { user, isAuthenticated, logout } = useAuth();
 */

'use client';

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from 'react';
import { api, ApiError } from '@/lib/api-client';
import type { CurrentUser } from '@/lib/api-types';
import { RegisterData } from '@/lib/validation/auth.validation';
import { usePathname, useRouter } from 'next/navigation';
import { authRoutes, protectedRoutes } from '@/middleware';
import { toast } from 'sonner';

// Interface of Auth context(all state and methods available with useAuth())
interface AuthContextValue {
  user: CurrentUser | undefined;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  refresh: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

// Centralized error handler for auth operations (DRY)
const handleAuthError = (err: unknown, context: string): never => {
  if (err instanceof ApiError) {
    console.log(`${context} error:`, err.message);
    throw err;
  }
  throw new Error(
    'Erreur de communication avec le serveur, réessayez plus tard.',
  );
};

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const router = useRouter();
  const [user, setUser] = useState<CurrentUser | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const pathname = usePathname();

  const refresh = useCallback(async () => {
    try {
      const response = await api.getMe();
      if (response.success && response.data) {
        setUser(response.data);
      }
    } catch (err) {
      setUser(undefined);
      throw err;
    }
  }, []);

  // Fetch current user on mount
  useEffect(() => {
    const fetchUser = async () => {
      setIsLoading(true);
      try {
        const response = await api.getMe();
        if (response.success && response.data) {
          setUser(response.data);
        }
      } catch {
        setUser(undefined);
      } finally {
        setIsLoading(false);
      }
    };
    fetchUser();
  }, []);

  // Refresh the current user after a redirection into an auth route if the user is already connected
  useEffect(() => {
    const isAuthPage = authRoutes.some((route) => pathname.startsWith(route));

    if (user && isAuthPage) {
      const checkSession = async () => {
        try {
          // If the middleware redirect the user in an auth page after connexion(if accessing protected route with no refresh token but still connected)
          // -> refresh the state of user with getMe()
          await refresh();
        } catch {
          if (pathname.startsWith('/connexion')) {
            toast.error('Session expirée', {
              description: 'Veuillez vous reconnecter pour continuer.',
            });
          }
        }
      };

      checkSession();
    }
  }, [pathname, refresh, user]);

  const login = useCallback(async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await api.login({ email, password });
      if (response.success && response.data) {
        setUser(response.data);
      }
    } catch (err) {
      handleAuthError(err, 'Login');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const register = useCallback(async (data: RegisterData) => {
    setIsLoading(true);
    try {
      const response = await api.register(data);
      if (response.success && response.data) {
        setUser(response.data);
      }
    } catch (err) {
      handleAuthError(err, 'Register');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await api.logout();
    } finally {
      setUser(undefined);
    }
  }, [setUser]);

  const value: AuthContextValue = {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    refresh,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
