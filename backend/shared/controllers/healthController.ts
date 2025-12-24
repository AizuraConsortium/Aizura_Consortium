import type { Request, Response } from 'express';
import type { Orchestrator } from '../orchestrator/Orchestrator.js';
import { ErrorLogger } from '../services/errorLogger.js';

/**
 * Controller for handling health check requests
 */
export class HealthController {
  private orchestrator: Orchestrator | null = null;
  private errorLogger: ErrorLogger;

  constructor() {
    this.errorLogger = ErrorLogger.getInstance();
  }

  /**
   * Sets the orchestrator instance for health checks
   * @param orchestrator - The orchestrator instance to use
   */
  setOrchestrator(orchestrator: Orchestrator): void {
    this.orchestrator = orchestrator;
  }

  /**
   * Checks overall system health including database connectivity
   * @param req - Express request object
   * @param res - Express response object
   */
  async checkHealth(req: Request, res: Response): Promise<void> {
    try {
      const { SupabaseService } = await import('../services/supabase/SupabaseService.js');
      const supabase = SupabaseService.getInstance();
      const dbHealth = await supabase.healthCheck();

      if (!dbHealth.healthy) {
        await this.errorLogger.logBackendError(
          'HEALTH_CHECK_DATABASE_UNHEALTHY',
          'Database health check failed',
          {
            requestPath: req.path,
            requestMethod: req.method,
            metadata: { dbHealth }
          }
        );

        res.status(503).json({
          status: 'unhealthy',
          database: dbHealth,
          timestamp: new Date().toISOString()
        });
        return;
      }

      res.json({
        status: 'ok',
        database: { healthy: true },
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      const stackTrace = error instanceof Error ? error.stack : undefined;

      await this.errorLogger.logBackendError(
        'HEALTH_CHECK_ERROR',
        `Health check failed: ${errorMessage}`,
        {
          requestPath: req.path,
          requestMethod: req.method,
          stackTrace
        }
      );

      res.status(503).json({
        status: 'error',
        error: errorMessage,
        timestamp: new Date().toISOString()
      });
    }
  }

  /**
   * Checks orchestrator health and leadership status
   * @param req - Express request object
   * @param res - Express response object
   */
  async checkOrchestratorHealth(req: Request, res: Response): Promise<void> {
    try {
      if (!this.orchestrator) {
        res.json({
          status: 'not_initialized',
          isLeader: false,
          instanceId: null,
          lockStatus: null,
          timestamp: new Date().toISOString()
        });
        return;
      }

      const leadershipStatus = this.orchestrator.getLeadershipStatus();
      const lockStatus = await this.orchestrator.getLockStatus();

      res.json({
        status: 'ok',
        isLeader: leadershipStatus.isLeader,
        instanceId: leadershipStatus.instanceId,
        lockStatus: lockStatus,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      const stackTrace = error instanceof Error ? error.stack : undefined;

      await this.errorLogger.logBackendError(
        'ORCHESTRATOR_HEALTH_CHECK_ERROR',
        `Orchestrator health check failed: ${errorMessage}`,
        {
          requestPath: req.path,
          requestMethod: req.method,
          stackTrace
        }
      );

      res.status(500).json({
        status: 'error',
        error: errorMessage,
        timestamp: new Date().toISOString()
      });
    }
  }
}
