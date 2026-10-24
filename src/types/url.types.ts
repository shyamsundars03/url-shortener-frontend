export interface Url {
  id: string;
  shortUrl: string;
  originalUrl: string;
  lastVisited: string[];
  createdAt: string;
  userId: string;
  shortUrlFull?: string;
}

export interface CreateUrlRequest {
  originalUrl: string;
}

export interface CreateUrlResponse extends Url {
  shortUrlFull: string;
}

export interface PaginatedUrlsResponse {
  urls: Url[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

