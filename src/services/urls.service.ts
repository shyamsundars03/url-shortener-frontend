import type { CreateUrlRequest, CreateUrlResponse, PaginatedUrlsResponse } from '../types/url.types';
import type { ApiResponse } from '../types/api.types';
import api from './api';

export async function createUrl(payload: CreateUrlRequest): Promise<CreateUrlResponse> {
  const { data } = await api.post<ApiResponse<CreateUrlResponse>>('/link', payload);
  return data;
}

export async function getUserUrls(page: number = 1, limit: number = 10, search: string = ''): Promise<PaginatedUrlsResponse> {
  const params = new URLSearchParams({ page: page.toString(), limit: limit.toString() });
  if (search) {
    params.append('search', search);
  }
  const { data } = await api.get<ApiResponse<PaginatedUrlsResponse>>(`/link?${params.toString()}`);
  return data;
}
