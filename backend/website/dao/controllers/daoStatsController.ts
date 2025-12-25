import { Request, Response } from 'express';
import { BaseController } from '../../../shared/controllers/BaseController.js';
import { DAOStatsService } from '../services/daoStatsService.js';
import type { TimePeriod } from '../types/daoTypes.js';

/**
 * DAO Stats Controller
 * Handles HTTP requests for DAO statistics endpoints
 */
export class DAOStatsController extends BaseController {
  constructor(private statsService: DAOStatsService) {
    super('DAOStatsController');
  }

  /**
   * GET /api/website/dao/stats
   * Get current DAO statistics
   */
  async getStats(req: Request, res: Response): Promise<void> {
    try {
      const stats = await this.statsService.getDAOStats();
      this.ok(res, stats);
    } catch (error) {
      this.handleError(error, req, res);
    }
  }

  /**
   * GET /api/website/dao/trends
   * Get governance trends over time
   */
  async getTrends(req: Request, res: Response): Promise<void> {
    try {
      const period = (req.query.period as TimePeriod) || '30d';

      if (!['7d', '30d', '90d'].includes(period)) {
        return this.badRequest(res, 'Invalid period. Must be one of: 7d, 30d, 90d');
      }

      const trends = await this.statsService.getGovernanceTrends(period);
      this.ok(res, trends);
    } catch (error) {
      this.handleError(error, req, res);
    }
  }

  /**
   * GET /api/website/dao/activity
   * Get recent DAO activity
   */
  async getActivity(req: Request, res: Response): Promise<void> {
    try {
      const limit = parseInt(req.query.limit as string) || 10;

      if (limit < 1 || limit > 50) {
        return this.badRequest(res, 'Limit must be between 1 and 50');
      }

      const activity = await this.statsService.getRecentActivity(limit);
      this.ok(res, activity);
    } catch (error) {
      this.handleError(error, req, res);
    }
  }

  /**
   * POST /api/website/dao/refresh
   * Manually refresh materialized views (admin only)
   */
  async refreshViews(req: Request, res: Response): Promise<void> {
    try {
      await this.statsService.refreshViews();
      this.ok(res, { message: 'Materialized views refreshed successfully' });
    } catch (error) {
      this.handleError(error, req, res);
    }
  }

  /**
   * POST /api/website/dao/capture
   * Manually capture governance snapshot (admin only)
   */
  async captureSnapshot(req: Request, res: Response): Promise<void> {
    try {
      await this.statsService.captureSnapshot();
      this.ok(res, { message: 'Governance snapshot captured successfully' });
    } catch (error) {
      this.handleError(error, req, res);
    }
  }

  /**
   * GET /api/website/dao/cache/stats
   * Get cache statistics (admin only)
   */
  async getCacheStats(req: Request, res: Response): Promise<void> {
    try {
      const stats = this.statsService.getCacheStats();
      this.ok(res, stats);
    } catch (error) {
      this.handleError(error, req, res);
    }
  }
}
