import { create } from 'zustand';
import type { DAOStats, TreasuryStats, HistoricalMetrics } from '@shared/types/dao';

interface DAOState {
  stats: DAOStats | null;
  treasury: TreasuryStats | null;
  historicalMetrics: HistoricalMetrics | null;

  setStats: (stats: DAOStats) => void;
  setTreasury: (treasury: TreasuryStats) => void;
  setHistoricalMetrics: (metrics: HistoricalMetrics) => void;

  clearAll: () => void;
}

export const useDaoStore = create<DAOState>((set) => ({
  stats: null,
  treasury: null,
  historicalMetrics: null,

  setStats: (stats) => set({ stats }),
  setTreasury: (treasury) => set({ treasury }),
  setHistoricalMetrics: (historicalMetrics) => set({ historicalMetrics }),

  clearAll: () => set({ stats: null, treasury: null, historicalMetrics: null }),
}));
