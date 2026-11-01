export interface ErrorResponse {
  statusCode: number;
  message: string | string[];
  error: string;
  timestamp?: string;
  path?: string;
}

/** Matches the backend ApiResponse<T> wrapper: { success, message, data } */
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface MessageResponse {
  message: string;
}

