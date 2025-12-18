import { z } from 'zod';
import type { PaginationParams, ValidationErrorDetail } from '../../../shared/types/validation.js';
import { PAGINATION_CONSTRAINTS } from '../../../shared/types/validation.js';

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
      sanitized[param] = query[param];
    }
  }

  return sanitized;
}
