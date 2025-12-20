import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Topic, AgentId } from '../../shared/types';

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

interface UIState {
  sidebarOpen: boolean;
  debugMode: boolean;
  setSidebarOpen: (open: boolean) => void;
  toggleSidebar: () => void;
  setDebugMode: (enabled: boolean) => void;
}

interface WebsiteStore extends TopicState, MessageState, UIState {}

export const useWebsiteStore = create<WebsiteStore>()(
  persist(
    (set) => ({
      currentTopic: null,
      endedTopics: [],
      selectedMessages: [],
      messageFilters: {},
      currentPage: 1,
      pageSize: 20,
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

      setSidebarOpen: (open) => set({ sidebarOpen: open }),

      toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),

      setDebugMode: (enabled) => set({ debugMode: enabled }),
    }),
    {
      name: 'website-storage',
      partialize: (state) => ({
        sidebarOpen: state.sidebarOpen,
      }),
    }
  )
);
