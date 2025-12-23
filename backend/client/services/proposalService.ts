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
import {
  PROPOSAL_VALIDATION_RULES,
  assertValidProposalId,
  assertValidVoteType,
  assertValidUserId,
} from '../../../shared/utils/validation/index.js';
import type { Database } from '../../../shared/types/database.types.js';

type Proposal = Database['public']['Tables']['proposals']['Row'];
type ProposalInsert = Database['public']['Tables']['proposals']['Insert'];
type ProposalVote = Database['public']['Tables']['proposal_votes']['Row'];

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
    assertValidUserId(userId);
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
    assertValidProposalId(id);
    assertValidUserId(userId);
    return getProposalByIdForUser(id, userId);
  }

  /**
   * Create a new proposal with business rule validation
   *
   * Business Rules (from shared validation):
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
    // Validate user ID using shared validator
    assertValidUserId(userId);

    // Validate proposal data against shared business rules
    this.validateProposalData(title, summary);

    // Build proposal object with business logic
    const proposalData: ProposalInsert = {
      title: title.trim(),
      summary: summary.trim(),
      submitted_by: userId,
      status: PROPOSAL_VALIDATION_RULES.DEFAULT_STATUS,
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
    // Validate inputs using shared validators
    assertValidProposalId(proposalId);
    assertValidUserId(userId);
    assertValidVoteType(vote);

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
    assertValidProposalId(proposalId);
    assertValidUserId(userId);
    return repoGetUserVote(proposalId, userId);
  }

  /**
   * Validate proposal data against shared business rules
   *
   * Uses PROPOSAL_VALIDATION_RULES from @shared/utils/validation to ensure
   * frontend and backend validation are consistent.
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
    if (trimmedTitle.length < PROPOSAL_VALIDATION_RULES.TITLE_MIN_LENGTH) {
      throw new Error(
        `Proposal title must be at least ${PROPOSAL_VALIDATION_RULES.TITLE_MIN_LENGTH} characters`
      );
    }

    if (trimmedTitle.length > PROPOSAL_VALIDATION_RULES.TITLE_MAX_LENGTH) {
      throw new Error(
        `Proposal title must not exceed ${PROPOSAL_VALIDATION_RULES.TITLE_MAX_LENGTH} characters`
      );
    }

    // Validate summary
    if (!summary || typeof summary !== 'string') {
      throw new Error('Proposal summary is required');
    }

    const trimmedSummary = summary.trim();
    if (trimmedSummary.length < PROPOSAL_VALIDATION_RULES.SUMMARY_MIN_LENGTH) {
      throw new Error(
        `Proposal summary must be at least ${PROPOSAL_VALIDATION_RULES.SUMMARY_MIN_LENGTH} characters`
      );
    }

    if (trimmedSummary.length > PROPOSAL_VALIDATION_RULES.SUMMARY_MAX_LENGTH) {
      throw new Error(
        `Proposal summary must not exceed ${PROPOSAL_VALIDATION_RULES.SUMMARY_MAX_LENGTH} characters`
      );
    }
  }
}
