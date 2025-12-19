import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  id: string;
  email: string;
  role: string;
}

interface ErrorFilter {
  severity?: string;
  source?: string;
  dateRange?: { start: Date; end: Date };
}

interface ErrorMonitoringState {
  selectedErrors: string[];
  filters: ErrorFilter;
  currentPage: number;
  pageSize: number;
  setSelectedErrors: (ids: string[]) => void;
  setFilters: (filters: ErrorFilter) => void;
  setCurrentPage: (page: number) => void;
  resetFilters: () => void;
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

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  login: (user: User) => void;
  logout: () => void;
}

interface AdminStore extends AuthState, ErrorMonitoringState, RateLimitState, SystemHealthState {}

export const useAdminStore = create<AdminStore>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isLoading: true,
      selectedErrors: [],
      filters: {},
      currentPage: 1,
      pageSize: 20,
      selectedClient: undefined,
      timeRange: '24h',
      lastCheck: null,
      status: 'unknown',

      setUser: (user) =>
        set({
          user,
          isAuthenticated: !!user,
          isLoading: false,
        }),

      setLoading: (loading) => set({ isLoading: loading }),

      login: (user) =>
        set({
          user,
          isAuthenticated: true,
          isLoading: false,
        }),

      logout: () =>
        set({
          user: null,
          isAuthenticated: false,
          isLoading: false,
        }),

      setSelectedErrors: (ids) => set({ selectedErrors: ids }),

      setFilters: (filters) =>
        set((state) => ({
          filters: { ...state.filters, ...filters },
          currentPage: 1,
        })),

      setCurrentPage: (page) => set({ currentPage: page }),

      resetFilters: () =>
        set({
          filters: {},
          currentPage: 1,
        }),

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
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        timeRange: state.timeRange,
      }),
    }
  )
);
