import { BaseService } from '../../../shared/services/BaseService.js';
import { DAORepository } from '../repositories/daoRepository.js';
import { daoCacheService, DAOCacheService } from './daoCacheService.js';
import type {
  TreasurySnapshotResponse,
  TreasuryHistoryResponse,
  TreasuryHistoryPoint,
  BusinessBreakdownItem,
  GrowthMetrics,
  TimePeriod,
} from '../types/daoTypes.js';

/**
 * DAO Treasury Service
 * Handles treasury calculations, business breakdown, and historical tracking
 */
export class DAOTreasuryService extends BaseService {
  constructor(
    private daoRepo: DAORepository,
    private cache: DAOCacheService = daoCacheService
  ) {
    super('DAOTreasuryService');
  }

  /**
   * Get current treasury snapshot
   * Includes breakdown by business and category
   */
  async getTreasurySnapshot(): Promise<TreasurySnapshotResponse> {
    return this.cache.get(
      this.cache.CACHE_CONFIG.TREASURY_METRICS.key,
      async () => {
        try {
          const metrics = await this.daoRepo.getTreasuryMetrics();

          if (!metrics) {
            return this.getDefaultSnapshot();
          }

          const businesses = await this.daoRepo.getActiveBusinesses();
          const breakdown = this.calculateBusinessBreakdown(businesses, metrics.total_lifetime_revenue);
          const growth = await this.daoRepo.getTreasuryGrowth();

          return {
            totalValue: metrics.total_lifetime_revenue,
            monthlyRevenue: metrics.total_monthly_revenue,
            businesses: breakdown,
            allocation: {
              foundation: metrics.foundation_value,
              foundationPercentage: this.calculatePercentage(
                metrics.foundation_value,
                metrics.total_lifetime_revenue
              ),
              liveBusinesses: metrics.live_business_value,
              liveBusinessesPercentage: this.calculatePercentage(
                metrics.live_business_value,
                metrics.total_lifetime_revenue
              ),
            },
            growth: {
              monthlyGrowth: growth.monthly,
              quarterlyGrowth: growth.quarterly,
              yearlyGrowth: growth.yearly,
            },
            lastUpdated: metrics.last_updated,
          };
        } catch (error) {
          this.logError('getTreasurySnapshot', error as Error);
          throw error;
        }
      },
      this.cache.CACHE_CONFIG.TREASURY_METRICS.ttl
    );
  }

  /**
   * Get treasury historical data
   */
  async getTreasuryHistory(period: TimePeriod = '30d'): Promise<TreasuryHistoryResponse> {
    const cacheKey = `${this.cache.CACHE_CONFIG.TREASURY_HISTORY.key}:${period}`;

    return this.cache.get(
      cacheKey,
      async () => {
        try {
          const history = await this.daoRepo.getTreasuryHistory(period);

          const data: TreasuryHistoryPoint[] = history.map((snapshot) => ({
            date: snapshot.recorded_at,
            totalValue: snapshot.total_treasury_value,
            monthlyRevenue: snapshot.monthly_revenue,
            activeBusinesses: snapshot.active_businesses,
          }));

          return {
            period,
            data,
          };
        } catch (error) {
          this.logError('getTreasuryHistory', error as Error);
          throw error;
        }
      },
      this.cache.CACHE_CONFIG.TREASURY_HISTORY.ttl
    );
  }

  /**
   * Calculate business breakdown with percentages
   */
  private calculateBusinessBreakdown(
    businesses: any[],
    totalValue: number
  ): BusinessBreakdownItem[] {
    return businesses.map((business) => ({
      id: business.id,
      name: business.name,
      slug: business.slug,
      value: business.total_revenue,
      monthlyRevenue: business.monthly_revenue,
      category: business.category,
      status: business.status,
      percentage: this.calculatePercentage(business.total_revenue, totalValue),
    }));
  }

  /**
   * Calculate percentage
   */
  private calculatePercentage(part: number, total: number): number {
    if (total === 0) return 0;
    return Math.round((part / total) * 10000) / 100; // Round to 2 decimals
  }

  /**
   * Get default snapshot when no data is available
   */
  private getDefaultSnapshot(): TreasurySnapshotResponse {
    return {
      totalValue: 0,
      monthlyRevenue: 0,
      businesses: [],
      allocation: {
        foundation: 0,
        foundationPercentage: 0,
        liveBusinesses: 0,
        liveBusinessesPercentage: 0,
      },
      growth: {
        monthlyGrowth: 0,
        quarterlyGrowth: 0,
        yearlyGrowth: 0,
      },
      lastUpdated: new Date().toISOString(),
    };
  }

  /**
   * Get business breakdown (cached separately)
   */
  async getBusinessBreakdown(): Promise<BusinessBreakdownItem[]> {
    return this.cache.get(
      this.cache.CACHE_CONFIG.BUSINESS_BREAKDOWN.key,
      async () => {
        try {
          const metrics = await this.daoRepo.getTreasuryMetrics();

          if (!metrics) {
            return [];
          }

          const businesses = await this.daoRepo.getActiveBusinesses();
          return this.calculateBusinessBreakdown(businesses, metrics.total_lifetime_revenue);
        } catch (error) {
          this.logError('getBusinessBreakdown', error as Error);
          throw error;
        }
      },
      this.cache.CACHE_CONFIG.BUSINESS_BREAKDOWN.ttl
    );
  }

  /**
   * Get treasury growth metrics (cached separately)
   */
  async getGrowthMetrics(): Promise<GrowthMetrics> {
    return this.cache.get(
      this.cache.CACHE_CONFIG.TREASURY_GROWTH.key,
      async () => {
        try {
          const growth = await this.daoRepo.getTreasuryGrowth();
          return {
            monthlyGrowth: growth.monthly,
            quarterlyGrowth: growth.quarterly,
            yearlyGrowth: growth.yearly,
          };
        } catch (error) {
          this.logError('getGrowthMetrics', error as Error);
          throw error;
        }
      },
      this.cache.CACHE_CONFIG.TREASURY_GROWTH.ttl
    );
  }

  /**
   * Warm cache on server startup
   */
  async warmCache(): Promise<void> {
    try {
      this.logInfo('warmCache', 'Warming treasury cache...');

      await this.cache.warmCache({
        [this.cache.CACHE_CONFIG.TREASURY_METRICS.key]: async () => this.getTreasurySnapshot(),
        [this.cache.CACHE_CONFIG.BUSINESS_BREAKDOWN.key]: async () => this.getBusinessBreakdown(),
      });

      this.logInfo('warmCache', 'Treasury cache warmed successfully');
    } catch (error) {
      this.logError('warmCache', error as Error);
      // Don't throw - cache warming failures shouldn't prevent server startup
    }
  }
}
