import { Router } from 'express';
import { DAORepository } from '../repositories/daoRepository.js';
import { DAOStatsService } from '../services/daoStatsService.js';
import { DAOTreasuryService } from '../services/daoTreasuryService.js';
import { DAOGovernanceService } from '../services/daoGovernanceService.js';
import { DAOStatsController } from '../controllers/daoStatsController.js';
import { DAOTreasuryController } from '../controllers/daoTreasuryController.js';
import { DAOGovernanceController } from '../controllers/daoGovernanceController.js';
import { daoCacheService } from '../services/daoCacheService.js';
import { requireRole } from '../../../shared/middleware/rbac.js';

/**
 * DAO Routes
 * Public routes for DAO portal (stats, treasury, governance)
 * No authentication required for read operations (full transparency)
 */

const router = Router();

// Initialize repository
const daoRepo = new DAORepository();

// Initialize services
const statsService = new DAOStatsService(daoRepo, daoCacheService);
const treasuryService = new DAOTreasuryService(daoRepo, daoCacheService);
const governanceService = new DAOGovernanceService(daoRepo, daoCacheService);

// Initialize controllers
const statsController = new DAOStatsController(statsService);
const treasuryController = new DAOTreasuryController(treasuryService);
const governanceController = new DAOGovernanceController(governanceService);

// ============================================================================
// PUBLIC ROUTES - DAO Statistics
// ============================================================================

/**
 * GET /api/website/dao/stats
 * Get current DAO statistics
 * Public endpoint - no auth required
 */
router.get('/stats', statsController.getStats.bind(statsController));

/**
 * GET /api/website/dao/trends
 * Get governance trends over time
 * Query params: period (7d, 30d, 90d)
 * Public endpoint - no auth required
 */
router.get('/trends', statsController.getTrends.bind(statsController));

/**
 * GET /api/website/dao/activity
 * Get recent DAO activity
 * Query params: limit (1-50, default 10)
 * Public endpoint - no auth required
 */
router.get('/activity', statsController.getActivity.bind(statsController));

// ============================================================================
// PUBLIC ROUTES - Treasury
// ============================================================================

/**
 * GET /api/website/dao/treasury
 * Get current treasury snapshot
 * Public endpoint - no auth required
 */
router.get('/treasury', treasuryController.getSnapshot.bind(treasuryController));

/**
 * GET /api/website/dao/treasury/history
 * Get treasury historical data
 * Query params: period (7d, 30d, 90d)
 * Public endpoint - no auth required
 */
router.get(
  '/treasury/history',
  treasuryController.getHistory.bind(treasuryController)
);

/**
 * GET /api/website/dao/treasury/breakdown
 * Get business-by-business breakdown
 * Public endpoint - no auth required
 */
router.get(
  '/treasury/breakdown',
  treasuryController.getBusinessBreakdown.bind(treasuryController)
);

/**
 * GET /api/website/dao/treasury/growth
 * Get treasury growth metrics
 * Public endpoint - no auth required
 */
router.get(
  '/treasury/growth',
  treasuryController.getGrowthMetrics.bind(treasuryController)
);

// ============================================================================
// PUBLIC ROUTES - Governance
// ============================================================================

/**
 * GET /api/website/dao/governance/participation
 * Get participation metrics
 * Public endpoint - no auth required
 */
router.get(
  '/governance/participation',
  governanceController.getParticipationMetrics.bind(governanceController)
);

/**
 * GET /api/website/dao/governance/health
 * Get governance health status
 * Public endpoint - no auth required
 */
router.get(
  '/governance/health',
  governanceController.getHealthStatus.bind(governanceController)
);

// ============================================================================
// ADMIN ROUTES - Maintenance & Debugging
// ============================================================================

/**
 * POST /api/website/dao/refresh
 * Manually refresh materialized views
 * Admin only
 */
router.post(
  '/refresh',
  requireRole(['admin', 'moderator']),
  statsController.refreshViews.bind(statsController)
);

/**
 * POST /api/website/dao/capture
 * Manually capture governance snapshot
 * Admin only
 */
router.post(
  '/capture',
  requireRole(['admin', 'moderator']),
  statsController.captureSnapshot.bind(statsController)
);

/**
 * GET /api/website/dao/cache/stats
 * Get cache statistics
 * Admin only
 */
router.get(
  '/cache/stats',
  requireRole(['admin']),
  statsController.getCacheStats.bind(statsController)
);

// ============================================================================
// EXPORTS
// ============================================================================

export default router;

// Export services for cache warming on startup
export { statsService, treasuryService, governanceService };
