/*
  # Refactor arbitration.decision Phase 2: Migrate Decision Data

  ## Changes
  1. Extract decision fields from decision JSONB column
  2. Populate new typed columns with existing data
  3. Handle missing or malformed data gracefully

  ## Data Safety
  - This is a one-way migration that preserves the original decision column
  - The decision column will be dropped in Phase 3 only after verification
  - Uses safe JSONB extraction with null handling
  - Converts numeric types appropriately

  ## Migration Logic
  - Extract 'importance' field as winner_importance
  - Extract 'candidateCount' field as candidate_count
  - Leave runner_up_importance as null (not tracked in old format)
  - Keep any additional data in decision_metadata_json
*/

-- Migrate decision data to new columns
UPDATE arbitration
SET
  winner_importance = (decision->>'importance')::numeric,
  candidate_count = (decision->>'candidateCount')::integer,
  decision_metadata_json = CASE
    WHEN jsonb_typeof(decision) = 'object' 
      AND decision - 'importance' - 'candidateCount' != '{}'::jsonb
    THEN decision - 'importance' - 'candidateCount'
    ELSE NULL
  END
WHERE decision IS NOT NULL
  AND jsonb_typeof(decision) = 'object';
