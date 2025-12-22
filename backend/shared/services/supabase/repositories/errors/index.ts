/**
 * Repository Error Classes
 * Central export for all repository error types
 */

export {
  RepositoryError,
  NotFoundError,
  ValidationError,
  ConstraintViolationError,
  StateTransitionError,
  ConcurrencyError,
  CircularDependencyError,
  DependencyBlockedError,
  OperationNotAllowedError,
  QueryTimeoutError,
  type ErrorContext,
} from './RepositoryError.js';
