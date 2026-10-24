import { useCallback, useState } from 'react';
import { createUrl as createUrlRequest, getUserUrls } from '../services/urls.service';
import type { CreateUrlRequest, CreateUrlResponse, Url } from '../types/url.types';
import { getApiErrorMessage } from '../utils/axios-error.util';

export interface UseUrlsResult {
  urls: Url[];
  loading: boolean;
  error: string | null;
  success: string | null;
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  search: string;
  fetchUrls: () => Promise<void>;
  createUrl: (payload: CreateUrlRequest) => Promise<CreateUrlResponse | null>;
  clearMessages: () => void;
  setPage: (page: number) => void;
  setSearch: (search: string) => void;
}

export function useUrls(): UseUrlsResult {
  const [urls, setUrls] = useState<Url[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [search, setSearch] = useState('');

  const clearMessages = useCallback(() => {
    setError(null);
    setSuccess(null);
  }, []);

  const fetchUrls = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getUserUrls(page, limit, search);
      setUrls(data.urls);
      setTotal(data.total);
      setTotalPages(data.totalPages);
    } catch (err: unknown) {
      setError(getApiErrorMessage(err, 'Could not load links'));
    } finally {
      setLoading(false);
    }
  }, [page, limit, search]);

  const createUrl = useCallback(
    async (payload: CreateUrlRequest): Promise<CreateUrlResponse | null> => {
      setLoading(true);
      setError(null);
      setSuccess(null);
      try {
        const created = await createUrlRequest(payload);
        // Reset to first page and refresh
        setPage(1);
        await fetchUrls();
        setSuccess(`Short link: ${created.shortUrlFull ?? created.shortUrl}`);
        return created;
      } catch (err: unknown) {
        setError(getApiErrorMessage(err, 'Could not create link'));
        return null;
      } finally {
        setLoading(false);
      }
    },
    [fetchUrls],
  );

  return {
    urls,
    loading,
    error,
    success,
    total,
    page,
    limit,
    totalPages,
    search,
    fetchUrls,
    createUrl,
    clearMessages,
    setPage,
    setSearch,
  };
}
