import type { CreateUrlRequest, CreateUrlResponse, PaginatedUrlsResponse } from '../types/url.types';
import type { ApiResponse } from '../types/api.types';
import api from './api';
import { URL_ENDPOINTS } from '../constants/api-endpoints';

export async function createUrl(payload: CreateUrlRequest): Promise<CreateUrlResponse> {
  const { data } = await api.post<ApiResponse<CreateUrlResponse>>(
    URL_ENDPOINTS.CREATE,
    payload,
  );
  return data.data;
}

export async function getUserUrls(
  page: number = 1,
  limit: number = 10,
  search: string = '',
): Promise<PaginatedUrlsResponse> {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
  });
  if (search) {
    params.append('search', search);
  }
  const { data } = await api.get<ApiResponse<PaginatedUrlsResponse>>(
    `${URL_ENDPOINTS.LIST}?${params.toString()}`,
  );
  return data.data;
}
