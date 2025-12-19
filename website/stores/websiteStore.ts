import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Topic, Message, AgentId, VoteChoice } from '../../shared/types';

interface MessageFilter {
  agentId?: AgentId;
  phase?: string;
  importance?: { min: number; max: number };
}

interface TopicState {
  currentTopic: Topic | null;
  endedTopics: Topic[];
  setCurrentTopic: (topic: Topic | null) => void;
  setEndedTopics: (topics: Topic[]) => void;
  addEndedTopic: (topic: Topic) => void;
}

interface MessageState {
  selectedMessages: string[];
  messageFilters: MessageFilter;
  currentPage: number;
  pageSize: number;
  setSelectedMessages: (ids: string[]) => void;
  setMessageFilters: (filters: MessageFilter) => void;
  setCurrentPage: (page: number) => void;
  resetFilters: () => void;
}

interface VotingState {
  userVotes: Record<string, VoteChoice>;
  votingHistory: Array<{ topicId: string; vote: VoteChoice; timestamp: Date }>;
  castVote: (topicId: string, vote: VoteChoice) => void;
  clearVotes: () => void;
}

interface UIState {
  sidebarOpen: boolean;
  debugMode: boolean;
  setSidebarOpen: (open: boolean) => void;
  toggleSidebar: () => void;
  setDebugMode: (enabled: boolean) => void;
}

interface WebsiteStore extends TopicState, MessageState, VotingState, UIState {}

export const useWebsiteStore = create<WebsiteStore>()(
  persist(
    (set) => ({
      currentTopic: null,
      endedTopics: [],
      selectedMessages: [],
      messageFilters: {},
      currentPage: 1,
      pageSize: 20,
      userVotes: {},
      votingHistory: [],
      sidebarOpen: true,
      debugMode: false,

      setCurrentTopic: (topic) => set({ currentTopic: topic }),

      setEndedTopics: (topics) => set({ endedTopics: topics }),

      addEndedTopic: (topic) =>
        set((state) => ({
          endedTopics: [topic, ...state.endedTopics],
        })),

      setSelectedMessages: (ids) => set({ selectedMessages: ids }),

      setMessageFilters: (filters) =>
        set((state) => ({
          messageFilters: { ...state.messageFilters, ...filters },
          currentPage: 1,
        })),

      setCurrentPage: (page) => set({ currentPage: page }),

      resetFilters: () =>
        set({
          messageFilters: {},
          currentPage: 1,
        }),

      castVote: (topicId, vote) =>
        set((state) => ({
          userVotes: { ...state.userVotes, [topicId]: vote },
          votingHistory: [
            ...state.votingHistory,
            { topicId, vote, timestamp: new Date() },
          ],
        })),

      clearVotes: () =>
        set({
          userVotes: {},
          votingHistory: [],
        }),

      setSidebarOpen: (open) => set({ sidebarOpen: open }),

      toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),

      setDebugMode: (enabled) => set({ debugMode: enabled }),
    }),
    {
      name: 'website-storage',
      partialize: (state) => ({
        userVotes: state.userVotes,
        votingHistory: state.votingHistory,
        sidebarOpen: state.sidebarOpen,
      }),
    }
  )
);
