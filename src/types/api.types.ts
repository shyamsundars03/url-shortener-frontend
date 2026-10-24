export interface ErrorResponse {
  statusCode: number;
  message: string | string[];
  error: string;
  timestamp?: string;
  path?: string;
}

/** Successful API payloads (errors are thrown, not returned). */
export type ApiResponse<T> = T;

export interface MessageResponse {
  message: string;
}
