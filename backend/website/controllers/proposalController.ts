import { Request, Response } from 'express';
import { ProposalService } from '../services/proposalService.js';

export class ProposalController {
  private proposalService: ProposalService;

  constructor() {
    this.proposalService = new ProposalService();
  }

  async getProposals(req: Request, res: Response) {
    try {
      const status = req.query.status as string;
      const proposals = await this.proposalService.getProposals(status);
      res.json({ proposals, count: proposals.length });
    } catch (error) {
      console.error('Error fetching proposals:', error);
      res.status(500).json({ error: 'Failed to fetch proposals' });
    }
  }

  async getProposalById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const proposal = await this.proposalService.getProposalById(id);
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
