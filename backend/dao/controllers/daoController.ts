import { Request, Response } from 'express';
import { BaseController } from '../../shared/controllers/BaseController.js';
import { DAOService } from '../services/daoService.js';

export class DAOController extends BaseController {
  private daoService: DAOService;

  constructor() {
    super('DAOController');
    this.daoService = new DAOService();
  }

  /**
   * GET /api/dao/stats
   * Get consolidated DAO statistics
   */
  async getStats(req: Request, res: Response): Promise<void> {
    try {
      const stats = await this.daoService.getDAOStats();
      this.ok(res, stats);
    } catch (error) {
      this.handleError(error, req, res);
    }
  }

  /**
   * GET /api/dao/treasury
   * Get detailed treasury breakdown
   */
  async getTreasury(req: Request, res: Response): Promise<void> {
    try {
      const treasury = await this.daoService.getTreasuryStats();
      this.ok(res, treasury);
    } catch (error) {
      this.handleError(error, req, res);
    }
  }

  /**
   * GET /api/dao/metrics/historical
   * Get historical metrics for charts
   * Query params: ?days=30 (default 30, max 365)
   */
  async getHistoricalMetrics(req: Request, res: Response): Promise<void> {
    try {
      const days = Math.min(parseInt(req.query.days as string) || 30, 365);
      const metrics = await this.daoService.getHistoricalMetrics(days);
      this.ok(res, metrics);
    } catch (error) {
      this.handleError(error, req, res);
    }
  }
}
