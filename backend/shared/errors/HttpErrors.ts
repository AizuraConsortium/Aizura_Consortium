/**
 * HTTP Error Classes
 *
 * Type-safe custom error classes for consistent HTTP error handling.
 * Each error maps to a specific HTTP status code.
 */

/**
 * Base HTTP Error class
 * All custom HTTP errors extend this class
 */
export class HttpError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;
  public readonly details?: any;

  constructor(
    message: string,
    statusCode: number,
    isOperational: boolean = true,
    details?: any
  ) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.details = details;

    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * 400 Bad Request
 * Client sent invalid data
 */
export class BadRequestError extends HttpError {
  constructor(message: string = 'Bad request', details?: any) {
    super(message, 400, true, details);
  }
}

/**
 * 401 Unauthorized
 * Authentication is required
 */
export class UnauthorizedError extends HttpError {
  constructor(message: string = 'Authentication required', details?: any) {
    super(message, 401, true, details);
  }
}

/**
 * 403 Forbidden
 * User is authenticated but doesn't have permission
 */
export class ForbiddenError extends HttpError {
  constructor(message: string = 'Access denied', details?: any) {
    super(message, 403, true, details);
  }
}

/**
 * 404 Not Found
 * Resource doesn't exist
 */
export class NotFoundError extends HttpError {
  constructor(message: string = 'Resource not found', details?: any) {
    super(message, 404, true, details);
  }
}

/**
 * 409 Conflict
 * Request conflicts with current state (e.g., duplicate entry)
 */
export class ConflictError extends HttpError {
  constructor(message: string = 'Resource conflict', details?: any) {
    super(message, 409, true, details);
  }
}

/**
 * 422 Unprocessable Entity
 * Validation failed
 */
export class ValidationError extends HttpError {
  constructor(message: string = 'Validation failed', details?: any) {
    super(message, 422, true, details);
  }
}

/**
 * 429 Too Many Requests
 * Rate limit exceeded
 */
export class RateLimitError extends HttpError {
  constructor(message: string = 'Too many requests', details?: any) {
    super(message, 429, true, details);
  }
}

/**
 * 500 Internal Server Error
 * Unexpected server error
 */
export class InternalServerError extends HttpError {
  constructor(message: string = 'Internal server error', details?: any) {
    super(message, 500, false, details);
  }
}

/**
 * 503 Service Unavailable
 * Service temporarily unavailable (e.g., database down)
 */
export class ServiceUnavailableError extends HttpError {
  constructor(message: string = 'Service temporarily unavailable', details?: any) {
    super(message, 503, true, details);
  }
}

/**
 * Type guard to check if error is an HttpError
 */
export function isHttpError(error: any): error is HttpError {
  return error instanceof HttpError;
}

/**
 * Type guard to check if error is operational
 * Operational errors are expected and handled gracefully
 * Non-operational errors are programming errors that should crash
 */
export function isOperationalError(error: any): boolean {
  if (isHttpError(error)) {
    return error.isOperational;
  }
  return false;
}
