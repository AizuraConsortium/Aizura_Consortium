import { MetricsCollector } from './MetricsCollector.js';

/**
 * DAO Metrics Collector
 * Specialized metrics collector for DAO portal endpoints
 * Tracks API performance, cache efficiency, and data freshness
 */
export class DAOMetricsCollector extends MetricsCollector {
  /**
   * Track API endpoint performance
   */
  recordAPICall(
    endpoint: string,
    duration: number,
    success: boolean,
    statusCode?: number
  ): void {
    const sanitizedEndpoint = endpoint.replace(/[^a-zA-Z0-9_]/g, '_');

    // Record duration histogram
    this.histogram(`dao.api.${sanitizedEndpoint}.duration_ms`, duration);

    // Record success/error counter
    this.increment(
      `dao.api.${sanitizedEndpoint}.${success ? 'success' : 'error'}`,
      1
    );

    // Record by status code if provided
    if (statusCode) {
      this.increment(`dao.api.${sanitizedEndpoint}.status_${statusCode}`, 1);
    }

    // Track overall API health
    this.increment(`dao.api.total.${success ? 'success' : 'error'}`, 1);
  }

  /**
   * Track cache hit/miss rates
   */
  recordCacheHit(key: string, hit: boolean): void {
    const sanitizedKey = key.replace(/[^a-zA-Z0-9_]/g, '_');

    this.increment(`dao.cache.${sanitizedKey}.${hit ? 'hit' : 'miss'}`, 1);
    this.increment(`dao.cache.total.${hit ? 'hit' : 'miss'}`, 1);

    // Calculate and record cache hit rate
    // Note: This is simplified - in production, use a proper metrics system
  }

  /**
   * Track data age/freshness
   */
  recordDataAge(type: string, ageSeconds: number): void {
    const sanitizedType = type.replace(/[^a-zA-Z0-9_]/g, '_');

    this.gauge(`dao.data.${sanitizedType}.age_seconds`, ageSeconds);

    // Alert if data is stale (older than expected)
    if (ageSeconds > 600) {
      // 10 minutes
      this.increment(`dao.data.${sanitizedType}.stale`, 1);
    }
  }

  /**
   * Track page views on DAO portal
   */
  recordPageView(page: string): void {
    const sanitizedPage = page.replace(/[^a-zA-Z0-9_]/g, '_');

    this.increment(`dao.pageview.${sanitizedPage}`, 1);
    this.increment('dao.pageview.total', 1);
  }

  /**
   * Track materialized view refresh performance
   */
  recordViewRefresh(viewName: string, duration: number, success: boolean): void {
    const sanitizedView = viewName.replace(/[^a-zA-Z0-9_]/g, '_');

    this.histogram(`dao.view_refresh.${sanitizedView}.duration_ms`, duration);
    this.increment(
      `dao.view_refresh.${sanitizedView}.${success ? 'success' : 'error'}`,
      1
    );
  }

  /**
   * Track governance snapshot capture
   */
  recordSnapshotCapture(duration: number, success: boolean): void {
    this.histogram('dao.snapshot.capture_duration_ms', duration);
    this.increment(`dao.snapshot.${success ? 'success' : 'error'}`, 1);
  }

  /**
   * Track treasury metrics
   */
  recordTreasuryMetrics(totalValue: number, monthlyRevenue: number): void {
    this.gauge('dao.treasury.total_value', totalValue);
    this.gauge('dao.treasury.monthly_revenue', monthlyRevenue);
  }

  /**
   * Track governance metrics
   */
  recordGovernanceMetrics(
    activeProposals: number,
    participationRate: number,
    uniqueVoters: number
  ): void {
    this.gauge('dao.governance.active_proposals', activeProposals);
    this.gauge('dao.governance.participation_rate', participationRate);
    this.gauge('dao.governance.unique_voters', uniqueVoters);
  }

  /**
   * Track cache statistics
   */
  recordCacheStats(size: number, hitRate: number): void {
    this.gauge('dao.cache.size', size);
    this.gauge('dao.cache.hit_rate', hitRate);
  }

  /**
   * Track query performance by repository method
   */
  recordRepositoryQuery(
    method: string,
    duration: number,
    success: boolean
  ): void {
    const sanitizedMethod = method.replace(/[^a-zA-Z0-9_]/g, '_');

    this.histogram(`dao.repository.${sanitizedMethod}.duration_ms`, duration);
    this.increment(
      `dao.repository.${sanitizedMethod}.${success ? 'success' : 'error'}`,
      1
    );
  }

  /**
   * Track error rates
   */
  recordError(context: string, errorType: string): void {
    const sanitizedContext = context.replace(/[^a-zA-Z0-9_]/g, '_');
    const sanitizedType = errorType.replace(/[^a-zA-Z0-9_]/g, '_');

    this.increment(`dao.error.${sanitizedContext}.${sanitizedType}`, 1);
    this.increment('dao.error.total', 1);
  }

  /**
   * Get summary of all DAO metrics
   */
  getSummary(): Record<string, any> {
    // This would integrate with your metrics system
    // For now, return basic structure
    return {
      timestamp: new Date().toISOString(),
      metrics: {
        api: {
          total_calls: 0,
          success_rate: 0,
          avg_duration: 0,
        },
        cache: {
          hit_rate: 0,
          size: 0,
        },
        governance: {
          active_proposals: 0,
          participation_rate: 0,
          unique_voters: 0,
        },
        treasury: {
          total_value: 0,
          monthly_revenue: 0,
        },
      },
    };
  }
}

// Export singleton instance
export const daoMetricsCollector = new DAOMetricsCollector();
