import { Request, Response } from 'express';
import { TopicService } from '../services/topicService.js';

export class TopicController {
  private topicService: TopicService;

  constructor() {
    this.topicService = new TopicService();
  }

  async getCurrentTopic(req: Request, res: Response) {
    try {
      const topic = await this.topicService.getCurrentTopic();
      if (!topic) {
        return res.status(404).json({ error: 'No active topic found' });
      }
      res.json(topic);
    } catch (error) {
      console.error('Error fetching current topic:', error);
      res.status(500).json({ error: 'Failed to fetch topic' });
    }
  }

  async getTopicById(req: Request, res: Response) {
    try {
      const { topicId } = req.params;
      const topic = await this.topicService.getTopicById(topicId);
      if (!topic) {
        return res.status(404).json({ error: 'Topic not found' });
      }
      res.json(topic);
    } catch (error) {
      console.error('Error fetching topic by ID:', error);
      res.status(500).json({ error: 'Failed to fetch topic' });
    }
  }
}
