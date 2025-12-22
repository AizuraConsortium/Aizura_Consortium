import { useState, useEffect, useCallback, useRef } from 'react';

interface RetryConfig {
  maxAttempts?: number;
  baseDelay?: number;
  maxDelay?: number;
}

interface CacheConfig {
  enabled?: boolean;
  ttl?: number;
}

interface UseDataFetchOptions<T> {
  initialData?: T;
  skip?: boolean;
  onError?: (error: Error) => void;
  onSuccess?: (data: T) => void;
  retry?: RetryConfig;
  cache?: CacheConfig;
}

interface UseDataFetchResult<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  isRetrying: boolean;
  attemptCount: number;
}

interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

const cache = new Map<string, CacheEntry<any>>();

function generateCacheKey(fetcher: Function): string {
  return fetcher.toString();
}

function getCachedData<T>(key: string, ttl: number): T | null {
  const entry = cache.get(key);
  if (!entry) return null;

  const age = Date.now() - entry.timestamp;
  if (age > ttl) {
    cache.delete(key);
    return null;
  }

  return entry.data as T;
}

function setCachedData<T>(key: string, data: T): void {
  cache.set(key, {
    data,
    timestamp: Date.now()
  });
}

export function useDataFetch<T = any>(
  fetcher: () => Promise<T>,
  dependencies: React.DependencyList = [],
  options: UseDataFetchOptions<T> = {}
): UseDataFetchResult<T> {
  const {
    initialData = null,
    skip = false,
    onError,
    onSuccess,
    retry = { maxAttempts: 3, baseDelay: 1000, maxDelay: 10000 },
    cache: cacheConfig = { enabled: false, ttl: 60000 }
  } = options;

  const { maxAttempts = 3, baseDelay = 1000, maxDelay = 10000 } = retry;
  const { enabled: cacheEnabled = false, ttl = 60000 } = cacheConfig;

  const [data, setData] = useState<T | null>(initialData);
  const [loading, setLoading] = useState(!skip);
  const [error, setError] = useState<string | null>(null);
  const [isRetrying, setIsRetrying] = useState(false);
  const [attemptCount, setAttemptCount] = useState(0);

  const isMountedRef = useRef(true);
  const abortControllerRef = useRef<AbortController | null>(null);
  const cacheKeyRef = useRef<string>('');

  useEffect(() => {
    isMountedRef.current = true;
    if (cacheEnabled) {
      cacheKeyRef.current = generateCacheKey(fetcher);
    }

    return () => {
      isMountedRef.current = false;
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  const sleep = (ms: number): Promise<void> => {
    return new Promise(resolve => setTimeout(resolve, ms));
  };

  const calculateBackoffDelay = (attempt: number): number => {
    const delay = baseDelay * Math.pow(2, attempt);
    return Math.min(delay, maxDelay);
  };

  const fetchData = useCallback(async () => {
    if (skip) return;

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    abortControllerRef.current = new AbortController();

    if (cacheEnabled && cacheKeyRef.current) {
      const cachedData = getCachedData<T>(cacheKeyRef.current, ttl);
      if (cachedData && isMountedRef.current) {
        setData(cachedData);
        setLoading(false);
        setError(null);
        if (onSuccess) {
          onSuccess(cachedData);
        }
        return;
      }
    }

    let currentAttempt = 0;

    while (currentAttempt < maxAttempts) {
      try {
        if (isMountedRef.current) {
          setLoading(true);
          setError(null);
          setAttemptCount(currentAttempt + 1);

          if (currentAttempt > 0) {
            setIsRetrying(true);
          }
        }

        const result = await fetcher();

        if (isMountedRef.current) {
          setData(result);

          if (cacheEnabled && cacheKeyRef.current) {
            setCachedData(cacheKeyRef.current, result);
          }

          if (onSuccess) {
            onSuccess(result);
          }

          setIsRetrying(false);
          setAttemptCount(0);
        }

        break;
      } catch (err) {
        currentAttempt++;

        if (currentAttempt >= maxAttempts) {
          if (isMountedRef.current) {
            const errorMessage = err instanceof Error ? err.message : 'An error occurred';
            setError(errorMessage);
            if (onError && err instanceof Error) {
              onError(err);
            }
            setIsRetrying(false);
          }
        } else {
          const delay = calculateBackoffDelay(currentAttempt - 1);
          await sleep(delay);
        }
      } finally {
        if (isMountedRef.current && currentAttempt >= maxAttempts) {
          setLoading(false);
        }
      }
    }
  }, [
    fetcher,
    skip,
    onError,
    onSuccess,
    maxAttempts,
    baseDelay,
    maxDelay,
    cacheEnabled,
    ttl
  ]);

  useEffect(() => {
    fetchData();
  }, [fetchData, ...dependencies]);

  return {
    data,
    loading,
    error,
    refetch: fetchData,
    isRetrying,
    attemptCount
  };
}
