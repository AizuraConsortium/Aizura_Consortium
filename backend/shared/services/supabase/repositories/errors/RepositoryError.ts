/**
 * Repository Error Classes
 *
 * Provides a comprehensive error hierarchy for repository operations.
 * These errors convert database-level errors into domain-specific errors
 * with rich context for better debugging and error handling.
 */

export interface ErrorContext {
  operation?: string;
  table?: string;
  resource?: string;
  resourceId?: string;
  constraintName?: string;
  field?: string;
  value?: unknown;
  details?: Record<string, unknown>;
  cause?: Error;
}

/**
 * Base repository error class
 * All repository errors extend from this class
 */
export class RepositoryError extends Error {
  public readonly context: ErrorContext;
  public readonly timestamp: Date;
  public readonly code: string;

  constructor(message: string, code: string, context: ErrorContext = {}) {
    super(message);
    this.name = 'RepositoryError';
    this.code = code;
    this.context = context;
    this.timestamp = new Date();

    Error.captureStackTrace(this, this.constructor);
  }

  toJSON(): Record<string, unknown> {
    return {
      name: this.name,
      code: this.code,
      message: this.message,
      context: this.context,
      timestamp: this.timestamp.toISOString(),
      stack: this.stack,
    };
  }
}

/**
 * Resource not found error
 * Thrown when a requested resource doesn't exist
 */
export class NotFoundError extends RepositoryError {
  constructor(resource: string, identifier: string | Record<string, unknown>, context: ErrorContext = {}) {
    const identifierStr = typeof identifier === 'string'
      ? identifier
      : JSON.stringify(identifier);

    super(
      `${resource} not found: ${identifierStr}`,
      'NOT_FOUND',
      { ...context, resource, resourceId: identifierStr }
    );
    this.name = 'NotFoundError';
  }
}

/**
 * Validation error
 * Thrown when input data fails validation
 */
export class ValidationError extends RepositoryError {
  public readonly field?: string;
  public readonly violations: Array<{ field: string; message: string; value?: unknown }>;

  constructor(
    message: string,
    violations: Array<{ field: string; message: string; value?: unknown }> = [],
    context: ErrorContext = {}
  ) {
    super(message, 'VALIDATION_ERROR', context);
    this.name = 'ValidationError';
    this.violations = violations;
    this.field = violations[0]?.field;
  }

  static single(field: string, message: string, value?: unknown, context: ErrorContext = {}): ValidationError {
    return new ValidationError(
      message,
      [{ field, message, value }],
      { ...context, field, value }
    );
  }
}

/**
 * Database constraint violation error
 * Thrown when a database constraint is violated (unique, foreign key, not null, etc.)
 */
export class ConstraintViolationError extends RepositoryError {
  constructor(
    constraint: string,
    message: string,
    context: ErrorContext = {}
  ) {
    super(
      message,
      'CONSTRAINT_VIOLATION',
      { ...context, constraintName: constraint }
    );
    this.name = 'ConstraintViolationError';
  }

  static uniqueViolation(field: string, value: unknown, context: ErrorContext = {}): ConstraintViolationError {
    return new ConstraintViolationError(
      'unique_constraint',
      `${field} already exists: ${value}`,
      { ...context, field, value }
    );
  }

  static foreignKeyViolation(field: string, value: unknown, context: ErrorContext = {}): ConstraintViolationError {
    return new ConstraintViolationError(
      'foreign_key_constraint',
      `Invalid reference: ${field} = ${value} does not exist`,
      { ...context, field, value }
    );
  }

  static notNullViolation(field: string, context: ErrorContext = {}): ConstraintViolationError {
    return new ConstraintViolationError(
      'not_null_constraint',
      `${field} cannot be null`,
      { ...context, field }
    );
  }
}

/**
 * State transition error
 * Thrown when attempting an invalid state transition
 */
export class StateTransitionError extends RepositoryError {
  constructor(
    resource: string,
    currentState: string,
    attemptedState: string,
    allowedTransitions: string[],
    context: ErrorContext = {}
  ) {
    super(
      `Invalid state transition for ${resource}: ${currentState} → ${attemptedState}. Allowed: ${allowedTransitions.join(', ')}`,
      'INVALID_STATE_TRANSITION',
      {
        ...context,
        resource,
        details: { currentState, attemptedState, allowedTransitions }
      }
    );
    this.name = 'StateTransitionError';
  }
}

/**
 * Concurrency error
 * Thrown when optimistic locking or concurrent modification is detected
 */
export class ConcurrencyError extends RepositoryError {
  constructor(resource: string, resourceId: string, context: ErrorContext = {}) {
    super(
      `Concurrent modification detected for ${resource}: ${resourceId}`,
      'CONCURRENCY_ERROR',
      { ...context, resource, resourceId }
    );
    this.name = 'ConcurrencyError';
  }
}

/**
 * Circular dependency error
 * Thrown when a circular dependency is detected
 */
export class CircularDependencyError extends RepositoryError {
  constructor(
    resource: string,
    dependencyChain: string[],
    context: ErrorContext = {}
  ) {
    super(
      `Circular dependency detected in ${resource}: ${dependencyChain.join(' → ')}`,
      'CIRCULAR_DEPENDENCY',
      { ...context, resource, details: { dependencyChain } }
    );
    this.name = 'CircularDependencyError';
  }
}

/**
 * Dependency blocked error
 * Thrown when an operation is blocked by unmet dependencies
 */
export class DependencyBlockedError extends RepositoryError {
  constructor(
    resource: string,
    blockedBy: string[],
    context: ErrorContext = {}
  ) {
    super(
      `${resource} is blocked by dependencies: ${blockedBy.join(', ')}`,
      'DEPENDENCY_BLOCKED',
      { ...context, resource, details: { blockedBy } }
    );
    this.name = 'DependencyBlockedError';
  }
}

/**
 * Operation not allowed error
 * Thrown when an operation is not permitted in the current context
 */
export class OperationNotAllowedError extends RepositoryError {
  constructor(
    operation: string,
    reason: string,
    context: ErrorContext = {}
  ) {
    super(
      `Operation not allowed: ${operation}. Reason: ${reason}`,
      'OPERATION_NOT_ALLOWED',
      { ...context, operation, details: { reason } }
    );
    this.name = 'OperationNotAllowedError';
  }
}

/**
 * Query timeout error
 * Thrown when a database query exceeds the timeout limit
 */
export class QueryTimeoutError extends RepositoryError {
  constructor(
    operation: string,
    timeoutMs: number,
    context: ErrorContext = {}
  ) {
    super(
      `Query timeout: ${operation} exceeded ${timeoutMs}ms`,
      'QUERY_TIMEOUT',
      { ...context, operation, details: { timeoutMs } }
    );
    this.name = 'QueryTimeoutError';
  }
}
