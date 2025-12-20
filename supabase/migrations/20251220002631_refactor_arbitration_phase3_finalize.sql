/*
  # Refactor arbitration.decision Phase 3: Finalize Migration

  ## Changes
  1. Drop decision JSONB column (data has been migrated to typed columns)

  ## Data Safety
  - This migration is safe because:
    - All data has been migrated in Phase 2
    - New columns have been populated
    - Applications should verify data before running this

  ## Post-Migration
  - Decision data now stored in typed columns:
    - winner_importance (numeric)
    - candidate_count (integer)
    - runner_up_importance (numeric, nullable)
    - decision_metadata_json (jsonb, nullable) for any additional data
*/

-- Drop the decision column (all data has been migrated)
ALTER TABLE arbitration DROP COLUMN IF EXISTS decision;
