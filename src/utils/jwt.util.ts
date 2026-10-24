import type { User } from '../types/user.types';

interface AccessTokenPayload {
  sub: string;
  email: string;
  iat?: number;
  exp?: number;
}

function isAccessTokenPayload(value: unknown): value is AccessTokenPayload {
  if (typeof value !== 'object' || value === null) {
    return false;
  }
  const record = value as Record<string, unknown>;
  return typeof record.sub === 'string' && typeof record.email === 'string';
}

export function parseAccessToken(token: string): AccessTokenPayload | null {
  const segments = token.split('.');
  if (segments.length !== 3) {
    return null;
  }
  try {
    const base64 = segments[1].replace(/-/g, '+').replace(/_/g, '/');
    const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), '=');
    const decoded = atob(padded);
    const parsed: unknown = JSON.parse(decoded);
    if (!isAccessTokenPayload(parsed)) {
      return null;
    }
    if (parsed.exp !== undefined && parsed.exp * 1000 <= Date.now()) {
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

export function userFromAccessToken(token: string): User | null {
  if (!token || typeof token !== 'string') {
    return null;
  }
  const payload = parseAccessToken(token);
  if (!payload || !payload.email) {
    return null;
  }
  const nameFromEmail = payload.email.split('@')[0] ?? payload.email;
  return {
    id: payload.sub,
    email: payload.email,
    name: nameFromEmail,
  };
}
