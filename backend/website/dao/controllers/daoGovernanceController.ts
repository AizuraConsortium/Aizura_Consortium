import { Request, Response } from 'express';
import { BaseController } from '../../../shared/controllers/BaseController.js';
import { DAOGovernanceService } from '../services/daoGovernanceService.js';

/**
 * DAO Governance Controller
 * Handles HTTP requests for governance-specific endpoints
 */
export class DAOGovernanceController extends BaseController {
  constructor(private governanceService: DAOGovernanceService) {
    super();
  }

  /**
   * GET /api/website/dao/governance/participation
   * Get participation metrics
   */
  async getParticipationMetrics(req: Request, res: Response): Promise<void> {
    return this.handleRequest(req, res, async () => {
      const metrics = await this.governanceService.getParticipationMetrics();
      return this.ok(res, metrics);
    });
  }

  /**
   * GET /api/website/dao/governance/health
   * Get governance health status
   */
  async getHealthStatus(req: Request, res: Response): Promise<void> {
    return this.handleRequest(req, res, async () => {
      const health = await this.governanceService.getHealthStatus();
      return this.ok(res, health);
    });
  }
}
