/**
 * Base Controller Class
 *
 * Provides common functionality for all controller classes.
 * Includes standard response methods, error handling, and data extraction.
 */

import { Request, Response } from 'express';
import { handleControllerError } from '../utils/errorHandler.js';
import {
  ApiResponse,
  PaginatedResponse,
  SuccessResponse,
} from '../types/controllers.js';
import { PaginatedRequest, getPaginationMeta } from '../middleware/pagination.js';

/**
 * Base Controller class with common functionality
 *
 * All controller classes should extend this class to inherit:
 * - Standard response methods
 * - Error handling wrappers
 * - Data extraction helpers
 */
export abstract class BaseController {
  protected controllerName: string;

  constructor(controllerName: string) {
    this.controllerName = controllerName;
  }

  /**
   * Send successful JSON response (200 OK)
   *
   * @param res - Express response
   * @param data - Response data
   * @param message - Optional success message
   * @protected
   */
  protected ok<T>(res: Response, data: T, message?: string): void {
    const response: ApiResponse<T> = {
      data,
      ...(message && { message }),
    };
    res.status(200).json(response);
  }

  /**
   * Send created response (201 Created)
   *
   * @param res - Express response
   * @param data - Created resource data
   * @param message - Optional success message
   * @protected
   */
  protected created<T>(res: Response, data: T, message?: string): void {
    const response: ApiResponse<T> = {
      data,
      message: message || 'Resource created successfully',
    };
    res.status(201).json(response);
  }

  /**
   * Send no content response (204 No Content)
   *
   * @param res - Express response
   * @protected
   */
  protected noContent(res: Response): void {
    res.status(204).send();
  }

  /**
   * Send paginated response (200 OK)
   *
   * @param req - Express request with pagination
   * @param res - Express response
   * @param data - Array of data items
   * @param total - Total count of items
   * @protected
   */
  protected paginated<T>(
    req: Request,
    res: Response,
    data: T[],
    total: number
  ): void {
    const pagination = getPaginationMeta(req as PaginatedRequest, total);
    const response: PaginatedResponse<T> = {
      data,
      pagination,
    };
    res.status(200).json(response);
  }

  /**
   * Send not found response (404 Not Found)
   *
   * @param res - Express response
   * @param message - Error message
   * @protected
   */
  protected notFound(res: Response, message = 'Resource not found'): void {
    res.status(404).json({
      error: 'Not Found',
      message,
    });
  }

  /**
   * Send bad request response (400 Bad Request)
   *
   * @param res - Express response
   * @param message - Error message
   * @param details - Additional error details
   * @protected
   */
  protected badRequest(
    res: Response,
    message: string,
    details?: any
  ): void {
    res.status(400).json({
      error: 'Bad Request',
      message,
      ...(details && { details }),
    });
  }

  /**
   * Send unauthorized response (401 Unauthorized)
   *
   * @param res - Express response
   * @param message - Error message
   * @protected
   */
  protected unauthorized(res: Response, message = 'Authentication required'): void {
    res.status(401).json({
      error: 'Unauthorized',
      message,
    });
  }

  /**
   * Send forbidden response (403 Forbidden)
   *
   * @param res - Express response
   * @param message - Error message
   * @protected
   */
  protected forbidden(res: Response, message = 'Access denied'): void {
    res.status(403).json({
      error: 'Forbidden',
      message,
    });
  }

  /**
   * Send conflict response (409 Conflict)
   *
   * @param res - Express response
   * @param message - Error message
   * @protected
   */
  protected conflict(res: Response, message: string): void {
    res.status(409).json({
      error: 'Conflict',
      message,
    });
  }

  /**
   * Send validation error response (422 Unprocessable Entity)
   *
   * @param res - Express response
   * @param message - Error message
   * @param errors - Validation errors
   * @protected
   */
  protected validationError(
    res: Response,
    message: string,
    errors?: any[]
  ): void {
    res.status(422).json({
      error: 'Validation Error',
      message,
      ...(errors && { errors }),
    });
  }

  /**
   * Send internal server error response (500 Internal Server Error)
   *
   * @param res - Express response
   * @param message - Error message
   * @protected
   */
  protected serverError(res: Response, message = 'Internal server error'): void {
    res.status(500).json({
      error: 'Internal Server Error',
      message,
    });
  }

  /**
   * Handle error with standard error handler
   *
   * @param error - Error to handle
   * @param req - Express request (accepts AuthenticatedRequest or regular Request)
   * @param res - Express response
   * @protected
   */
  protected handleError(error: unknown, req: any, res: Response): void {
    handleControllerError(error, res, {
      requestPath: req.path,
      requestMethod: req.method,
      userId: req.user?.id,
    });
  }

  /**
   * Extract user ID from request
   * Assumes requireUserId middleware has run
   *
   * @param req - Express request (accepts AuthenticatedRequest or regular Request)
   * @returns User ID
   * @protected
   */
  protected getUserId(req: any): string {
    const userId = req.user?.id;
    if (!userId) {
      throw new Error('User ID not found in request');
    }
    return userId;
  }

  /**
   * Extract pagination from request
   * Assumes parsePagination middleware has run
   *
   * @param req - Express request
   * @returns Pagination parameters
   * @protected
   */
  protected getPagination(req: Request): { limit: number; offset: number } {
    const paginatedReq = req as PaginatedRequest;
    if (!paginatedReq.pagination) {
      return { limit: 50, offset: 0 };
    }
    return paginatedReq.pagination;
  }

  /**
   * Extract query parameter as string
   *
   * @param req - Express request
   * @param param - Parameter name
   * @param defaultValue - Default value if not present
   * @returns Parameter value
   * @protected
   */
  protected getQueryParam(
    req: Request,
    param: string,
    defaultValue?: string
  ): string | undefined {
    const value = req.query[param];
    if (typeof value === 'string') {
      return value;
    }
    return defaultValue;
  }

  /**
   * Extract query parameter as number
   *
   * @param req - Express request
   * @param param - Parameter name
   * @param defaultValue - Default value if not present or invalid
   * @returns Parameter value as number
   * @protected
   */
  protected getQueryParamAsNumber(
    req: Request,
    param: string,
    defaultValue?: number
  ): number | undefined {
    const value = req.query[param];
    if (typeof value === 'string') {
      const parsed = parseInt(value, 10);
      if (!isNaN(parsed)) {
        return parsed;
      }
    }
    return defaultValue;
  }

  /**
   * Extract query parameter as boolean
   *
   * @param req - Express request
   * @param param - Parameter name
   * @param defaultValue - Default value if not present
   * @returns Parameter value as boolean
   * @protected
   */
  protected getQueryParamAsBoolean(
    req: Request,
    param: string,
    defaultValue?: boolean
  ): boolean | undefined {
    const value = req.query[param];
    if (typeof value === 'string') {
      return value === 'true' || value === '1';
    }
    return defaultValue;
  }

  /**
   * Log controller action
   *
   * @param action - Action being performed
   * @param metadata - Additional metadata
   * @protected
   */
  protected log(action: string, metadata?: Record<string, any>): void {
    console.log(`[${this.controllerName}] ${action}`, metadata || '');
  }
}
