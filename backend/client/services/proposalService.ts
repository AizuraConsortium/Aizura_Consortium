/**
 * Proposal Service (Client Module)
 *
 * Business logic layer for client proposal operations.
 * Validates business rules, applies constraints, and delegates to repository.
 */

import {
  getClientProposals as repoGetClientProposals,
  getProposals,
  getProposalByIdForUser,
  createProposal as repoCreateProposal,
  voteOnProposal as repoVoteOnProposal,
  getUserVote as repoGetUserVote,
} from '../../shared/services/supabase/repositories/proposals.js';
import type { Database } from '../../../shared/types/database.types.js';

type Proposal = Database['public']['Tables']['proposals']['Row'];
type ProposalInsert = Database['public']['Tables']['proposals']['Insert'];
type ProposalVote = Database['public']['Tables']['proposal_votes']['Row'];

/**
 * Business rule constants
 */
const PROPOSAL_CONSTRAINTS = {
  MIN_TITLE_LENGTH: 5,
  MAX_TITLE_LENGTH: 200,
  MIN_SUMMARY_LENGTH: 20,
  MAX_SUMMARY_LENGTH: 2000,
  DEFAULT_STATUS: 'queued' as const,
  VALID_VOTE_TYPES: ['for', 'against'] as const,
};

/**
 * Service for managing client proposal operations with business logic
 */
export class ProposalService {
  /**
   * Get all proposals for a specific client user
   *
   * @param userId - The client user ID
   * @returns List of proposals submitted by the user
   */
  async getClientProposals(userId: string): Promise<Proposal[]> {
    this.validateUserId(userId);
    return repoGetClientProposals(userId);
  }

  /**
   * Get all proposals (admin functionality)
   *
   * @returns List of all proposals
   */
  async getAllProposals(): Promise<Proposal[]> {
    return getProposals();
  }

  /**
   * Get a specific proposal by ID for a user
   *
   * @param id - Proposal ID
   * @param userId - User ID requesting the proposal
   * @returns Proposal if found and accessible, null otherwise
   */
  async getProposalById(id: string, userId: string): Promise<Proposal | null> {
    this.validateProposalId(id);
    this.validateUserId(userId);
    return getProposalByIdForUser(id, userId);
  }

  /**
   * Create a new proposal with business rule validation
   *
   * Business Rules:
   * - Title must be between 5 and 200 characters
   * - Summary must be between 20 and 2000 characters
   * - Initial status is always 'queued'
   * - User must be authenticated (validated by middleware)
   *
   * @param title - Proposal title
   * @param summary - Proposal summary/description
   * @param userId - User ID creating the proposal
   * @returns Created proposal
   * @throws Error if validation fails
   */
  async createProposal(
    title: string,
    summary: string,
    userId: string
  ): Promise<Proposal> {
    // Validate user ID
    this.validateUserId(userId);

    // Validate proposal data against business rules
    this.validateProposalData(title, summary);

    // Build proposal object with business logic
    const proposalData: ProposalInsert = {
      title: title.trim(),
      summary: summary.trim(),
      submitted_by: userId,
      status: this.setInitialProposalStatus(),
    };

    // Delegate to repository
    const createdProposal = await repoCreateProposal(proposalData);

    return createdProposal;
  }

  /**
   * Vote on a proposal with business rule validation
   *
   * Business Rules:
   * - Vote must be 'for' or 'against'
   * - User must be authenticated
   * - User can change their vote (upsert behavior)
   *
   * @param proposalId - Proposal ID to vote on
   * @param userId - User ID voting
   * @param vote - Vote type ('for' | 'against')
   * @returns Vote record
   * @throws Error if validation fails
   */
  async voteOnProposal(
    proposalId: string,
    userId: string,
    vote: 'for' | 'against'
  ): Promise<ProposalVote> {
    // Validate inputs
    this.validateProposalId(proposalId);
    this.validateUserId(userId);
    this.validateVoteType(vote);

    // Delegate to repository
    return repoVoteOnProposal(proposalId, userId, vote);
  }

  /**
   * Get user's vote on a specific proposal
   *
   * @param proposalId - Proposal ID
   * @param userId - User ID
   * @returns Vote record if exists, null otherwise
   */
  async getUserVote(proposalId: string, userId: string): Promise<ProposalVote | null> {
    this.validateProposalId(proposalId);
    this.validateUserId(userId);
    return repoGetUserVote(proposalId, userId);
  }

  /**
   * Validate proposal data against business rules
   *
   * @private
   * @throws Error with descriptive message if validation fails
   */
  private validateProposalData(title: string, summary: string): void {
    // Validate title
    if (!title || typeof title !== 'string') {
      throw new Error('Proposal title is required');
    }

    const trimmedTitle = title.trim();
    if (trimmedTitle.length < PROPOSAL_CONSTRAINTS.MIN_TITLE_LENGTH) {
      throw new Error(
        `Proposal title must be at least ${PROPOSAL_CONSTRAINTS.MIN_TITLE_LENGTH} characters`
      );
    }

    if (trimmedTitle.length > PROPOSAL_CONSTRAINTS.MAX_TITLE_LENGTH) {
      throw new Error(
        `Proposal title must not exceed ${PROPOSAL_CONSTRAINTS.MAX_TITLE_LENGTH} characters`
      );
    }

    // Validate summary
    if (!summary || typeof summary !== 'string') {
      throw new Error('Proposal summary is required');
    }

    const trimmedSummary = summary.trim();
    if (trimmedSummary.length < PROPOSAL_CONSTRAINTS.MIN_SUMMARY_LENGTH) {
      throw new Error(
        `Proposal summary must be at least ${PROPOSAL_CONSTRAINTS.MIN_SUMMARY_LENGTH} characters`
      );
    }

    if (trimmedSummary.length > PROPOSAL_CONSTRAINTS.MAX_SUMMARY_LENGTH) {
      throw new Error(
        `Proposal summary must not exceed ${PROPOSAL_CONSTRAINTS.MAX_SUMMARY_LENGTH} characters`
      );
    }
  }

  /**
   * Set initial proposal status based on business rules
   * Currently always returns 'queued', but can be extended for other logic
   *
   * @private
   */
  private setInitialProposalStatus(): 'queued' {
    return PROPOSAL_CONSTRAINTS.DEFAULT_STATUS;
  }

  /**
   * Validate vote type against business rules
   *
   * @private
   * @throws Error if vote type is invalid
   */
  private validateVoteType(vote: string): asserts vote is 'for' | 'against' {
    if (!PROPOSAL_CONSTRAINTS.VALID_VOTE_TYPES.includes(vote as any)) {
      throw new Error(
        `Invalid vote type. Must be one of: ${PROPOSAL_CONSTRAINTS.VALID_VOTE_TYPES.join(', ')}`
      );
    }
  }

  /**
   * Validate proposal ID format
   *
   * @private
   * @throws Error if proposal ID is invalid
   */
  private validateProposalId(proposalId: string): void {
    if (!proposalId || typeof proposalId !== 'string') {
      throw new Error('Invalid proposal ID');
    }

    if (proposalId.trim().length === 0) {
      throw new Error('Proposal ID cannot be empty');
    }
  }

  /**
   * Validate user ID format
   *
   * @private
   * @throws Error if user ID is invalid
   */
  private validateUserId(userId: string): void {
    if (!userId || typeof userId !== 'string') {
      throw new Error('Invalid user ID');
    }

    if (userId.trim().length === 0) {
      throw new Error('User ID cannot be empty');
    }
  }
}
