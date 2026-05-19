import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { createPaginatedStore } from '@shared/store/createPaginatedStore';
import type { FilteredStoreState } from '@shared/store/createFilteredStore';
import type { PaginatedStoreState } from '@shared/store/createPaginatedStore';
import type { Topic, AgentId, Message } from '@shared/types/models';

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
  messages: Message[];
  selectedMessages: string[];
  totalMessages: number;
  hasMore: boolean;
  setMessages: (messages: Message[]) => void;
  addMessage: (message: Message) => void;
  prependMessages: (messages: Message[]) => void;
  setHasMore: (hasMore: boolean) => void;
  setSelectedMessages: (ids: string[]) => void;
  clearMessages: () => void;
}

interface UIState {
  sidebarOpen: boolean;
  debugMode: boolean;
  setSidebarOpen: (open: boolean) => void;
  toggleSidebar: () => void;
  setDebugMode: (enabled: boolean) => void;
}

type WebsiteStoreFiltered = FilteredStoreState<MessageFilter> & {
  setMessageFilters: (filters: MessageFilter) => void;
  messageFilters: MessageFilter;
};

type WebsiteStore = TopicState &
  MessageState &
  UIState &
  Omit<WebsiteStoreFiltered, 'filters' | 'setFilters'> &
  PaginatedStoreState;

export const useWebsiteStore = create<WebsiteStore>()(
  persist(
    (set, get, store) => {
      return {
        ...createPaginatedStore({
          initialPage: 1,
          pageSize: 20,
        })(set, get, store),

        currentTopic: null,
        endedTopics: [],
        messages: [],
        selectedMessages: [],
        messageFilters: {},
        totalMessages: 0,
        hasMore: false,
        sidebarOpen: true,
        debugMode: false,

        setMessageFilters: (filters: MessageFilter) =>
          set((state) => ({
            messageFilters: { ...state.messageFilters, ...filters },
            currentPage: 1,
          })),

        resetFilters: () =>
          set({
            messageFilters: {},
            currentPage: 1,
          }),

        setCurrentTopic: (topic) => set({ currentTopic: topic }),

        setEndedTopics: (topics) => set({ endedTopics: topics }),

        addEndedTopic: (topic) =>
          set((state) => ({
            endedTopics: [topic, ...state.endedTopics],
          })),

        setMessages: (messages) => set({ messages }),

        addMessage: (message) =>
          set((state) => ({
            messages: [...state.messages, message],
            totalMessages: state.totalMessages + 1,
          })),

        prependMessages: (messages) =>
          set((state) => ({
            messages: [...messages, ...state.messages],
          })),

        setHasMore: (hasMore) => set({ hasMore }),

        clearMessages: () => set({ messages: [], totalMessages: 0, hasMore: false }),

        setSelectedMessages: (ids) => set({ selectedMessages: ids }),

        setSidebarOpen: (open) => set({ sidebarOpen: open }),

        toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),

        setDebugMode: (enabled) => set({ debugMode: enabled }),
      };
    },
    {
      name: 'website-storage',
      partialize: (state) => ({
        sidebarOpen: state.sidebarOpen,
      }),
    }
  )
);
