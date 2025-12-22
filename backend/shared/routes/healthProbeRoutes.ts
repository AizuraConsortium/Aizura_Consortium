/**
 * Health Probe Routes
 *
 * Kubernetes health check endpoints (no authentication required)
 */

import { Router } from 'express';
import { HealthProbeController } from '../controllers/healthProbeController.js';

const router = Router();
const controller = new HealthProbeController();

/**
 * GET /health
 * Comprehensive health check
 */
router.get('/', (req, res) => controller.getHealth(req, res));

/**
 * GET /health/ready
 * Readiness probe (for Kubernetes)
 */
router.get('/ready', (req, res) => controller.getReadiness(req, res));

/**
 * GET /health/live
 * Liveness probe (for Kubernetes)
 */
router.get('/live', (req, res) => controller.getLiveness(req, res));

/**
 * GET /health/ping
 * Simple ping endpoint
 */
router.get('/ping', (req, res) => controller.ping(req, res));

export default router;
