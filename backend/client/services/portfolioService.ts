/**
 * Portfolio Service (Client Module)
 *
 * Business logic layer for client portfolio operations.
 * Validates business rules, calculates exposure metrics, and delegates to repositories.
 */

import { portfolioRepository } from '../../shared/services/supabase/repositories/portfolio.js';
import { businessMetricsRepository } from '../../shared/services/supabase/repositories/businessMetrics.js';
import type {
  Business,
  BusinessWithMetrics,
  BusinessPerformance,
  UserExposure,
  PortfolioOverview,
  BusinessFilters,
  MetricType,
  BusinessMetricsTimeSeries,
} from '../../../shared/types/portfolio.js';

/**
 * Service for managing client portfolio operations with business logic
 */
export class PortfolioService {
  /**
   * Get user's complete portfolio overview
   *
   * @param userId - The user ID
   * @returns Complete portfolio overview with businesses and metrics
   */
  async getUserPortfolio(userId: string): Promise<PortfolioOverview> {
    if (!userId) {
      throw new Error('User ID is required');
    }

    return portfolioRepository.getUserPortfolio(userId);
  }

  /**
   * Get all businesses with performance and user exposure data
   *
   * @param userId - Optional user ID for exposure data
   * @param filters - Optional filters
   * @returns List of businesses with metrics
   */
  async getBusinesses(userId?: string, filters?: BusinessFilters): Promise<BusinessWithMetrics[]> {
    return portfolioRepository.getBusinessesWithMetrics(userId, filters);
  }

  /**
   * Get a specific business by ID with metrics
   *
   * @param businessId - Business ID
   * @param userId - Optional user ID for exposure data
   * @returns Business with metrics if found, null otherwise
   */
  async getBusinessById(businessId: string, userId?: string): Promise<BusinessWithMetrics | null> {
    if (!businessId) {
      throw new Error('Business ID is required');
    }

    const business = await portfolioRepository.getBusinessById(businessId);
    if (!business) {
      return null;
    }

    const performance = await portfolioRepository.getBusinessPerformance(businessId);
    const exposure = userId ? await portfolioRepository.getUserExposure(userId, businessId) : null;

    return {
      ...business,
      performance,
      exposure,
    };
  }

  /**
   * Get a business by slug with metrics
   *
   * @param slug - Business slug
   * @param userId - Optional user ID for exposure data
   * @returns Business with metrics if found, null otherwise
   */
  async getBusinessBySlug(slug: string, userId?: string): Promise<BusinessWithMetrics | null> {
    if (!slug) {
      throw new Error('Business slug is required');
    }

    const business = await portfolioRepository.getBusinessBySlug(slug);
    if (!business) {
      return null;
    }

    const performance = await portfolioRepository.getBusinessPerformance(business.id);
    const exposure = userId ? await portfolioRepository.getUserExposure(userId, business.id) : null;

    return {
      ...business,
      performance,
      exposure,
    };
  }

  /**
   * Get user's exposure to a specific business
   *
   * @param userId - User ID
   * @param businessId - Business ID
   * @returns User exposure data if found, null otherwise
   */
  async getUserExposure(userId: string, businessId: string): Promise<UserExposure | null> {
    if (!userId) {
      throw new Error('User ID is required');
    }

    if (!businessId) {
      throw new Error('Business ID is required');
    }

    return portfolioRepository.getUserExposure(userId, businessId);
  }

  /**
   * Get business performance statistics
   *
   * @param businessId - Business ID
   * @returns Business performance data
   */
  async getBusinessPerformance(businessId: string): Promise<BusinessPerformance | null> {
    if (!businessId) {
      throw new Error('Business ID is required');
    }

    return portfolioRepository.getBusinessPerformance(businessId);
  }

  /**
   * Get all business performance statistics with optional filters
   *
   * @param filters - Optional filters
   * @returns List of business performance data
   */
  async getAllBusinessPerformance(filters?: BusinessFilters): Promise<BusinessPerformance[]> {
    return portfolioRepository.getAllBusinessPerformance(filters);
  }

  /**
   * Get metrics time-series for a business
   *
   * @param businessId - Business ID
   * @param metricType - Type of metric to retrieve
   * @param startDate - Optional start date
   * @param endDate - Optional end date
   * @returns Time-series data with trend calculation
   */
  async getBusinessMetricsTimeSeries(
    businessId: string,
    metricType: MetricType,
    startDate?: string,
    endDate?: string
  ): Promise<BusinessMetricsTimeSeries> {
    if (!businessId) {
      throw new Error('Business ID is required');
    }

    if (!metricType) {
      throw new Error('Metric type is required');
    }

    return businessMetricsRepository.getMetricsTimeSeries(businessId, metricType, startDate, endDate);
  }

  /**
   * Get foundation businesses (pre-seeded businesses from Aizura)
   *
   * @param userId - Optional user ID for exposure data
   * @returns List of foundation businesses
   */
  async getFoundationBusinesses(userId?: string): Promise<BusinessWithMetrics[]> {
    const filters: BusinessFilters = {
      is_foundation: true,
      sort: 'launch_date',
      order: 'desc',
    };

    return this.getBusinesses(userId, filters);
  }

  /**
   * Get live businesses (currently operational)
   *
   * @param userId - Optional user ID for exposure data
   * @returns List of live businesses
   */
  async getLiveBusinesses(userId?: string): Promise<BusinessWithMetrics[]> {
    const filters: BusinessFilters = {
      status: 'live',
      sort: 'revenue',
      order: 'desc',
    };

    return this.getBusinesses(userId, filters);
  }

  /**
   * Get businesses in development
   *
   * @param userId - Optional user ID for exposure data
   * @returns List of businesses in development
   */
  async getDevelopmentBusinesses(userId?: string): Promise<BusinessWithMetrics[]> {
    const filters: BusinessFilters = {
      status: 'development',
      sort: 'name',
      order: 'asc',
    };

    return this.getBusinesses(userId, filters);
  }

  /**
   * Search businesses by name or description
   *
   * @param query - Search query
   * @param userId - Optional user ID for exposure data
   * @returns List of matching businesses
   */
  async searchBusinesses(query: string, userId?: string): Promise<BusinessWithMetrics[]> {
    if (!query || query.trim().length < 2) {
      throw new Error('Search query must be at least 2 characters');
    }

    const filters: BusinessFilters = {
      search: query.trim(),
      limit: 20,
    };

    return this.getBusinesses(userId, filters);
  }

  /**
   * Get top performing businesses by revenue
   *
   * @param limit - Number of businesses to return
   * @param userId - Optional user ID for exposure data
   * @returns Top performing businesses
   */
  async getTopPerformingBusinesses(limit: number = 10, userId?: string): Promise<BusinessWithMetrics[]> {
    const filters: BusinessFilters = {
      status: 'live',
      sort: 'revenue',
      order: 'desc',
      limit,
    };

    return this.getBusinesses(userId, filters);
  }

  /**
   * Refresh portfolio materialized views
   * (Typically called periodically by a background job)
   */
  async refreshPortfolioViews(): Promise<void> {
    await portfolioRepository.refreshPortfolioViews();
  }
}

export const portfolioService = new PortfolioService();
