import {
  getClientProposals,
  getProposals,
  getProposalByIdForUser,
  createProposal,
  voteOnProposal,
  getUserVote,
} from '../../shared/services/supabase/repositories/proposals.js';
import type { Database } from '../../../shared/types/database.types.js';

type Proposal = Database['public']['Tables']['proposals']['Row'];
type ProposalInsert = Database['public']['Tables']['proposals']['Insert'];
type ProposalVote = Database['public']['Tables']['proposal_votes']['Row'];

export class ProposalService {
  async getClientProposals(userId: string): Promise<Proposal[]> {
    return getClientProposals(userId);
  }

  async getAllProposals(): Promise<Proposal[]> {
    return getProposals();
  }

  async getProposalById(id: string, userId: string): Promise<Proposal | null> {
    return getProposalByIdForUser(id, userId);
  }

  async createProposal(proposal: ProposalInsert): Promise<Proposal> {
    return createProposal(proposal);
  }

  async voteOnProposal(
    proposalId: string,
    userId: string,
    vote: 'for' | 'against'
  ): Promise<ProposalVote> {
    return voteOnProposal(proposalId, userId, vote);
  }

  async getUserVote(proposalId: string, userId: string): Promise<ProposalVote | null> {
    return getUserVote(proposalId, userId);
  }
}
