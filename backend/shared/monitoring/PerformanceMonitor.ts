/**
 * Performance Monitor
 *
 * Tracks operation performance, detects slow queries, and monitors resource usage.
 */

import { ErrorLogger } from '../services/errorLogger.js';

/**
 * Performance threshold configuration
 */
interface PerformanceThresholds {
  slowQueryMs: number;
  slowRequestMs: number;
  memoryWarningMb: number;
  memoryCriticalMb: number;
}

/**
 * Operation timing record
 */
interface OperationTiming {
  operation: string;
  startTime: number;
  endTime?: number;
  duration?: number;
  metadata?: Record<string, any>;
}

/**
 * Slow operation record
 */
interface SlowOperation {
  operation: string;
  duration: number;
  timestamp: string;
  metadata?: Record<string, any>;
  threshold: number;
}

/**
 * Resource usage snapshot
 */
interface ResourceUsage {
  memoryMb: number;
  memoryPercent: number;
  uptimeSeconds: number;
  timestamp: string;
}

/**
 * Performance Monitor
 *
 * Monitors application performance and resource usage.
 * Tracks slow operations and alerts on threshold violations.
 */
export class PerformanceMonitor {
  private static instance: PerformanceMonitor | null = null;
  private errorLogger: ErrorLogger;
  private thresholds: PerformanceThresholds;
  private slowOperations: SlowOperation[] = [];
  private activeOperations: Map<string, OperationTiming> = new Map();
  private maxSlowOperations = 100;

  private constructor() {
    this.errorLogger = ErrorLogger.getInstance();
    this.thresholds = {
      slowQueryMs: 1000,
      slowRequestMs: 2000,
      memoryWarningMb: 512,
      memoryCriticalMb: 1024,
    };
  }

  /**
   * Get singleton instance
   */
  static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor();
    }
    return PerformanceMonitor.instance;
  }

  /**
   * Start tracking an operation
   *
   * @param operationId - Unique operation identifier
   * @param operationName - Human-readable operation name
   * @param metadata - Additional context
   */
  startOperation(
    operationId: string,
    operationName: string,
    metadata?: Record<string, any>
  ): void {
    this.activeOperations.set(operationId, {
      operation: operationName,
      startTime: Date.now(),
      metadata,
    });
  }

  /**
   * End tracking an operation
   *
   * @param operationId - Operation identifier
   * @param additionalMetadata - Additional metadata to merge
   * @returns Duration in milliseconds
   */
  endOperation(operationId: string, additionalMetadata?: Record<string, any>): number | null {
    const operation = this.activeOperations.get(operationId);
    if (!operation) {
      return null;
    }

    const endTime = Date.now();
    const duration = endTime - operation.startTime;

    operation.endTime = endTime;
    operation.duration = duration;

    if (additionalMetadata) {
      operation.metadata = {
        ...operation.metadata,
        ...additionalMetadata,
      };
    }

    // Check if operation was slow
    this.checkSlowOperation(operation);

    this.activeOperations.delete(operationId);

    return duration;
  }

  /**
   * Track a query execution
   *
   * @param queryName - Query identifier
   * @param duration - Duration in milliseconds
   * @param metadata - Query metadata
   */
  trackQuery(queryName: string, duration: number, metadata?: Record<string, any>): void {
    if (duration > this.thresholds.slowQueryMs) {
      this.recordSlowOperation({
        operation: `Query: ${queryName}`,
        duration,
        timestamp: new Date().toISOString(),
        metadata,
        threshold: this.thresholds.slowQueryMs,
      });

      // Log slow query
      this.errorLogger.logBackendError(
        'SLOW_QUERY',
        `Query "${queryName}" took ${duration}ms`,
        {
          queryTimeMs: duration,
          metadata: {
            queryName,
            threshold: this.thresholds.slowQueryMs,
            ...metadata,
          },
        }
      );
    }
  }

  /**
   * Track a request execution
   *
   * @param requestPath - Request path
   * @param duration - Duration in milliseconds
   * @param metadata - Request metadata
   */
  trackRequest(requestPath: string, duration: number, metadata?: Record<string, any>): void {
    if (duration > this.thresholds.slowRequestMs) {
      this.recordSlowOperation({
        operation: `Request: ${requestPath}`,
        duration,
        timestamp: new Date().toISOString(),
        metadata,
        threshold: this.thresholds.slowRequestMs,
      });
    }
  }

  /**
   * Check if operation exceeded thresholds
   *
   * @param operation - Operation timing
   * @private
   */
  private checkSlowOperation(operation: OperationTiming): void {
    if (!operation.duration) return;

    let threshold = this.thresholds.slowRequestMs;
    if (operation.operation.startsWith('Query:')) {
      threshold = this.thresholds.slowQueryMs;
    }

    if (operation.duration > threshold) {
      this.recordSlowOperation({
        operation: operation.operation,
        duration: operation.duration,
        timestamp: new Date().toISOString(),
        metadata: operation.metadata,
        threshold,
      });
    }
  }

  /**
   * Record slow operation
   *
   * @param slowOp - Slow operation record
   * @private
   */
  private recordSlowOperation(slowOp: SlowOperation): void {
    this.slowOperations.push(slowOp);

    // Keep only recent slow operations
    if (this.slowOperations.length > this.maxSlowOperations) {
      this.slowOperations = this.slowOperations.slice(-this.maxSlowOperations);
    }
  }

  /**
   * Get recent slow operations
   *
   * @param limit - Maximum number to return
   * @returns Array of slow operations
   */
  getSlowOperations(limit = 50): SlowOperation[] {
    return this.slowOperations.slice(-limit);
  }

  /**
   * Get current resource usage
   *
   * @returns Resource usage snapshot
   */
  getResourceUsage(): ResourceUsage {
    const usage = process.memoryUsage();
    const memoryMb = Math.round(usage.heapUsed / 1024 / 1024);
    const memoryPercent = (usage.heapUsed / usage.heapTotal) * 100;

    // Check memory thresholds
    if (memoryMb > this.thresholds.memoryCriticalMb) {
      this.errorLogger.logBackendError(
        'MEMORY_CRITICAL',
        `Memory usage critical: ${memoryMb}MB`,
        {
          metadata: {
            memoryMb,
            threshold: this.thresholds.memoryCriticalMb,
          },
        }
      );
    } else if (memoryMb > this.thresholds.memoryWarningMb) {
      this.errorLogger.logBackendError(
        'MEMORY_WARNING',
        `Memory usage high: ${memoryMb}MB`,
        {
          metadata: {
            memoryMb,
            threshold: this.thresholds.memoryWarningMb,
          },
        }
      );
    }

    return {
      memoryMb,
      memoryPercent: Math.round(memoryPercent * 100) / 100,
      uptimeSeconds: Math.round(process.uptime()),
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Get active operations count
   */
  getActiveOperationsCount(): number {
    return this.activeOperations.size;
  }

  /**
   * Get active operations
   */
  getActiveOperations(): OperationTiming[] {
    return Array.from(this.activeOperations.values());
  }

  /**
   * Clear slow operations history
   */
  clearSlowOperations(): void {
    this.slowOperations = [];
  }

  /**
   * Update performance thresholds
   *
   * @param thresholds - New threshold values
   */
  updateThresholds(thresholds: Partial<PerformanceThresholds>): void {
    this.thresholds = {
      ...this.thresholds,
      ...thresholds,
    };
  }

  /**
   * Get current thresholds
   */
  getThresholds(): PerformanceThresholds {
    return { ...this.thresholds };
  }
}
