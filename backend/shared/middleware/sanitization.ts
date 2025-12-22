/**
 * Request Sanitization Middleware
 *
 * Sanitizes request data before reaching controllers.
 * Prevents XSS, SQL injection, and other security threats.
 */

import { Request, Response, NextFunction } from 'express';
import { sanitizeText } from '../utils/sanitization.js';

/**
 * Sanitization schema for fields
 */
export interface SanitizationSchema {
  [field: string]: {
    maxLength?: number;
    allowHtml?: boolean;
    required?: boolean;
  };
}

/**
 * Sanitize Request Body Middleware
 *
 * Sanitizes specified fields in request body according to schema.
 * Prevents XSS and injection attacks.
 *
 * @param schema - Sanitization rules for each field
 * @returns Express middleware function
 *
 * @example
 * router.post('/items',
 *   sanitizeBody({
 *     title: { maxLength: 200, required: true },
 *     description: { maxLength: 2000 },
 *     tags: { maxLength: 50 }
 *   }),
 *   controller.createItem
 * );
 */
export function sanitizeBody(schema: SanitizationSchema) {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      if (!req.body || typeof req.body !== 'object') {
        next();
        return;
      }

      const sanitized: Record<string, any> = { ...req.body };

      for (const [field, rules] of Object.entries(schema)) {
        const value = req.body[field];

        // Check required fields
        if (rules.required && (value === undefined || value === null || value === '')) {
          res.status(400).json({
            error: 'Validation failed',
            message: `Field '${field}' is required`,
          });
          return;
        }

        // Skip undefined/null optional fields
        if (value === undefined || value === null) {
          continue;
        }

        // Sanitize string fields
        if (typeof value === 'string') {
          sanitized[field] = sanitizeText(value, rules.maxLength);
        }
        // Sanitize array of strings
        else if (Array.isArray(value)) {
          sanitized[field] = value.map((item) =>
            typeof item === 'string' ? sanitizeText(item, rules.maxLength) : item
          );
        }
        // Keep other types as-is (numbers, booleans, objects)
        else {
          sanitized[field] = value;
        }
      }

      req.body = sanitized;
      next();
    } catch (error) {
      res.status(500).json({
        error: 'Sanitization failed',
        message: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  };
}

/**
 * Sanitize Query Parameters Middleware
 *
 * Sanitizes specified query parameters according to schema.
 *
 * @param schema - Sanitization rules for each parameter
 * @returns Express middleware function
 *
 * @example
 * router.get('/items',
 *   sanitizeQuery({
 *     search: { maxLength: 100 },
 *     filter: { maxLength: 50 }
 *   }),
 *   controller.getItems
 * );
 */
export function sanitizeQuery(schema: SanitizationSchema) {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      if (!req.query || typeof req.query !== 'object') {
        next();
        return;
      }

      const sanitized: Record<string, any> = { ...req.query };

      for (const [param, rules] of Object.entries(schema)) {
        const value = req.query[param];

        // Check required params
        if (rules.required && (value === undefined || value === null || value === '')) {
          res.status(400).json({
            error: 'Validation failed',
            message: `Query parameter '${param}' is required`,
          });
          return;
        }

        // Skip undefined/null optional params
        if (value === undefined || value === null) {
          continue;
        }

        // Sanitize string params
        if (typeof value === 'string') {
          sanitized[param] = sanitizeText(value, rules.maxLength);
        }
        // Sanitize array of strings
        else if (Array.isArray(value)) {
          sanitized[param] = value.map((item) =>
            typeof item === 'string' ? sanitizeText(item, rules.maxLength) : item
          );
        }
        // Keep other types as-is
        else {
          sanitized[param] = value;
        }
      }

      req.query = sanitized;
      next();
    } catch (error) {
      res.status(500).json({
        error: 'Sanitization failed',
        message: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  };
}

/**
 * Sanitize All Text Fields Middleware
 *
 * Automatically sanitizes all string fields in request body and query.
 * Useful as a catch-all security measure.
 *
 * @param maxLength - Maximum length for all text fields (default: 1000)
 * @returns Express middleware function
 */
export function sanitizeAllText(maxLength: number = 1000) {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      // Sanitize body
      if (req.body && typeof req.body === 'object') {
        req.body = sanitizeObject(req.body, maxLength);
      }

      // Sanitize query
      if (req.query && typeof req.query === 'object') {
        req.query = sanitizeObject(req.query as Record<string, any>, maxLength);
      }

      next();
    } catch (error) {
      res.status(500).json({
        error: 'Sanitization failed',
        message: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  };
}

/**
 * Recursively sanitize all strings in an object
 * @private
 */
function sanitizeObject(obj: Record<string, any>, maxLength: number): Record<string, any> {
  const sanitized: Record<string, any> = {};

  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === 'string') {
      sanitized[key] = sanitizeText(value, maxLength);
    } else if (Array.isArray(value)) {
      sanitized[key] = value.map((item) =>
        typeof item === 'string'
          ? sanitizeText(item, maxLength)
          : typeof item === 'object' && item !== null
          ? sanitizeObject(item, maxLength)
          : item
      );
    } else if (typeof value === 'object' && value !== null) {
      sanitized[key] = sanitizeObject(value, maxLength);
    } else {
      sanitized[key] = value;
    }
  }

  return sanitized;
}
