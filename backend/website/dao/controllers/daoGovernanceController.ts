import { Request, Response } from 'express';
import { BaseController } from '../../../shared/controllers/BaseController.js';
import { DAOGovernanceService } from '../services/daoGovernanceService.js';

/**
 * DAO Governance Controller
 * Handles HTTP requests for governance-specific endpoints
 */
export class DAOGovernanceController extends BaseController {
  constructor(private governanceService: DAOGovernanceService) {
    super('DAOGovernanceController');
  }

  /**
   * GET /api/website/dao/governance/participation
   * Get participation metrics
   */
  async getParticipationMetrics(req: Request, res: Response): Promise<void> {
    try {
      const metrics = await this.governanceService.getParticipationMetrics();
      this.ok(res, metrics);
    } catch (error) {
      this.handleError(error, req, res);
    }
  }

  /**
   * GET /api/website/dao/governance/health
   * Get governance health status
   */
  async getHealthStatus(req: Request, res: Response): Promise<void> {
    try {
      const health = await this.governanceService.getHealthStatus();
      this.ok(res, health);
    } catch (error) {
      this.handleError(error, req, res);
    }
  }
}
