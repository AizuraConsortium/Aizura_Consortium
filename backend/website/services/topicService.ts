import * as TopicsRepo from '../repositories/topics.js';
import * as ProposalsRepo from '../repositories/proposals.js';
import * as PlansRepo from '../repositories/plans.js';
import type { Topic, Proposal, Plan } from '../../../shared/types/index.js';
import type { TopicWithDetails } from '../../../shared/types/api.js';

export class TopicService {
  async getCurrentTopic(): Promise<TopicWithDetails | null> {
    const topic = await TopicsRepo.getCurrentTopic();

    if (!topic) {
      return null;
    }

    const proposal = await ProposalsRepo.getProposalById(topic.proposal_id);
    const planData = await PlansRepo.getPlan(topic.id);
    const planContent = await PlansRepo.getPlanContent(topic.id);

    return {
      id: topic.id,
      title: proposal?.title || 'Untitled Topic',
      description: proposal?.summary || '',
      state: topic.state,
      proposal_id: topic.proposal_id,
      created_at: topic.started_at,
      updated_at: topic.started_at,
      proposal: proposal ? {
        id: proposal.id,
        title: proposal.title,
        description: proposal.summary || '',
        status: proposal.status,
        created_at: proposal.created_at,
        user_id: proposal.submitted_by
      } : null,
      plan: planData ? {
        id: planData.id,
        topic_id: planData.topic_id,
        content_md: planContent,
        created_at: planData.created_at,
        updated_at: planData.created_at
      } : null,
    };
  }

  async getTopicById(topicId: string): Promise<TopicWithDetails | null> {
    const topic = await TopicsRepo.getTopic(topicId);

    if (!topic) {
      return null;
    }

    const proposal = await ProposalsRepo.getProposalById(topic.proposal_id);
    const planData = await PlansRepo.getPlan(topic.id);
    const planContent = await PlansRepo.getPlanContent(topic.id);

    return {
      id: topic.id,
      title: proposal?.title || 'Untitled Topic',
      description: proposal?.summary || '',
      state: topic.state,
      proposal_id: topic.proposal_id,
      created_at: topic.started_at,
      updated_at: topic.started_at,
      proposal: proposal ? {
        id: proposal.id,
        title: proposal.title,
        description: proposal.summary || '',
        status: proposal.status,
        created_at: proposal.created_at,
        user_id: proposal.submitted_by
      } : null,
      plan: planData ? {
        id: planData.id,
        topic_id: planData.topic_id,
        content_md: planContent,
        created_at: planData.created_at,
        updated_at: planData.created_at
      } : null,
    };
  }
}
