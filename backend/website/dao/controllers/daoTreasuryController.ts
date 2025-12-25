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
    super('DAOTreasuryController');
  }

  /**
   * GET /api/website/dao/treasury
   * Get current treasury snapshot
   */
  async getSnapshot(req: Request, res: Response): Promise<void> {
    try {
      const snapshot = await this.treasuryService.getTreasurySnapshot();
      this.ok(res, snapshot);
    } catch (error) {
      this.handleError(error, req, res);
    }
  }

  /**
   * GET /api/website/dao/treasury/history
   * Get treasury historical data
   */
  async getHistory(req: Request, res: Response): Promise<void> {
    try {
      const period = (req.query.period as TimePeriod) || '30d';

      if (!['7d', '30d', '90d'].includes(period)) {
        return this.badRequest(res, 'Invalid period. Must be one of: 7d, 30d, 90d');
      }

      const history = await this.treasuryService.getTreasuryHistory(period);
      this.ok(res, history);
    } catch (error) {
      this.handleError(error, req, res);
    }
  }

  /**
   * GET /api/website/dao/treasury/breakdown
   * Get business breakdown
   */
  async getBusinessBreakdown(req: Request, res: Response): Promise<void> {
    try {
      const breakdown = await this.treasuryService.getBusinessBreakdown();
      this.ok(res, breakdown);
    } catch (error) {
      this.handleError(error, req, res);
    }
  }

  /**
   * GET /api/website/dao/treasury/growth
   * Get treasury growth metrics
   */
  async getGrowthMetrics(req: Request, res: Response): Promise<void> {
    try {
      const growth = await this.treasuryService.getGrowthMetrics();
      this.ok(res, growth);
    } catch (error) {
      this.handleError(error, req, res);
    }
  }
}
