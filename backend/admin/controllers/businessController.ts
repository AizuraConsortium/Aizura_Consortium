/**
 * Business Controller (Admin Module)
 *
 * Handles admin operations for managing businesses and metrics.
 * All operations require admin authentication.
 */

import { Request, Response } from 'express';
import { portfolioRepository } from '../../shared/services/supabase/repositories/portfolio.js';
import { businessMetricsRepository } from '../../shared/services/supabase/repositories/businessMetrics.js';
import type { UpdateBusinessPayload, CreateBusinessMetricPayload } from '../../../shared/types/portfolio.js';

export class BusinessController {
  /**
   * GET /api/admin/businesses
   * Get all businesses with performance data
   * Admin only
   */
  async getAllBusinesses(req: Request, res: Response): Promise<void> {
    try {
      const filters = {
        status: req.query.status as string | undefined,
        category: req.query.category as string | undefined,
        is_foundation: req.query.is_foundation === 'true' ? true : req.query.is_foundation === 'false' ? false : undefined,
        is_active: req.query.is_active === 'true' ? true : req.query.is_active === 'false' ? false : undefined,
        search: req.query.search as string | undefined,
        sort: req.query.sort as string | undefined,
        order: req.query.order as 'asc' | 'desc' | undefined,
        limit: req.query.limit ? parseInt(req.query.limit as string, 10) : undefined,
        offset: req.query.offset ? parseInt(req.query.offset as string, 10) : undefined,
      };

      const businesses = await portfolioRepository.getBusinesses(filters);
      const performances = await portfolioRepository.getAllBusinessPerformance(filters);

      res.json({
        businesses,
        performances,
        total: businesses.length,
        filters,
      });
    } catch (error) {
      console.error('Error fetching all businesses:', error);
      res.status(500).json({
        error: 'Failed to fetch businesses',
        message: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  /**
   * GET /api/admin/businesses/:id
   * Get business by ID with full details
   * Admin only
   */
  async getBusinessById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      const business = await portfolioRepository.getBusinessById(id);

      if (!business) {
        res.status(404).json({ error: 'Business not found' });
        return;
      }

      const performance = await portfolioRepository.getBusinessPerformance(id);
      const metrics = await businessMetricsRepository.getBusinessMetrics(id);

      res.json({
        business,
        performance,
        metrics,
      });
    } catch (error) {
      console.error('Error fetching business by ID:', error);
      res.status(500).json({
        error: 'Failed to fetch business',
        message: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  /**
   * PATCH /api/admin/businesses/:id
   * Update business information
   * Admin only
   */
  async updateBusiness(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const updates: UpdateBusinessPayload = req.body;

      if (!updates || Object.keys(updates).length === 0) {
        res.status(400).json({ error: 'No update data provided' });
        return;
      }

      const business = await portfolioRepository.updateBusiness(id, updates);

      res.json({
        business,
        message: 'Business updated successfully',
      });
    } catch (error) {
      console.error('Error updating business:', error);
      res.status(500).json({
        error: 'Failed to update business',
        message: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  /**
   * POST /api/admin/businesses/:id/metrics
   * Create a new metric for a business
   * Admin only
   */
  async createMetric(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const payload: CreateBusinessMetricPayload = {
        business_id: id,
        ...req.body,
      };

      const metric = await businessMetricsRepository.createMetric(payload);

      res.status(201).json({
        metric,
        message: 'Metric created successfully',
      });
    } catch (error) {
      console.error('Error creating metric:', error);
      res.status(500).json({
        error: 'Failed to create metric',
        message: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  /**
   * POST /api/admin/businesses/:id/metrics/bulk
   * Create multiple metrics in bulk
   * Admin only
   */
  async createMetricsBulk(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { metrics } = req.body;

      if (!Array.isArray(metrics) || metrics.length === 0) {
        res.status(400).json({ error: 'Metrics array is required and must not be empty' });
        return;
      }

      const payloads: CreateBusinessMetricPayload[] = metrics.map(m => ({
        business_id: id,
        ...m,
      }));

      const createdMetrics = await businessMetricsRepository.createMetricsBulk(payloads);

      res.status(201).json({
        metrics: createdMetrics,
        count: createdMetrics.length,
        message: `${createdMetrics.length} metrics created successfully`,
      });
    } catch (error) {
      console.error('Error creating metrics in bulk:', error);
      res.status(500).json({
        error: 'Failed to create metrics',
        message: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  /**
   * GET /api/admin/businesses/:id/metrics
   * Get all metrics for a business
   * Admin only
   */
  async getBusinessMetrics(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      const filters = {
        business_id: id,
        metric_type: req.query.metric_type as string | undefined,
        start_date: req.query.start_date as string | undefined,
        end_date: req.query.end_date as string | undefined,
        limit: req.query.limit ? parseInt(req.query.limit as string, 10) : undefined,
        offset: req.query.offset ? parseInt(req.query.offset as string, 10) : undefined,
      };

      const metrics = await businessMetricsRepository.getBusinessMetrics(id, filters);

      res.json({
        metrics,
        total: metrics.length,
        filters,
      });
    } catch (error) {
      console.error('Error fetching business metrics:', error);
      res.status(500).json({
        error: 'Failed to fetch metrics',
        message: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  /**
   * DELETE /api/admin/businesses/metrics/:metricId
   * Delete a specific metric
   * Admin only
   */
  async deleteMetric(req: Request, res: Response): Promise<void> {
    try {
      const { metricId } = req.params;

      await businessMetricsRepository.deleteMetric(metricId);

      res.json({
        message: 'Metric deleted successfully',
      });
    } catch (error) {
      console.error('Error deleting metric:', error);
      res.status(500).json({
        error: 'Failed to delete metric',
        message: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  /**
   * POST /api/admin/businesses/refresh-views
   * Manually refresh portfolio materialized views
   * Admin only
   */
  async refreshPortfolioViews(req: Request, res: Response): Promise<void> {
    try {
      await portfolioRepository.refreshPortfolioViews();

      res.json({
        message: 'Portfolio views refreshed successfully',
        refreshed_at: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Error refreshing portfolio views:', error);
      res.status(500).json({
        error: 'Failed to refresh views',
        message: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  /**
   * GET /api/admin/businesses/performance
   * Get aggregated performance stats for all businesses
   * Admin only
   */
  async getAllBusinessPerformance(req: Request, res: Response): Promise<void> {
    try {
      const filters = {
        status: req.query.status as string | undefined,
        category: req.query.category as string | undefined,
        is_foundation: req.query.is_foundation === 'true' ? true : req.query.is_foundation === 'false' ? false : undefined,
        sort: req.query.sort as string | undefined,
        order: req.query.order as 'asc' | 'desc' | undefined,
        limit: req.query.limit ? parseInt(req.query.limit as string, 10) : undefined,
      };

      const performances = await portfolioRepository.getAllBusinessPerformance(filters);

      const summary = {
        total_businesses: performances.length,
        total_revenue: performances.reduce((sum, p) => sum + Number(p.total_revenue), 0),
        total_users: performances.reduce((sum, p) => sum + Number(p.current_users), 0),
        live_count: performances.filter(p => p.status === 'live').length,
        development_count: performances.filter(p => p.status === 'development').length,
        planning_count: performances.filter(p => p.status === 'planning').length,
      };

      res.json({
        performances,
        summary,
        filters,
      });
    } catch (error) {
      console.error('Error fetching business performance:', error);
      res.status(500).json({
        error: 'Failed to fetch performance data',
        message: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }
}

export const businessController = new BusinessController();
