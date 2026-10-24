import axios from 'axios';
import type { ErrorResponse } from '../types/api.types';

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

export function isErrorResponse(data: unknown): data is ErrorResponse {
  if (!isRecord(data)) {
    return false;
  }
  return (
    typeof data.statusCode === 'number' &&
    (typeof data.message === 'string' || Array.isArray(data.message)) &&
    typeof data.error === 'string'
  );
}

function messageFromUnknown(data: unknown): string | null {
  if (!isRecord(data) || !('message' in data)) {
    return null;
  }
  const message = data.message;
  if (typeof message === 'string') {
    return message;
  }
  if (Array.isArray(message) && message.every((item) => typeof item === 'string')) {
    return message.join(', ');
  }
  return null;
}

export function getApiErrorMessage(error: unknown, fallback = 'Something went wrong'): string {
  if (axios.isAxiosError(error)) {
    const data: unknown = error.response?.data;
    if (isErrorResponse(data)) {
      return Array.isArray(data.message) ? data.message.join(', ') : data.message;
    }
    const nested = messageFromUnknown(data);
    if (nested) {
      return nested;
    }
    if (typeof error.message === 'string' && error.message.length > 0) {
      return error.message;
    }
  }
  if (error instanceof Error && error.message) {
    return error.message;
  }
  return fallback;
}
