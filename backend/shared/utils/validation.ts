import { z } from 'zod';
import type { Request, Response, NextFunction } from 'express';
import type { PaginationParams, ValidationErrorDetail, ValidationErrorResponse } from '../../../shared/types/validation.js';
import { PAGINATION_CONSTRAINTS } from '../../../shared/types/validation.js';
import { sanitizeQueryParam } from './sanitization.js';

export class QueryValidationError extends Error {
  constructor(
    message: string,
    public readonly details: ValidationErrorDetail
  ) {
    super(message);
    this.name = 'QueryValidationError';
  }
}

const paginationSchema = z.object({
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

export function validatePaginationParams(query: any): PaginationParams {
  try {
    const rawLimit = query.limit;
    const rawOffset = query.offset;

    if (rawLimit !== undefined && !isFiniteNumber(rawLimit)) {
      throw new QueryValidationError(
        'Invalid pagination parameter',
        {
          param: 'limit',
          provided: String(rawLimit),
          expected: 'A finite integer',
          constraints: PAGINATION_CONSTRAINTS.limit
        }
      );
    }

    if (rawOffset !== undefined && !isFiniteNumber(rawOffset)) {
      throw new QueryValidationError(
        'Invalid pagination parameter',
        {
          param: 'offset',
          provided: String(rawOffset),
          expected: 'A finite integer',
          constraints: PAGINATION_CONSTRAINTS.offset
        }
      );
    }

    const result = paginationSchema.parse({
      limit: rawLimit,
      offset: rawOffset,
    });

    return result;
  } catch (error) {
    if (error instanceof QueryValidationError) {
      throw error;
    }

    if (error instanceof z.ZodError) {
      const firstError = error.errors[0];
      const param = firstError.path[0] as string;

      throw new QueryValidationError(
        'Invalid pagination parameter',
        {
          param,
          provided: query[param],
          expected: firstError.message,
          constraints: PAGINATION_CONSTRAINTS[param as keyof typeof PAGINATION_CONSTRAINTS]
        }
      );
    }

    throw error;
  }
}

export function validateIntegerParam(
  value: any,
  paramName: string,
  options: {
    min?: number;
    max?: number;
    default?: number;
    required?: boolean;
  } = {}
): number {
  if (value === undefined || value === null || value === '') {
    if (options.required) {
      throw new QueryValidationError(
        `Missing required parameter: ${paramName}`,
        {
          param: paramName,
          provided: null,
          expected: 'An integer value',
          constraints: options
        }
      );
    }

    if (options.default !== undefined) {
      return options.default;
    }

    throw new QueryValidationError(
      `Missing parameter: ${paramName}`,
      {
        param: paramName,
        provided: null,
        expected: 'An integer value',
        constraints: options
      }
    );
  }

  if (!isFiniteNumber(value)) {
    throw new QueryValidationError(
      `Invalid parameter: ${paramName}`,
      {
        param: paramName,
        provided: String(value),
        expected: 'A finite integer',
        constraints: options
      }
    );
  }

  const numValue = Number(value);

  if (!Number.isInteger(numValue)) {
    throw new QueryValidationError(
      `Invalid parameter: ${paramName}`,
      {
        param: paramName,
        provided: String(value),
        expected: 'An integer (no decimals)',
        constraints: options
      }
    );
  }

  if (options.min !== undefined && numValue < options.min) {
    throw new QueryValidationError(
      `Parameter ${paramName} is below minimum`,
      {
        param: paramName,
        provided: String(value),
        expected: `An integer >= ${options.min}`,
        constraints: options
      }
    );
  }

  if (options.max !== undefined && numValue > options.max) {
    throw new QueryValidationError(
      `Parameter ${paramName} exceeds maximum`,
      {
        param: paramName,
        provided: String(value),
        expected: `An integer <= ${options.max}`,
        constraints: options
      }
    );
  }

  return numValue;
}

export function validateEnumParam<T extends string>(
  value: any,
  paramName: string,
  allowedValues: readonly T[],
  options: {
    default?: T;
    required?: boolean;
  } = {}
): T {
  if (value === undefined || value === null || value === '') {
    if (options.required) {
      throw new QueryValidationError(
        `Missing required parameter: ${paramName}`,
        {
          param: paramName,
          provided: null,
          expected: `One of: ${allowedValues.join(', ')}`,
          constraints: { allowedValues }
        }
      );
    }

    if (options.default !== undefined) {
      return options.default;
    }

    throw new QueryValidationError(
      `Missing parameter: ${paramName}`,
      {
        param: paramName,
        provided: null,
        expected: `One of: ${allowedValues.join(', ')}`,
        constraints: { allowedValues }
      }
    );
  }

  const stringValue = String(value);

  if (!allowedValues.includes(stringValue as T)) {
    throw new QueryValidationError(
      `Invalid value for ${paramName}`,
      {
        param: paramName,
        provided: stringValue,
        expected: `One of: ${allowedValues.join(', ')}`,
        constraints: { allowedValues }
      }
    );
  }

  return stringValue as T;
}

function isFiniteNumber(value: any): boolean {
  if (typeof value === 'number') {
    return Number.isFinite(value);
  }

  if (typeof value !== 'string') {
    return false;
  }

  if (value.trim() === '') {
    return false;
  }

  if (value.toLowerCase() === 'infinity' || value.toLowerCase() === '-infinity') {
    return false;
  }

  if (value.toLowerCase() === 'nan') {
    return false;
  }

  if (value.startsWith('0x') || value.startsWith('0X')) {
    return false;
  }

  if (value.startsWith('0o') || value.startsWith('0O')) {
    return false;
  }

  if (value.startsWith('0b') || value.startsWith('0B')) {
    return false;
  }

  const num = Number(value);
  return Number.isFinite(num);
}

export function sanitizeQueryParams<T extends Record<string, any>>(
  query: any,
  allowedParams: readonly (keyof T)[]
): Partial<T> {
  const sanitized: Partial<T> = {};

  for (const param of allowedParams) {
    if (query[param] !== undefined) {
      try {
        sanitized[param] = sanitizeQueryParam(query[param]) as any;
      } catch (error) {
        sanitized[param] = query[param];
      }
    }
  }

  return sanitized;
}

interface ValidationFailureLog {
  timestamp: string;
  ip: string;
  path: string;
  method: string;
  userAgent?: string;
  error: ValidationErrorDetail;
}

interface SuspiciousPattern {
  ip: string;
  failureCount: number;
  firstFailure: number;
  lastFailure: number;
  patterns: string[];
}

const validationFailures: ValidationFailureLog[] = [];
const suspiciousIPs = new Map<string, SuspiciousPattern>();

const MAX_LOG_SIZE = 1000;
const SUSPICIOUS_THRESHOLD = 10;
const SUSPICIOUS_WINDOW_MS = 60 * 1000;

export function logValidationFailure(
  req: Request,
  error: ValidationErrorDetail
): void {
  const ip = req.ip || 'unknown';
  const timestamp = new Date().toISOString();

  const log: ValidationFailureLog = {
    timestamp,
    ip,
    path: req.path,
    method: req.method,
    userAgent: req.get('user-agent'),
    error
  };

  validationFailures.push(log);

  if (validationFailures.length > MAX_LOG_SIZE) {
    validationFailures.shift();
  }

  trackSuspiciousActivity(ip, error);

  console.warn('[VALIDATION FAILURE]', {
    ip,
    path: req.path,
    param: error.param,
    provided: error.provided,
    timestamp
  });
}

function trackSuspiciousActivity(
  ip: string,
  error: ValidationErrorDetail
): void {
  const now = Date.now();
  let pattern = suspiciousIPs.get(ip);

  if (!pattern) {
    pattern = {
      ip,
      failureCount: 0,
      firstFailure: now,
      lastFailure: now,
      patterns: []
    };
    suspiciousIPs.set(ip, pattern);
  }

  if (now - pattern.firstFailure > SUSPICIOUS_WINDOW_MS) {
    pattern.failureCount = 0;
    pattern.firstFailure = now;
    pattern.patterns = [];
  }

  pattern.failureCount++;
  pattern.lastFailure = now;
  pattern.patterns.push(`${error.param}:${error.provided}`);

  if (pattern.failureCount >= SUSPICIOUS_THRESHOLD) {
    console.error('[SUSPICIOUS ACTIVITY DETECTED]', {
      ip,
      failureCount: pattern.failureCount,
      windowMs: now - pattern.firstFailure,
      patterns: pattern.patterns.slice(-5),
      message: 'Multiple validation failures detected - possible attack attempt'
    });

    pattern.failureCount = 0;
    pattern.firstFailure = now;
    pattern.patterns = [];
  }
}

export function getValidationStats(): {
  totalFailures: number;
  recentFailures: ValidationFailureLog[];
  suspiciousIPs: Array<{
    ip: string;
    failureCount: number;
    patterns: string[];
  }>;
} {
  const suspicious = Array.from(suspiciousIPs.values())
    .filter(p => p.failureCount > 0)
    .map(p => ({
      ip: p.ip,
      failureCount: p.failureCount,
      patterns: p.patterns
    }));

  return {
    totalFailures: validationFailures.length,
    recentFailures: validationFailures.slice(-20),
    suspiciousIPs: suspicious
  };
}

export function clearValidationLogs(): void {
  validationFailures.length = 0;
  suspiciousIPs.clear();
}

setInterval(() => {
  const now = Date.now();
  for (const [ip, pattern] of suspiciousIPs.entries()) {
    if (now - pattern.lastFailure > SUSPICIOUS_WINDOW_MS * 2) {
      suspiciousIPs.delete(ip);
    }
  }
}, SUSPICIOUS_WINDOW_MS);

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

/**
 * Zod Schema-based validators
 * These schemas are used for body and query validation
 */

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

/**
 * Create a Zod schema-based query validator middleware
 *
 * This is an alternative to createQueryValidator above, using Zod schemas
 * for simpler validation use cases.
 */
export function createZodQueryValidator<T extends z.ZodType>(schema: T) {
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

/**
 * Create a Zod schema-based body validator middleware
 */
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
