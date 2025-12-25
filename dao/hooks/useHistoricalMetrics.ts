import { useState, useEffect, useCallback } from 'react';
import { daoApi } from '../lib/api';
import type { HistoricalMetrics } from '@shared/types/dao';

export function useHistoricalMetrics(days: number = 30) {
  const [metrics, setMetrics] = useState<HistoricalMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMetrics = useCallback(async () => {
    try {
      setError(null);
      setLoading(true);
      const data = await daoApi.getHistoricalMetrics(days);
      setMetrics(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch historical metrics';
      setError(message);
      console.error('Failed to fetch historical metrics:', err);
    } finally {
      setLoading(false);
    }
  }, [days]);

  useEffect(() => {
    fetchMetrics();
  }, [fetchMetrics]);

  return { metrics, loading, error, refetch: fetchMetrics };
}
