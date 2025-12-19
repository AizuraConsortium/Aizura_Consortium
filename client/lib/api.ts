import { apiClient, APIError, logError } from '@shared/lib';

export const api = {
  ...apiClient,

  async getProposals(token?: string) {
    return this.get('/client/proposals', token);
  },

  async getMyProposals(token?: string) {
    return this.get('/client/proposals/my', token);
  },

  async createProposal(title: string, summary: string, token?: string) {
    return this.post('/client/proposals', { title, summary }, token);
  },

  async voteOnProposal(proposalId: string, vote: 'for' | 'against', token: string) {
    return this.post(`/client/proposals/${proposalId}/vote`, { vote }, token);
  },

  async getUserVote(proposalId: string, token: string) {
    return this.get(`/client/proposals/${proposalId}/vote`, token);
  },

  logError
};

export { APIError };
