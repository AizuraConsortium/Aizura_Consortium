import { describe, it, expect } from '@jest/globals';
import {
  validatePaginationParams,
  validateIntegerParam,
  validateEnumParam,
  QueryValidationError,
  sanitizeQueryParams
} from '../../../backend/src/utils/queryValidation.js';
import { PAGINATION_CONSTRAINTS } from '../../../shared/types/validation.js';

describe('validatePaginationParams', () => {
  describe('valid inputs', () => {
    it('should accept valid limit and offset', () => {
      const result = validatePaginationParams({ limit: '50', offset: '100' });
      expect(result).toEqual({ limit: 50, offset: 100 });
    });

    it('should use defaults for missing parameters', () => {
      const result = validatePaginationParams({});
      expect(result).toEqual({
        limit: PAGINATION_CONSTRAINTS.limit.default,
        offset: PAGINATION_CONSTRAINTS.offset.default
      });
    });

    it('should accept boundary values', () => {
      const result = validatePaginationParams({
        limit: String(PAGINATION_CONSTRAINTS.limit.max),
        offset: String(PAGINATION_CONSTRAINTS.offset.max)
      });
      expect(result.limit).toBe(PAGINATION_CONSTRAINTS.limit.max);
      expect(result.offset).toBe(PAGINATION_CONSTRAINTS.offset.max);
    });

    it('should accept minimum values', () => {
      const result = validatePaginationParams({
        limit: String(PAGINATION_CONSTRAINTS.limit.min),
        offset: String(PAGINATION_CONSTRAINTS.offset.min)
      });
      expect(result.limit).toBe(PAGINATION_CONSTRAINTS.limit.min);
      expect(result.offset).toBe(PAGINATION_CONSTRAINTS.offset.min);
    });

    it('should accept numeric types', () => {
      const result = validatePaginationParams({ limit: 25, offset: 50 });
      expect(result).toEqual({ limit: 25, offset: 50 });
    });
  });

  describe('invalid inputs', () => {
    it('should reject negative offset', () => {
      expect(() => {
        validatePaginationParams({ offset: '-1' });
      }).toThrow(QueryValidationError);
    });

    it('should reject negative limit', () => {
      expect(() => {
        validatePaginationParams({ limit: '-10' });
      }).toThrow(QueryValidationError);
    });

    it('should reject limit exceeding max', () => {
      expect(() => {
        validatePaginationParams({ limit: '999999' });
      }).toThrow(QueryValidationError);
    });

    it('should reject offset exceeding max', () => {
      expect(() => {
        validatePaginationParams({ offset: '9999999' });
      }).toThrow(QueryValidationError);
    });

    it('should reject NaN values', () => {
      expect(() => {
        validatePaginationParams({ limit: 'NaN' });
      }).toThrow(QueryValidationError);
    });

    it('should reject Infinity', () => {
      expect(() => {
        validatePaginationParams({ limit: 'Infinity' });
      }).toThrow(QueryValidationError);
    });

    it('should reject -Infinity', () => {
      expect(() => {
        validatePaginationParams({ offset: '-Infinity' });
      }).toThrow(QueryValidationError);
    });

    it('should reject hexadecimal strings', () => {
      expect(() => {
        validatePaginationParams({ limit: '0x10' });
      }).toThrow(QueryValidationError);
    });

    it('should reject octal strings', () => {
      expect(() => {
        validatePaginationParams({ limit: '0o10' });
      }).toThrow(QueryValidationError);
    });

    it('should reject binary strings', () => {
      expect(() => {
        validatePaginationParams({ limit: '0b10' });
      }).toThrow(QueryValidationError);
    });

    it('should reject decimal values', () => {
      expect(() => {
        validatePaginationParams({ limit: '50.5' });
      }).toThrow(QueryValidationError);
    });

    it('should reject non-numeric strings', () => {
      expect(() => {
        validatePaginationParams({ limit: 'abc' });
      }).toThrow(QueryValidationError);
    });

    it('should reject SQL injection attempts', () => {
      expect(() => {
        validatePaginationParams({ limit: "50; DROP TABLE users--" });
      }).toThrow(QueryValidationError);
    });

    it('should reject empty strings', () => {
      expect(() => {
        validatePaginationParams({ limit: '' });
      }).toThrow(QueryValidationError);
    });
  });

  describe('error details', () => {
    it('should provide detailed error information', () => {
      try {
        validatePaginationParams({ limit: '-10' });
        expect(true).toBe(false);
      } catch (error) {
        expect(error).toBeInstanceOf(QueryValidationError);
        if (error instanceof QueryValidationError) {
          expect(error.details.param).toBe('limit');
          expect(error.details.provided).toBe('-10');
          expect(error.details.constraints).toBeDefined();
        }
      }
    });
  });
});

