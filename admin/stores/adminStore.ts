import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { createFilteredStore } from '@shared/store/createFilteredStore';
import { createPaginatedStore } from '@shared/store/createPaginatedStore';
import type { FilteredStoreState } from '@shared/store/createFilteredStore';
import type { PaginatedStoreState } from '@shared/store/createPaginatedStore';

interface ErrorFilter {
  severity?: string;
  source?: string;
  dateRange?: { start: Date; end: Date };
}

interface ErrorMonitoringState {
  selectedErrors: string[];
  setSelectedErrors: (ids: string[]) => void;
}

interface RateLimitState {
  selectedClient?: string;
  timeRange: '1h' | '24h' | '7d';
  setSelectedClient: (client: string | undefined) => void;
  setTimeRange: (range: '1h' | '24h' | '7d') => void;
}

interface SystemHealthState {
  lastCheck: Date | null;
  status: 'healthy' | 'degraded' | 'unhealthy' | 'unknown';
  updateHealth: (status: 'healthy' | 'degraded' | 'unhealthy' | 'unknown') => void;
}

type AdminStore = ErrorMonitoringState &
  RateLimitState &
  SystemHealthState &
  FilteredStoreState<ErrorFilter> &
  PaginatedStoreState;

export const useAdminStore = create<AdminStore>()(
  persist(
    (set, get, store) => ({
      ...createFilteredStore<ErrorFilter>({
        defaultFilters: {},
        resetPagination: true,
      })(set, get, store),

      ...createPaginatedStore({
        initialPage: 1,
        pageSize: 20,
      })(set, get, store),

      selectedErrors: [],
      selectedClient: undefined,
      timeRange: '24h',
      lastCheck: null,
      status: 'unknown',

      setSelectedErrors: (ids) => set({ selectedErrors: ids }),

      setSelectedClient: (client) => set({ selectedClient: client }),

      setTimeRange: (range) => set({ timeRange: range }),

      updateHealth: (status) =>
        set({
          status,
          lastCheck: new Date(),
        }),
    }),
    {
      name: 'admin-storage',
      partialize: (state) => ({
        timeRange: state.timeRange,
      }),
    }
  )
);
