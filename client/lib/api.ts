import { apiClient, APIError, logError } from '@shared/lib';
import { validateProposal } from './validation/proposalValidation';

export const api = {
  ...apiClient,

  async getProposals(token?: string) {
    return this.get('/client/proposals', token);
  },

  async getMyProposals(token?: string) {
    return this.get('/client/proposals/my', token);
  },

  async createProposal(title: string, summary: string, token?: string) {
    const validation = validateProposal(title, summary);
    if (!validation.isValid) {
      const errorMessage = Object.values(validation.errors).join('; ');
      throw new APIError(errorMessage, 400, 'Validation Error', validation.errors);
    }

    return this.post('/client/proposals', { title, summary }, token);
  },

  async voteOnProposal(proposalId: string, vote: 'for' | 'against', token: string) {
    if (vote !== 'for' && vote !== 'against') {
      throw new APIError('Invalid vote value. Must be "for" or "against"', 400, 'Validation Error');
    }

    return this.post(`/client/proposals/${proposalId}/vote`, { vote }, token);
  },

  async getUserVote(proposalId: string, token: string) {
    return this.get(`/client/proposals/${proposalId}/vote`, token);
  },

  logError
};

export { APIError };
