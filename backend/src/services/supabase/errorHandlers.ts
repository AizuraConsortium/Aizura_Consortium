export interface PostgresError extends Error {
  code?: string;
  details?: string;
  hint?: string;
}

export function isPostgresError(error: unknown): error is PostgresError {
  return error instanceof Error && 'code' in error;
}

export function isDuplicateKeyError(
  error: unknown,
  constraintName?: string
): boolean {
  if (!isPostgresError(error)) return false;
  if (error.code !== '23505') return false;

  if (constraintName && error.message) {
    return error.message.includes(constraintName);
  }

  return true;
}

export function isUniqueViolation(error: unknown): boolean {
  return isPostgresError(error) && error.code === '23505';
}

export function isForeignKeyViolation(error: unknown): boolean {
  return isPostgresError(error) && error.code === '23503';
}

export function isNotNullViolation(error: unknown): boolean {
  return isPostgresError(error) && error.code === '23502';
}