describe('validateIntegerParam', () => {
  describe('valid inputs', () => {
    it('should accept valid integer string', () => {
      const result = validateIntegerParam('42', 'count');
      expect(result).toBe(42);
    });

    it('should accept numeric types', () => {
      const result = validateIntegerParam(42, 'count');
      expect(result).toBe(42);
    });

    it('should apply min constraint', () => {
      const result = validateIntegerParam('50', 'count', { min: 10 });
      expect(result).toBe(50);
    });

    it('should apply max constraint', () => {
      const result = validateIntegerParam('50', 'count', { max: 100 });
      expect(result).toBe(50);
    });

    it('should use default value when missing', () => {
      const result = validateIntegerParam(undefined, 'count', { default: 10 });
      expect(result).toBe(10);
    });

    it('should accept zero', () => {
      const result = validateIntegerParam('0', 'count', { min: 0 });
      expect(result).toBe(0);
    });
  });

  describe('invalid inputs', () => {
    it('should reject values below min', () => {
      expect(() => {
        validateIntegerParam('5', 'count', { min: 10 });
      }).toThrow(QueryValidationError);
    });

    it('should reject values above max', () => {
      expect(() => {
        validateIntegerParam('150', 'count', { max: 100 });
      }).toThrow(QueryValidationError);
    });

    it('should reject decimal values', () => {
      expect(() => {
        validateIntegerParam('42.5', 'count');
      }).toThrow(QueryValidationError);
    });

    it('should reject Infinity', () => {
      expect(() => {
        validateIntegerParam('Infinity', 'count');
      }).toThrow(QueryValidationError);
    });

    it('should reject NaN', () => {
      expect(() => {
        validateIntegerParam('NaN', 'count');
      }).toThrow(QueryValidationError);
    });

    it('should throw when required param is missing', () => {
      expect(() => {
        validateIntegerParam(undefined, 'count', { required: true });
      }).toThrow(QueryValidationError);
    });
  });
});

describe('validateEnumParam', () => {
  const validStatuses = ['active', 'pending', 'completed'] as const;

  describe('valid inputs', () => {
    it('should accept valid enum value', () => {
      const result = validateEnumParam('active', 'status', validStatuses);
      expect(result).toBe('active');
    });

    it('should use default when missing', () => {
      const result = validateEnumParam(undefined, 'status', validStatuses, {
        default: 'pending'
      });
      expect(result).toBe('pending');
    });

    it('should accept all valid values', () => {
      for (const status of validStatuses) {
        const result = validateEnumParam(status, 'status', validStatuses);
        expect(result).toBe(status);
      }
    });
  });

  describe('invalid inputs', () => {
    it('should reject invalid enum value', () => {
      expect(() => {
        validateEnumParam('invalid', 'status', validStatuses);
      }).toThrow(QueryValidationError);
    });

    it('should throw when required param is missing', () => {
      expect(() => {
        validateEnumParam(undefined, 'status', validStatuses, { required: true });
      }).toThrow(QueryValidationError);
    });

    it('should reject case-mismatched values', () => {
      expect(() => {
        validateEnumParam('ACTIVE', 'status', validStatuses);
      }).toThrow(QueryValidationError);
    });

    it('should provide helpful error with allowed values', () => {
      try {
        validateEnumParam('invalid', 'status', validStatuses);
        expect(true).toBe(false);
      } catch (error) {
        expect(error).toBeInstanceOf(QueryValidationError);
        if (error instanceof QueryValidationError) {
          expect(error.details.expected).toContain('active');
          expect(error.details.expected).toContain('pending');
          expect(error.details.expected).toContain('completed');
        }
      }
    });
  });
});

describe('sanitizeQueryParams', () => {
  it('should keep only allowed parameters', () => {
    const query = {
      limit: '50',
      offset: '10',
      malicious: 'DROP TABLE',
      unexpected: 'value'
    };

    const result = sanitizeQueryParams(query, ['limit', 'offset']);

    expect(result).toEqual({
      limit: '50',
      offset: '10'
    });
    expect(result.malicious).toBeUndefined();
    expect(result.unexpected).toBeUndefined();
  });

  it('should handle missing allowed parameters', () => {
    const query = {
      limit: '50'
    };

    const result = sanitizeQueryParams(query, ['limit', 'offset']);

    expect(result).toEqual({
      limit: '50'
    });
  });

  it('should return empty object when no params match', () => {
    const query = {
      malicious: 'value'
    };

    const result = sanitizeQueryParams(query, ['limit', 'offset']);

    expect(result).toEqual({});
  });
});
