/**
 * Proposals Repository
 *
 * Manages proposal CRUD operations with comprehensive validation,
 * status transitions, voting, and queue management.
 */

import { BaseRepository, type OperationContext } from './BaseRepository.js';
import { isDuplicateKeyError } from '../errorHandlers.js';
import { NotFoundError } from './errors/index.js';
import {
  validateProposalData,
  validateProposalTitle,
  validateProposalSummary,
  validateProposalId,
  validateUserId,
  validateStatusTransition,
  isValidProposalStatus,
  isValidVoteType,
} from './guards/index.js';
import type { Proposal, ProposalQueue, QueueOperationResult } from '../../../../../shared/types/index.js';
import type { Database } from '../../../../../shared/types/database.types.js';

type ProposalInsert = Database['public']['Tables']['proposals']['Insert'];
type ProposalUpdate = Database['public']['Tables']['proposals']['Update'];
type ProposalVote = Database['public']['Tables']['proposal_votes']['Row'];
type ProposalVoteInsert = Database['public']['Tables']['proposal_votes']['Insert'];
type ProposalStatus = Database['public']['Tables']['proposals']['Row']['status'];

/**
 * Proposals Repository Class
 */
class ProposalsRepository extends BaseRepository {
  constructor() {
    super('proposals');
  }

