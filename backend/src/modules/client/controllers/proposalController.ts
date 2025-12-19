import { Request, Response } from 'express';
import { ProposalService } from '../services/proposalService.js';

export class ProposalController {
  private proposalService: ProposalService;

  constructor() {
    this.proposalService = new ProposalService();
  }

  async getClientProposals(req: Request, res: Response) {
    try {
      const { userId } = req.query;
      if (!userId) {
        return res.status(400).json({ error: 'userId is required' });
      }

      const proposals = await this.proposalService.getClientProposals(userId as string);
      res.json({ proposals, count: proposals.length });
    } catch (error) {
      console.error('Error fetching client proposals:', error);
      res.status(500).json({ error: 'Failed to fetch proposals' });
    }
  }

  async getProposalById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { userId } = req.query;

      if (!userId) {
        return res.status(400).json({ error: 'userId is required' });
      }

      const proposal = await this.proposalService.getProposalById(id, userId as string);
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
