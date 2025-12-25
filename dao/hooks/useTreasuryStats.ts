import { useState, useEffect, useCallback } from 'react';
import { daoApi } from '../lib/api';
import type { TreasuryStats } from '@shared/types/dao';

export function useTreasuryStats(autoRefresh: boolean = true, interval: number = 60000) {
  const [treasury, setTreasury] = useState<TreasuryStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTreasury = useCallback(async () => {
    try {
      setError(null);
      const data = await daoApi.getTreasuryStats();
      setTreasury(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch treasury stats';
      setError(message);
      console.error('Failed to fetch treasury stats:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTreasury();

    if (autoRefresh && interval > 0) {
      const id = setInterval(fetchTreasury, interval);
      return () => clearInterval(id);
    }
  }, [fetchTreasury, autoRefresh, interval]);

  return { treasury, loading, error, refetch: fetchTreasury };
}
