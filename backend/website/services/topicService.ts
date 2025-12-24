/**
 * Topic Service
 *
 * Handles business logic for topic operations.
 * Topics represent active discussion/consensus-building sessions around proposals.
 */

import { createTopicsRepository } from '../../shared/services/supabase/repositories/topics.js';
import { createProposalsRepository } from '../../shared/services/supabase/repositories/proposals.js';
import { createPlansRepository } from '../../shared/services/supabase/repositories/plans.js';
import { getWebsiteSupabaseClient } from '../config/supabaseWebsiteClient.js';
import type { Topic, Proposal, Plan } from '../../../shared/types/models.js';
import type { TopicWithDetails } from '../../../shared/types/api.js';
import { BaseService } from '../../shared/services/BaseService.js';

/**
 * Topic Service
 *
 * Manages topic lifecycle and provides topic details with related data.
 */
export class TopicService extends BaseService {
  private topicsRepo = createTopicsRepository(getWebsiteSupabaseClient());
  private proposalsRepo = createProposalsRepository(getWebsiteSupabaseClient());
  private plansRepo = createPlansRepository(getWebsiteSupabaseClient());

  constructor() {
    super('TopicService');
  }

  /**
   * Get the current active topic
   *
   * Returns the most recent active topic with all related data including
   * proposal details and plan information.
   *
   * @returns Topic with details or null if no active topic
   *
   * @example
   * const currentTopic = await topicService.getCurrentTopic();
   * if (currentTopic) {
   *   console.log(`Active topic: ${currentTopic.title}`);
   * }
   */
  async getCurrentTopic(): Promise<TopicWithDetails | null> {
    const topic = await this.topicsRepo.getCurrentTopic();

    if (!topic) {
      return null;
    }

    return this.buildTopicWithDetails(topic);
  }

  /**
   * Get a specific topic by ID
   *
   * Returns the specified topic with all related data including
   * proposal details and plan information.
   *
   * @param topicId - UUID of the topic
   * @returns Topic with details or null if not found
   *
   * @example
   * const topic = await topicService.getTopicById('123e4567-e89b-12d3-a456-426614174000');
   * if (topic) {
   *   console.log(`Topic state: ${topic.state}`);
   * }
   */
  async getTopicById(topicId: string): Promise<TopicWithDetails | null> {
    this.guard(
      typeof topicId === 'string' && topicId.length > 0,
      'Topic ID must be a non-empty string',
      'INVALID_TOPIC_ID'
    );

    const topic = await this.topicsRepo.getTopic(topicId);

    if (!topic) {
      return null;
    }

    return this.buildTopicWithDetails(topic);
  }

  /**
   * Build topic with all related details
   *
   * Fetches proposal and plan data related to the topic and combines them
   * into a comprehensive TopicWithDetails object.
   *
   * @param topic - Base topic data from database
   * @returns Topic with all related details
   * @private
   */
  private async buildTopicWithDetails(topic: Topic): Promise<TopicWithDetails> {
    const [proposal, planData, planContent] = await Promise.all([
      this.proposalsRepo.getProposalById(topic.proposal_id),
      this.plansRepo.getPlan(topic.id),
      this.plansRepo.getCurrentPlanContent(topic.id),
    ]);

    return {
      id: topic.id,
      title: proposal?.title || 'Untitled Topic',
      description: proposal?.summary || '',
      state: topic.state,
      proposal_id: topic.proposal_id,
      created_at: topic.started_at,
      updated_at: topic.started_at,
      proposal: proposal ? this.buildProposalSummary(proposal) : null,
      plan: planData ? this.buildPlanSummary(planData, planContent) : null,
    };
  }

  /**
   * Build proposal summary from full proposal data
   *
   * @param proposal - Full proposal data
   * @returns Proposal summary for topic details
   * @private
   */
  private buildProposalSummary(proposal: Proposal): TopicWithDetails['proposal'] {
    return {
      id: proposal.id,
      title: proposal.title,
      description: proposal.summary || '',
      status: proposal.status,
      created_at: proposal.created_at,
      user_id: proposal.submitted_by,
    };
  }

  /**
   * Build plan summary from plan data and content
   *
   * @param planData - Plan metadata
   * @param planContent - Plan content in markdown
   * @returns Plan summary for topic details
   * @private
   */
  private buildPlanSummary(planData: Plan, planContent: string): TopicWithDetails['plan'] {
    return {
      id: planData.id,
      topic_id: planData.topic_id,
      content_md: planContent,
      created_at: planData.created_at,
      updated_at: planData.created_at,
    };
  }
}
