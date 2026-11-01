/**
 * Centralised API endpoint paths for all frontend service calls.
 * Import from here instead of hardcoding strings in service files.
 *
 * These paths are relative to the axios baseURL configured in api.ts.
 */

export const AUTH_ENDPOINTS = {
  /** POST /auth/register */
  REGISTER: '/auth/register',

  /** POST /auth/login */
  LOGIN: '/auth/login',

  /** POST /auth/refresh */
  REFRESH: '/auth/refresh',

  /** POST /auth/logout */
  LOGOUT: '/auth/logout',

  /** Browser redirect → /auth/google (Google OAuth entry) */
  GOOGLE: '/auth/google',
} as const;

export const URL_ENDPOINTS = {
  /** POST /link — create a short URL */
  CREATE: '/link',

  /** GET /link — list user's URLs (supports ?page, ?limit, ?search) */
  LIST: '/link',

  /** GET /link/count — total count of user's URLs */
  COUNT: '/link/count',
} as const;
