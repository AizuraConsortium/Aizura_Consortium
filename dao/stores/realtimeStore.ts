import { create } from 'zustand';

interface RealtimeActivity {
  id: string;
  type: 'proposal' | 'vote' | 'message' | 'arbitration';
  timestamp: string;
  data: any;
}

interface RealtimeState {
  activities: RealtimeActivity[];
  isConnected: boolean;

  addActivity: (activity: RealtimeActivity) => void;
  setConnected: (connected: boolean) => void;
  clearActivities: () => void;
}

export const useRealtimeStore = create<RealtimeState>((set) => ({
  activities: [],
  isConnected: false,

  addActivity: (activity) =>
    set((state) => ({
      activities: [activity, ...state.activities].slice(0, 50),
    })),

  setConnected: (isConnected) => set({ isConnected }),

  clearActivities: () => set({ activities: [] }),
}));
