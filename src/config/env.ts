function trimTrailingSlashes(value: string): string {
  return value.replace(/\/+$/, '');
}

export const env = {
  apiBaseUrl: trimTrailingSlashes(
    import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3001',
  ),
  googleClientId: import.meta.env.VITE_GOOGLE_CLIENT_ID ?? '',
  backendOrigin: trimTrailingSlashes(
    import.meta.env.VITE_BACKEND_ORIGIN ?? 'http://localhost:3001',
  ),
} as const;
