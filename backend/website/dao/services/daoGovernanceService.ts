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
          this.logError('getParticipationMetrics', error as Error);
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
      this.logError('isGovernanceHealthy', error as Error);
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
      this.logError('getHealthStatus', error as Error);
      throw error;
    }
  }

  /**
   * Warm cache on server startup
   */
  async warmCache(): Promise<void> {
    try {
      this.logInfo('warmCache', 'Warming governance cache...');

      await this.cache.warmCache({
        [this.cache.CACHE_CONFIG.PARTICIPATION_METRICS.key]: async () =>
          this.getParticipationMetrics(),
      });

      this.logInfo('warmCache', 'Governance cache warmed successfully');
    } catch (error) {
      this.logError('warmCache', error as Error);
      // Don't throw - cache warming failures shouldn't prevent server startup
    }
  }
}
