'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { clientCache, DEFAULT_TTLS } from '@/lib/cache';

export interface UseCachedQueryOptions<T> {
  ttl?: number;
  swr?: boolean;
  initialData?: T;
  enabled?: boolean;
}

export interface UseCachedQueryResult<T> {
  data: T | undefined;
  isLoading: boolean;
  isValidating: boolean;
  error: Error | null;
  refresh: (force?: boolean) => Promise<T | undefined>;
  mutate: (newData: T) => void;
}

/**
 * Universal Hook for Instant Caching & SWR Background Revalidation
 * Prevents UI freezes/sticking on route changes by serving cached data in 0ms.
 */
export function useCachedQuery<T>(
  key: string | null,
  fetcher: () => Promise<T>,
  options: UseCachedQueryOptions<T> = {}
): UseCachedQueryResult<T> {
  const {
    ttl = DEFAULT_TTLS.SERVICES,
    swr = true,
    initialData,
    enabled = true,
  } = options;

  // Check cache synchronously for instant 0ms first paint
  const cached = key ? clientCache.get<T>(key) : null;
  const initialValue = cached ? cached.data : initialData;

  const [data, setData] = useState<T | undefined>(initialValue);
  const [isLoading, setIsLoading] = useState<boolean>(!cached && enabled && initialData === undefined);
  const [isValidating, setIsValidating] = useState<boolean>(Boolean(cached && !cached.isFresh && enabled));
  const [error, setError] = useState<Error | null>(null);

  const fetcherRef = useRef(fetcher);
  fetcherRef.current = fetcher;

  const executeFetch = useCallback(
    async (force: boolean = false) => {
      if (!key || !enabled) return undefined;

      const hasCache = clientCache.get<T>(key);
      if (!hasCache) {
        setIsLoading(true);
      } else {
        setIsValidating(true);
      }

      setError(null);

      try {
        const result = await clientCache.fetchWithCache<T>(
          key,
          fetcherRef.current,
          { ttl, force, swr }
        );
        setData(result);
        return result;
      } catch (err) {
        const e = err instanceof Error ? err : new Error(String(err));
        setError(e);
        return undefined;
      } finally {
        setIsLoading(false);
        setIsValidating(false);
      }
    },
    [key, enabled, ttl, swr]
  );

  // Subscribe to cache updates (from background revalidation or other components)
  useEffect(() => {
    if (!key) return;

    const unsubscribe = clientCache.subscribe<T>(key, (updatedData) => {
      setData(updatedData);
      setIsLoading(false);
      setIsValidating(false);
    });

    return () => {
      unsubscribe();
    };
  }, [key]);

  // Initial fetch / revalidation
  useEffect(() => {
    if (!key || !enabled) return;

    const currentCached = clientCache.get<T>(key);
    if (!currentCached) {
      executeFetch(false);
    } else if (!currentCached.isFresh) {
      // Background revalidation without locking UI
      executeFetch(false);
    }
  }, [key, enabled, executeFetch]);

  const mutate = useCallback(
    (newData: T) => {
      if (!key) return;
      setData(newData);
      clientCache.set(key, newData, ttl);
    },
    [key, ttl]
  );

  const refresh = useCallback(
    (force: boolean = true) => {
      return executeFetch(force);
    },
    [executeFetch]
  );

  return {
    data,
    isLoading,
    isValidating,
    error,
    refresh,
    mutate,
  };
}
