/**
 * News Routes (Client Module)
 *
 * Defines routes for news operations with proper middleware chain.
 * Public endpoints (no authentication required for reading news).
 * Follows pattern from portfolioRoutes.ts
 */

import { Router } from 'express';
import { newsController } from '../controllers/newsController.js';
import { createRateLimit } from '../../shared/middleware/validation.js';

const router = Router();
const controller = newsController;

/**
 * Middleware Order:
 * 1. createRateLimit() - Rate limiting (prevent abuse)
 * 2. controller.method - Handle request
 *
 * Note: No authentication required for public news reading
 */

/**
 * GET /api/client/news
 * Get latest news articles (compact format for dashboard)
 * Public endpoint - Rate limited to prevent abuse
 */
router.get(
  '/',
  createRateLimit('GET:/api/client/news'),
  controller.getLatestNews.bind(controller)
);

/**
 * GET /api/client/news/all
 * Get all published articles with filtering and pagination
 * Public endpoint - Rate limited
 */
router.get(
  '/all',
  createRateLimit('GET:/api/client/news/all'),
  controller.getAllNews.bind(controller)
);

/**
 * GET /api/client/news/featured
 * Get featured articles
 * Public endpoint - Rate limited
 */
router.get(
  '/featured',
  createRateLimit('GET:/api/client/news/featured'),
  controller.getFeaturedArticles.bind(controller)
);

/**
 * GET /api/client/news/slug/:slug
 * Get specific article by slug
 * Public endpoint - Rate limited
 */
router.get(
  '/slug/:slug',
  createRateLimit('GET:/api/client/news/slug/:slug'),
  controller.getArticleBySlug.bind(controller)
);

/**
 * GET /api/client/news/:id
 * Get specific article by ID
 * Public endpoint - Rate limited
 */
router.get(
  '/:id',
  createRateLimit('GET:/api/client/news/:id'),
  controller.getArticleById.bind(controller)
);

export default router;
