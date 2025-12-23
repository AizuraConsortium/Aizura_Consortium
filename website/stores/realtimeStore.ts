import { create } from 'zustand';
import type { Message } from '@shared/types/models';
import type { RealtimeMessage } from '@shared/types/api';

type ConnectionStatus = 'disconnected' | 'connecting' | 'connected' | 'reconnecting' | 'error';

interface RealtimeState {
  status: ConnectionStatus;
  messages: Message[];
  topicId: string | null;
  error: string | null;
  lastMessageTime: number | null;
  eventSource: EventSource | null;

  connect: (topicId: string) => void;
  disconnect: () => void;
  addMessage: (message: Message) => void;
  setMessages: (messages: Message[]) => void;
  clearMessages: () => void;
  handleReconnect: () => void;
}

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export const useRealtimeStore = create<RealtimeState>((set, get) => ({
  status: 'disconnected',
  messages: [],
  topicId: null,
  error: null,
  lastMessageTime: null,
  eventSource: null,

  connect: (topicId: string) => {
    const currentState = get();

    if (currentState.eventSource) {
      currentState.eventSource.close();
    }

    set({
      status: 'connecting',
      topicId,
      error: null,
      messages: [],
    });

    try {
      const url = `${API_URL}/api/website/realtime/messages/${topicId}`;
      const eventSource = new EventSource(url);

      eventSource.onopen = () => {
        console.log('SSE connection established');
        set({ status: 'connected', error: null });
      };

      eventSource.onmessage = (event) => {
        try {
          const message: RealtimeMessage = JSON.parse(event.data);

          switch (message.type) {
            case 'connected':
              console.log('Connected to realtime stream:', message.data);
              set({ status: 'connected', lastMessageTime: Date.now() });
              break;

            case 'message_added':
              const newMessage = message.data as Message;
              set((state) => ({
                messages: [...state.messages, newMessage],
                lastMessageTime: Date.now(),
              }));
              break;

            case 'topic_updated':
              console.log('Topic updated:', message.data);
              set({ lastMessageTime: Date.now() });
              break;

            case 'ping':
              set({ lastMessageTime: Date.now() });
              break;

            case 'error':
              console.error('Realtime error:', message.data);
              set({ error: message.data.message });
              break;

            default:
              console.log('Unknown message type:', message.type);
          }
        } catch (error) {
          console.error('Error parsing SSE message:', error);
        }
      };

      eventSource.onerror = (error) => {
        console.error('SSE connection error:', error);
        const currentStatus = get().status;

        if (currentStatus === 'connected' || currentStatus === 'reconnecting') {
          set({ status: 'reconnecting', error: 'Connection lost, reconnecting...' });

          setTimeout(() => {
            const state = get();
            if (state.status === 'reconnecting' && state.topicId) {
              console.log('Attempting to reconnect...');
              state.connect(state.topicId);
            }
          }, 3000);
        } else {
          set({ status: 'error', error: 'Failed to connect to realtime stream' });
        }

        eventSource.close();
      };

      set({ eventSource });
    } catch (error) {
      console.error('Error creating EventSource:', error);
      set({
        status: 'error',
        error: error instanceof Error ? error.message : 'Failed to establish connection',
      });
    }
  },

  disconnect: () => {
    const currentState = get();
    if (currentState.eventSource) {
      currentState.eventSource.close();
    }
    set({
      status: 'disconnected',
      eventSource: null,
      topicId: null,
      error: null,
    });
  },

  addMessage: (message: Message) => {
    set((state) => ({
      messages: [...state.messages, message],
      lastMessageTime: Date.now(),
    }));
  },

  setMessages: (messages: Message[]) => {
    set({ messages, lastMessageTime: Date.now() });
  },

  clearMessages: () => {
    set({ messages: [] });
  },

  handleReconnect: () => {
    const currentState = get();
    if (currentState.topicId) {
      currentState.connect(currentState.topicId);
    }
  },
}));
