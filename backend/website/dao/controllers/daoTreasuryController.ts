import { Request, Response } from 'express';
import { BaseController } from '../../../shared/controllers/BaseController.js';
import { DAOTreasuryService } from '../services/daoTreasuryService.js';
import type { TimePeriod } from '../types/daoTypes.js';

/**
 * DAO Treasury Controller
 * Handles HTTP requests for treasury-related endpoints
 */
export class DAOTreasuryController extends BaseController {
  constructor(private treasuryService: DAOTreasuryService) {
    super();
  }

  /**
   * GET /api/website/dao/treasury
   * Get current treasury snapshot
   */
  async getSnapshot(req: Request, res: Response): Promise<void> {
    return this.handleRequest(req, res, async () => {
      const snapshot = await this.treasuryService.getTreasurySnapshot();
      return this.ok(res, snapshot);
    });
  }

  /**
   * GET /api/website/dao/treasury/history
   * Get treasury historical data
   */
  async getHistory(req: Request, res: Response): Promise<void> {
    return this.handleRequest(req, res, async () => {
      const period = (req.query.period as TimePeriod) || '30d';

      // Validate period
      if (!['7d', '30d', '90d'].includes(period)) {
        return this.badRequest(res, 'Invalid period. Must be one of: 7d, 30d, 90d');
      }

      const history = await this.treasuryService.getTreasuryHistory(period);
      return this.ok(res, history);
    });
  }

  /**
   * GET /api/website/dao/treasury/breakdown
   * Get business breakdown
   */
  async getBusinessBreakdown(req: Request, res: Response): Promise<void> {
    return this.handleRequest(req, res, async () => {
      const breakdown = await this.treasuryService.getBusinessBreakdown();
      return this.ok(res, breakdown);
    });
  }

  /**
   * GET /api/website/dao/treasury/growth
   * Get treasury growth metrics
   */
  async getGrowthMetrics(req: Request, res: Response): Promise<void> {
    return this.handleRequest(req, res, async () => {
      const growth = await this.treasuryService.getGrowthMetrics();
      return this.ok(res, growth);
    });
  }
}
