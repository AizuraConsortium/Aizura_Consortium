import { Request, Response } from 'express';
import { createProposalsRepository } from '../repositories/proposals.js';
import { getWebsiteSupabaseClient } from '../../website/config/supabaseWebsiteClient.js';

export class ProposalController {
  private proposalsRepo = createProposalsRepository(getWebsiteSupabaseClient());

  async getProposals(req: Request, res: Response) {
    try {
      const status = req.query.status as string;
      const proposals = await this.proposalsRepo.getProposals(status as any);
      res.json({ proposals, count: proposals.length });
    } catch (error) {
      console.error('Error fetching proposals:', error);
      res.status(500).json({ error: 'Failed to fetch proposals' });
    }
  }

  async getProposalById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const proposal = await this.proposalsRepo.getProposalById(id);
      if (!proposal) {
        return res.status(404).json({ error: 'Proposal not found' });
      }
      res.json(proposal);
    } catch (error) {
      console.error('Error fetching proposal by ID:', error);
      res.status(500).json({ error: 'Failed to fetch proposal' });
    }
  }
}
