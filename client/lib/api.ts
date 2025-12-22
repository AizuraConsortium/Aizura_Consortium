import { apiClient, APIError, logError } from '@shared/lib';
import { validateProposal } from './validation/proposalValidation';
import type { Proposal, ApiResponse } from '@shared/types';

interface ProposalsResponse {
  proposals: Proposal[];
  count: number;
}

interface VoteResponse {
  success: boolean;
  message: string;
}

interface UserVoteResponse {
  vote: 'for' | 'against' | null;
  voted_at: string | null;
}

export const api = {
  ...apiClient,

  async getProposals(token?: string): Promise<ProposalsResponse> {
    return this.get<ProposalsResponse>('/client/proposals', token);
  },

  async getMyProposals(token?: string): Promise<ProposalsResponse> {
    return this.get<ProposalsResponse>('/client/proposals/my', token);
  },

  async createProposal(
    title: string,
    summary: string,
    token?: string
  ): Promise<ApiResponse<{ id: string; proposal: Proposal }>> {
    const validation = validateProposal(title, summary);
    if (!validation.isValid) {
      const errorMessage = Object.values(validation.errors).join('; ');
      throw new APIError(errorMessage, 400, 'Validation Error', validation.errors);
    }

    return this.post<ApiResponse<{ id: string; proposal: Proposal }>>(
      '/client/proposals',
      { title, summary },
      token
    );
  },

  async voteOnProposal(
    proposalId: string,
    vote: 'for' | 'against',
    token: string
  ): Promise<VoteResponse> {
    if (vote !== 'for' && vote !== 'against') {
      throw new APIError('Invalid vote value. Must be "for" or "against"', 400, 'Validation Error');
    }

    return this.post<VoteResponse>(
      `/client/proposals/${proposalId}/vote`,
      { vote },
      token
    );
  },

  async getUserVote(
    proposalId: string,
    token: string
  ): Promise<UserVoteResponse> {
    return this.get<UserVoteResponse>(
      `/client/proposals/${proposalId}/vote`,
      token
    );
  },

  logError
};

export { APIError };
export type { ProposalsResponse, VoteResponse, UserVoteResponse };
