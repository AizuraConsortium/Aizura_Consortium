/**
 * Base Service Class
 *
 * Provides common functionality for all service classes.
 * Includes error handling, logging, validation, and transaction support.
 */

import {
  ServiceResult,
  ServiceError,
  ValidationResult,
  BusinessRule,
} from '../types/services.js';
import { ErrorLogger } from './errorLogger.js';

/**
 * Base Service class with common functionality
 *
 * All service classes should extend this class to inherit:
 * - Standard error handling
 * - Logging helpers
 * - Validation patterns
 * - Guard clause utilities
 */
export abstract class BaseService {
  protected errorLogger: ErrorLogger;
  protected serviceName: string;

  constructor(serviceName: string) {
    this.serviceName = serviceName;
    this.errorLogger = ErrorLogger.getInstance();
  }

  /**
   * Create a successful service result
   *
   * @param data - Result data
   * @returns Success result
   */
  protected success<T>(data: T): ServiceResult<T> {
    return { success: true, data };
  }

  /**
   * Create a failed service result
   *
   * @param code - Error code
   * @param message - Error message
   * @param details - Additional error details
   * @param originalError - Original error if any
   * @returns Failure result
   */
  protected failure<T>(
    code: string,
    message: string,
    details?: Record<string, any>,
    originalError?: Error
  ): ServiceResult<T> {
    const error: ServiceError = {
      code,
      message,
      details,
      originalError,
    };

    // Log the error
    this.logError(code, message, originalError, details);

    return { success: false, error };
  }

  /**
   * Log an error to the error logging system
   *
   * @param errorType - Type of error
   * @param message - Error message
   * @param error - Original error
   * @param metadata - Additional metadata
   * @protected
   */
  protected async logError(
    errorType: string,
    message: string,
    error?: Error,
    metadata?: Record<string, any>
  ): Promise<void> {
    try {
      await this.errorLogger.logBackendError(errorType, message, {
        stackTrace: error?.stack,
        metadata: {
          service: this.serviceName,
          ...metadata,
        },
      });
    } catch (logError) {
      console.error('Failed to log service error:', logError);
    }
  }

  /**
   * Validate data against business rules
   *
   * @param data - Data to validate
   * @param rules - Business rules to apply
   * @returns Validation result
   * @protected
   */
  protected async validateRules<T>(
    data: T,
    rules: BusinessRule<T>[]
  ): Promise<ValidationResult> {
    const errors: Array<{ field: string; message: string; code: string }> = [];

    for (const rule of rules) {
      try {
        const isValid = await rule.validate(data);
        if (!isValid) {
          errors.push({
            field: rule.name,
            message: rule.errorMessage,
            code: `RULE_${rule.name.toUpperCase()}`,
          });
        }
      } catch (error) {
        errors.push({
          field: rule.name,
          message: `Validation failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
          code: 'VALIDATION_ERROR',
        });
      }
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }

  /**
   * Guard clause - throw error if condition is false
   *
   * @param condition - Condition to check
   * @param message - Error message if condition fails
   * @param code - Error code
   * @throws Error if condition is false
   * @protected
   */
  protected guard(condition: boolean, message: string, code = 'GUARD_FAILED'): asserts condition {
    if (!condition) {
      throw new Error(`${code}: ${message}`);
    }
  }

  /**
   * Guard clause - throw error if value is null or undefined
   *
   * @param value - Value to check
   * @param message - Error message if value is nullish
   * @param code - Error code
   * @throws Error if value is nullish
   * @protected
   */
  protected guardNotNull<T>(
    value: T | null | undefined,
    message: string,
    code = 'VALUE_NULL'
  ): asserts value is T {
    if (value === null || value === undefined) {
      throw new Error(`${code}: ${message}`);
    }
  }

  /**
   * Guard clause - throw error if array is empty
   *
   * @param array - Array to check
   * @param message - Error message if array is empty
   * @param code - Error code
   * @throws Error if array is empty
   * @protected
   */
  protected guardNotEmpty<T>(
    array: T[],
    message: string,
    code = 'ARRAY_EMPTY'
  ): void {
    if (array.length === 0) {
      throw new Error(`${code}: ${message}`);
    }
  }

  /**
   * Execute function with error handling
   *
   * Wraps a function call with try/catch and returns a ServiceResult.
   * Automatically logs errors and converts them to service errors.
   *
   * @param fn - Function to execute
   * @param errorCode - Error code for failures
   * @param errorMessage - Error message for failures
   * @returns Service result
   * @protected
   */
  protected async tryExecute<T>(
    fn: () => Promise<T>,
    errorCode: string,
    errorMessage: string
  ): Promise<ServiceResult<T>> {
    try {
      const result = await fn();
      return this.success(result);
    } catch (error) {
      return this.failure(
        errorCode,
        errorMessage,
        { originalMessage: error instanceof Error ? error.message : String(error) },
        error instanceof Error ? error : undefined
      );
    }
  }

  /**
   * Execute function with retry logic
   *
   * @param fn - Function to execute
   * @param maxRetries - Maximum number of retries
   * @param delayMs - Delay between retries in milliseconds
   * @returns Result of function
   * @protected
   */
  protected async retry<T>(
    fn: () => Promise<T>,
    maxRetries = 3,
    delayMs = 1000
  ): Promise<T> {
    let lastError: Error | undefined;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        return await fn();
      } catch (error) {
        lastError = error instanceof Error ? error : new Error(String(error));

        if (attempt < maxRetries) {
          await this.delay(delayMs * attempt);
        }
      }
    }

    throw lastError || new Error('Retry failed');
  }

  /**
   * Delay execution for specified milliseconds
   *
   * @param ms - Milliseconds to delay
   * @private
   */
  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  /**
   * Log info message
   *
   * @param message - Message to log
   * @param metadata - Additional metadata
   * @protected
   */
  protected logInfo(message: string, metadata?: Record<string, any>): void {
    console.log(`[${this.serviceName}] ${message}`, metadata || '');
  }

  /**
   * Log warning message
   *
   * @param message - Warning message
   * @param metadata - Additional metadata
   * @protected
   */
  protected logWarning(message: string, metadata?: Record<string, any>): void {
    console.warn(`[${this.serviceName}] WARNING: ${message}`, metadata || '');
  }

  /**
   * Validate required fields are present
   *
   * @param data - Object to validate
   * @param requiredFields - Array of required field names
   * @throws Error if any required field is missing
   * @protected
   */
  protected validateRequiredFields(
    data: Record<string, any>,
    requiredFields: string[]
  ): void {
    for (const field of requiredFields) {
      if (data[field] === undefined || data[field] === null || data[field] === '') {
        throw new Error(`Required field missing: ${field}`);
      }
    }
  }
}
