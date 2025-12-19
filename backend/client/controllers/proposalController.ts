import { Request, Response } from 'express';
import { ProposalService } from '../services/proposalService.js';

export class ProposalController {
  private proposalService: ProposalService;

  constructor() {
    this.proposalService = new ProposalService();
  }

  async getAllProposals(req: Request, res: Response) {
    try {
      const proposals = await this.proposalService.getAllProposals();
      res.json({ proposals, count: proposals.length });
    } catch (error) {
      console.error('Error fetching all proposals:', error);
      res.status(500).json({ error: 'Failed to fetch proposals' });
    }
  }

  async getClientProposals(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ error: 'User not authenticated' });
      }

      const proposals = await this.proposalService.getClientProposals(userId);
      res.json({ proposals, count: proposals.length });
    } catch (error) {
      console.error('Error fetching client proposals:', error);
      res.status(500).json({ error: 'Failed to fetch proposals' });
    }
  }

  async getProposalById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({ error: 'User not authenticated' });
      }

      const proposal = await this.proposalService.getProposalById(id, userId);
      if (!proposal) {
        return res.status(404).json({ error: 'Proposal not found' });
      }
      res.json(proposal);
    } catch (error) {
      console.error('Error fetching proposal by ID:', error);
      res.status(500).json({ error: 'Failed to fetch proposal' });
    }
  }

  async createProposal(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ error: 'User not authenticated' });
      }

      const { title, summary } = req.body;
      if (!title || !summary) {
        return res.status(400).json({ error: 'Title and summary are required' });
      }

      const proposal = await this.proposalService.createProposal({
        title,
        summary,
        submitted_by: userId,
        status: 'queued',
      });

      res.status(201).json(proposal);
    } catch (error) {
      console.error('Error creating proposal:', error);
      res.status(500).json({ error: 'Failed to create proposal' });
    }
  }

  async voteOnProposal(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const userId = req.user?.id;
      const { vote } = req.body;

      if (!userId) {
        return res.status(401).json({ error: 'User not authenticated' });
      }

      if (!vote || !['for', 'against'].includes(vote)) {
        return res.status(400).json({ error: 'Valid vote (for/against) is required' });
      }

      const voteRecord = await this.proposalService.voteOnProposal(id, userId, vote);
      res.json(voteRecord);
    } catch (error) {
      console.error('Error voting on proposal:', error);
      res.status(500).json({ error: 'Failed to vote on proposal' });
    }
  }

  async getUserVote(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({ error: 'User not authenticated' });
      }

      const vote = await this.proposalService.getUserVote(id, userId);
      res.json({ vote });
    } catch (error) {
      console.error('Error fetching user vote:', error);
      res.status(500).json({ error: 'Failed to fetch user vote' });
    }
  }
}
