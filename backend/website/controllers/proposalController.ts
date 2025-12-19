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

  async createProposal(req: Request, res: Response) {
    try {
      const proposal = await this.proposalService.createProposal(req.body);
      res.status(201).json(proposal);
    } catch (error) {
      console.error('Error creating proposal:', error);
      res.status(500).json({ error: 'Failed to create proposal' });
    }
  }

  async voteOnProposal(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { vote, userId } = req.body;

      if (!vote || !userId) {
        return res.status(400).json({ error: 'Vote and userId are required' });
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
      const { userId } = req.query;

      if (!userId) {
        return res.status(400).json({ error: 'userId is required' });
      }

      const vote = await this.proposalService.getUserVote(id, userId as string);
      res.json({ vote });
    } catch (error) {
      console.error('Error fetching user vote:', error);
      res.status(500).json({ error: 'Failed to fetch user vote' });
    }
  }
}
