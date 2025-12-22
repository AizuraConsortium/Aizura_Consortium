/**
 * System Controller
 *
 * Handles system health and monitoring endpoints for admin users.
 * Uses standardized error handling and admin action logging.
 */

import { Request, Response } from 'express';
import { SystemService } from '../services/systemService.js';
import { handleControllerError } from '../../shared/utils/errorHandler.js';
import { withAdminAction } from '../../shared/utils/adminActionHelper.js';

export class SystemController {
  private systemService: SystemService;

  constructor() {
    this.systemService = new SystemService();
  }

  /**
   * GET /api/admin/system/health
   * Get system health status
   */
  async getSystemHealth(req: Request, res: Response): Promise<void> {
    try {
      await withAdminAction(
        req,
        res,
        'system_health_check',
        'system',
        async () => {
          const health = await this.systemService.getSystemHealth();
          res.json(health);

          return {
            details: {
              systemStatus: health.status,
              uptime: health.uptime,
            },
          };
        }
      );
    } catch (error) {
      handleControllerError(error, res, {
        requestPath: req.path,
        requestMethod: req.method,
        userId: req.user?.id,
      });
    }
  }

  /**
   * GET /api/admin/system/rate-limit-stats
   * Get rate limit statistics
   */
  async getRateLimitStats(req: Request, res: Response): Promise<void> {
    try {
      await withAdminAction(
        req,
        res,
        'rate_limit_view',
        'rate_limit',
        async () => {
          const hours = parseInt(req.query.hours as string, 10) || 24;
          const stats = await this.systemService.getRateLimitStats(hours);

          res.json({ stats, count: stats.length });

          return {
            details: {
              hours,
              statsCount: stats.length,
            },
          };
        }
      );
    } catch (error) {
      handleControllerError(error, res, {
        requestPath: req.path,
        requestMethod: req.method,
        userId: req.user?.id,
      });
    }
  }

  /**
   * POST /api/admin/system/rate-limit-clear
   * Clear all rate limit violations
   */
  async clearRateLimitViolations(req: Request, res: Response): Promise<void> {
    try {
      await withAdminAction(
        req,
        res,
        'rate_limit_clear',
        'rate_limit',
        async () => {
          const cleared = await this.systemService.clearRateLimitViolations();

          res.json({ cleared });

          return {
            details: {
              clearedCount: cleared,
            },
          };
        }
      );
    } catch (error) {
      handleControllerError(error, res, {
        requestPath: req.path,
        requestMethod: req.method,
        userId: req.user?.id,
      });
    }
  }
}
