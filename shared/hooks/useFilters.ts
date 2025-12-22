import { useState, useCallback, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export interface UseFiltersConfig<T extends Record<string, any>> {
  initialFilters: T;
  syncWithUrl?: boolean;
  onFilterChange?: (filters: T) => void;
}

export interface UseFiltersReturn<T extends Record<string, any>> {
  filters: T;
  setFilters: (filters: T) => void;
  updateFilter: <K extends keyof T>(key: K, value: T[K]) => void;
  clearFilters: () => void;
  resetFilters: () => void;
  hasActiveFilters: boolean;
  getQueryParams: () => URLSearchParams;
}

/**
 * useFilters Hook
 *
 * Generic filter state management with optional URL synchronization.
 * Type-safe filter operations.
 *
 * @example
 * ```tsx
 * interface ErrorFilters {
 *   source: string;
 *   severity: string;
 *   startDate: string;
 * }
 *
 * const filters = useFilters<ErrorFilters>({
 *   initialFilters: {
 *     source: '',
 *     severity: '',
 *     startDate: '',
 *   },
 *   syncWithUrl: true,
 *   onFilterChange: (filters) => {
 *     fetchData(filters);
 *   },
 * });
 *
 * // Use filters
 * filters.updateFilter('source', 'frontend');
 * filters.clearFilters();
 * console.log(filters.hasActiveFilters);
 * ```
 *
 * @param config - Configuration object
 * @returns Filter state and operations
 */
export function useFilters<T extends Record<string, any>>({
  initialFilters,
  syncWithUrl = false,
  onFilterChange,
}: UseFiltersConfig<T>): UseFiltersReturn<T> {
  const navigate = useNavigate();
  const location = useLocation();

  const getFiltersFromUrl = useCallback((): T => {
    if (!syncWithUrl) return initialFilters;

    const params = new URLSearchParams(location.search);
    const urlFilters = { ...initialFilters };

    Object.keys(initialFilters).forEach((key) => {
      const value = params.get(key);
      if (value !== null) {
        const initialValue = initialFilters[key];

        if (typeof initialValue === 'number') {
          urlFilters[key] = Number(value) as T[Extract<keyof T, string>];
        } else if (typeof initialValue === 'boolean') {
          urlFilters[key] = (value === 'true') as T[Extract<keyof T, string>];
        } else {
          urlFilters[key] = value as T[Extract<keyof T, string>];
        }
      }
    });

    return urlFilters;
  }, [initialFilters, location.search, syncWithUrl]);

  const [filters, setFiltersState] = useState<T>(getFiltersFromUrl);

  useEffect(() => {
    if (syncWithUrl) {
      const urlFilters = getFiltersFromUrl();
      setFiltersState(urlFilters);
    }
  }, [syncWithUrl, getFiltersFromUrl]);

  const updateUrl = useCallback(
    (newFilters: T) => {
      if (!syncWithUrl) return;

      const params = new URLSearchParams();

      Object.entries(newFilters).forEach(([key, value]) => {
        if (value !== '' && value !== null && value !== undefined) {
          if (Array.isArray(value)) {
            params.set(key, JSON.stringify(value));
          } else {
            params.set(key, String(value));
          }
        }
      });

      const search = params.toString();
      const newUrl = search ? `${location.pathname}?${search}` : location.pathname;

      navigate(newUrl, { replace: true });
    },
    [syncWithUrl, navigate, location.pathname]
  );

  const setFilters = useCallback(
    (newFilters: T) => {
      setFiltersState(newFilters);
      updateUrl(newFilters);
      onFilterChange?.(newFilters);
    },
    [updateUrl, onFilterChange]
  );

  const updateFilter = useCallback(
    <K extends keyof T>(key: K, value: T[K]) => {
      const newFilters = { ...filters, [key]: value };
      setFilters(newFilters);
    },
    [filters, setFilters]
  );

  const clearFilters = useCallback(() => {
    setFilters(initialFilters);
  }, [initialFilters, setFilters]);

  const resetFilters = clearFilters;

  const hasActiveFilters = Object.entries(filters).some(([key, value]) => {
    const initialValue = initialFilters[key];
    if (Array.isArray(value)) {
      return value.length > 0;
    }
    return value !== initialValue && value !== '' && value !== null && value !== undefined;
  });

  const getQueryParams = useCallback((): URLSearchParams => {
    const params = new URLSearchParams();

    Object.entries(filters).forEach(([key, value]) => {
      if (value !== '' && value !== null && value !== undefined) {
        if (Array.isArray(value)) {
          value.forEach((item) => params.append(key, String(item)));
        } else {
          params.set(key, String(value));
        }
      }
    });

    return params;
  }, [filters]);

  return {
    filters,
    setFilters,
    updateFilter,
    clearFilters,
    resetFilters,
    hasActiveFilters,
    getQueryParams,
  };
}
