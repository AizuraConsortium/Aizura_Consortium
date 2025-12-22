/**
 * Service Type Definitions
 *
 * Common types for service layer functionality.
 * Provides type safety for business logic operations.
 */

/**
 * Standard service operation result
 * Use for operations that can succeed or fail
 */
export type ServiceResult<T> =
  | { success: true; data: T }
  | { success: false; error: ServiceError };

/**
 * Service error with detailed information
 */
export interface ServiceError {
  code: string;
  message: string;
  details?: Record<string, any>;
  originalError?: Error;
}

/**
 * Pagination parameters for service methods
 */
export interface PaginationParams {
  limit: number;
  offset: number;
}

/**
 * Paginated result from service
 */
export interface PaginatedResult<T> {
  data: T[];
  total: number;
  limit: number;
  offset: number;
}

/**
 * Filter parameters for queries
 */
export interface FilterParams {
  [key: string]: string | number | boolean | undefined | null;
}

/**
 * Sort parameters
 */
export interface SortParams {
  field: string;
  direction: 'asc' | 'desc';
}

/**
 * Query options combining pagination, filtering, and sorting
 */
export interface QueryOptions {
  pagination?: PaginationParams;
  filters?: FilterParams;
  sort?: SortParams;
}

/**
 * Database transaction context
 */
export interface TransactionContext {
  client?: any;
  isTransaction: boolean;
}

/**
 * Service operation options
 */
export interface ServiceOptions {
  transaction?: TransactionContext;
  userId?: string;
  skipValidation?: boolean;
}

/**
 * Validation result
 */
export interface ValidationResult {
  valid: boolean;
  errors: ValidationError[];
}

/**
 * Validation error detail
 */
export interface ValidationError {
  field: string;
  message: string;
  code: string;
  value?: any;
}

/**
 * Business rule validation
 */
export interface BusinessRule<T = any> {
  name: string;
  validate: (data: T) => boolean | Promise<boolean>;
  errorMessage: string;
}

/**
 * State transition definition
 */
export interface StateTransition {
  from: string;
  to: string;
  allowed: boolean;
  requiredRole?: 'admin' | 'client' | 'agent';
  conditions?: BusinessRule[];
}

/**
 * Entity metadata
 */
export interface EntityMetadata {
  createdAt: Date;
  updatedAt: Date;
  createdBy?: string;
  updatedBy?: string;
}

/**
 * Soft delete support
 */
export interface SoftDeletable {
  deletedAt?: Date | null;
  deletedBy?: string | null;
}

/**
 * Audit trail support
 */
export interface Auditable extends EntityMetadata {
  version: number;
  changes?: Record<string, any>;
}

/**
 * Service health status
 */
export interface ServiceHealth {
  service: string;
  status: 'healthy' | 'degraded' | 'unhealthy';
  uptime: number;
  dependencies: {
    database: 'connected' | 'disconnected';
    externalServices: Record<string, 'available' | 'unavailable'>;
  };
  metrics?: {
    requestCount: number;
    errorCount: number;
    averageResponseTime: number;
  };
}

/**
 * Cache options
 */
export interface CacheOptions {
  key: string;
  ttl: number;
  namespace?: string;
}

/**
 * Bulk operation result
 */
export interface BulkOperationResult<T> {
  successful: T[];
  failed: Array<{
    item: T;
    error: ServiceError;
  }>;
  total: number;
  successCount: number;
  failureCount: number;
}

/**
 * Export options
 */
export interface ExportOptions {
  format: 'json' | 'csv' | 'xlsx';
  fields?: string[];
  filters?: FilterParams;
  includeMetadata?: boolean;
}

/**
 * Import result
 */
export interface ImportResult<T> {
  imported: T[];
  skipped: number;
  errors: Array<{
    row: number;
    error: string;
  }>;
}
