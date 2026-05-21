/**
 * Error Handler Utility
 *
 * Standardizes error handling across all controllers.
 * Maps errors to appropriate HTTP status codes and formats responses.
 */

import { Response } from 'express';
import { isHttpError, isOperationalError } from '../errors/HttpErrors.js';
import { ErrorLogger } from '../services/errorLogger.js';

const errorLogger = ErrorLogger.getInstance();

/**
 * Error context for logging
 */
export interface ErrorContext {
  requestPath?: string;
  requestMethod?: string;
  userId?: string;
  requestId?: string;
  metadata?: Record<string, any>;
}

/**
 * Standard error response format
 */
export interface ErrorResponse {
  error: string;
  message: string;
  statusCode: number;
  details?: any;
  stack?: string;
  requestId?: string;
}

/**
 * Handle controller errors in a standardized way
 *
 * Maps error types to HTTP status codes and formats consistent responses.
 * Logs errors appropriately based on severity.
 *
 * @param error - The error to handle
 * @param res - Express response object
 * @param context - Additional context for logging
 *
 * @example
 * try {
 *   const result = await service.getData();
 *   res.json(result);
 * } catch (error) {
 *   handleControllerError(error, res, {
 *     requestPath: req.path,
 *     requestMethod: req.method,
 *     userId: req.userId
 *   });
 * }
 */
export function handleControllerError(
  error: unknown,
  res: Response,
  context: ErrorContext = {}
): void {
  // Create error response
  const errorResponse = createErrorResponse(error, context);

  // Log error if appropriate
  if (shouldLogError(error)) {
    logError(error, context);
  }

  // Send response
  res.status(errorResponse.statusCode).json(errorResponse);
}

/**
 * Create standardized error response object
 *
 * @param error - The error to format
 * @param context - Additional context
 * @returns Formatted error response
 */
export function createErrorResponse(
  error: unknown,
  context: ErrorContext = {}
): ErrorResponse {
  // Handle HttpError instances
  if (isHttpError(error)) {
    return {
      error: error.name,
      message: error.message,
      statusCode: error.statusCode,
      details: error.details,
      ...(process.env.NODE_ENV === 'development' && { stack: error.stack }),
      ...(context.requestId && { requestId: context.requestId }),
    };
  }

  // Handle standard Error instances
  if (error instanceof Error) {
    const statusCode = getStatusCode(error);
    return {
      error: error.name || 'Error',
      message: sanitizeErrorMessage(error.message, statusCode),
      statusCode,
      ...(process.env.NODE_ENV === 'development' && { stack: error.stack }),
      ...(context.requestId && { requestId: context.requestId }),
    };
  }

  // Handle unknown error types
  return {
    error: 'UnknownError',
    message: 'An unexpected error occurred',
    statusCode: 500,
    ...(process.env.NODE_ENV === 'development' && {
      details: String(error),
    }),
    ...(context.requestId && { requestId: context.requestId }),
  };
}

/**
 * Get HTTP status code from error
 *
 * @param error - The error to analyze
 * @returns HTTP status code
 */
export function getStatusCode(error: unknown): number {
  // HttpError instances have statusCode
  if (isHttpError(error)) {
    return error.statusCode;
  }

  // Check for common error patterns
  if (error instanceof Error) {
    const message = error.message.toLowerCase();

    // Validation errors
    if (
      message.includes('validation') ||
      message.includes('invalid') ||
      message.includes('required')
    ) {
      return 422;
    }

    // Not found errors
    if (message.includes('not found') || message.includes('does not exist')) {
      return 404;
    }

    // Duplicate/conflict errors
    if (message.includes('duplicate') || message.includes('already exists')) {
      return 409;
    }

    // Permission errors
    if (
      message.includes('permission') ||
      message.includes('forbidden') ||
      message.includes('unauthorized')
    ) {
      return 403;
    }
  }

  // Default to 500 for unknown errors
  return 500;
}

/**
 * Sanitize error message for production
 * Hides sensitive information in production environments
 *
 * @param message - Original error message
 * @param statusCode - HTTP status code
 * @returns Sanitized message
 */
function sanitizeErrorMessage(message: string, statusCode: number): string {
  // In development, return original message
  if (process.env.NODE_ENV === 'development') {
    return message;
  }

  // In production, hide internal error details for 5xx errors
  if (statusCode >= 500) {
    return 'An internal server error occurred';
  }

  // For 4xx errors, return the message (it's client-facing)
  return message;
}

/**
 * Determine if error should be logged
 *
 * @param error - The error to check
 * @returns True if error should be logged
 */
function shouldLogError(error: unknown): boolean {
  // Always log non-operational errors (programming errors)
  if (!isOperationalError(error)) {
    return true;
  }

  // Log 5xx errors (server errors)
  if (isHttpError(error) && error.statusCode >= 500) {
    return true;
  }

  // Don't log expected client errors (4xx)
  return false;
}

/**
 * Log error to error logging system
 *
 * @param error - The error to log
 * @param context - Additional context
 */
function logError(error: unknown, context: ErrorContext): void {
  const errorMessage = error instanceof Error ? error.message : String(error);
  const stackTrace = error instanceof Error ? error.stack : undefined;

  errorLogger.logBackendError(
    'CONTROLLER_ERROR',
    errorMessage,
    {
      requestPath: context.requestPath,
      requestMethod: context.requestMethod,
      stackTrace,
      metadata: {
        ...context.metadata,
        userId: context.userId,
        isOperational: isOperationalError(error),
        statusCode: getStatusCode(error),
      },
    }
  ).catch((logError) => {
    console.error('Failed to log error:', logError);
  });
}

/**
 * Async error wrapper for controller methods
 * Automatically catches and handles errors
 *
 * @param fn - Async controller method
 * @returns Wrapped method with error handling
 *
 * @example
 * async getItems(req: Request, res: Response) {
 *   return asyncErrorHandler(async () => {
 *     const items = await service.getItems();
 *     res.json(items);
 *   })(req, res);
 * }
 */
export function asyncErrorHandler<T>(
  fn: (req: any, res: Response) => Promise<T>
) {
  return async (req: any, res: Response): Promise<void> => {
    try {
      await fn(req, res);
    } catch (error) {
      handleControllerError(error, res, {
        requestPath: req.path,
        requestMethod: req.method,
        userId: req.userId || req.user?.id,
      });
    }
  };
}
