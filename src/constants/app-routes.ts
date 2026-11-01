/**
 * Frontend application route paths.
 * Use these constants everywhere instead of hardcoded strings
 * — in <Route path>, <Link to>, navigate(), and window.location.assign().
 */

export const APP_ROUTES = {
  /** / — Home / dashboard */
  HOME: '/',

  /** /login — Login page */
  LOGIN: '/login',

  /** /register — Registration page */
  REGISTER: '/register',

  /** /auth/callback — Google OAuth callback landing page */
  AUTH_CALLBACK: '/auth/callback',

  /** /404 — Not found page */
  NOT_FOUND: '/404',
} as const;
