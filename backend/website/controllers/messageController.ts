import { Request, Response } from 'express';
import { MessageService } from '../services/messageService.js';

export class MessageController {
  private messageService: MessageService;

  constructor() {
    this.messageService = new MessageService();
  }

  async getTopicMessages(req: Request, res: Response) {
    try {
      const { topicId } = req.params;
      const pagination = {
        limit: parseInt(req.query.limit as string) || 50,
        offset: parseInt(req.query.offset as string) || 0,
      };

      const result = await this.messageService.getTopicMessages(topicId, pagination);
      res.json(result);
    } catch (error) {
      console.error('Error fetching topic messages:', error);
      res.status(500).json({ error: 'Failed to fetch messages' });
    }
  }

  async getMessageById(req: Request, res: Response) {
    try {
      const { messageId } = req.params;
      const message = await this.messageService.getMessageById(messageId);
      if (!message) {
        return res.status(404).json({ error: 'Message not found' });
      }
      res.json(message);
    } catch (error) {
      console.error('Error fetching message by ID:', error);
      res.status(500).json({ error: 'Failed to fetch message' });
    }
  }
}
