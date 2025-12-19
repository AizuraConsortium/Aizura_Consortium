import type { PostgrestError } from '@supabase/supabase-js';

export class SupabaseQueryError extends Error {
  constructor(
    message: string,
    public readonly originalError: PostgrestError | Error
  ) {
    super(message);
    this.name = 'SupabaseQueryError';
  }
}

export async function handleSupabaseQuery<T>(
  queryPromise: Promise<{ data: T | null; error: PostgrestError | null }>,
  options: {
    errorMessage?: string;
    logError?: boolean;
    throwOnError?: boolean;
  } = {}
): Promise<T | null> {
  const {
    errorMessage = 'Database query error',
    logError = true,
    throwOnError = true
  } = options;

  const { data, error } = await queryPromise;

  if (error) {
    if (logError) {
      console.error(`${errorMessage}:`, error);
    }

    if (throwOnError) {
      throw new SupabaseQueryError(errorMessage, error);
    }

    return null;
  }

  return data;
}

export async function handleSupabaseQueryRequired<T>(
  queryPromise: Promise<{ data: T | null; error: PostgrestError | null }>,
  errorMessage: string = 'Database query error'
): Promise<T> {
  const data = await handleSupabaseQuery(queryPromise, {
    errorMessage,
    throwOnError: true
  });

  if (!data) {
    throw new SupabaseQueryError(`${errorMessage}: No data returned`, new Error('No data'));
  }

  return data;
}

export function createSupabaseErrorResponse(error: unknown, defaultMessage: string = 'Database error') {
  if (error instanceof SupabaseQueryError) {
    return {
      error: error.message,
      details: error.originalError.message || null
    };
  }

  if (error instanceof Error) {
    return {
      error: defaultMessage,
      details: error.message
    };
  }

  return {
    error: defaultMessage,
    details: null
  };
}
