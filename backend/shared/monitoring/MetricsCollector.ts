/**
 * Metrics Collector
 *
 * Collects and aggregates application metrics for monitoring and analysis.
 */

/**
 * Request metrics for an endpoint
 */
interface EndpointMetrics {
  endpoint: string;
  method: string;
  requestCount: number;
  errorCount: number;
  totalDuration: number;
  minDuration: number;
  maxDuration: number;
  durations: number[]; // For percentile calculation
}

/**
 * Aggregated system metrics
 */
export interface SystemMetrics {
  totalRequests: number;
  totalErrors: number;
  requestsPerSecond: number;
  errorRate: number;
  avgResponseTime: number;
  p95ResponseTime: number;
  p99ResponseTime: number;
  endpointMetrics: Map<string, EndpointMetrics>;
  startTime: Date;
  uptime: number;
}

/**
 * Metrics time window
 */
interface MetricsWindow {
  startTime: Date;
  endTime?: Date;
  metrics: Map<string, EndpointMetrics>;
  totalRequests: number;
  totalErrors: number;
}

/**
 * Metrics Collector
 *
 * Collects and aggregates metrics for monitoring application performance.
 * Provides real-time and historical metrics data.
 */
export class MetricsCollector {
  private static instance: MetricsCollector | null = null;
  private currentWindow: MetricsWindow;
  private startTime: Date;
  private windowDurationMs = 60000; // 1 minute windows

  private constructor() {
    this.startTime = new Date();
    this.currentWindow = this.createNewWindow();
    this.startWindowRotation();
  }

  /**
   * Get singleton instance
   */
  static getInstance(): MetricsCollector {
    if (!MetricsCollector.instance) {
      MetricsCollector.instance = new MetricsCollector();
    }
    return MetricsCollector.instance;
  }

  /**
   * Record a request
   *
   * @param endpoint - Request endpoint
   * @param method - HTTP method
   * @param duration - Request duration in ms
   * @param isError - Whether request resulted in error
   */
  recordRequest(
    endpoint: string,
    method: string,
    duration: number,
    isError = false
  ): void {
    const key = `${method} ${endpoint}`;
    let endpointMetrics = this.currentWindow.metrics.get(key);

    if (!endpointMetrics) {
      endpointMetrics = {
        endpoint,
        method,
        requestCount: 0,
        errorCount: 0,
        totalDuration: 0,
        minDuration: Infinity,
        maxDuration: 0,
        durations: [],
      };
      this.currentWindow.metrics.set(key, endpointMetrics);
    }

    endpointMetrics.requestCount++;
    this.currentWindow.totalRequests++;

    if (isError) {
      endpointMetrics.errorCount++;
      this.currentWindow.totalErrors++;
    }

    endpointMetrics.totalDuration += duration;
    endpointMetrics.minDuration = Math.min(endpointMetrics.minDuration, duration);
    endpointMetrics.maxDuration = Math.max(endpointMetrics.maxDuration, duration);
    endpointMetrics.durations.push(duration);

    // Keep only recent durations for percentile calculation
    if (endpointMetrics.durations.length > 1000) {
      endpointMetrics.durations = endpointMetrics.durations.slice(-1000);
    }
  }

