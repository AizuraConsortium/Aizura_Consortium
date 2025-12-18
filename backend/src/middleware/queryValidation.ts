import type { Request, Response, NextFunction } from 'express';
import { validatePaginationParams, QueryValidationError } from '../utils/queryValidation.js';
import { logValidationFailure } from '../utils/validationLogger.js';
import type { ValidationErrorResponse } from '../../../shared/types/validation.js';

export function validatePagination() {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const validated = validatePaginationParams(req.query);

      req.query.limit = String(validated.limit);
      req.query.offset = String(validated.offset);

      next();
    } catch (error) {
      if (error instanceof QueryValidationError) {
        logValidationFailure(req, error.details);

        const response: ValidationErrorResponse = {
          error: error.message,
          code: 'VALIDATION_ERROR',
          details: error.details,
          timestamp: new Date().toISOString()
        };

        return res.status(400).json(response);
      }

      console.error('Unexpected validation error:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  };
}

export function createQueryValidator<T extends Record<string, any>>(
  validator: (query: any) => T
) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const validated = validator(req.query);

      req.query = validated as any;

      next();
    } catch (error) {
      if (error instanceof QueryValidationError) {
        logValidationFailure(req, error.details);

        const response: ValidationErrorResponse = {
          error: error.message,
          code: 'VALIDATION_ERROR',
          details: error.details,
          timestamp: new Date().toISOString()
        };

        return res.status(400).json(response);
      }

      console.error('Unexpected validation error:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  };
}
