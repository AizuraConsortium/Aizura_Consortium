/**
 * Portfolio Routes (Client Module)
 *
 * Defines routes for portfolio operations with proper middleware chain.
 */

import { Router } from 'express';
import { portfolioController, PortfolioController } from '../controllers/portfolioController.js';
import { requireAuth } from '../../shared/middleware/auth.js';
import { requireRole } from '../../shared/middleware/rbac.js';
import { createRateLimit } from '../../shared/middleware/validation.js';

const router = Router();
const controller = portfolioController;

/**
 * Middleware Order (STANDARD):
 * 1. createRateLimit() - Rate limiting (always first)
 * 2. requireAuth - Verify authentication
 * 3. requireRole('client') - Verify authorization
 * 4. controller.method - Handle request
 */

/**
 * GET /api/client/portfolio
 * Get user's complete portfolio overview with all businesses and metrics
 */
router.get(
  '/',
  createRateLimit('GET:/api/client/portfolio'),
  requireAuth,
  requireRole('client'),
  controller.getUserPortfolio.bind(controller)
);

/**
 * GET /api/client/portfolio/businesses
 * Get all businesses with optional filtering
 * Query params: status, category, is_foundation, is_active, search, sort, order, limit, offset
 */
router.get(
  '/businesses',
  createRateLimit('GET:/api/client/portfolio/businesses'),
  requireAuth,
  requireRole('client'),
  controller.getBusinesses.bind(controller)
);

/**
 * GET /api/client/portfolio/businesses/foundation
 * Get foundation businesses (pre-seeded by Aizura)
 */
router.get(
  '/businesses/foundation',
  createRateLimit('GET:/api/client/portfolio/businesses/foundation'),
  requireAuth,
  requireRole('client'),
  controller.getFoundationBusinesses.bind(controller)
);

/**
 * GET /api/client/portfolio/businesses/live
 * Get live (operational) businesses
 */
router.get(
  '/businesses/live',
  createRateLimit('GET:/api/client/portfolio/businesses/live'),
  requireAuth,
  requireRole('client'),
  controller.getLiveBusinesses.bind(controller)
);

/**
 * GET /api/client/portfolio/businesses/top
 * Get top performing businesses by revenue
 * Query params: limit (default: 10)
 */
router.get(
  '/businesses/top',
  createRateLimit('GET:/api/client/portfolio/businesses/top'),
  requireAuth,
  requireRole('client'),
  controller.getTopPerformingBusinesses.bind(controller)
);

/**
 * GET /api/client/portfolio/businesses/search
 * Search businesses by name or description
 * Query params: q (required, min 2 characters)
 */
router.get(
  '/businesses/search',
  createRateLimit('GET:/api/client/portfolio/businesses/search'),
  requireAuth,
  requireRole('client'),
  controller.searchBusinesses.bind(controller)
);

/**
 * GET /api/client/portfolio/businesses/slug/:slug
 * Get a business by slug with metrics
 */
router.get(
  '/businesses/slug/:slug',
  createRateLimit('GET:/api/client/portfolio/businesses/slug/:slug'),
  requireAuth,
  requireRole('client'),
  controller.getBusinessBySlug.bind(controller)
);

/**
 * GET /api/client/portfolio/businesses/:id
 * Get a specific business by ID with performance and exposure data
 */
router.get(
  '/businesses/:id',
  createRateLimit('GET:/api/client/portfolio/businesses/:id'),
  requireAuth,
  requireRole('client'),
  controller.getBusinessById.bind(controller)
);

/**
 * GET /api/client/portfolio/businesses/:id/performance
 * Get business performance statistics
 */
router.get(
  '/businesses/:id/performance',
  createRateLimit('GET:/api/client/portfolio/businesses/:id/performance'),
  requireAuth,
  requireRole('client'),
  controller.getBusinessPerformance.bind(controller)
);

/**
 * GET /api/client/portfolio/businesses/:id/exposure
 * Get user's exposure to a specific business
 */
router.get(
  '/businesses/:id/exposure',
  createRateLimit('GET:/api/client/portfolio/businesses/:id/exposure'),
  requireAuth,
  requireRole('client'),
  controller.getBusinessExposure.bind(controller)
);

/**
 * GET /api/client/portfolio/businesses/:id/metrics
 * Get metrics time-series for a business
 * Query params: metric_type (required: revenue|users|transactions|api_calls), start_date, end_date
 */
router.get(
  '/businesses/:id/metrics',
  createRateLimit('GET:/api/client/portfolio/businesses/:id/metrics'),
  requireAuth,
  requireRole('client'),
  controller.getBusinessMetrics.bind(controller)
);

export default router;
