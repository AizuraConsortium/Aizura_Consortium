/*
  # Refactor error_logs.details Phase 2: Migrate Details Data

  ## Changes
  1. Extract detail fields from details JSONB column
  2. Populate new typed columns with existing data
  3. Handle missing or malformed data gracefully
  4. Preserve any unmapped fields in details_metadata_json

  ## Data Safety
  - This is a one-way migration that preserves the original details column
  - The details column will be dropped in Phase 3 only after verification
  - Uses safe JSONB extraction with null handling
  - Converts types appropriately

  ## Migration Logic
  - Extract common fields from details JSONB:
    - 'stackTrace' or 'stack_trace' -> stack_trace
    - 'requestPath' or 'request_path' or 'path' -> request_path
    - 'requestMethod' or 'request_method' or 'method' -> request_method
    - 'userId' or 'user_id' -> user_id
    - 'endpoint' -> endpoint
    - 'queryTime' or 'query_time_ms' -> query_time_ms
    - 'context' or 'additional_context' -> additional_context
  - Store any remaining fields in details_metadata_json
*/

-- Migrate details data to new columns
UPDATE error_logs
SET
  stack_trace = COALESCE(
    details->>'stackTrace',
    details->>'stack_trace',
    details->>'stack'
  ),
  request_path = COALESCE(
    details->>'requestPath',
    details->>'request_path',
    details->>'path'
  ),
  request_method = UPPER(COALESCE(
    details->>'requestMethod',
    details->>'request_method',
    details->>'method'
  )),
  user_id = CASE
    WHEN details->>'userId' IS NOT NULL THEN (details->>'userId')::uuid
    WHEN details->>'user_id' IS NOT NULL THEN (details->>'user_id')::uuid
    ELSE NULL
  END,
  endpoint = details->>'endpoint',
  query_time_ms = CASE
    WHEN details->>'queryTime' IS NOT NULL THEN (details->>'queryTime')::numeric
    WHEN details->>'query_time_ms' IS NOT NULL THEN (details->>'query_time_ms')::numeric
    WHEN details->>'queryTimeMs' IS NOT NULL THEN (details->>'queryTimeMs')::numeric
    ELSE NULL
  END,
  additional_context = COALESCE(
    details->>'context',
    details->>'additional_context',
    details->>'additionalContext'
  ),
  details_metadata_json = CASE
    WHEN jsonb_typeof(details) = 'object' THEN
      details 
        - 'stackTrace' - 'stack_trace' - 'stack'
        - 'requestPath' - 'request_path' - 'path'
        - 'requestMethod' - 'request_method' - 'method'
        - 'userId' - 'user_id'
        - 'endpoint'
        - 'queryTime' - 'query_time_ms' - 'queryTimeMs'
        - 'context' - 'additional_context' - 'additionalContext'
    ELSE details
  END
WHERE details IS NOT NULL
  AND jsonb_typeof(details) = 'object';

-- Clean up details_metadata_json - set to null if it's empty after removing extracted fields
UPDATE error_logs
SET details_metadata_json = NULL
WHERE details_metadata_json IS NOT NULL
  AND (
    jsonb_typeof(details_metadata_json) != 'object'
    OR details_metadata_json = '{}'::jsonb
  );
