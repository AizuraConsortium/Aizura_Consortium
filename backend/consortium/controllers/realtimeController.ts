import { Request, Response } from 'express';
import { RealtimeService } from '../services/realtimeService.js';
import { randomBytes } from 'crypto';

export class RealtimeController {
  private realtimeService: RealtimeService;

  constructor(realtimeService: RealtimeService) {
    this.realtimeService = realtimeService;
  }

  async streamMessages(req: Request, res: Response) {
    try {
      const { topicId } = req.params;

      if (!topicId) {
        return res.status(400).json({ error: 'Topic ID is required' });
      }

      const clientId = randomBytes(16).toString('hex');
      console.log(`New SSE client ${clientId} connected for topic ${topicId}`);

      await this.realtimeService.addClient(clientId, topicId, res);
    } catch (error) {
      console.error('Error in streamMessages:', error);
      if (!res.headersSent) {
        res.status(500).json({ error: 'Failed to establish realtime connection' });
      }
    }
  }
}
