import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { createFilteredStore } from '@shared/store/createFilteredStore';
import { createPaginatedStore } from '@shared/store/createPaginatedStore';
import type { FilteredStoreState } from '@shared/store/createFilteredStore';
import type { PaginatedStoreState } from '@shared/store/createPaginatedStore';
import { api } from '../lib/api';
import type { User, Proposal, ProposalStatus } from '@shared/types';

interface ProposalDraft {
  title: string;
  summary: string;
  lastSaved: Date;
}

interface ProposalFilter {
  status?: ProposalStatus;
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
  proposals: Proposal[];
  isLoadingProposals: boolean;
  proposalError: string | null;
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

type ClientStore = AuthState &
  ProposalState &
  DraftState &
  FilteredStoreState<ProposalFilter> &
  PaginatedStoreState;

export const useClientStore = create<ClientStore>()(
  persist(
    (set, get, store) => ({
      ...createFilteredStore<ProposalFilter>({
        defaultFilters: {},
        resetPagination: true,
      })(set, get, store),

      ...createPaginatedStore({
        initialPage: 1,
        pageSize: 10,
      })(set, get, store),

      user: null,
      isAuthenticated: false,
      isLoading: true,
      proposals: [],
      isLoadingProposals: false,
      proposalError: null,
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
