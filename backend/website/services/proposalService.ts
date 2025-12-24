import { createProposalsRepository } from '../../shared/services/supabase/repositories/proposals.js';
import { getWebsiteSupabaseClient } from '../config/supabaseWebsiteClient.js';
import type { Proposal } from '../../../shared/types/models.js';

export class ProposalService {
  private proposalsRepo = createProposalsRepository(getWebsiteSupabaseClient());

  async getProposals(status?: string): Promise<Proposal[]> {
    return this.proposalsRepo.getProposals(status as any);
  }

  async getProposalById(id: string): Promise<Proposal | null> {
    return this.proposalsRepo.getProposalById(id);
  }
}
