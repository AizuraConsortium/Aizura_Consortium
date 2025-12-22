/**
 * Health Probe Controller
 *
 * Provides Kubernetes health check endpoints (readiness and liveness probes).
 */

import { Request, Response } from 'express';
import { BaseController } from './BaseController.js';
import { HealthCheckService } from '../services/healthCheckService.js';

/**
 * Health Probe Controller
 *
 * Provides endpoints for Kubernetes health probes.
 * These endpoints should not require authentication.
 */
export class HealthProbeController extends BaseController {
  private healthCheckService: HealthCheckService;

  constructor() {
    super('HealthProbeController');
    this.healthCheckService = HealthCheckService.getInstance();
  }

  /**
   * Comprehensive health check
   *
   * GET /health
   *
   * Returns detailed health information about all system dependencies.
   * Use this for monitoring and dashboards.
   *
   * @example
   * Response 200:
   * {
   *   "status": "healthy",
   *   "uptime": 3600,
   *   "dependencies": {
   *     "database": { "status": "healthy", "responseTime": 50 },
   *     "fileSystem": { "status": "healthy" },
   *     "memory": { "status": "healthy" }
   *   }
   * }
   */
  async getHealth(req: Request, res: Response): Promise<void> {
    try {
      const health = await this.healthCheckService.checkHealth();

      // Return 503 if unhealthy
      const statusCode = health.status === 'unhealthy' ? 503 : 200;

      res.status(statusCode).json(health);
    } catch (error) {
      this.serverError(res, 'Health check failed');
    }
  }

  /**
   * Readiness probe
   *
   * GET /health/ready
   *
   * Kubernetes readiness probe endpoint.
   * Returns 200 if ready to serve traffic, 503 if not ready.
   *
   * Use this to determine if the service should receive traffic.
   *
   * @example
   * Response 200: { "ready": true }
   * Response 503: { "ready": false, "reason": "Database not connected" }
   */
  async getReadiness(req: Request, res: Response): Promise<void> {
    try {
      const readiness = await this.healthCheckService.checkReadiness();

      if (readiness.ready) {
        res.status(200).json(readiness);
      } else {
        res.status(503).json(readiness);
      }
    } catch (error) {
      res.status(503).json({
        ready: false,
        reason: error instanceof Error ? error.message : 'Unknown error',
        checks: {
          database: false,
          dependencies: false,
        },
      });
    }
  }

  /**
   * Liveness probe
   *
   * GET /health/live
   *
   * Kubernetes liveness probe endpoint.
   * Returns 200 if process is alive and responsive.
   *
   * Use this to determine if the container should be restarted.
   *
   * @example
   * Response 200: { "alive": true }
   */
  async getLiveness(req: Request, res: Response): Promise<void> {
    try {
      const alive = await this.healthCheckService.checkLiveness();

      if (alive) {
        res.status(200).json({ alive: true, timestamp: new Date().toISOString() });
      } else {
        res.status(503).json({ alive: false, timestamp: new Date().toISOString() });
      }
    } catch (error) {
      res.status(503).json({
        alive: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString(),
      });
    }
  }

  /**
   * Simple ping endpoint
   *
   * GET /health/ping
   *
   * Simple endpoint that always returns 200.
   * Use for basic connectivity tests.
   */
  async ping(req: Request, res: Response): Promise<void> {
    res.status(200).json({
      pong: true,
      timestamp: new Date().toISOString(),
    });
  }
}
