import { z } from 'zod';
import type { Request, Response, NextFunction } from 'express';
import { PAGINATION_CONSTRAINTS } from '../../../shared/types/validation.js';
import type { ValidationErrorResponse } from '../../../shared/types/validation.js';

export const paginationSchema = z.object({
  limit: z.coerce
    .number({
      invalid_type_error: 'limit must be a number',
    })
    .int('limit must be an integer')
    .min(PAGINATION_CONSTRAINTS.limit.min, `limit must be at least ${PAGINATION_CONSTRAINTS.limit.min}`)
    .max(PAGINATION_CONSTRAINTS.limit.max, `limit must be at most ${PAGINATION_CONSTRAINTS.limit.max}`)
    .default(PAGINATION_CONSTRAINTS.limit.default),
  offset: z.coerce
    .number({
      invalid_type_error: 'offset must be a number',
    })
    .int('offset must be an integer')
    .min(PAGINATION_CONSTRAINTS.offset.min, `offset must be at least ${PAGINATION_CONSTRAINTS.offset.min}`)
    .max(PAGINATION_CONSTRAINTS.offset.max, `offset must be at most ${PAGINATION_CONSTRAINTS.offset.max}`)
    .default(PAGINATION_CONSTRAINTS.offset.default),
});

export const dateRangeSchema = z.object({
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
});

export const severitySchema = z.enum(['info', 'warning', 'error', 'critical']);

export const sourceSchema = z.enum(['frontend', 'backend', 'agent']);

export const agentIdSchema = z.enum(['claude', 'chatgpt', 'grok', 'gemini', 'deepseek', 'qwen']).nullable().optional();

export const errorLogSchema = z.object({
  source: sourceSchema,
  severity: severitySchema,
  error_type: z.string()
    .min(1, 'error_type is required')
    .max(100, 'error_type must be at most 100 characters'),
  message: z.string()
    .min(1, 'message is required')
    .max(1000, 'message must be at most 1000 characters'),
  details: z.record(z.any()).optional(),
  agent_id: agentIdSchema,
  topic_id: z.string().uuid().optional(),
  appName: z.string().max(50).optional(),
});

export function createQueryValidator<T extends z.ZodType>(schema: T) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = schema.safeParse(req.query);

      if (!result.success) {
        const firstError = result.error.errors[0];
        const errorResponse: ValidationErrorResponse = {
          error: 'Validation failed',
          code: 'VALIDATION_ERROR',
          details: {
            param: firstError.path.join('.'),
            provided: String(req.query[firstError.path[0] as string] || null),
            expected: firstError.message
          },
          timestamp: new Date().toISOString()
        };

        return res.status(400).json(errorResponse);
      }

      req.query = result.data;
      next();
    } catch (error) {
      console.error('Validation middleware error:', error);
      res.status(500).json({ error: 'Validation error' });
    }
  };
}

export function createBodyValidator<T extends z.ZodType>(schema: T) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = schema.safeParse(req.body);

      if (!result.success) {
        const firstError = result.error.errors[0];
        const errorResponse: ValidationErrorResponse = {
          error: 'Validation failed',
          code: 'VALIDATION_ERROR',
          details: {
            param: firstError.path.join('.'),
            provided: String(req.body[firstError.path[0] as string] || null),
            expected: firstError.message
          },
          timestamp: new Date().toISOString()
        };

        return res.status(400).json(errorResponse);
      }

      req.body = result.data;
      next();
    } catch (error) {
      console.error('Validation middleware error:', error);
      res.status(500).json({ error: 'Validation error' });
    }
  };
}
