import { apiClient } from '@shared/lib/apiClient';
import type { DAOStats, TreasuryStats, HistoricalMetrics } from '@shared/types/dao';
import type { ProposalsResponse } from '@shared/types/api';

export const daoApi = {
  ...apiClient,

  async getDAOStats(): Promise<DAOStats> {
    return apiClient.get<DAOStats>('/dao/stats');
  },

  async getTreasuryStats(): Promise<TreasuryStats> {
    return apiClient.get<TreasuryStats>('/dao/treasury');
  },

  async getHistoricalMetrics(days: number = 30): Promise<HistoricalMetrics> {
    return apiClient.get<HistoricalMetrics>(`/dao/metrics/historical?days=${days}`);
  },

  async getProposals(status?: string): Promise<ProposalsResponse> {
    const endpoint = status ? `/website/proposals?status=${status}` : '/website/proposals';
    return apiClient.get<ProposalsResponse>(endpoint);
  },
};
