export interface PaginationParams {
  limit: number;
  offset: number;
}

export interface ValidationErrorDetail {
  param: string;
  provided: string | null;
  expected: string;
  constraints?: Record<string, any>;
}

export interface ValidationErrorResponse {
  error: string;
  code: 'VALIDATION_ERROR';
  details: ValidationErrorDetail;
  timestamp: string;
}

export const PAGINATION_CONSTRAINTS = {
  limit: {
    min: 1,
    max: 100,
    default: 50
  },
  offset: {
    min: 0,
    max: 1_000_000,
    default: 0
  }
} as const;

export type PaginationConstraints = typeof PAGINATION_CONSTRAINTS;
