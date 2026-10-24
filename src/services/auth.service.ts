import type { AuthResponse, LoginCredentials, LogoutResponse, RegisterPayload, RegisterResponse } from '../types/user.types';
import type { ApiResponse } from '../types/api.types';
import { env } from '../config/env';
import api from './api';

export async function register(payload: RegisterPayload): Promise<RegisterResponse> {
  const { data } = await api.post<ApiResponse<RegisterResponse>>('/auth/register', payload);
  return data;
}

export async function login(credentials: LoginCredentials): Promise<AuthResponse> {
  const { data } = await api.post<ApiResponse<AuthResponse>>('/auth/login', credentials);
  return data;
}

export async function refreshTokens(refreshToken: string): Promise<AuthResponse> {
  const { data } = await api.post<ApiResponse<AuthResponse>>('/auth/refresh', { refresh_token: refreshToken });
  return data;
}

export async function logout(): Promise<LogoutResponse> {
  const { data } = await api.post<ApiResponse<LogoutResponse>>('/auth/logout');
  return data;
}

/** Redirect browser to backend Google OAuth entrypoint. */
export function redirectToGoogleOAuth(): void {
  window.location.assign(`${env.apiBaseUrl}/auth/google`);
}

/** Read JWT from backend redirect query (?token=...) after Google OAuth. */
export function parseGoogleOAuthCallbackToken(searchParams: URLSearchParams): { token: string | null; refresh: string | null } {
  const token = searchParams.get('token');
  const refresh = searchParams.get('refresh');
  return {
    token: token && token.trim() !== '' ? token : null,
    refresh: refresh && refresh.trim() !== '' ? refresh : null,
  };
}

/** Store token returned from Google OAuth callback (same shape as login). */
export function googleLoginFromCallbackToken(token: string, refreshToken: string): AuthResponse {
  return { access_token: token, refresh_token: refreshToken };
}
