/**
 * Performance Middleware
 *
 * Tracks request performance and records metrics.
 */

import { Request, Response, NextFunction } from 'express';
import { PerformanceMonitor } from '../monitoring/PerformanceMonitor.js';
import { MetricsCollector } from '../monitoring/MetricsCollector.js';

/**
 * Performance tracking middleware
 *
 * Tracks request duration and records metrics for monitoring.
 * Logs slow requests that exceed thresholds.
 *
 * @example
 * app.use(performanceMiddleware);
 */
export function performanceMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const perfMonitor = PerformanceMonitor.getInstance();
  const metricsCollector = MetricsCollector.getInstance();

  const startTime = Date.now();
  const operationId = `req_${Date.now()}_${Math.random().toString(36).substring(7)}`;

  // Start operation tracking
  perfMonitor.startOperation(operationId, `Request: ${req.method} ${req.path}`, {
    method: req.method,
    path: req.path,
    url: req.url,
    userAgent: req.get('user-agent'),
  });

  // Override res.end to capture completion
  const originalEnd = res.end.bind(res);
  res.end = function (chunk?: any, encoding?: any, callback?: any): Response {
    const duration = Date.now() - startTime;

    // End operation tracking
    perfMonitor.endOperation(operationId, {
      statusCode: res.statusCode,
      duration,
    });

    // Record metrics
    const isError = res.statusCode >= 400;
    metricsCollector.recordRequest(req.path, req.method, duration, isError);

    // Track request performance
    perfMonitor.trackRequest(req.path, duration, {
      method: req.method,
      statusCode: res.statusCode,
    });

    // Call original end
    if (callback) {
      return originalEnd(chunk, encoding, callback);
    } else if (encoding) {
      return originalEnd(chunk, encoding);
    } else {
      return originalEnd(chunk);
    }
  } as any;

  next();
}

/**
 * Query performance tracking helper
 *
 * Wraps a query function to track its execution time.
 *
 * @param queryName - Name of the query
 * @param queryFn - Query function to execute
 * @param metadata - Additional metadata
 * @returns Query result
 *
 * @example
 * const result = await trackQuery('getUserById', async () => {
 *   return await db.users.findById(userId);
 * }, { userId });
 */
export async function trackQuery<T>(
  queryName: string,
  queryFn: () => Promise<T>,
  metadata?: Record<string, any>
): Promise<T> {
  const perfMonitor = PerformanceMonitor.getInstance();
  const startTime = Date.now();

  try {
    const result = await queryFn();
    const duration = Date.now() - startTime;
    perfMonitor.trackQuery(queryName, duration, metadata);
    return result;
  } catch (error) {
    const duration = Date.now() - startTime;
    perfMonitor.trackQuery(queryName, duration, {
      ...metadata,
      error: error instanceof Error ? error.message : String(error),
    });
    throw error;
  }
}

/**
 * Operation tracking decorator
 *
 * Tracks the execution time of a function.
 *
 * @param operationName - Name of the operation
 * @param fn - Function to execute
 * @param metadata - Additional metadata
 * @returns Function result
 *
 * @example
 * const result = await trackOperation('processProposal', async () => {
 *   return await processProposal(proposalId);
 * });
 */
export async function trackOperation<T>(
  operationName: string,
  fn: () => Promise<T>,
  metadata?: Record<string, any>
): Promise<T> {
  const perfMonitor = PerformanceMonitor.getInstance();
  const operationId = `op_${Date.now()}_${Math.random().toString(36).substring(7)}`;

  perfMonitor.startOperation(operationId, operationName, metadata);

  try {
    const result = await fn();
    perfMonitor.endOperation(operationId, { success: true });
    return result;
  } catch (error) {
    perfMonitor.endOperation(operationId, {
      success: false,
      error: error instanceof Error ? error.message : String(error),
    });
    throw error;
  }
}
