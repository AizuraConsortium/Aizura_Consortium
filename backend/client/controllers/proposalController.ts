/**
 * Proposal Controller (Client Module)
 *
 * Pure request/response handler for client proposal operations.
 * Delegates all business logic to the service layer.
 * Authentication and validation are handled by middleware.
 */

import { Request, Response } from 'express';
import { ProposalService } from '../services/proposalService.js';

export class ProposalController {
  private proposalService: ProposalService;

  constructor(proposalService?: ProposalService) {
    this.proposalService = proposalService || new ProposalService();
  }

  /**
   * GET /api/client/proposals
   * Get all proposals for the authenticated client
   * Auth validated by middleware - req.user.id is guaranteed
   */
  async getClientProposals(req: Request, res: Response): Promise<void> {
    try {
      // Extract user ID (guaranteed by middleware)
      const userId = req.user!.id;

      // Delegate to service layer
      const proposals = await this.proposalService.getClientProposals(userId);

      // Return response
      res.json({ proposals, count: proposals.length });
    } catch (error) {
      console.error('Error fetching client proposals:', error);
      res.status(500).json({
        error: 'Failed to fetch proposals',
        message: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  /**
   * GET /api/client/proposals/:id
   * Get a specific proposal by ID
   * Auth validated by middleware
   */
  async getProposalById(req: Request, res: Response): Promise<void> {
    try {
      // Extract parameters
      const { id } = req.params;
      const userId = req.user!.id;

      // Delegate to service layer
      const proposal = await this.proposalService.getProposalById(id, userId);

      if (!proposal) {
        res.status(404).json({ error: 'Proposal not found' });
        return;
      }

      // Return response
      res.json(proposal);
    } catch (error) {
      console.error('Error fetching proposal by ID:', error);
      res.status(500).json({
        error: 'Failed to fetch proposal',
        message: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  /**
   * POST /api/client/proposals
   * Create a new proposal
   * Auth and validation handled by middleware
   */
  async createProposal(req: Request, res: Response): Promise<void> {
    try {
      // Extract request data (validation done by middleware)
      const userId = req.user!.id;
      const { title, summary } = req.body;

      // Delegate to service layer (business logic)
      const proposal = await this.proposalService.createProposal(
        title,
        summary,
        userId
      );

      // Return success response
      res.status(201).json(proposal);
    } catch (error) {
      console.error('Error creating proposal:', error);
      res.status(500).json({
        error: 'Failed to create proposal',
        message: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  /**
   * POST /api/client/proposals/:id/vote
   * Vote on a proposal
   * Auth and validation handled by middleware
   */
  async voteOnProposal(req: Request, res: Response): Promise<void> {
    try {
      // Extract request data (validation done by middleware)
      const { id } = req.params;
      const userId = req.user!.id;
      const { vote } = req.body;

      // Delegate to service layer (business logic)
      const voteRecord = await this.proposalService.voteOnProposal(
        id,
        userId,
        vote
      );

      // Return response
      res.json(voteRecord);
    } catch (error) {
      console.error('Error voting on proposal:', error);
      res.status(500).json({
        error: 'Failed to vote on proposal',
        message: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  /**
   * GET /api/client/proposals/:id/vote
   * Get user's vote on a specific proposal
   * Auth validated by middleware
   */
  async getUserVote(req: Request, res: Response): Promise<void> {
    try {
      // Extract parameters
      const { id } = req.params;
      const userId = req.user!.id;

      // Delegate to service layer
      const vote = await this.proposalService.getUserVote(id, userId);

      // Return response
      res.json({ vote });
    } catch (error) {
      console.error('Error fetching user vote:', error);
      res.status(500).json({
        error: 'Failed to fetch user vote',
        message: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }
}
