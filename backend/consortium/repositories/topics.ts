/**
 * Topics Repository
 *
 * Manages topic lifecycle with phase transitions, validation, and state management.
 */

import { BaseRepository, type OperationContext } from '../../shared/services/supabase/repositories/BaseRepository.js';
import { NotFoundError } from '../../shared/services/supabase/repositories/errors/RepositoryError.js';
import {
  validateTopicData,
  validateTopicId,
  validateProposalIdForTopic,
  validatePhaseTransition,
  validateCanEndTopic,
  isValidPhase,
} from './guards/topicGuards.js';
import type { Topic } from '../../../shared/types/models.js';
import type { Database } from '../../../shared/types/database.types.js';

type TopicInsert = Database['public']['Tables']['topics']['Insert'];
type TopicPhase = Database['public']['Tables']['topics']['Row']['state'];

/**
 * Topics Repository Class
 */
class TopicsRepository extends BaseRepository {
  constructor(client?: import('@supabase/supabase-js').SupabaseClient) {
    super('topics', client);
  }

  /**
   * Create a new topic for a proposal
   *
   * @throws {ValidationError} If proposalId is invalid
   * @throws {ConstraintViolationError} If proposal doesn't exist
   */
  async createTopic(proposalId: string): Promise<Topic> {
    const context: OperationContext = {
      operation: 'createTopic',
      table: 'topics',
      metadata: { proposalId },
    };

    return this.executeWithRetry(async () => {
      this.validateRequired(proposalId, 'proposalId');
      validateProposalIdForTopic(proposalId);

      const topicData: TopicInsert = {
        proposal_id: proposalId,
        state: 'intake',
      };

      validateTopicData(topicData);

      const { data, error } = await this.client
        .from('topics')
        .insert(topicData)
        .select()
        .single();

      if (error) throw error;
      if (!data) throw new Error('Failed to create topic');

      return data;
    }, context);
  }

  /**
   * Get topic by ID
   */
  async getTopic(topicId: string): Promise<Topic | null> {
    const context: OperationContext = {
      operation: 'getTopic',
      table: 'topics',
      resourceId: topicId,
    };

    return this.execute(async () => {
      this.validateRequired(topicId, 'topicId');
      validateTopicId(topicId);

      const { data, error } = await this.client
        .from('topics')
        .select('*')
        .eq('id', topicId)
        .maybeSingle();

      if (error) throw error;
      return data;
    }, context);
  }

  /**
   * Get topic by ID (throws if not found)
   */
  async getTopicOrThrow(topicId: string): Promise<Topic> {
    const topic = await this.getTopic(topicId);
    if (!topic) {
      throw new NotFoundError('Topic', topicId);
    }
    return topic;
  }

  /**
   * Update topic phase with transition validation
   *
   * @throws {StateTransitionError} If phase transition is invalid
   * @throws {NotFoundError} If topic doesn't exist
   */
  async updateTopicState(topicId: string, state: TopicPhase): Promise<void> {
    const context: OperationContext = {
      operation: 'updateTopicState',
      table: 'topics',
      resourceId: topicId,
      metadata: { state },
    };

    return this.execute(async () => {
      this.validateRequired(topicId, 'topicId');
      this.validateRequired(state, 'state');

      validateTopicId(topicId);

      if (!isValidPhase(state)) {
        this.validateEnum(state, 'state', ['intake', 'debate', 'plan_drafting', 'pre_vote', 'vote', 'commit', 'idle']);
      }

      const currentTopic = await this.getTopicOrThrow(topicId);

      validatePhaseTransition(currentTopic.state, state);

      const { error } = await this.client
        .from('topics')
        .update({ state })
        .eq('id', topicId);

      if (error) throw error;
    }, context);
  }

  /**
   * End a topic (must be in commit phase)
   *
   * @throws {OperationNotAllowedError} If topic cannot be ended
   * @throws {NotFoundError} If topic doesn't exist
   */
  async endTopic(topicId: string): Promise<void> {
    const context: OperationContext = {
      operation: 'endTopic',
      table: 'topics',
      resourceId: topicId,
    };

    return this.execute(async () => {
      this.validateRequired(topicId, 'topicId');
      validateTopicId(topicId);

      const currentTopic = await this.getTopicOrThrow(topicId);

      validateCanEndTopic(currentTopic.state, !!currentTopic.ended_at);

      const { error } = await this.client
        .from('topics')
        .update({
          ended_at: new Date().toISOString(),
          state: 'commit',
        })
        .eq('id', topicId);

      if (error) throw error;
    }, context);
  }

  /**
   * Get the current active topic (most recent without ended_at)
   */
  async getCurrentTopic(): Promise<Topic | null> {
    const context: OperationContext = {
      operation: 'getCurrentTopic',
      table: 'topics',
    };

    return this.execute(async () => {
      const { data, error } = await this.client
        .from('topics')
        .select('*')
        .is('ended_at', null)
        .order('started_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) throw error;
      return data;
    }, context);
  }

  /**
   * Get topic by proposal ID
   */
  async getTopicByProposalId(proposalId: string): Promise<Topic | null> {
    const context: OperationContext = {
      operation: 'getTopicByProposalId',
      table: 'topics',
      metadata: { proposalId },
    };

    return this.execute(async () => {
      this.validateRequired(proposalId, 'proposalId');
      validateProposalIdForTopic(proposalId);

      const { data, error } = await this.client
        .from('topics')
        .select('*')
        .eq('proposal_id', proposalId)
        .maybeSingle();

      if (error) throw error;
      return data;
    }, context);
  }
}

const topicsRepository = new TopicsRepository();

export const {
  createTopic,
  getTopic,
  getTopicOrThrow,
  updateTopicState,
  endTopic,
  getCurrentTopic,
  getTopicByProposalId,
} = topicsRepository;

export function createTopicsRepository(client?: import('@supabase/supabase-js').SupabaseClient): TopicsRepository {
  return new TopicsRepository(client);
}
