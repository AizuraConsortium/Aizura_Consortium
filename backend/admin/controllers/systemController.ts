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

      if (req.logAdminAction) {
        await req.logAdminAction({
          actionType: 'system_health_check',
          resourceType: 'system',
          actionDetails: {
            systemStatus: health.status,
            uptime: health.uptime
          },
          success: true
        });
      }

      res.json(health);
    } catch (error) {
      console.error('Error fetching system health:', error);

      if (req.logAdminAction) {
        await req.logAdminAction({
          actionType: 'system_health_check',
          resourceType: 'system',
          success: false,
          errorMessage: error instanceof Error ? error.message : 'Unknown error'
        });
      }

      res.status(500).json({ error: 'Failed to fetch system health' });
    }
  }

  async getRateLimitStats(req: Request, res: Response) {
    try {
      const hours = parseInt(req.query.hours as string) || 24;
      const stats = await this.systemService.getRateLimitStats(hours);

      if (req.logAdminAction) {
        await req.logAdminAction({
          actionType: 'rate_limit_view',
          resourceType: 'rate_limit',
          actionDetails: {
            hours,
            statsCount: stats.length
          },
          success: true
        });
      }

      res.json({ stats, count: stats.length });
    } catch (error) {
      console.error('Error fetching rate limit stats:', error);

      if (req.logAdminAction) {
        await req.logAdminAction({
          actionType: 'rate_limit_view',
          resourceType: 'rate_limit',
          success: false,
          errorMessage: error instanceof Error ? error.message : 'Unknown error'
        });
      }

      res.status(500).json({ error: 'Failed to fetch rate limit stats' });
    }
  }

  async clearRateLimitViolations(req: Request, res: Response) {
    try {
      const cleared = await this.systemService.clearRateLimitViolations();

      if (req.logAdminAction) {
        await req.logAdminAction({
          actionType: 'rate_limit_clear',
          resourceType: 'rate_limit',
          actionDetails: {
            clearedCount: cleared
          },
          success: true
        });
      }

      res.json({ cleared });
    } catch (error) {
      console.error('Error clearing rate limit violations:', error);

      if (req.logAdminAction) {
        await req.logAdminAction({
          actionType: 'rate_limit_clear',
          resourceType: 'rate_limit',
          success: false,
          errorMessage: error instanceof Error ? error.message : 'Unknown error'
        });
      }

      res.status(500).json({ error: 'Failed to clear violations' });
    }
  }
}
