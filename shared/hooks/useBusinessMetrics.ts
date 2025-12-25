/**
 * useBusinessMetrics Hook
 *
 * Fetches and manages business metrics time-series data with trend calculations.
 */

import { useCallback } from 'react';
import { useDataFetch } from './useDataFetch.js';
import type {
  BusinessMetricsTimeSeries,
  BusinessPerformance,
  MetricType,
} from '../types/portfolio.js';

interface UseBusinessMetricsOptions {
  businessId?: string;
  metricType: MetricType;
  startDate?: string;
  endDate?: string;
  skip?: boolean;
  onError?: (error: Error) => void;
  onSuccess?: (data: BusinessMetricsTimeSeries) => void;
  cache?: {
    enabled?: boolean;
    ttl?: number;
  };
}

interface UseBusinessMetricsResult {
  metrics: BusinessMetricsTimeSeries | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  isRetrying: boolean;
}

/**
 * Fetch business metrics time-series with trend calculation
 *
 * @param apiClient - API client instance with getBusinessMetrics method
 * @param options - Configuration options
 * @returns Metrics time-series data, loading state, and error handling
 *
 * @example
 * const { metrics, loading, error } = useBusinessMetrics(api, {
 *   businessId: 'uuid',
 *   metricType: 'revenue',
 *   startDate: '2024-01-01',
 *   endDate: '2024-12-31'
 * });
 */
export function useBusinessMetrics(
  apiClient: {
    getBusinessMetrics: (
      businessId: string,
      metricType: MetricType,
      startDate?: string,
      endDate?: string
    ) => Promise<BusinessMetricsTimeSeries>;
  },
  options: UseBusinessMetricsOptions
): UseBusinessMetricsResult {
  const {
    businessId,
    metricType,
    startDate,
    endDate,
    skip = !businessId || !metricType,
    onError,
    onSuccess,
    cache = { enabled: true, ttl: 120000 },
  } = options;

  const fetcher = useCallback(async () => {
    if (!businessId) {
      throw new Error('Business ID is required');
    }
    if (!metricType) {
      throw new Error('Metric type is required');
    }
    return apiClient.getBusinessMetrics(businessId, metricType, startDate, endDate);
  }, [apiClient, businessId, metricType, startDate, endDate]);

  const { data, loading, error, refetch, isRetrying } = useDataFetch<BusinessMetricsTimeSeries>(
    fetcher,
    [businessId, metricType, startDate, endDate],
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
    metrics: data,
    loading,
    error,
    refetch,
    isRetrying,
  };
}

interface UseBusinessPerformanceOptions {
  businessId?: string;
  skip?: boolean;
  onError?: (error: Error) => void;
  onSuccess?: (data: BusinessPerformance) => void;
  cache?: {
    enabled?: boolean;
    ttl?: number;
  };
}

interface UseBusinessPerformanceResult {
  performance: BusinessPerformance | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  isRetrying: boolean;
}

/**
 * Fetch business performance statistics
 *
 * @param apiClient - API client instance with getBusinessPerformance method
 * @param options - Configuration options
 * @returns Performance statistics, loading state, and error handling
 *
 * @example
 * const { performance, loading, error } = useBusinessPerformance(api, {
 *   businessId: 'uuid'
 * });
 */
export function useBusinessPerformance(
  apiClient: {
    getBusinessPerformance: (businessId: string) => Promise<BusinessPerformance>;
  },
  options: UseBusinessPerformanceOptions = {}
): UseBusinessPerformanceResult {
  const {
    businessId,
    skip = !businessId,
    onError,
    onSuccess,
    cache = { enabled: true, ttl: 180000 },
  } = options;

  const fetcher = useCallback(async () => {
    if (!businessId) {
      throw new Error('Business ID is required');
    }
    return apiClient.getBusinessPerformance(businessId);
  }, [apiClient, businessId]);

  const { data, loading, error, refetch, isRetrying } = useDataFetch<BusinessPerformance>(
    fetcher,
    [businessId],
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
    performance: data,
    loading,
    error,
    refetch,
    isRetrying,
  };
}

interface UseMultiMetricsOptions {
  businessId?: string;
  metricTypes: MetricType[];
  startDate?: string;
  endDate?: string;
  skip?: boolean;
  onError?: (error: Error) => void;
  onSuccess?: (data: Record<MetricType, BusinessMetricsTimeSeries>) => void;
}

interface UseMultiMetricsResult {
  metricsMap: Record<string, BusinessMetricsTimeSeries> | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  isRetrying: boolean;
}

/**
 * Fetch multiple metric types at once for a business
 *
 * @param apiClient - API client instance with getBusinessMetrics method
 * @param options - Configuration options
 * @returns Map of metric types to time-series data
 *
 * @example
 * const { metricsMap, loading, error } = useMultiMetrics(api, {
 *   businessId: 'uuid',
 *   metricTypes: ['revenue', 'users', 'transactions']
 * });
 */
export function useMultiMetrics(
  apiClient: {
    getBusinessMetrics: (
      businessId: string,
      metricType: MetricType,
      startDate?: string,
      endDate?: string
    ) => Promise<BusinessMetricsTimeSeries>;
  },
  options: UseMultiMetricsOptions
): UseMultiMetricsResult {
  const {
    businessId,
    metricTypes,
    startDate,
    endDate,
    skip = !businessId || !metricTypes || metricTypes.length === 0,
    onError,
    onSuccess,
  } = options;

  const fetcher = useCallback(async () => {
    if (!businessId) {
      throw new Error('Business ID is required');
    }
    if (!metricTypes || metricTypes.length === 0) {
      throw new Error('Metric types are required');
    }

    const promises = metricTypes.map(metricType =>
      apiClient.getBusinessMetrics(businessId, metricType, startDate, endDate)
    );

    const results = await Promise.all(promises);

    const metricsMap: Record<string, BusinessMetricsTimeSeries> = {};
    results.forEach((result, index) => {
      metricsMap[metricTypes[index]] = result;
    });

    return metricsMap;
  }, [apiClient, businessId, metricTypes, startDate, endDate]);

  const { data, loading, error, refetch, isRetrying } = useDataFetch<
    Record<string, BusinessMetricsTimeSeries>
  >(
    fetcher,
    [businessId, metricTypes, startDate, endDate],
    {
      skip,
      onError,
      onSuccess,
      cache: {
        enabled: true,
        ttl: 120000,
      },
      retry: {
        maxAttempts: 2,
        baseDelay: 1000,
        maxDelay: 5000,
      },
    }
  );

  return {
    metricsMap: data,
    loading,
    error,
    refetch,
    isRetrying,
  };
}
