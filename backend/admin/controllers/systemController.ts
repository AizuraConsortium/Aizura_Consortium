import { Request, Response } from 'express';
import { SystemService } from '../services/systemService.js';

export class SystemController {
  private systemService: SystemService;

  constructor() {
    this.systemService = new SystemService();
  }

  async getSystemHealth(req: Request, res: Response) {
    try {
      const health = await this.systemService.getSystemHealth();
      res.json(health);
    } catch (error) {
      console.error('Error fetching system health:', error);
      res.status(500).json({ error: 'Failed to fetch system health' });
    }
  }

  async getRateLimitStats(req: Request, res: Response) {
    try {
      const hours = parseInt(req.query.hours as string) || 24;
      const stats = await this.systemService.getRateLimitStats(hours);
      res.json({ stats, count: stats.length });
    } catch (error) {
      console.error('Error fetching rate limit stats:', error);
      res.status(500).json({ error: 'Failed to fetch rate limit stats' });
    }
  }

  async clearRateLimitViolations(req: Request, res: Response) {
    try {
      const cleared = await this.systemService.clearRateLimitViolations();
      res.json({ cleared });
    } catch (error) {
      console.error('Error clearing rate limit violations:', error);
      res.status(500).json({ error: 'Failed to clear violations' });
    }
  }
}
