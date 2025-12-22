/**
 * BaseRepository
 *
 * Provides common repository functionality including:
 * - Standardized error handling and conversion
 * - Performance monitoring and slow query logging
 * - Structured logging with context
 * - Retry logic for transient failures
 * - Correlation ID tracking
 */

import { getSupabaseClient } from '../client.js';
import { isPostgresError, isUniqueViolation, isForeignKeyViolation, isNotNullViolation } from '../errorHandlers.js';
import {
  RepositoryError,
  NotFoundError,
  ValidationError,
  ConstraintViolationError,
  QueryTimeoutError,
  type ErrorContext,
} from './errors/index.js';
import { queryMonitor } from '../monitoring/QueryMonitor.js';
import { repositoryCache } from '../cache/RepositoryCache.js';
import type { SupabaseClient } from '@supabase/supabase-js';

export interface OperationContext {
  operation: string;
  table?: string;
  resource?: string;
  resourceId?: string;
  correlationId?: string;
  metadata?: Record<string, unknown>;
}

export interface PerformanceMetrics {
  operation: string;
  durationMs: number;
  success: boolean;
  timestamp: Date;
}

const SLOW_QUERY_WARNING_MS = 100;
const SLOW_QUERY_ERROR_MS = 500;
const MAX_RETRY_ATTEMPTS = 3;
const RETRY_DELAY_MS = 100;

/**
 * Base repository class providing common functionality
 */
export abstract class BaseRepository {
  protected readonly client: SupabaseClient;
  protected readonly tableName: string;
  private readonly performanceMetrics: PerformanceMetrics[] = [];

  constructor(tableName: string) {
    this.tableName = tableName;
    this.client = getSupabaseClient();
  }

  /**
   * Execute an operation with comprehensive error handling and logging
   */
  protected async execute<T>(
    operation: () => Promise<T>,
    context: OperationContext
  ): Promise<T> {
    const startTime = Date.now();
    const correlationId = context.correlationId || this.generateCorrelationId();

    this.logOperation('start', context, correlationId);

    try {
      const result = await operation();
      const durationMs = Date.now() - startTime;

      this.logOperation('success', context, correlationId, durationMs);
      this.recordMetrics(context.operation, durationMs, true);
      this.checkSlowQuery(context.operation, durationMs);

      queryMonitor.recordQuery({
        operation: context.operation,
        table: context.table || this.tableName,
        durationMs,
        timestamp: new Date(),
        success: true,
        correlationId,
      });

      return result;
    } catch (error) {
      const durationMs = Date.now() - startTime;

      queryMonitor.recordQuery({
        operation: context.operation,
        table: context.table || this.tableName,
        durationMs,
        timestamp: new Date(),
        success: false,
        correlationId,
        error: error instanceof Error ? error.message : String(error),
      });

      this.logOperation('error', context, correlationId, durationMs, error);
      this.recordMetrics(context.operation, durationMs, false);

      throw this.convertError(error, context);
    }
  }

