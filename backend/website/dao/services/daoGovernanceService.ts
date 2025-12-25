import { BaseService } from '../../../shared/services/BaseService.js';
import { DAORepository } from '../repositories/daoRepository.js';
import { daoCacheService, DAOCacheService } from './daoCacheService.js';
import type { ParticipationMetrics } from '../types/daoTypes.js';

/**
 * DAO Governance Service
 * Handles governance-specific operations and metrics
 */
export class DAOGovernanceService extends BaseService {
  constructor(
    private daoRepo: DAORepository,
    private cache: DAOCacheService = daoCacheService
  ) {
    super('DAOGovernanceService');
  }

  /**
   * Get participation metrics
   */
  async getParticipationMetrics(): Promise<ParticipationMetrics> {
    return this.cache.get(
      this.cache.CACHE_CONFIG.PARTICIPATION_METRICS.key,
      async () => {
        try {
          return await this.daoRepo.getParticipationMetrics();
        } catch (error) {
          await this.logError('GET_PARTICIPATION_METRICS', 'Failed to fetch participation metrics', error as Error);
          throw error;
        }
      },
      this.cache.CACHE_CONFIG.PARTICIPATION_METRICS.ttl
    );
  }

  /**
   * Get participation rate percentage
   */
  async getParticipationRate(): Promise<number> {
    const metrics = await this.getParticipationMetrics();
    return metrics.rate;
  }

  /**
   * Check if governance is healthy
   * Returns true if participation rate is above threshold
   */
  async isGovernanceHealthy(minParticipationRate: number = 10): Promise<boolean> {
    try {
      const metrics = await this.getParticipationMetrics();
      return metrics.rate >= minParticipationRate;
    } catch (error) {
      await this.logError('CHECK_GOVERNANCE_HEALTH', 'Failed to check governance health', error as Error);
      return false;
    }
  }

  /**
   * Get governance health status
   */
  async getHealthStatus(): Promise<{
    healthy: boolean;
    participationRate: number;
    status: 'excellent' | 'good' | 'fair' | 'poor';
    message: string;
  }> {
    try {
      const metrics = await this.getParticipationMetrics();
      const rate = metrics.rate;

      let status: 'excellent' | 'good' | 'fair' | 'poor';
      let message: string;

      if (rate >= 50) {
        status = 'excellent';
        message = 'Governance participation is excellent';
      } else if (rate >= 25) {
        status = 'good';
        message = 'Governance participation is good';
      } else if (rate >= 10) {
        status = 'fair';
        message = 'Governance participation is fair';
      } else {
        status = 'poor';
        message = 'Governance participation needs improvement';
      }

      return {
        healthy: rate >= 10,
        participationRate: rate,
        status,
        message,
      };
    } catch (error) {
      await this.logError('GET_HEALTH_STATUS', 'Failed to get governance health status', error as Error);
      throw error;
    }
  }

  /**
   * Warm cache on server startup
   */
  async warmCache(): Promise<void> {
    try {
      this.logInfo('Warming governance cache...');

      await this.cache.warmCache({
        [this.cache.CACHE_CONFIG.PARTICIPATION_METRICS.key]: async () =>
          this.getParticipationMetrics(),
      });

      this.logInfo('Governance cache warmed successfully');
    } catch (error) {
      await this.logError('WARM_CACHE', 'Failed to warm governance cache', error as Error);
      // Don't throw - cache warming failures shouldn't prevent server startup
    }
  }
}
