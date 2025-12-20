/*
  # Refactor error_logs.details Phase 3: Finalize Migration

  ## Changes
  1. Drop details JSONB column (data has been migrated to typed columns)

  ## Data Safety
  - This migration is safe because:
    - All data has been migrated in Phase 2
    - New columns have been populated
    - Applications should verify data before running this

  ## Post-Migration
  - Error detail data now stored in typed columns:
    - stack_trace (text) - error stack traces
    - request_path (text) - HTTP request paths
    - request_method (text) - HTTP methods
    - user_id (uuid) - user identifiers
    - endpoint (text) - API endpoint identifiers
    - query_time_ms (numeric) - query execution times
    - additional_context (text) - extra context information
    - details_metadata_json (jsonb) - any additional dynamic data
*/

-- Drop the details column (all data has been migrated)
ALTER TABLE error_logs DROP COLUMN IF EXISTS details;
