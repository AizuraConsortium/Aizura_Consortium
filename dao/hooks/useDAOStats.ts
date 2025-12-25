import { useState, useEffect, useCallback } from 'react';
import { daoApi } from '../lib/api';
import type { DAOStats } from '@shared/types/dao';

export function useDAOStats(autoRefresh: boolean = true, interval: number = 30000) {
  const [stats, setStats] = useState<DAOStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = useCallback(async () => {
    try {
      setError(null);
      const data = await daoApi.getDAOStats();
      setStats(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch DAO stats';
      setError(message);
      console.error('Failed to fetch DAO stats:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();

    if (autoRefresh && interval > 0) {
      const id = setInterval(fetchStats, interval);
      return () => clearInterval(id);
    }
  }, [fetchStats, autoRefresh, interval]);

  return { stats, loading, error, refetch: fetchStats };
}
