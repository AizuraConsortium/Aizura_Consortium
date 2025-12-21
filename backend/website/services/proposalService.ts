import * as ProposalsRepo from '../repositories/proposals.js';
import type { Proposal } from '../../../shared/types/index.js';

export class ProposalService {
  async getProposals(status?: string): Promise<Proposal[]> {
    return ProposalsRepo.getProposals(status);
  }

  async getProposalById(id: string): Promise<Proposal | null> {
    return ProposalsRepo.getProposalById(id);
  }
}
