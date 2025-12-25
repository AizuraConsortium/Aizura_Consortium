/**
 * Portfolio Controller (Client Module)
 *
 * Pure request/response handler for client portfolio operations.
 * Delegates all business logic to the service layer.
 * Authentication is handled by middleware.
 */

import { Request, Response } from 'express';
import { portfolioService, PortfolioService } from '../services/portfolioService.js';

export class PortfolioController {
  private portfolioService: PortfolioService;

  constructor(service?: PortfolioService) {
    this.portfolioService = service || portfolioService;
  }

  /**
   * GET /api/client/portfolio
   * Get user's complete portfolio overview
   * Auth validated by middleware - req.user.id is guaranteed
   */
  async getUserPortfolio(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user!.id;

      const portfolio = await this.portfolioService.getUserPortfolio(userId);

      res.json({
        portfolio,
        last_refreshed: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Error fetching user portfolio:', error);
      res.status(500).json({
        error: 'Failed to fetch portfolio',
        message: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  /**
   * GET /api/client/businesses
   * Get all businesses with optional filtering
   * Auth validated by middleware
   */
  async getBusinesses(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user!.id;

      const filters = {
        status: req.query.status as any,
        category: req.query.category as any,
        is_foundation: req.query.is_foundation === 'true' ? true : req.query.is_foundation === 'false' ? false : undefined,
        is_active: req.query.is_active === 'true' ? true : req.query.is_active === 'false' ? false : undefined,
        search: req.query.search as string | undefined,
        sort: req.query.sort as any,
        order: req.query.order as 'asc' | 'desc' | undefined,
        limit: req.query.limit ? parseInt(req.query.limit as string, 10) : undefined,
        offset: req.query.offset ? parseInt(req.query.offset as string, 10) : undefined,
      };

      const businesses = await this.portfolioService.getBusinesses(userId, filters);

      res.json({
        businesses,
        total: businesses.length,
        filters,
      });
    } catch (error) {
      console.error('Error fetching businesses:', error);
      res.status(500).json({
        error: 'Failed to fetch businesses',
        message: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  /**
   * GET /api/client/businesses/:id
   * Get a specific business by ID with metrics
   * Auth validated by middleware
   */
  async getBusinessById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const userId = req.user!.id;

      const business = await this.portfolioService.getBusinessById(id, userId);

      if (!business) {
        res.status(404).json({ error: 'Business not found' });
        return;
      }

      res.json(business);
    } catch (error) {
      console.error('Error fetching business by ID:', error);
      res.status(500).json({
        error: 'Failed to fetch business',
        message: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  /**
   * GET /api/client/businesses/slug/:slug
   * Get a business by slug with metrics
   * Auth validated by middleware
   */
  async getBusinessBySlug(req: Request, res: Response): Promise<void> {
    try {
      const { slug } = req.params;
      const userId = req.user!.id;

      const business = await this.portfolioService.getBusinessBySlug(slug, userId);

      if (!business) {
        res.status(404).json({ error: 'Business not found' });
        return;
      }

      res.json(business);
    } catch (error) {
      console.error('Error fetching business by slug:', error);
      res.status(500).json({
        error: 'Failed to fetch business',
        message: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  /**
   * GET /api/client/businesses/:id/exposure
   * Get user's exposure to a specific business
   * Auth validated by middleware
   */
  async getBusinessExposure(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const userId = req.user!.id;

      const exposure = await this.portfolioService.getUserExposure(userId, id);

      if (!exposure) {
        res.status(404).json({ error: 'No exposure data found for this business' });
        return;
      }

      res.json(exposure);
    } catch (error) {
      console.error('Error fetching business exposure:', error);
      res.status(500).json({
        error: 'Failed to fetch business exposure',
        message: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  /**
   * GET /api/client/businesses/:id/metrics
   * Get metrics time-series for a business
   * Auth validated by middleware
   */
  async getBusinessMetrics(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const metricType = req.query.metric_type as string;
      const startDate = req.query.start_date as string | undefined;
      const endDate = req.query.end_date as string | undefined;

      if (!metricType) {
        res.status(400).json({ error: 'metric_type query parameter is required' });
        return;
      }

      if (!['revenue', 'users', 'transactions', 'api_calls'].includes(metricType)) {
        res.status(400).json({ error: 'Invalid metric_type. Must be: revenue, users, transactions, or api_calls' });
        return;
      }

      const metrics = await this.portfolioService.getBusinessMetricsTimeSeries(
        id,
        metricType as any,
        startDate,
        endDate
      );

      res.json(metrics);
    } catch (error) {
      console.error('Error fetching business metrics:', error);
      res.status(500).json({
        error: 'Failed to fetch business metrics',
        message: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  /**
   * GET /api/client/businesses/:id/performance
   * Get business performance statistics
   * Auth validated by middleware
   */
  async getBusinessPerformance(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      const performance = await this.portfolioService.getBusinessPerformance(id);

      if (!performance) {
        res.status(404).json({ error: 'Business performance data not found' });
        return;
      }

      res.json(performance);
    } catch (error) {
      console.error('Error fetching business performance:', error);
      res.status(500).json({
        error: 'Failed to fetch business performance',
        message: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  /**
   * GET /api/client/businesses/foundation
   * Get foundation businesses
   * Auth validated by middleware
   */
  async getFoundationBusinesses(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user!.id;

      const businesses = await this.portfolioService.getFoundationBusinesses(userId);

      res.json({
        businesses,
        total: businesses.length,
      });
    } catch (error) {
      console.error('Error fetching foundation businesses:', error);
      res.status(500).json({
        error: 'Failed to fetch foundation businesses',
        message: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  /**
   * GET /api/client/businesses/live
   * Get live businesses
   * Auth validated by middleware
   */
  async getLiveBusinesses(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user!.id;

      const businesses = await this.portfolioService.getLiveBusinesses(userId);

      res.json({
        businesses,
        total: businesses.length,
      });
    } catch (error) {
      console.error('Error fetching live businesses:', error);
      res.status(500).json({
        error: 'Failed to fetch live businesses',
        message: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  /**
   * GET /api/client/businesses/search
   * Search businesses by name or description
   * Auth validated by middleware
   */
  async searchBusinesses(req: Request, res: Response): Promise<void> {
    try {
      const query = req.query.q as string;
      const userId = req.user!.id;

      if (!query || query.trim().length < 2) {
        res.status(400).json({ error: 'Search query must be at least 2 characters' });
        return;
      }

      const businesses = await this.portfolioService.searchBusinesses(query, userId);

      res.json({
        businesses,
        total: businesses.length,
        query,
      });
    } catch (error) {
      console.error('Error searching businesses:', error);
      res.status(500).json({
        error: 'Failed to search businesses',
        message: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  /**
   * GET /api/client/businesses/top
   * Get top performing businesses
   * Auth validated by middleware
   */
  async getTopPerformingBusinesses(req: Request, res: Response): Promise<void> {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 10;
      const userId = req.user!.id;

      const businesses = await this.portfolioService.getTopPerformingBusinesses(limit, userId);

      res.json({
        businesses,
        total: businesses.length,
      });
    } catch (error) {
      console.error('Error fetching top performing businesses:', error);
      res.status(500).json({
        error: 'Failed to fetch top performing businesses',
        message: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }
}

export const portfolioController = new PortfolioController();
