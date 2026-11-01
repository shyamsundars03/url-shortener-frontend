import axios, { type InternalAxiosRequestConfig } from 'axios';
import { ACCESS_TOKEN_STORAGE_KEY, REFRESH_TOKEN_STORAGE_KEY } from '../constants/storage.keys';
import { env } from '../config/env';
import { refreshTokens } from './auth.service';
import { APP_ROUTES } from '../constants/app-routes';

/** Extend InternalAxiosRequestConfig to track retry attempts */
interface RetriableRequest extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

const api = axios.create({
  baseURL: env.apiBaseUrl,
  headers: {
    'Content-Type': 'application/json',
  },
});

let isRefreshing = false;
let failedQueue: Array<(token: string | null) => void> = [];

function processQueue(token: string | null) {
  failedQueue.forEach((prom) => prom(token));
  failedQueue = [];
}

function attachAuthHeader(config: InternalAxiosRequestConfig): InternalAxiosRequestConfig {
  const token = localStorage.getItem(ACCESS_TOKEN_STORAGE_KEY);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}

function redirectToLogin(): void {
  const path = window.location.pathname;
  if (path !== APP_ROUTES.LOGIN && path !== APP_ROUTES.REGISTER) {
    window.location.assign(APP_ROUTES.LOGIN);
  }
}

api.interceptors.request.use(attachAuthHeader);

api.interceptors.response.use(
  (response) => response,
  async (error: unknown) => {
    // ── Non-Axios errors — wrap and reject safely ─────────────────────────────
    if (!axios.isAxiosError(error)) {
      return Promise.reject(
        error instanceof Error ? error : new Error('API request failed'),
      );
    }

    const originalRequest = error.config as RetriableRequest | undefined;

    // ── 401 handling — attempt token refresh ──────────────────────────────────
    if (
      error.response?.status === 401 &&
      originalRequest &&
      !originalRequest._retry
    ) {
      if (isRefreshing) {
        return new Promise((resolve) => {
          failedQueue.push((token) => {
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${token}`;
            }
            resolve(api(originalRequest));
          });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken = localStorage.getItem(REFRESH_TOKEN_STORAGE_KEY);

      if (refreshToken) {
        try {
          const { access_token, refresh_token } = await refreshTokens(refreshToken);
          localStorage.setItem(ACCESS_TOKEN_STORAGE_KEY, access_token);
          localStorage.setItem(REFRESH_TOKEN_STORAGE_KEY, refresh_token);
          processQueue(access_token);
          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${access_token}`;
          }
          return api(originalRequest);
        } catch (refreshError) {
          processQueue(null);
          localStorage.removeItem(ACCESS_TOKEN_STORAGE_KEY);
          localStorage.removeItem(REFRESH_TOKEN_STORAGE_KEY);
          redirectToLogin();
          // Safely wrap unknown catch value before rejecting
          return Promise.reject(
            refreshError instanceof Error ? refreshError : new Error('Session expired'),
          );
        } finally {
          isRefreshing = false;
        }
      } else {
        localStorage.removeItem(ACCESS_TOKEN_STORAGE_KEY);
        localStorage.removeItem(REFRESH_TOKEN_STORAGE_KEY);
        redirectToLogin();
      }
    }

    // ── All other Axios errors — AxiosError is typed, safe to reject ──────────
    return Promise.reject(error);
  },
);

export default api;
