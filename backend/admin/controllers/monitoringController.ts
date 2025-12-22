/**
 * Monitoring Controller
 *
 * Provides access to system monitoring data and metrics.
 */

import { Request, Response } from 'express';
import { BaseController } from '../../shared/controllers/BaseController.js';
import { PerformanceMonitor } from '../../shared/monitoring/PerformanceMonitor.js';
import { MetricsCollector } from '../../shared/monitoring/MetricsCollector.js';

/**
 * Monitoring Controller
 *
 * Exposes monitoring endpoints for administrators to view system health,
 * performance metrics, and slow operations.
 */
export class MonitoringController extends BaseController {
  private perfMonitor: PerformanceMonitor;
  private metricsCollector: MetricsCollector;

  constructor() {
    super('MonitoringController');
    this.perfMonitor = PerformanceMonitor.getInstance();
    this.metricsCollector = MetricsCollector.getInstance();
  }

  /**
   * Get current system metrics
   *
   * Returns comprehensive metrics including request rates, error rates,
   * response times, and top endpoints.
   *
   * GET /api/admin/monitoring/metrics
   *
   * @example
   * Response:
   * {
   *   "data": {
   *     "totalRequests": 1000,
   *     "requestsPerSecond": 10.5,
   *     "errorRate": 1.2,
   *     "avgResponseTime": 150,
   *     "p95ResponseTime": 450,
   *     "p99ResponseTime": 850
   *   }
   * }
   */
  async getMetrics(req: Request, res: Response): Promise<void> {
    try {
      const metrics = this.metricsCollector.getSystemMetrics();
      const resourceUsage = this.perfMonitor.getResourceUsage();

      this.ok(res, {
        ...metrics,
        endpointMetrics: Array.from(metrics.endpointMetrics.values()),
        resourceUsage,
      });
    } catch (error) {
      this.handleError(error, req, res);
    }
  }

  /**
   * Get slow operations
   *
   * Returns list of operations that exceeded performance thresholds.
   *
   * GET /api/admin/monitoring/slow-operations
   *
   * Query params:
   * - limit: Number of operations to return (default 50)
   *
   * @example
   * Response:
   * {
   *   "data": [
   *     {
   *       "operation": "Query: getProposals",
   *       "duration": 1500,
   *       "timestamp": "2024-01-01T12:00:00Z",
   *       "threshold": 1000
   *     }
   *   ]
   * }
   */
  async getSlowOperations(req: Request, res: Response): Promise<void> {
    try {
      const limit = this.getQueryParamAsNumber(req, 'limit', 50);
      const slowOps = this.perfMonitor.getSlowOperations(limit || 50);

      this.ok(res, slowOps);
    } catch (error) {
      this.handleError(error, req, res);
    }
  }

  /**
   * Get top endpoints by request count
   *
   * GET /api/admin/monitoring/top-endpoints
   *
   * Query params:
   * - limit: Number of endpoints to return (default 10)
   */
  async getTopEndpoints(req: Request, res: Response): Promise<void> {
    try {
      const limit = this.getQueryParamAsNumber(req, 'limit', 10);
      const topEndpoints = this.metricsCollector.getTopEndpoints(limit || 10);

      this.ok(res, topEndpoints);
    } catch (error) {
      this.handleError(error, req, res);
    }
  }

  /**
   * Get top error endpoints
   *
   * GET /api/admin/monitoring/top-errors
   *
   * Query params:
   * - limit: Number of endpoints to return (default 10)
   */
  async getTopErrors(req: Request, res: Response): Promise<void> {
    try {
      const limit = this.getQueryParamAsNumber(req, 'limit', 10);
      const topErrors = this.metricsCollector.getTopErrorEndpoints(limit || 10);

      this.ok(res, topErrors);
    } catch (error) {
      this.handleError(error, req, res);
    }
  }

  /**
   * Get slowest endpoints
   *
   * GET /api/admin/monitoring/slowest-endpoints
   *
   * Query params:
   * - limit: Number of endpoints to return (default 10)
   */
  async getSlowestEndpoints(req: Request, res: Response): Promise<void> {
    try {
      const limit = this.getQueryParamAsNumber(req, 'limit', 10);
      const slowest = this.metricsCollector.getSlowestEndpoints(limit || 10);

      this.ok(res, slowest);
    } catch (error) {
      this.handleError(error, req, res);
    }
  }

  /**
   * Get resource usage
   *
   * GET /api/admin/monitoring/resources
   */
  async getResourceUsage(req: Request, res: Response): Promise<void> {
    try {
      const usage = this.perfMonitor.getResourceUsage();
      const activeOps = this.perfMonitor.getActiveOperations();

      this.ok(res, {
        ...usage,
        activeOperations: activeOps.length,
        operations: activeOps,
      });
    } catch (error) {
      this.handleError(error, req, res);
    }
  }

  /**
   * Get performance thresholds
   *
   * GET /api/admin/monitoring/thresholds
   */
  async getThresholds(req: Request, res: Response): Promise<void> {
    try {
      const thresholds = this.perfMonitor.getThresholds();
      this.ok(res, thresholds);
    } catch (error) {
      this.handleError(error, req, res);
    }
  }

  /**
   * Update performance thresholds
   *
   * PUT /api/admin/monitoring/thresholds
   *
   * Body:
   * {
   *   "slowQueryMs": 1000,
   *   "slowRequestMs": 2000,
   *   "memoryWarningMb": 512,
   *   "memoryCriticalMb": 1024
   * }
   */
  async updateThresholds(req: Request, res: Response): Promise<void> {
    try {
      const thresholds = req.body;
      this.perfMonitor.updateThresholds(thresholds);

      this.ok(res, this.perfMonitor.getThresholds(), 'Thresholds updated successfully');
    } catch (error) {
      this.handleError(error, req, res);
    }
  }

  /**
   * Clear slow operations history
   *
   * DELETE /api/admin/monitoring/slow-operations
   */
  async clearSlowOperations(req: Request, res: Response): Promise<void> {
    try {
      this.perfMonitor.clearSlowOperations();
      this.ok(res, { cleared: true }, 'Slow operations history cleared');
    } catch (error) {
      this.handleError(error, req, res);
    }
  }
}
