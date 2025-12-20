/*
  # Refactor error_logs.details Phase 1: Add Detail Columns

  ## Changes
  1. Add new columns to error_logs table
     - stack_trace: text - error stack trace for debugging
     - request_path: text - HTTP request path when error occurred
     - request_method: text - HTTP method (GET, POST, PUT, DELETE, etc.)
     - user_id: uuid - user who encountered the error
     - endpoint: text - API endpoint identifier
     - query_time_ms: numeric - query execution time in milliseconds
     - additional_context: text - any extra context as human-readable text
     - details_metadata_json: jsonb - for truly dynamic data if needed

  2. Add constraints
     - query_time_ms must be non-negative if present
     - request_method should be uppercase

  3. Add indexes
     - Index on user_id for filtering errors by user
     - Index on endpoint for analyzing endpoint-specific errors
     - Index on request_path for analyzing path-specific errors

  ## Notes
  - Phase 1: Add new columns (this migration)
  - Phase 2: Migrate data from details JSONB to new columns
  - Phase 3: Drop details column
*/

-- Add new columns for error detail data
ALTER TABLE error_logs
  ADD COLUMN IF NOT EXISTS stack_trace text,
  ADD COLUMN IF NOT EXISTS request_path text,
  ADD COLUMN IF NOT EXISTS request_method text,
  ADD COLUMN IF NOT EXISTS user_id uuid,
  ADD COLUMN IF NOT EXISTS endpoint text,
  ADD COLUMN IF NOT EXISTS query_time_ms numeric,
  ADD COLUMN IF NOT EXISTS additional_context text,
  ADD COLUMN IF NOT EXISTS details_metadata_json jsonb;

-- Add check constraint for query_time_ms
ALTER TABLE error_logs
  ADD CONSTRAINT check_query_time_non_negative
  CHECK (query_time_ms IS NULL OR query_time_ms >= 0);

-- Add indexes for common query patterns
CREATE INDEX IF NOT EXISTS idx_error_logs_user_id
  ON error_logs(user_id)
  WHERE user_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_error_logs_endpoint
  ON error_logs(endpoint)
  WHERE endpoint IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_error_logs_request_path
  ON error_logs(request_path)
  WHERE request_path IS NOT NULL;

-- Add index for query performance analysis
CREATE INDEX IF NOT EXISTS idx_error_logs_query_time
  ON error_logs(query_time_ms)
  WHERE query_time_ms IS NOT NULL;
