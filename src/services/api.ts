import axios, { type InternalAxiosRequestConfig } from 'axios';
import { ACCESS_TOKEN_STORAGE_KEY, REFRESH_TOKEN_STORAGE_KEY } from '../constants/storage.keys';
import { env } from '../config/env';
import { refreshTokens } from './auth.service';

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

api.interceptors.request.use(attachAuthHeader);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (axios.isAxiosError(error) && error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve) => {
          failedQueue.push((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
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
          originalRequest.headers.Authorization = `Bearer ${access_token}`;
          return api(originalRequest);
        } catch (refreshError) {
          processQueue(null);
          localStorage.removeItem(ACCESS_TOKEN_STORAGE_KEY);
          localStorage.removeItem(REFRESH_TOKEN_STORAGE_KEY);
          const path = window.location.pathname;
          if (path !== '/login' && path !== '/register') {
            window.location.assign('/login');
          }
          return Promise.reject(refreshError);
        } finally {
          isRefreshing = false;
        }
      } else {
        localStorage.removeItem(ACCESS_TOKEN_STORAGE_KEY);
        localStorage.removeItem(REFRESH_TOKEN_STORAGE_KEY);
        const path = window.location.pathname;
        if (path !== '/login' && path !== '/register') {
          window.location.assign('/login');
        }
      }
    }

    if (axios.isAxiosError(error)) {
      return Promise.reject(error);
    }
    return Promise.reject(
      error instanceof Error ? error : new Error('API request failed'),
    );
  },
);

export default api;
