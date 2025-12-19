import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  id: string;
  email: string;
  role: string;
}

interface ProposalDraft {
  title: string;
  summary: string;
  lastSaved: Date;
}

interface ProposalFilter {
  status?: 'queued' | 'in_debate' | 'adopted' | 'rejected';
  dateRange?: { start: Date; end: Date };
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

interface ProposalState {
  filters: ProposalFilter;
  currentPage: number;
  pageSize: number;
  setFilters: (filters: ProposalFilter) => void;
  setCurrentPage: (page: number) => void;
  resetFilters: () => void;
}

interface DraftState {
  draft: ProposalDraft | null;
  setDraft: (draft: ProposalDraft | null) => void;
  clearDraft: () => void;
  updateDraft: (updates: Partial<ProposalDraft>) => void;
}

interface ClientStore extends AuthState, ProposalState, DraftState {}

export const useClientStore = create<ClientStore>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isLoading: true,
      filters: {},
      currentPage: 1,
      pageSize: 10,
      draft: null,

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
          draft: null,
        }),

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

      setDraft: (draft) => set({ draft }),

      clearDraft: () => set({ draft: null }),

      updateDraft: (updates) =>
        set((state) => ({
          draft: state.draft
            ? { ...state.draft, ...updates, lastSaved: new Date() }
            : null,
        })),
    }),
    {
      name: 'client-storage',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        draft: state.draft,
      }),
    }
  )
);
