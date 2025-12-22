/**
 * Shared Query Types
 *
 * Type definitions for database queries used across repositories.
 * These types ensure consistent query patterns throughout the application.
 */

/**
 * Query options for ordering, pagination, and limiting results
 */
export interface QueryOptions {
  orderBy?: string;
  ascending?: boolean;
  limit?: number;
  offset?: number;
}

/**
 * Filter options for database queries
 * Values can be:
 * - Single values for equality checks
 * - null for IS NULL checks
 * - Arrays for IN checks
 */
export interface FilterOptions {
  [key: string]: string | number | boolean | null | string[] | number[];
}

/**
 * Pagination parameters
 */
export interface Pagination {
  limit?: number;
  offset?: number;
}

/**
 * Sort direction
 */
export type SortDirection = 'asc' | 'desc';

/**
 * Generic sort option
 */
export interface SortOption {
  field: string;
  direction: SortDirection;
}

/**
 * Database filter operators
 */
export type FilterOperator =
  | 'eq'    // equals
  | 'neq'   // not equals
  | 'gt'    // greater than
  | 'gte'   // greater than or equal
  | 'lt'    // less than
  | 'lte'   // less than or equal
  | 'like'  // pattern match
  | 'ilike' // case-insensitive pattern match
  | 'in'    // in array
  | 'is'    // IS (for null checks)
  | 'not';  // NOT

/**
 * Advanced filter with operator support
 */
export interface AdvancedFilter {
  field: string;
  operator: FilterOperator;
  value: any;
}