  /**
   * Get current system metrics
   *
   * @returns Aggregated system metrics
   */
  getSystemMetrics(): SystemMetrics {
    const uptime = Date.now() - this.startTime.getTime();
    const uptimeSeconds = uptime / 1000;

    // Calculate requests per second
    const windowDurationSeconds = this.windowDurationMs / 1000;
    const requestsPerSecond =
      this.currentWindow.totalRequests / windowDurationSeconds;

    // Calculate error rate
    const errorRate =
      this.currentWindow.totalRequests > 0
        ? this.currentWindow.totalErrors / this.currentWindow.totalRequests
        : 0;

    // Collect all durations for percentile calculation
    const allDurations: number[] = [];
    for (const metrics of this.currentWindow.metrics.values()) {
      allDurations.push(...metrics.durations);
    }

    // Calculate response time metrics
    const avgResponseTime = this.calculateAverage(allDurations);
    const p95ResponseTime = this.calculatePercentile(allDurations, 95);
    const p99ResponseTime = this.calculatePercentile(allDurations, 99);

    return {
      totalRequests: this.currentWindow.totalRequests,
      totalErrors: this.currentWindow.totalErrors,
      requestsPerSecond: Math.round(requestsPerSecond * 100) / 100,
      errorRate: Math.round(errorRate * 10000) / 100, // Percentage
      avgResponseTime: Math.round(avgResponseTime),
      p95ResponseTime: Math.round(p95ResponseTime),
      p99ResponseTime: Math.round(p99ResponseTime),
      endpointMetrics: new Map(this.currentWindow.metrics),
      startTime: this.startTime,
      uptime: Math.round(uptimeSeconds),
    };
  }

  /**
   * Get metrics for specific endpoint
   *
   * @param endpoint - Endpoint path
   * @param method - HTTP method
   * @returns Endpoint metrics or null
   */
  getEndpointMetrics(endpoint: string, method: string): EndpointMetrics | null {
    const key = `${method} ${endpoint}`;
    return this.currentWindow.metrics.get(key) || null;
  }

  /**
   * Get all endpoint metrics sorted by request count
   *
   * @param limit - Maximum number of endpoints to return
   * @returns Array of endpoint metrics
   */
  getTopEndpoints(limit = 10): EndpointMetrics[] {
    const endpoints = Array.from(this.currentWindow.metrics.values());
    return endpoints
      .sort((a, b) => b.requestCount - a.requestCount)
      .slice(0, limit);
  }

  /**
   * Get endpoints with highest error rates
   *
   * @param limit - Maximum number of endpoints to return
   * @returns Array of endpoint metrics
   */
  getTopErrorEndpoints(limit = 10): EndpointMetrics[] {
    const endpoints = Array.from(this.currentWindow.metrics.values());
    return endpoints
      .filter((m) => m.errorCount > 0)
      .sort((a, b) => b.errorCount - a.errorCount)
      .slice(0, limit);
  }

  /**
   * Get slowest endpoints
   *
   * @param limit - Maximum number of endpoints to return
   * @returns Array of endpoint metrics
   */
  getSlowestEndpoints(limit = 10): EndpointMetrics[] {
    const endpoints = Array.from(this.currentWindow.metrics.values());
    return endpoints
      .sort((a, b) => {
        const avgA = a.totalDuration / a.requestCount;
        const avgB = b.totalDuration / b.requestCount;
        return avgB - avgA;
      })
      .slice(0, limit);
  }

  /**
   * Reset all metrics
   */
  reset(): void {
    this.currentWindow = this.createNewWindow();
  }

  /**
   * Create new metrics window
   *
   * @private
   */
  private createNewWindow(): MetricsWindow {
    return {
      startTime: new Date(),
      metrics: new Map(),
      totalRequests: 0,
      totalErrors: 0,
    };
  }

  /**
   * Start automatic window rotation
   *
   * @private
   */
  private startWindowRotation(): void {
    setInterval(() => {
      // Don't reset, just mark end time
      // In production, you'd save this window to database
      this.currentWindow.endTime = new Date();
    }, this.windowDurationMs);
  }

  /**
   * Calculate average of array
   *
   * @private
   */
  private calculateAverage(values: number[]): number {
    if (values.length === 0) return 0;
    const sum = values.reduce((acc, val) => acc + val, 0);
    return sum / values.length;
  }

  /**
   * Calculate percentile of array
   *
   * @private
   */
  private calculatePercentile(values: number[], percentile: number): number {
    if (values.length === 0) return 0;

    const sorted = [...values].sort((a, b) => a - b);
    const index = Math.ceil((percentile / 100) * sorted.length) - 1;
    return sorted[Math.max(0, index)];
  }
}
