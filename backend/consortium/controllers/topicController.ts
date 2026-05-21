import { Request, Response } from 'express';
import { createTopicsRepository } from '../repositories/topics.js';
import { createProposalsRepository } from '../repositories/proposals.js';
import { createPlansRepository } from '../repositories/plans.js';
import { getWebsiteSupabaseClient } from '../../website/config/supabaseWebsiteClient.js';
import type { Topic } from '../../../shared/types/models.js';
import type { TopicWithDetails } from '../../../shared/types/api.js';

export class TopicController {
  private topicsRepo = createTopicsRepository(getWebsiteSupabaseClient());
  private proposalsRepo = createProposalsRepository(getWebsiteSupabaseClient());
  private plansRepo = createPlansRepository(getWebsiteSupabaseClient());

  async getCurrentTopic(_req: Request, res: Response) {
    try {
      const topic = await this.topicsRepo.getCurrentTopic();
      if (!topic) {
        return res.status(404).json({ error: 'No active topic found' });
      }
      const topicDetails = await this.buildTopicWithDetails(topic);
      res.json(topicDetails);
    } catch (error) {
      console.error('Error fetching current topic:', error);
      res.status(500).json({ error: 'Failed to fetch topic' });
    }
  }

  async getTopicById(_req: Request, res: Response) {
    try {
      const { topicId } = req.params;

      if (!topicId || typeof topicId !== 'string') {
        return res.status(400).json({ error: 'Invalid topic ID' });
      }

      const topic = await this.topicsRepo.getTopic(topicId);
      if (!topic) {
        return res.status(404).json({ error: 'Topic not found' });
      }

      const topicDetails = await this.buildTopicWithDetails(topic);
      res.json(topicDetails);
    } catch (error) {
      console.error('Error fetching topic by ID:', error);
      res.status(500).json({ error: 'Failed to fetch topic' });
    }
  }

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
      proposal: proposal ? {
        id: proposal.id,
        title: proposal.title,
        description: proposal.summary || '',
        status: proposal.status,
        created_at: proposal.created_at,
        user_id: proposal.submitted_by,
      } : null,
      plan: planData ? {
        id: planData.id,
        topic_id: planData.topic_id,
        content_md: planContent,
        created_at: planData.created_at,
        updated_at: planData.created_at,
      } : null,
    };
  }
}
