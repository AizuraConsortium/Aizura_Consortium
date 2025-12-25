/**
 * useBusinessExposure Hook
 *
 * Fetches and manages user's exposure data to businesses including
 * voting participation, usage metrics, and rewards earned.
 */

import { useCallback } from 'react';
import { useDataFetch } from './useDataFetch.js';
import type { UserExposure } from '../types/portfolio.js';

interface UseBusinessExposureOptions {
  userId?: string;
  businessId?: string;
  skip?: boolean;
  onError?: (error: Error) => void;
  onSuccess?: (data: UserExposure) => void;
  cache?: {
    enabled?: boolean;
    ttl?: number;
  };
}

interface UseBusinessExposureResult {
  exposure: UserExposure | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  isRetrying: boolean;
}

/**
 * Fetch user's exposure to a specific business
 *
 * @param apiClient - API client instance with getUserExposure method
 * @param options - Configuration options
 * @returns Exposure data, loading state, and error handling
 *
 * @example
 * const { exposure, loading, error } = useBusinessExposure(api, {
 *   userId: user.id,
 *   businessId: 'uuid'
 * });
 */
export function useBusinessExposure(
  apiClient: {
    getUserExposure: (userId: string, businessId: string) => Promise<UserExposure>;
  },
  options: UseBusinessExposureOptions = {}
): UseBusinessExposureResult {
  const {
    userId,
    businessId,
    skip = !userId || !businessId,
    onError,
    onSuccess,
    cache = { enabled: true, ttl: 180000 },
  } = options;

  const fetcher = useCallback(async () => {
    if (!userId) {
      throw new Error('User ID is required');
    }
    if (!businessId) {
      throw new Error('Business ID is required');
    }
    return apiClient.getUserExposure(userId, businessId);
  }, [apiClient, userId, businessId]);

  const { data, loading, error, refetch, isRetrying } = useDataFetch<UserExposure>(
    fetcher,
    [userId, businessId],
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
    exposure: data,
    loading,
    error,
    refetch,
    isRetrying,
  };
}

interface UseUserExposuresOptions {
  userId?: string;
  skip?: boolean;
  onError?: (error: Error) => void;
  onSuccess?: (data: UserExposure[]) => void;
  cache?: {
    enabled?: boolean;
    ttl?: number;
  };
}

interface UseUserExposuresResult {
  exposures: UserExposure[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  isRetrying: boolean;
  totalExposure: number;
  highExposureCount: number;
  mediumExposureCount: number;
  lowExposureCount: number;
}

/**
 * Fetch all user exposures across all businesses
 *
 * @param apiClient - API client instance with getUserExposures method
 * @param options - Configuration options
 * @returns Array of exposures with aggregated statistics
 *
 * @example
 * const {
 *   exposures,
 *   loading,
 *   totalExposure,
 *   highExposureCount
 * } = useUserExposures(api, {
 *   userId: user.id
 * });
 */
export function useUserExposures(
  apiClient: {
    getUserExposures: (userId: string) => Promise<UserExposure[]>;
  },
  options: UseUserExposuresOptions = {}
): UseUserExposuresResult {
  const {
    userId,
    skip = !userId,
    onError,
    onSuccess,
    cache = { enabled: true, ttl: 300000 },
  } = options;

  const fetcher = useCallback(async () => {
    if (!userId) {
      throw new Error('User ID is required');
    }
    return apiClient.getUserExposures(userId);
  }, [apiClient, userId]);

  const { data, loading, error, refetch, isRetrying } = useDataFetch<UserExposure[]>(
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

  const exposures = data || [];

  const totalExposure = exposures.reduce((sum, exp) => sum + exp.exposure_score, 0);

  const highExposureCount = exposures.filter(exp => exp.activity_level === 'high').length;
  const mediumExposureCount = exposures.filter(exp => exp.activity_level === 'medium').length;
  const lowExposureCount = exposures.filter(exp => exp.activity_level === 'low').length;

  return {
    exposures,
    loading,
    error,
    refetch,
    isRetrying,
    totalExposure,
    highExposureCount,
    mediumExposureCount,
    lowExposureCount,
  };
}

interface UseTopExposuresOptions {
  userId?: string;
  limit?: number;
  skip?: boolean;
  onError?: (error: Error) => void;
  onSuccess?: (data: UserExposure[]) => void;
}

interface UseTopExposuresResult {
  topExposures: UserExposure[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  isRetrying: boolean;
}

/**
 * Fetch user's top exposures sorted by exposure score
 *
 * @param apiClient - API client instance with getUserExposures method
 * @param options - Configuration options
 * @returns Top exposures sorted by score
 *
 * @example
 * const { topExposures, loading, error } = useTopExposures(api, {
 *   userId: user.id,
 *   limit: 5
 * });
 */
export function useTopExposures(
  apiClient: {
    getUserExposures: (userId: string) => Promise<UserExposure[]>;
  },
  options: UseTopExposuresOptions = {}
): UseTopExposuresResult {
  const {
    userId,
    limit = 5,
    skip = !userId,
    onError,
    onSuccess,
  } = options;

  const fetcher = useCallback(async () => {
    if (!userId) {
      throw new Error('User ID is required');
    }
    const exposures = await apiClient.getUserExposures(userId);
    return exposures
      .sort((a, b) => b.exposure_score - a.exposure_score)
      .slice(0, limit);
  }, [apiClient, userId, limit]);

  const { data, loading, error, refetch, isRetrying } = useDataFetch<UserExposure[]>(
    fetcher,
    [userId, limit],
    {
      skip,
      onError,
      onSuccess,
      cache: {
        enabled: true,
        ttl: 180000,
      },
      initialData: [],
      retry: {
        maxAttempts: 3,
        baseDelay: 1000,
        maxDelay: 5000,
      },
    }
  );

  return {
    topExposures: data || [],
    loading,
    error,
    refetch,
    isRetrying,
  };
}
