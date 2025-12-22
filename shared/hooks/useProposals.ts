import { useState, useEffect, useCallback, useRef } from 'react';
import type { Proposal } from '@shared/types';

export interface ProposalFilters {
  status?: string;
  search?: string;
  sortBy?: 'created_at' | 'votes_for' | 'votes_against';
  sortOrder?: 'asc' | 'desc';
}

export interface UseProposalsConfig {
  apiClient: {
    getProposals: (token?: string) => Promise<{ proposals: Proposal[]; count: number }>;
  };
  token?: string;
  filters?: ProposalFilters;
  autoRefetch?: boolean;
  refetchInterval?: number;
  onError?: (error: Error) => void;
}

export interface UseProposalsReturn {
  proposals: Proposal[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  refresh: () => Promise<void>;
  updateProposal: (id: string, updates: Partial<Proposal>) => void;
  removeProposal: (id: string) => void;
  addProposal: (proposal: Proposal) => void;
}

/**
 * useProposals Hook
 *
 * Centralized proposal data fetching and management hook.
 *
 * Features:
 * - Automatic data fetching on mount
 * - Loading and error states
 * - Optional auto-refetch with configurable interval
 * - Filter support (client-side)
 * - Optimistic updates for better UX
 * - Cache management
 * - Manual refetch capability
 *
 * @example
 * ```tsx
 * const { proposals, loading, error, refetch } = useProposals({
 *   apiClient: api,
 *   token: session?.access_token,
 *   autoRefetch: true,
 *   refetchInterval: 30000,
 * });
 * ```
 *
 * @param config - Configuration object
 * @returns Proposal data and control functions
 */
export function useProposals({
  apiClient,
  token,
  filters,
  autoRefetch = false,
  refetchInterval = 30000,
  onError,
}: UseProposalsConfig): UseProposalsReturn {
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const mountedRef = useRef(true);

  const fetchProposals = useCallback(async () => {
    try {
      setError(null);
      const data = await apiClient.getProposals(token);

      if (!mountedRef.current) return;

      let filteredProposals = data.proposals;

      if (filters) {
        if (filters.status) {
          filteredProposals = filteredProposals.filter(
            (p) => p.status === filters.status
          );
        }

        if (filters.search) {
          const searchLower = filters.search.toLowerCase();
          filteredProposals = filteredProposals.filter(
            (p) =>
              p.title.toLowerCase().includes(searchLower) ||
              (p.summary && p.summary.toLowerCase().includes(searchLower))
          );
        }

        if (filters.sortBy) {
          filteredProposals = [...filteredProposals].sort((a, b) => {
            const aVal = a[filters.sortBy!] as number | string;
            const bVal = b[filters.sortBy!] as number | string;

            if (typeof aVal === 'number' && typeof bVal === 'number') {
              return filters.sortOrder === 'desc' ? bVal - aVal : aVal - bVal;
            }

            const aStr = String(aVal);
            const bStr = String(bVal);
            return filters.sortOrder === 'desc'
              ? bStr.localeCompare(aStr)
              : aStr.localeCompare(bStr);
          });
        }
      }

      setProposals(filteredProposals);
    } catch (err) {
      if (!mountedRef.current) return;

      const errorMessage = err instanceof Error ? err.message : 'Failed to load proposals';
      setError(errorMessage);

      if (onError) {
        onError(err instanceof Error ? err : new Error(errorMessage));
      }
    } finally {
      if (mountedRef.current) {
        setLoading(false);
      }
    }
  }, [apiClient, token, filters, onError]);

  const refetch = useCallback(async () => {
    setLoading(true);
    await fetchProposals();
  }, [fetchProposals]);

  const refresh = useCallback(async () => {
    await fetchProposals();
  }, [fetchProposals]);

  const updateProposal = useCallback((id: string, updates: Partial<Proposal>) => {
    setProposals((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updates } : p))
    );
  }, []);

  const removeProposal = useCallback((id: string) => {
    setProposals((prev) => prev.filter((p) => p.id !== id));
  }, []);

  const addProposal = useCallback((proposal: Proposal) => {
    setProposals((prev) => [proposal, ...prev]);
  }, []);

  useEffect(() => {
    mountedRef.current = true;
    fetchProposals();

    return () => {
      mountedRef.current = false;
    };
  }, [fetchProposals]);

  useEffect(() => {
    if (autoRefetch && refetchInterval > 0) {
      intervalRef.current = setInterval(() => {
        refresh();
      }, refetchInterval);

      return () => {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }
      };
    }
  }, [autoRefetch, refetchInterval, refresh]);

  return {
    proposals,
    loading,
    error,
    refetch,
    refresh,
    updateProposal,
    removeProposal,
    addProposal,
  };
}
