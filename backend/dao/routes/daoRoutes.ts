import { Router } from 'express';
import { DAOController } from '../controllers/daoController.js';
import { createRateLimit } from '../../shared/middleware/validation.js';

const router = Router();
const daoController = new DAOController();

/**
 * Public DAO statistics endpoints
 * No authentication required - public transparency
 * Rate limited to prevent abuse
 */

/**
 * GET /api/dao/stats
 * Get consolidated DAO statistics
 * Response: DAOStats object
 */
router.get(
  '/stats',
  createRateLimit('GET:/api/dao/stats'),
  daoController.getStats.bind(daoController)
);

/**
 * GET /api/dao/treasury
 * Get detailed treasury breakdown with per-business metrics
 * Response: TreasuryStats object
 */
router.get(
  '/treasury',
  createRateLimit('GET:/api/dao/treasury'),
  daoController.getTreasury.bind(daoController)
);

/**
 * GET /api/dao/metrics/historical
 * Get historical metrics for trend charts
 * Query: ?days=30 (default 30, max 365)
 * Response: HistoricalMetrics object
 */
router.get(
  '/metrics/historical',
  createRateLimit('GET:/api/dao/metrics/historical'),
  daoController.getHistoricalMetrics.bind(daoController)
);

export default router;
