/**
 * Query Monitor
 *
 * Tracks database query execution times, identifies slow queries,
 * and provides performance analytics for optimization.
 */

export interface QueryMetric {
  operation: string;
  table?: string;
  durationMs: number;
  timestamp: Date;
  success: boolean;
  error?: string;
  correlationId?: string;
}

export interface SlowQueryAlert {
  operation: string;
  table?: string;
  durationMs: number;
  threshold: number;
  timestamp: Date;
  severity: 'warning' | 'error';
}

export interface PerformanceReport {
  totalQueries: number;
  averageDuration: number;
  medianDuration: number;
  p95Duration: number;
  p99Duration: number;
  slowestQueries: QueryMetric[];
  errorRate: number;
  queriesByOperation: Record<string, number>;
  queriesByTable: Record<string, number>;
}

const SLOW_QUERY_WARNING_MS = 100;
const SLOW_QUERY_ERROR_MS = 500;
const MAX_METRICS_STORED = 10000;

/**
 * Query Monitor Singleton
 */
class QueryMonitor {
  private metrics: QueryMetric[] = [];
  private slowQueryAlerts: SlowQueryAlert[] = [];
  private enabled: boolean = true;

  /**
   * Record a query execution
   */
  recordQuery(metric: QueryMetric): void {
    if (!this.enabled) return;

    this.metrics.push(metric);

    if (this.metrics.length > MAX_METRICS_STORED) {
      this.metrics.shift();
    }

    this.checkSlowQuery(metric);
  }

  /**
   * Check if query is slow and create alert
   */
  private checkSlowQuery(metric: QueryMetric): void {
    if (metric.durationMs >= SLOW_QUERY_ERROR_MS) {
      const alert: SlowQueryAlert = {
        operation: metric.operation,
        table: metric.table,
        durationMs: metric.durationMs,
        threshold: SLOW_QUERY_ERROR_MS,
        timestamp: metric.timestamp,
        severity: 'error',
      };

      this.slowQueryAlerts.push(alert);
      this.logSlowQuery(alert);
    } else if (metric.durationMs >= SLOW_QUERY_WARNING_MS) {
      const alert: SlowQueryAlert = {
        operation: metric.operation,
        table: metric.table,
        durationMs: metric.durationMs,
        threshold: SLOW_QUERY_WARNING_MS,
        timestamp: metric.timestamp,
        severity: 'warning',
      };

      this.slowQueryAlerts.push(alert);
      this.logSlowQuery(alert);
    }

    if (this.slowQueryAlerts.length > 1000) {
      this.slowQueryAlerts.shift();
    }
  }

  /**
   * Log slow query alert
   */
  private logSlowQuery(alert: SlowQueryAlert): void {
    const logLevel = alert.severity === 'error' ? 'error' : 'warn';
    console[logLevel](`[SLOW QUERY ${alert.severity.toUpperCase()}]`, {
      operation: alert.operation,
      table: alert.table,
      durationMs: alert.durationMs,
      threshold: alert.threshold,
      timestamp: alert.timestamp.toISOString(),
    });
  }

  /**
   * Get performance report
   */
  getPerformanceReport(since?: Date): PerformanceReport {
    let metricsToAnalyze = this.metrics;

    if (since) {
      metricsToAnalyze = this.metrics.filter(m => m.timestamp >= since);
    }

    if (metricsToAnalyze.length === 0) {
      return {
        totalQueries: 0,
        averageDuration: 0,
        medianDuration: 0,
        p95Duration: 0,
        p99Duration: 0,
        slowestQueries: [],
        errorRate: 0,
        queriesByOperation: {},
        queriesByTable: {},
      };
    }

    const durations = metricsToAnalyze.map(m => m.durationMs).sort((a, b) => a - b);
    const totalQueries = metricsToAnalyze.length;
    const errorCount = metricsToAnalyze.filter(m => !m.success).length;

    const queriesByOperation: Record<string, number> = {};
    const queriesByTable: Record<string, number> = {};

    metricsToAnalyze.forEach(m => {
      queriesByOperation[m.operation] = (queriesByOperation[m.operation] || 0) + 1;
      if (m.table) {
        queriesByTable[m.table] = (queriesByTable[m.table] || 0) + 1;
      }
    });

    const slowestQueries = [...metricsToAnalyze]
      .sort((a, b) => b.durationMs - a.durationMs)
      .slice(0, 10);

    return {
      totalQueries,
      averageDuration: this.calculateAverage(durations),
      medianDuration: this.calculatePercentile(durations, 50),
      p95Duration: this.calculatePercentile(durations, 95),
      p99Duration: this.calculatePercentile(durations, 99),
      slowestQueries,
      errorRate: errorCount / totalQueries,
      queriesByOperation,
      queriesByTable,
    };
  }

  /**
   * Get slow query alerts
   */
  getSlowQueryAlerts(since?: Date): SlowQueryAlert[] {
    if (since) {
      return this.slowQueryAlerts.filter(a => a.timestamp >= since);
    }
    return [...this.slowQueryAlerts];
  }

  /**
   * Clear metrics and alerts
   */
  clear(): void {
    this.metrics = [];
    this.slowQueryAlerts = [];
  }

  /**
   * Enable/disable monitoring
   */
  setEnabled(enabled: boolean): void {
    this.enabled = enabled;
  }

  /**
   * Get all metrics
   */
  getMetrics(since?: Date): QueryMetric[] {
    if (since) {
      return this.metrics.filter(m => m.timestamp >= since);
    }
    return [...this.metrics];
  }

  /**
   * Calculate average
   */
  private calculateAverage(values: number[]): number {
    if (values.length === 0) return 0;
    return values.reduce((sum, val) => sum + val, 0) / values.length;
  }

  /**
   * Calculate percentile
   */
  private calculatePercentile(sortedValues: number[], percentile: number): number {
    if (sortedValues.length === 0) return 0;
    const index = Math.ceil((percentile / 100) * sortedValues.length) - 1;
    return sortedValues[Math.max(0, index)];
  }

  /**
   * Identify N+1 query patterns
   */
  identifyNPlusOnePatterns(windowMs: number = 1000): Array<{
    operation: string;
    table?: string;
    count: number;
    avgDuration: number;
    pattern: 'potential_n_plus_1';
  }> {
    const now = Date.now();
    const recentMetrics = this.metrics.filter(
      m => now - m.timestamp.getTime() < windowMs
    );

    const operationCounts = new Map<string, QueryMetric[]>();

    recentMetrics.forEach(metric => {
      const key = `${metric.operation}:${metric.table || 'unknown'}`;
      if (!operationCounts.has(key)) {
        operationCounts.set(key, []);
      }
      operationCounts.get(key)!.push(metric);
    });

    const patterns: Array<{
      operation: string;
      table?: string;
      count: number;
      avgDuration: number;
      pattern: 'potential_n_plus_1';
    }> = [];

    operationCounts.forEach((metrics, key) => {
      if (metrics.length >= 10) {
        const [operation, table] = key.split(':');
        const avgDuration =
          metrics.reduce((sum, m) => sum + m.durationMs, 0) / metrics.length;

        patterns.push({
          operation,
          table: table !== 'unknown' ? table : undefined,
          count: metrics.length,
          avgDuration,
          pattern: 'potential_n_plus_1',
        });
      }
    });

    return patterns.sort((a, b) => b.count - a.count);
  }
}

export const queryMonitor = new QueryMonitor();
