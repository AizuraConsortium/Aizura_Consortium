import { DAORepository } from '../../website/dao/repositories/daoRepository.js';
import { daoCacheService } from '../../website/dao/services/daoCacheService.js';

/**
 * Governance Metrics Capture Job
 * Runs periodically to ensure governance metrics are being captured
 * Provides application-level monitoring and fallback for database cron jobs
 */
export class GovernanceMetricsCaptureJob {
  private intervalId: NodeJS.Timeout | null = null;
  private isRunning: boolean = false;

  constructor(
    private daoRepo: DAORepository,
    private intervalMs: number = 60 * 60 * 1000 // 1 hour default
  ) {}

  /**
   * Start the background job
   */
  start(): void {
    if (this.intervalId) {
      console.log('[GovernanceMetricsCaptureJob] Job already running');
      return;
    }

    console.log(
      `[GovernanceMetricsCaptureJob] Starting job (interval: ${this.intervalMs / 1000}s)`
    );

    // Run immediately on start
    this.capture();

    // Then run on interval
    this.intervalId = setInterval(() => {
      this.capture();
    }, this.intervalMs);
  }

  /**
   * Stop the background job
   */
  stop(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
      console.log('[GovernanceMetricsCaptureJob] Job stopped');
    }
  }

  /**
   * Capture governance metrics snapshot
   */
  private async capture(): Promise<void> {
    if (this.isRunning) {
      console.log('[GovernanceMetricsCaptureJob] Capture already in progress, skipping');
      return;
    }

    this.isRunning = true;

    try {
      console.log('[GovernanceMetricsCaptureJob] Capturing governance metrics...');

      // Capture snapshot via database function
      await this.daoRepo.captureGovernanceSnapshot();

      // Invalidate relevant caches to ensure fresh data
      daoCacheService.invalidate(daoCacheService.CACHE_CONFIG.DAO_STATS.key);
      daoCacheService.invalidate(daoCacheService.CACHE_CONFIG.GOVERNANCE_HISTORY.key);
      daoCacheService.invalidatePattern('dao:history:*');

      console.log('[GovernanceMetricsCaptureJob] Metrics captured successfully');
    } catch (error) {
      console.error('[GovernanceMetricsCaptureJob] Failed to capture metrics:', error);

      // Log error to monitoring system
      // TODO: Send alert to monitoring system (e.g., Sentry, DataDog)
    } finally {
      this.isRunning = false;
    }
  }

  /**
   * Force capture (for manual triggers)
   */
  async forceCapture(): Promise<void> {
    console.log('[GovernanceMetricsCaptureJob] Force capturing metrics...');
    await this.capture();
  }

  /**
   * Get job status
   */
  getStatus(): {
    running: boolean;
    interval: number;
    captureInProgress: boolean;
  } {
    return {
      running: this.intervalId !== null,
      interval: this.intervalMs,
      captureInProgress: this.isRunning,
    };
  }
}

// Export singleton instance
let captureJobInstance: GovernanceMetricsCaptureJob | null = null;

export function getGovernanceMetricsCaptureJob(
  daoRepo: DAORepository
): GovernanceMetricsCaptureJob {
  if (!captureJobInstance) {
    captureJobInstance = new GovernanceMetricsCaptureJob(daoRepo);
  }
  return captureJobInstance;
}
