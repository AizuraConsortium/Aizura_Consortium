/**
 * usePortfolio Hook
 *
 * Fetches and manages user's complete portfolio data including all businesses,
 * exposure metrics, and performance statistics.
 */

import { useCallback } from 'react';
import { useDataFetch } from './useDataFetch.js';
import type {
  PortfolioOverview,
  BusinessWithMetrics,
  BusinessFilters,
} from '../types/portfolio.js';

interface UsePortfolioOptions {
  userId?: string;
  skip?: boolean;
  onError?: (error: Error) => void;
  onSuccess?: (data: PortfolioOverview) => void;
  cache?: {
    enabled?: boolean;
    ttl?: number;
  };
}

interface UsePortfolioResult {
  portfolio: PortfolioOverview | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  isRetrying: boolean;
}

/**
 * Fetch user's complete portfolio overview
 *
 * @param apiClient - API client instance with getPortfolio method
 * @param options - Configuration options
 * @returns Portfolio data, loading state, and error handling
 *
 * @example
 * const { portfolio, loading, error, refetch } = usePortfolio(api, {
 *   userId: user.id,
 *   cache: { enabled: true, ttl: 300000 }
 * });
 */
export function usePortfolio(
  apiClient: { getPortfolio: (userId: string) => Promise<PortfolioOverview> },
  options: UsePortfolioOptions = {}
): UsePortfolioResult {
  const {
    userId,
    skip = !userId,
    onError,
    onSuccess,
    cache = { enabled: true, ttl: 300000 },
  } = options;

  const fetcher = useCallback(async () => {
    if (!userId) {
      throw new Error('User ID is required to fetch portfolio');
    }
    return apiClient.getPortfolio(userId);
  }, [apiClient, userId]);

  const { data, loading, error, refetch, isRetrying } = useDataFetch<PortfolioOverview>(
    fetcher,
    [userId],
    {
      skip,
      onError,
      onSuccess,
      cache,
      retry: {
        maxAttempts: 3,
        baseDelay: 1000,
        maxDelay: 5000,
      },
    }
  );

  return {
    portfolio: data,
    loading,
    error,
    refetch,
    isRetrying,
  };
}

interface UseBusinessesOptions {
  userId?: string;
  filters?: BusinessFilters;
  skip?: boolean;
  onError?: (error: Error) => void;
  onSuccess?: (data: BusinessWithMetrics[]) => void;
  cache?: {
    enabled?: boolean;
    ttl?: number;
  };
}

interface UseBusinessesResult {
  businesses: BusinessWithMetrics[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  isRetrying: boolean;
}

/**
 * Fetch list of businesses with optional filtering
 *
 * @param apiClient - API client instance with getBusinesses method
 * @param options - Configuration options including filters
 * @returns List of businesses with metrics, loading state, and error handling
 *
 * @example
 * const { businesses, loading, error } = useBusinesses(api, {
 *   userId: user.id,
 *   filters: {
 *     status: 'live',
 *     sort: 'revenue',
 *     order: 'desc'
 *   }
 * });
 */
export function useBusinesses(
  apiClient: { getBusinesses: (userId?: string, filters?: BusinessFilters) => Promise<BusinessWithMetrics[]> },
  options: UseBusinessesOptions = {}
): UseBusinessesResult {
  const {
    userId,
    filters,
    skip = false,
    onError,
    onSuccess,
    cache = { enabled: true, ttl: 180000 },
  } = options;

  const fetcher = useCallback(async () => {
    return apiClient.getBusinesses(userId, filters);
  }, [apiClient, userId, filters]);

  const { data, loading, error, refetch, isRetrying } = useDataFetch<BusinessWithMetrics[]>(
    fetcher,
    [userId, filters],
    {
      skip,
      onError,
      onSuccess,
      cache,
      initialData: [],
      retry: {
        maxAttempts: 3,
        baseDelay: 1000,
        maxDelay: 5000,
      },
    }
  );

  return {
    businesses: data || [],
    loading,
    error,
    refetch,
    isRetrying,
  };
}

interface UseBusinessDetailOptions {
  businessId?: string;
  userId?: string;
  skip?: boolean;
  onError?: (error: Error) => void;
  onSuccess?: (data: BusinessWithMetrics) => void;
  cache?: {
    enabled?: boolean;
    ttl?: number;
  };
}

interface UseBusinessDetailResult {
  business: BusinessWithMetrics | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  isRetrying: boolean;
}

/**
 * Fetch a single business by ID with full details
 *
 * @param apiClient - API client instance with getBusinessById method
 * @param options - Configuration options
 * @returns Business details with metrics, loading state, and error handling
 *
 * @example
 * const { business, loading, error } = useBusinessDetail(api, {
 *   businessId: 'uuid',
 *   userId: user.id
 * });
 */
export function useBusinessDetail(
  apiClient: { getBusinessById: (businessId: string, userId?: string) => Promise<BusinessWithMetrics> },
  options: UseBusinessDetailOptions = {}
): UseBusinessDetailResult {
  const {
    businessId,
    userId,
    skip = !businessId,
    onError,
    onSuccess,
    cache = { enabled: true, ttl: 120000 },
  } = options;

  const fetcher = useCallback(async () => {
    if (!businessId) {
      throw new Error('Business ID is required');
    }
    return apiClient.getBusinessById(businessId, userId);
  }, [apiClient, businessId, userId]);

  const { data, loading, error, refetch, isRetrying } = useDataFetch<BusinessWithMetrics>(
    fetcher,
    [businessId, userId],
    {
      skip,
      onError,
      onSuccess,
      cache,
      retry: {
        maxAttempts: 3,
        baseDelay: 1000,
        maxDelay: 5000,
      },
    }
  );

  return {
    business: data,
    loading,
    error,
    refetch,
    isRetrying,
  };
}

interface UseFoundationBusinessesOptions {
  userId?: string;
  skip?: boolean;
  onError?: (error: Error) => void;
  onSuccess?: (data: BusinessWithMetrics[]) => void;
  cache?: {
    enabled?: boolean;
    ttl?: number;
  };
}

interface UseFoundationBusinessesResult {
  businesses: BusinessWithMetrics[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  isRetrying: boolean;
}

/**
 * Fetch foundation businesses (pre-seeded by Aizura)
 *
 * @param apiClient - API client instance with getFoundationBusinesses method
 * @param options - Configuration options
 * @returns List of foundation businesses, loading state, and error handling
 *
 * @example
 * const { businesses, loading, error } = useFoundationBusinesses(api, {
 *   userId: user.id,
 *   cache: { enabled: true, ttl: 600000 }
 * });
 */
export function useFoundationBusinesses(
  apiClient: { getFoundationBusinesses: (userId?: string) => Promise<BusinessWithMetrics[]> },
  options: UseFoundationBusinessesOptions = {}
): UseFoundationBusinessesResult {
  const {
    userId,
    skip = false,
    onError,
    onSuccess,
    cache = { enabled: true, ttl: 600000 },
  } = options;

  const fetcher = useCallback(async () => {
    return apiClient.getFoundationBusinesses(userId);
  }, [apiClient, userId]);

  const { data, loading, error, refetch, isRetrying } = useDataFetch<BusinessWithMetrics[]>(
    fetcher,
    [userId],
    {
      skip,
      onError,
      onSuccess,
      cache,
      initialData: [],
      retry: {
        maxAttempts: 3,
        baseDelay: 1000,
        maxDelay: 5000,
      },
    }
  );

  return {
    businesses: data || [],
    loading,
    error,
    refetch,
    isRetrying,
  };
}
