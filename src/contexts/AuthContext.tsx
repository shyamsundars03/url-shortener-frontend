import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import type { LoginCredentials, RegisterPayload, User } from '../types/user.types';
import {
  login as loginRequest,
  logout as logoutRequest,
  register as registerRequest,
} from '../services/auth.service';
import { ACCESS_TOKEN_STORAGE_KEY, REFRESH_TOKEN_STORAGE_KEY } from '../constants/storage.keys';
import { userFromAccessToken } from '../utils/jwt.util';

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (payload: RegisterPayload) => Promise<string>;
  logout: () => Promise<void>;
  completeOAuthLogin: (accessToken: string, refreshToken: string) => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

function readStoredUser(): User | null {
  const token = localStorage.getItem(ACCESS_TOKEN_STORAGE_KEY);
  if (!token) {
    return null;
  }
  return userFromAccessToken(token);
}

function persistSession(accessToken: string, refreshToken: string): User | null {
  const user = userFromAccessToken(accessToken);
  if (!user) {
    localStorage.removeItem(ACCESS_TOKEN_STORAGE_KEY);
    localStorage.removeItem(REFRESH_TOKEN_STORAGE_KEY);
    return null;
  }
  localStorage.setItem(ACCESS_TOKEN_STORAGE_KEY, accessToken);
  localStorage.setItem(REFRESH_TOKEN_STORAGE_KEY, refreshToken);
  return user;
}

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setUser(readStoredUser());
    setLoading(false);
  }, []);

  const login = useCallback(async (credentials: LoginCredentials) => {
    const { access_token, refresh_token } = await loginRequest(credentials);
    const nextUser = persistSession(access_token, refresh_token);
    if (!nextUser) {
      throw new Error('Invalid token received from server');
    }
    setUser(nextUser);
  }, []);

  const register = useCallback(async (payload: RegisterPayload) => {
    const response = await registerRequest(payload);
    // Don't auto-login on registration - let user login manually
    return response.message;
  }, []);

  const logout = useCallback(async () => {
    try {
      await logoutRequest();
    } catch {
      // Client session ends even if the server request fails
    }
    localStorage.removeItem(ACCESS_TOKEN_STORAGE_KEY);
    localStorage.removeItem(REFRESH_TOKEN_STORAGE_KEY);
    setUser(null);
  }, []);

  const completeOAuthLogin = useCallback((accessToken: string, refreshToken: string) => {
    const nextUser = persistSession(accessToken, refreshToken);
    if (!nextUser) {
      throw new Error('Invalid OAuth token');
    }
    setUser(nextUser);
  }, []);

  const value = useMemo<AuthContextType>(
    () => ({
      user,
      isAuthenticated: user !== null,
      loading,
      login,
      register,
      logout,
      completeOAuthLogin,
    }),
    [user, loading, login, register, logout, completeOAuthLogin],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
