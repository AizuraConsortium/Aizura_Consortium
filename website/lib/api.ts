import { apiClient, APIError, logError } from '@shared/lib';

export const api = {
  ...apiClient,

  async getHome() {
    return this.get('/home');
  },

  async getMessages(topicId: string, limit: number = 50, offset: number = 0) {
    return this.get(`/room/${topicId}/messages?limit=${limit}&offset=${offset}`);
  },

  async getPlan(topicId: string) {
    return this.get(`/plan/${topicId}`);
  },

  async getProposals() {
    return this.get('/proposals');
  },

  async createProposal(title: string, summary: string, token?: string) {
    return this.post('/proposals', { title, summary }, token);
  },

  async voteOnProposal(proposalId: string, vote: 'for' | 'against', token: string) {
    return this.post(`/proposals/${proposalId}/vote`, { vote }, token);
  },

  async getErrors(queryString?: string) {
    const endpoint = queryString ? `/errors?${queryString}` : '/errors';
    return this.get(endpoint);
  },

  logError
};

export { APIError };
