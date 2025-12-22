/**
 * Pagination Middleware
 *
 * Parses and validates pagination parameters from query strings.
 * Sets standardized pagination object in request for controller access.
 */

import { Request, Response, NextFunction } from 'express';

/**
 * Extended Express Request with pagination
 */
export interface PaginatedRequest extends Request {
  pagination: {
    limit: number;
    offset: number;
    page?: number;
  };
}

export interface PaginationOptions {
  defaultLimit?: number;
  maxLimit?: number;
  allowPageParam?: boolean;
}

/**
 * Parse and validate pagination parameters
 *
 * Creates middleware that extracts limit/offset (or page) from query params,
 * validates them, applies defaults and limits, and sets them in req.pagination.
 *
 * @param options - Configuration for pagination
 * @returns Express middleware function
 *
 * @example
 * router.get('/items',
 *   parsePagination({ defaultLimit: 20, maxLimit: 100 }),
 *   controller.getItems
 * );
 */
export function parsePagination(options: PaginationOptions = {}) {
  const {
    defaultLimit = 50,
    maxLimit = 100,
    allowPageParam = false,
  } = options;

  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      let limit = defaultLimit;
      let offset = 0;
      let page: number | undefined;

      // Parse limit
      if (req.query.limit) {
        const parsedLimit = parseInt(req.query.limit as string, 10);
        if (isNaN(parsedLimit) || parsedLimit < 1) {
          res.status(400).json({
            error: 'Invalid pagination parameter',
            message: 'Limit must be a positive integer',
          });
          return;
        }
        limit = Math.min(parsedLimit, maxLimit);
      }

      // Parse offset or page
      if (allowPageParam && req.query.page) {
        const parsedPage = parseInt(req.query.page as string, 10);
        if (isNaN(parsedPage) || parsedPage < 1) {
          res.status(400).json({
            error: 'Invalid pagination parameter',
            message: 'Page must be a positive integer',
          });
          return;
        }
        page = parsedPage;
        offset = (parsedPage - 1) * limit;
      } else if (req.query.offset) {
        const parsedOffset = parseInt(req.query.offset as string, 10);
        if (isNaN(parsedOffset) || parsedOffset < 0) {
          res.status(400).json({
            error: 'Invalid pagination parameter',
            message: 'Offset must be a non-negative integer',
          });
          return;
        }
        offset = parsedOffset;
        if (allowPageParam) {
          page = Math.floor(offset / limit) + 1;
        }
      }

      // Set pagination in request
      (req as PaginatedRequest).pagination = {
        limit,
        offset,
        ...(page !== undefined && { page }),
      };

      next();
    } catch (error) {
      res.status(400).json({
        error: 'Pagination parsing failed',
        message: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  };
}

/**
 * Get pagination metadata for response
 * Helper to include in API responses
 *
 * @param req - Request with pagination
 * @param total - Total number of items
 * @returns Pagination metadata object
 */
export function getPaginationMeta(req: PaginatedRequest, total: number) {
  const { limit, offset, page } = req.pagination;
  const totalPages = Math.ceil(total / limit);
  const currentPage = page || Math.floor(offset / limit) + 1;

  return {
    limit,
    offset,
    page: currentPage,
    totalPages,
    total,
    hasNext: offset + limit < total,
    hasPrev: offset > 0,
  };
}
