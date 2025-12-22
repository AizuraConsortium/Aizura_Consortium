/**
 * Monitoring Routes
 *
 * Admin routes for system monitoring and metrics
 */

import { Router } from 'express';
import { MonitoringController } from '../controllers/monitoringController.js';

const router = Router();
const controller = new MonitoringController();

/**
 * GET /api/admin/monitoring/metrics
 * Get current system metrics
 */
router.get('/metrics', (req, res) => controller.getMetrics(req, res));

/**
 * GET /api/admin/monitoring/slow-operations
 * Get slow operations history
 */
router.get('/slow-operations', (req, res) => controller.getSlowOperations(req, res));

/**
 * DELETE /api/admin/monitoring/slow-operations
 * Clear slow operations history
 */
router.delete('/slow-operations', (req, res) => controller.clearSlowOperations(req, res));

/**
 * GET /api/admin/monitoring/top-endpoints
 * Get top endpoints by request count
 */
router.get('/top-endpoints', (req, res) => controller.getTopEndpoints(req, res));

/**
 * GET /api/admin/monitoring/top-errors
 * Get endpoints with most errors
 */
router.get('/top-errors', (req, res) => controller.getTopErrors(req, res));

/**
 * GET /api/admin/monitoring/slowest-endpoints
 * Get slowest endpoints
 */
router.get('/slowest-endpoints', (req, res) => controller.getSlowestEndpoints(req, res));

/**
 * GET /api/admin/monitoring/resources
 * Get resource usage
 */
router.get('/resources', (req, res) => controller.getResourceUsage(req, res));

/**
 * GET /api/admin/monitoring/thresholds
 * Get performance thresholds
 */
router.get('/thresholds', (req, res) => controller.getThresholds(req, res));

/**
 * PUT /api/admin/monitoring/thresholds
 * Update performance thresholds
 */
router.put('/thresholds', (req, res) => controller.updateThresholds(req, res));

export default router;
