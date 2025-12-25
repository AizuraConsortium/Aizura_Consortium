import { BaseService } from '../../../shared/services/BaseService.js';
import { DAORepository } from '../repositories/daoRepository.js';
import { daoCacheService, DAOCacheService } from './daoCacheService.js';
import type {
  DAOStatsResponse,
  GovernanceTrendsResponse,
  GovernanceTrendPoint,
  DAOActivityResponse,
  TimePeriod,
} from '../types/daoTypes.js';

/**
 * DAO Stats Service
 * Business logic for DAO statistics with caching and aggregation
 */
export class DAOStatsService extends BaseService {
  constructor(
    private daoRepo: DAORepository,
    private cache: DAOCacheService = daoCacheService
  ) {
    super('DAOStatsService');
  }

  /**
   * Get comprehensive DAO statistics
   * Cached for 30 seconds
   */
  async getDAOStats(): Promise<DAOStatsResponse> {
    return this.cache.get(
      this.cache.CACHE_CONFIG.DAO_STATS.key,
      async () => {
        try {
          // Fetch from materialized view
          const stats = await this.daoRepo.getDAOStatistics();

          if (!stats) {
            // Return default values if no data
            return this.getDefaultStats();
          }

          // Fetch participation metrics
          const participation = await this.daoRepo.getParticipationMetrics();

          return {
            proposals: {
              active: stats.active_proposals,
              total: stats.total_proposals,
              passed: stats.passed_proposals,
              rejected: stats.rejected_proposals,
              pending: stats.pending_proposals,
            },
            governance: {
              participationRate: participation.rate,
              uniqueVoters: participation.unique_voters,
              activeVoters: participation.active_voters,
              totalEligibleVoters: participation.eligible_voters,
            },
            lastUpdated: stats.last_updated,
          };
        } catch (error) {
          await this.logError('GET_DAO_STATS', 'Failed to fetch DAO statistics', error as Error);
          throw error;
        }
      },
      this.cache.CACHE_CONFIG.DAO_STATS.ttl
    );
  }

  /**
   * Get governance trends over time
   */
  async getGovernanceTrends(period: TimePeriod = '30d'): Promise<GovernanceTrendsResponse> {
    const cacheKey = `${this.cache.CACHE_CONFIG.GOVERNANCE_HISTORY.key}:${period}`;

    return this.cache.get(
      cacheKey,
      async () => {
        try {
          const history = await this.daoRepo.getGovernanceHistory(period);

          const data: GovernanceTrendPoint[] = history.map((snapshot) => ({
            date: snapshot.recorded_at,
            activeProposals: snapshot.active_proposals,
            participationRate: snapshot.participation_rate,
            uniqueVoters: snapshot.unique_voters,
            totalProposals: snapshot.total_proposals,
          }));

          return {
            period,
            data,
          };
        } catch (error) {
          await this.logError('GET_GOVERNANCE_TRENDS', 'Failed to fetch governance trends', error as Error);
          throw error;
        }
      },
      this.cache.CACHE_CONFIG.GOVERNANCE_HISTORY.ttl
    );
  }

  /**
   * Get recent DAO activity
   */
  async getRecentActivity(limit: number = 10): Promise<DAOActivityResponse> {
    const cacheKey = `${this.cache.CACHE_CONFIG.RECENT_PROPOSALS.key}:${limit}`;

    return this.cache.get(
      cacheKey,
      async () => {
        try {
          const recentProposals = await this.daoRepo.getRecentProposalActivity(limit);

          // Calculate total recent votes (last 7 days)
          const participation = await this.daoRepo.getParticipationMetrics();

          return {
            recentProposals,
            recentVotes: participation.active_voters,
            activeUsers: participation.active_voters,
            lastUpdated: new Date().toISOString(),
          };
        } catch (error) {
          await this.logError('GET_RECENT_ACTIVITY', 'Failed to fetch recent DAO activity', error as Error);
          throw error;
        }
      },
      this.cache.CACHE_CONFIG.RECENT_PROPOSALS.ttl
    );
  }

  /**
   * Manually refresh materialized views
   * Useful for admin actions or after major updates
   */
  async refreshViews(): Promise<void> {
    try {
      await this.daoRepo.refreshMaterializedViews();

      // Invalidate all DAO caches
      this.cache.invalidatePattern('dao:*');

      this.logInfo('Materialized views refreshed and caches invalidated');
    } catch (error) {
      await this.logError('REFRESH_VIEWS', 'Failed to refresh materialized views', error as Error);
      throw error;
    }
  }

  /**
   * Manually capture governance snapshot
   * Useful for testing or manual data collection
   */
  async captureSnapshot(): Promise<void> {
    try {
      await this.daoRepo.captureGovernanceSnapshot();
      this.logInfo('Governance snapshot captured');
    } catch (error) {
      await this.logError('CAPTURE_SNAPSHOT', 'Failed to capture governance snapshot', error as Error);
      throw error;
    }
  }

  /**
   * Get default stats when no data is available
   */
  private getDefaultStats(): DAOStatsResponse {
    return {
      proposals: {
        active: 0,
        total: 0,
        passed: 0,
        rejected: 0,
        pending: 0,
      },
      governance: {
        participationRate: 0,
        uniqueVoters: 0,
        activeVoters: 0,
        totalEligibleVoters: 0,
      },
      lastUpdated: new Date().toISOString(),
    };
  }

  /**
   * Get cache statistics
   */
  getCacheStats(): {
    size: number;
    keys: string[];
  } {
    return this.cache.getStats();
  }

  /**
   * Warm cache on server startup
   */
  async warmCache(): Promise<void> {
    try {
      this.logInfo('Warming DAO stats cache...');

      await this.cache.warmCache({
        [this.cache.CACHE_CONFIG.DAO_STATS.key]: async () => this.getDAOStats(),
        [this.cache.CACHE_CONFIG.RECENT_PROPOSALS.key]: async () => this.getRecentActivity(10),
      });

      this.logInfo('DAO stats cache warmed successfully');
    } catch (error) {
      await this.logError('WARM_CACHE', 'Failed to warm DAO stats cache', error as Error);
      // Don't throw - cache warming failures shouldn't prevent server startup
    }
  }
}
