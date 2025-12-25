/**
 * Business Routes (Admin Module)
 *
 * Defines routes for admin business management operations.
 * All routes require admin authentication.
 */

import { Router } from 'express';
import { businessController, BusinessController } from '../controllers/businessController.js';
import { requireAuth } from '../../shared/middleware/auth.js';
import { requireRole } from '../../shared/middleware/rbac.js';
import { createRateLimit } from '../../shared/middleware/validation.js';
import { adminActionLogger } from '../../shared/middleware/adminActionLogger.js';

const router = Router();
const controller = businessController;

/**
 * Middleware Order (ADMIN STANDARD):
 * 1. createRateLimit() - Rate limiting
 * 2. requireAuth - Verify authentication
 * 3. requireRole('admin') - Verify admin authorization
 * 4. adminActionLogger - Log admin actions
 * 5. controller.method - Handle request
 */

/**
 * GET /api/admin/businesses
 * Get all businesses with performance data
 */
router.get(
  '/',
  createRateLimit('GET:/api/admin/businesses'),
  requireAuth,
  requireRole('admin'),
  controller.getAllBusinesses.bind(controller)
);

/**
 * GET /api/admin/businesses/performance
 * Get aggregated performance stats for all businesses
 */
router.get(
  '/performance',
  createRateLimit('GET:/api/admin/businesses/performance'),
  requireAuth,
  requireRole('admin'),
  controller.getAllBusinessPerformance.bind(controller)
);

/**
 * POST /api/admin/businesses/refresh-views
 * Manually refresh portfolio materialized views
 */
router.post(
  '/refresh-views',
  createRateLimit('POST:/api/admin/businesses/refresh-views'),
  requireAuth,
  requireRole('admin'),
  adminActionLogger('refresh_portfolio_views'),
  controller.refreshPortfolioViews.bind(controller)
);

/**
 * GET /api/admin/businesses/:id
 * Get business by ID with full details
 */
router.get(
  '/:id',
  createRateLimit('GET:/api/admin/businesses/:id'),
  requireAuth,
  requireRole('admin'),
  controller.getBusinessById.bind(controller)
);

/**
 * PATCH /api/admin/businesses/:id
 * Update business information
 */
router.patch(
  '/:id',
  createRateLimit('PATCH:/api/admin/businesses/:id'),
  requireAuth,
  requireRole('admin'),
  adminActionLogger('update_business'),
  controller.updateBusiness.bind(controller)
);

/**
 * GET /api/admin/businesses/:id/metrics
 * Get all metrics for a business
 */
router.get(
  '/:id/metrics',
  createRateLimit('GET:/api/admin/businesses/:id/metrics'),
  requireAuth,
  requireRole('admin'),
  controller.getBusinessMetrics.bind(controller)
);

/**
 * POST /api/admin/businesses/:id/metrics
 * Create a new metric for a business
 */
router.post(
  '/:id/metrics',
  createRateLimit('POST:/api/admin/businesses/:id/metrics'),
  requireAuth,
  requireRole('admin'),
  adminActionLogger('create_business_metric'),
  controller.createMetric.bind(controller)
);

/**
 * POST /api/admin/businesses/:id/metrics/bulk
 * Create multiple metrics in bulk
 */
router.post(
  '/:id/metrics/bulk',
  createRateLimit('POST:/api/admin/businesses/:id/metrics/bulk'),
  requireAuth,
  requireRole('admin'),
  adminActionLogger('create_business_metrics_bulk'),
  controller.createMetricsBulk.bind(controller)
);

/**
 * DELETE /api/admin/businesses/metrics/:metricId
 * Delete a specific metric
 */
router.delete(
  '/metrics/:metricId',
  createRateLimit('DELETE:/api/admin/businesses/metrics/:metricId'),
  requireAuth,
  requireRole('admin'),
  adminActionLogger('delete_business_metric'),
  controller.deleteMetric.bind(controller)
);

export default router;