  /**
   * Get proposal by ID
   *
   * @throws {NotFoundError} If proposal doesn't exist
   */
  async getProposal(proposalId: string): Promise<Proposal> {
    const context: OperationContext = {
      operation: 'getProposal',
      table: 'proposals',
      resourceId: proposalId,
    };

    return this.execute(async () => {
      this.validateRequired(proposalId, 'proposalId');
      validateProposalId(proposalId);

      const { data, error } = await this.client
        .from('proposals')
        .select('*')
        .eq('id', proposalId)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          throw new NotFoundError('Proposal', proposalId);
        }
        throw error;
      }

      return data;
    }, context);
  }

  /**
   * Get all proposals, optionally filtered by status
   */
  async getProposals(status?: ProposalStatus): Promise<Proposal[]> {
    const context: OperationContext = {
      operation: 'getProposals',
      table: 'proposals',
      metadata: { status },
    };

    return this.execute(async () => {
      if (status) {
        if (!isValidProposalStatus(status)) {
          this.validateEnum(status, 'status', ['queued', 'in_debate', 'adopted', 'rejected']);
        }
      }

      let query = this.client
        .from('proposals')
        .select('*')
        .order('created_at', { ascending: false });

      if (status) {
        query = query.eq('status', status);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data || [];
    }, context);
  }

  /**
   * Get proposal by ID (returns null if not found)
   */
  async getProposalById(id: string): Promise<Proposal | null> {
    try {
      return await this.getProposal(id);
    } catch (error) {
      if (error instanceof NotFoundError) {
        return null;
      }
      throw error;
    }
  }

  /**
   * Get proposals submitted by a specific user
   */
  async getClientProposals(userId: string): Promise<Proposal[]> {
    const context: OperationContext = {
      operation: 'getClientProposals',
      table: 'proposals',
      metadata: { userId },
    };

    return this.execute(async () => {
      this.validateRequired(userId, 'userId');
      validateUserId(userId);

      const { data, error } = await this.client
        .from('proposals')
        .select('*')
        .eq('submitted_by', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    }, context);
  }

  /**
   * Get proposal by ID for a specific user
   */
  async getProposalByIdForUser(id: string, userId: string): Promise<Proposal | null> {
    const context: OperationContext = {
      operation: 'getProposalByIdForUser',
      table: 'proposals',
      resourceId: id,
      metadata: { userId },
    };

    return this.execute(async () => {
      this.validateRequired(id, 'id');
      this.validateRequired(userId, 'userId');
      validateProposalId(id);
      validateUserId(userId);

      const { data, error } = await this.client
        .from('proposals')
        .select('*')
        .eq('id', id)
        .eq('submitted_by', userId)
        .maybeSingle();

      if (error) throw error;
      return data;
    }, context);
  }

  /**
   * Create a new proposal with validation
   *
   * @throws {ValidationError} If proposal data is invalid
   */
  async createProposal(data: ProposalInsert): Promise<Proposal> {
    const context: OperationContext = {
      operation: 'createProposal',
      table: 'proposals',
      metadata: { title: data.title },
    };

    return this.executeWithRetry(async () => {
      validateProposalData(data);

      const { data: proposal, error } = await this.client
        .from('proposals')
        .insert(data)
        .select()
        .single();

      if (error) throw error;
      if (!proposal) throw new Error('Failed to create proposal');

      return proposal;
    }, context);
  }

  /**
   * Vote on a proposal (upsert vote)
   *
   * @throws {ValidationError} If vote data is invalid
   * @throws {NotFoundError} If proposal doesn't exist
   */
  async voteOnProposal(
    proposalId: string,
    userId: string,
    vote: 'for' | 'against'
  ): Promise<ProposalVote> {
    const context: OperationContext = {
      operation: 'voteOnProposal',
      table: 'proposal_votes',
      metadata: { proposalId, userId, vote },
    };

    return this.execute(async () => {
      this.validateRequired(proposalId, 'proposalId');
      this.validateRequired(userId, 'userId');
      this.validateRequired(vote, 'vote');

      validateProposalId(proposalId);
      validateUserId(userId);

      if (!isValidVoteType(vote)) {
        this.validateEnum(vote, 'vote', ['for', 'against']);
      }

      await this.getProposal(proposalId);

      const voteData: ProposalVoteInsert = {
        proposal_id: proposalId,
        user_id: userId,
        vote,
      };

      const { data, error } = await this.client
        .from('proposal_votes')
        .upsert(voteData, { onConflict: 'proposal_id,user_id' })
        .select()
        .single();

      if (error) throw error;
      if (!data) throw new Error('Failed to record vote');

      return data;
    }, context);
  }

  /**
   * Get user's vote on a proposal
   */
  async getUserVote(proposalId: string, userId: string): Promise<ProposalVote | null> {
    const context: OperationContext = {
      operation: 'getUserVote',
      table: 'proposal_votes',
      metadata: { proposalId, userId },
    };

    return this.execute(async () => {
      this.validateRequired(proposalId, 'proposalId');
      this.validateRequired(userId, 'userId');

      validateProposalId(proposalId);
      validateUserId(userId);

      const { data, error } = await this.client
        .from('proposal_votes')
        .select('*')
        .eq('proposal_id', proposalId)
        .eq('user_id', userId)
        .maybeSingle();

      if (error) throw error;
      return data;
    }, context);
  }

  /**
   * Update proposal status with transition validation
   *
   * @throws {StateTransitionError} If status transition is invalid
   * @throws {NotFoundError} If proposal doesn't exist
   */
  async updateProposalStatus(
    proposalId: string,
    status: ProposalStatus
  ): Promise<void> {
    const context: OperationContext = {
      operation: 'updateProposalStatus',
      table: 'proposals',
      resourceId: proposalId,
      metadata: { status },
    };

    return this.execute(async () => {
      this.validateRequired(proposalId, 'proposalId');
      this.validateRequired(status, 'status');

      validateProposalId(proposalId);

      if (!isValidProposalStatus(status)) {
        this.validateEnum(status, 'status', ['queued', 'in_debate', 'adopted', 'rejected']);
      }

      const currentProposal = await this.getProposal(proposalId);

      validateStatusTransition(currentProposal.status, status);

      const { error } = await this.client
        .from('proposals')
        .update({
          status,
          updated_at: new Date().toISOString(),
        })
        .eq('id', proposalId);

      if (error) throw error;
    }, context);
  }

  /**
   * Add proposal to processing queue
   *
   * @throws {NotFoundError} If proposal doesn't exist
   */
  async addToProposalQueue(
    proposalId: string,
    priority: number = 0
  ): Promise<QueueOperationResult> {
    const context: OperationContext = {
      operation: 'addToProposalQueue',
      table: 'proposal_queue',
      metadata: { proposalId, priority },
    };

    return this.execute(async () => {
      this.validateRequired(proposalId, 'proposalId');
      validateProposalId(proposalId);

      this.validateRange(priority, 'priority', 0, 1000);

      await this.getProposal(proposalId);

      try {
        const { error } = await this.client
          .from('proposal_queue')
          .insert({
            proposal_id: proposalId,
            priority,
            status: 'queued',
          });

        if (error) {
          if (isDuplicateKeyError(error, 'proposal_queue_proposal_id_key')) {
            return {
              success: true,
              wasAlreadyQueued: true,
              message: `Proposal ${proposalId} is already queued`,
            };
          }
          throw error;
        }

        return {
          success: true,
          wasAlreadyQueued: false,
          message: `Proposal ${proposalId} added to queue successfully`,
        };
      } catch (error) {
        throw error;
      }
    }, context);
  }

  /**
   * Get next queued proposal (with database-level locking)
   */
  async getNextQueuedProposal(): Promise<ProposalQueue | null> {
    const context: OperationContext = {
      operation: 'getNextQueuedProposal',
      table: 'proposal_queue',
    };

    return this.execute(async () => {
      const { data, error } = await this.client
        .rpc('get_and_lock_next_proposal');

      if (error) throw error;
      return data;
    }, context);
  }
}

const proposalsRepository = new ProposalsRepository();

export const {
  getProposal,
  getProposals,
  getProposalById,
  getClientProposals,
  getProposalByIdForUser,
  createProposal,
  voteOnProposal,
  getUserVote,
  updateProposalStatus,
  addToProposalQueue,
  getNextQueuedProposal,
} = proposalsRepository;
