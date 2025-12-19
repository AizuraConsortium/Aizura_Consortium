import { useState, useEffect, useCallback, useRef } from 'react';

interface UseDataFetchOptions<T> {
  initialData?: T;
  skip?: boolean;
  onError?: (error: Error) => void;
  onSuccess?: (data: T) => void;
}

interface UseDataFetchResult<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useDataFetch<T = any>(
  fetcher: () => Promise<T>,
  dependencies: React.DependencyList = [],
  options: UseDataFetchOptions<T> = {}
): UseDataFetchResult<T> {
  const { initialData = null, skip = false, onError, onSuccess } = options;

  const [data, setData] = useState<T | null>(initialData);
  const [loading, setLoading] = useState(!skip);
  const [error, setError] = useState<string | null>(null);

  const isMountedRef = useRef(true);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const fetchData = useCallback(async () => {
    if (skip) return;

    try {
      setLoading(true);
      setError(null);

      const result = await fetcher();

      if (isMountedRef.current) {
        setData(result);
        if (onSuccess) {
          onSuccess(result);
        }
      }
    } catch (err) {
      if (isMountedRef.current) {
        const errorMessage = err instanceof Error ? err.message : 'An error occurred';
        setError(errorMessage);
        if (onError && err instanceof Error) {
          onError(err);
        }
      }
    } finally {
      if (isMountedRef.current) {
        setLoading(false);
      }
    }
  }, [fetcher, skip, onError, onSuccess]);

  useEffect(() => {
    fetchData();
  }, [fetchData, ...dependencies]);

  return {
    data,
    loading,
    error,
    refetch: fetchData
  };
}
