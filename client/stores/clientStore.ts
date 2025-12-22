import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { api } from '../lib/api';
import type { User } from '@shared/types';

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
  proposals: any[];
  isLoadingProposals: boolean;
  proposalError: string | null;
  filters: ProposalFilter;
  currentPage: number;
  pageSize: number;
  setFilters: (filters: ProposalFilter) => void;
  setCurrentPage: (page: number) => void;
  resetFilters: () => void;
  fetchProposals: (token?: string) => Promise<void>;
  createProposal: (title: string, summary: string, token?: string) => Promise<void>;
  voteOnProposal: (proposalId: string, vote: 'for' | 'against', token: string) => Promise<void>;
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
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: true,
      proposals: [],
      isLoadingProposals: false,
      proposalError: null,
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

      fetchProposals: async (token) => {
        set({ isLoadingProposals: true, proposalError: null });
        try {
          const data = await api.getProposals(token);
          set({ proposals: data.proposals || [], isLoadingProposals: false });
        } catch (error: any) {
          set({
            proposalError: error.message || 'Failed to fetch proposals',
            isLoadingProposals: false,
          });
        }
      },

      createProposal: async (title, summary, token) => {
        set({ proposalError: null });
        try {
          await api.createProposal(title, summary, token);
          await get().fetchProposals(token);
        } catch (error: any) {
          set({ proposalError: error.message || 'Failed to create proposal' });
          throw error;
        }
      },

      voteOnProposal: async (proposalId, vote, token) => {
        set({ proposalError: null });
        try {
          await api.voteOnProposal(proposalId, vote, token);
          await get().fetchProposals(token);
        } catch (error: any) {
          set({ proposalError: error.message || 'Failed to vote on proposal' });
          throw error;
        }
      },
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