  /**
   * Execute operation with retry logic for transient failures
   */
  protected async executeWithRetry<T>(
    operation: () => Promise<T>,
    context: OperationContext,
    maxAttempts: number = MAX_RETRY_ATTEMPTS
  ): Promise<T> {
    let lastError: Error | undefined;

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        return await this.execute(operation, context);
      } catch (error) {
        lastError = error as Error;

        if (attempt < maxAttempts && this.isRetryableError(error)) {
          const delayMs = RETRY_DELAY_MS * Math.pow(2, attempt - 1);
          console.warn(`[RETRY] Attempt ${attempt}/${maxAttempts} failed, retrying in ${delayMs}ms`, {
            operation: context.operation,
            correlationId: context.correlationId,
            error: error instanceof Error ? error.message : String(error),
          });
          await this.sleep(delayMs);
        } else {
          throw error;
        }
      }
    }

    throw lastError;
  }

  /**
   * Convert database errors to domain-specific errors
   */
  protected convertError(error: unknown, context: OperationContext): Error {
    if (error instanceof RepositoryError) {
      return error;
    }

    const errorContext: ErrorContext = {
      operation: context.operation,
      table: context.table || this.tableName,
      resource: context.resource,
      resourceId: context.resourceId,
      details: context.metadata,
      cause: error instanceof Error ? error : undefined,
    };

    if (isPostgresError(error)) {
      if (isUniqueViolation(error)) {
        const field = this.extractFieldFromError(error);
        return ConstraintViolationError.uniqueViolation(
          field || 'unknown',
          'duplicate',
          errorContext
        );
      }

      if (isForeignKeyViolation(error)) {
        const field = this.extractFieldFromError(error);
        return ConstraintViolationError.foreignKeyViolation(
          field || 'unknown',
          'unknown',
          errorContext
        );
      }

      if (isNotNullViolation(error)) {
        const field = this.extractFieldFromError(error);
        return ConstraintViolationError.notNullViolation(field || 'unknown', errorContext);
      }

      return new RepositoryError(
        error.message,
        error.code || 'POSTGRES_ERROR',
        errorContext
      );
    }

    if (error instanceof Error) {
      return new RepositoryError(
        error.message,
        'UNKNOWN_ERROR',
        errorContext
      );
    }

    return new RepositoryError(
      'An unknown error occurred',
      'UNKNOWN_ERROR',
      errorContext
    );
  }

  /**
   * Log operation with context
   */
  private logOperation(
    stage: 'start' | 'success' | 'error',
    context: OperationContext,
    correlationId: string,
    durationMs?: number,
    error?: unknown
  ): void {
    const logData = {
      stage,
      correlationId,
      operation: context.operation,
      table: context.table || this.tableName,
      resource: context.resource,
      resourceId: context.resourceId,
      durationMs,
      timestamp: new Date().toISOString(),
      metadata: context.metadata,
    };

    if (stage === 'start') {
      console.log(`[REPO] ${context.operation}`, logData);
    } else if (stage === 'success') {
      console.log(`[REPO] ${context.operation} completed`, logData);
    } else if (stage === 'error') {
      console.error(`[REPO] ${context.operation} failed`, {
        ...logData,
        error: error instanceof Error ? {
          name: error.name,
          message: error.message,
          stack: error.stack,
        } : String(error),
      });
    }
  }

  /**
   * Check if query is slow and log accordingly
   */
  private checkSlowQuery(operation: string, durationMs: number): void {
    if (durationMs > SLOW_QUERY_ERROR_MS) {
      console.error(`[SLOW QUERY] ${operation} took ${durationMs}ms (threshold: ${SLOW_QUERY_ERROR_MS}ms)`, {
        operation,
        durationMs,
        table: this.tableName,
        threshold: SLOW_QUERY_ERROR_MS,
      });
    } else if (durationMs > SLOW_QUERY_WARNING_MS) {
      console.warn(`[SLOW QUERY] ${operation} took ${durationMs}ms (threshold: ${SLOW_QUERY_WARNING_MS}ms)`, {
        operation,
        durationMs,
        table: this.tableName,
        threshold: SLOW_QUERY_WARNING_MS,
      });
    }
  }

  /**
   * Record performance metrics
   */
  private recordMetrics(operation: string, durationMs: number, success: boolean): void {
    this.performanceMetrics.push({
      operation,
      durationMs,
      success,
      timestamp: new Date(),
    });

    if (this.performanceMetrics.length > 1000) {
      this.performanceMetrics.shift();
    }
  }

  /**
   * Get performance metrics for this repository
   */
  public getMetrics(): PerformanceMetrics[] {
    return [...this.performanceMetrics];
  }

  /**
   * Extract field name from Postgres error
   */
  private extractFieldFromError(error: unknown): string | null {
    if (error instanceof Error && 'message' in error) {
      const match = error.message.match(/Key \((.*?)\)=/);
      if (match) {
        return match[1];
      }
    }
    return null;
  }

  /**
   * Check if error is retryable
   */
  private isRetryableError(error: unknown): boolean {
    if (error instanceof Error) {
      const message = error.message.toLowerCase();
      return (
        message.includes('network') ||
        message.includes('timeout') ||
        message.includes('connection') ||
        message.includes('econnreset') ||
        message.includes('enotfound')
      );
    }
    return false;
  }

  /**
   * Generate correlation ID for tracking
   */
  private generateCorrelationId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Sleep utility for retries
   */
  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Validate UUID format
   */
  protected isValidUuid(uuid: string): boolean {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    return uuidRegex.test(uuid);
  }

  /**
   * Validate required string field
   */
  protected validateRequired(value: unknown, field: string): void {
    if (value === null || value === undefined || value === '') {
      throw ValidationError.single(field, `${field} is required`);
    }
  }

  /**
   * Validate string length
   */
  protected validateLength(
    value: string,
    field: string,
    min?: number,
    max?: number
  ): void {
    if (min !== undefined && value.length < min) {
      throw ValidationError.single(
        field,
        `${field} must be at least ${min} characters`,
        value
      );
    }
    if (max !== undefined && value.length > max) {
      throw ValidationError.single(
        field,
        `${field} must not exceed ${max} characters`,
        value
      );
    }
  }

  /**
   * Validate number range
   */
  protected validateRange(
    value: number,
    field: string,
    min?: number,
    max?: number
  ): void {
    if (min !== undefined && value < min) {
      throw ValidationError.single(
        field,
        `${field} must be at least ${min}`,
        value
      );
    }
    if (max !== undefined && value > max) {
      throw ValidationError.single(
        field,
        `${field} must not exceed ${max}`,
        value
      );
    }
  }

  /**
   * Validate enum value
   */
  protected validateEnum<T extends string>(
    value: T,
    field: string,
    allowedValues: readonly T[]
  ): void {
    if (!allowedValues.includes(value)) {
      throw ValidationError.single(
        field,
        `${field} must be one of: ${allowedValues.join(', ')}`,
        value
      );
    }
  }

  /**
   * Get from cache or execute function
   */
  protected async getFromCacheOrExecute<T>(
    cacheKey: string,
    operation: () => Promise<T>,
    namespace: string = 'default',
    ttl?: number
  ): Promise<T> {
    const cached = repositoryCache.get<T>(cacheKey, namespace);
    if (cached !== null) {
      return cached;
    }

    const result = await operation();
    repositoryCache.set(cacheKey, result, namespace, ttl);
    return result;
  }

  /**
   * Invalidate cache
   */
  protected invalidateCache(key: string, namespace: string = 'default'): void {
    repositoryCache.delete(key, namespace);
  }

  /**
   * Invalidate cache namespace
   */
  protected invalidateCacheNamespace(namespace: string): void {
    repositoryCache.invalidateNamespace(namespace);
  }
}
