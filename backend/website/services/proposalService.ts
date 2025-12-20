import { getProposals, getProposalById } from '../../shared/services/supabase/repositories/proposals.js';
import type { Database } from '../../../shared/types/database.types.js';

type Proposal = Database['public']['Tables']['proposals']['Row'];

export class ProposalService {
  async getProposals(status?: string): Promise<Proposal[]> {
    return getProposals(status);
  }

  async getProposalById(id: string): Promise<Proposal | null> {
    return getProposalById(id);
  }
}
