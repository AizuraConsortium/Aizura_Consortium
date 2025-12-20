/*
  # Refactor plan_revisions.diff Phase 3: Finalize Migration

  ## Changes
  1. Drop diff JSONB column (data has been migrated to new columns)
  2. Add NOT NULL constraints on new columns
  3. Add check constraints to ensure data integrity

  ## Data Safety
  - This migration is safe because:
    - All data has been migrated in Phase 2
    - New columns have been populated
    - Applications should verify data before running this

  ## Validation Rules
  - added_chars and removed_chars must be non-negative integers
  - Both columns must be NOT NULL
*/

-- Add NOT NULL constraints
ALTER TABLE plan_revisions
  ALTER COLUMN added_chars SET NOT NULL;

ALTER TABLE plan_revisions
  ALTER COLUMN removed_chars SET NOT NULL;

-- Add check constraints to ensure non-negative values
ALTER TABLE plan_revisions
  ADD CONSTRAINT check_added_chars_non_negative
  CHECK (added_chars >= 0);

ALTER TABLE plan_revisions
  ADD CONSTRAINT check_removed_chars_non_negative
  CHECK (removed_chars >= 0);

-- Drop the diff column (all data has been migrated)
ALTER TABLE plan_revisions DROP COLUMN IF EXISTS diff;
