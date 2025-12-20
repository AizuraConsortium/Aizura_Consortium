/*
  # Refactor arbitration.decision Phase 1: Add Decision Columns

  ## Changes
  1. Add new columns to arbitration table
     - winner_importance: numeric - the importance score of the winning message
     - candidate_count: integer - how many messages competed in arbitration
     - runner_up_importance: numeric (nullable) - importance of 2nd place message
     - decision_metadata_json: jsonb (nullable) - for any additional dynamic data

  2. Add check constraints
     - winner_importance must be between 0 and 100
     - candidate_count must be positive
     - runner_up_importance must be between 0 and 100 if present

  ## Notes
  - Phase 1: Add new columns (this migration)
  - Phase 2: Migrate data from decision JSONB to new columns
  - Phase 3: Drop decision column
  - Importance is typically 0-100, candidate_count is typically 1-6
*/

-- Add new columns for decision data
ALTER TABLE arbitration
  ADD COLUMN IF NOT EXISTS winner_importance numeric,
  ADD COLUMN IF NOT EXISTS candidate_count integer,
  ADD COLUMN IF NOT EXISTS runner_up_importance numeric,
  ADD COLUMN IF NOT EXISTS decision_metadata_json jsonb;

-- Add check constraints
ALTER TABLE arbitration
  ADD CONSTRAINT check_winner_importance_range
  CHECK (winner_importance IS NULL OR (winner_importance >= 0 AND winner_importance <= 100));

ALTER TABLE arbitration
  ADD CONSTRAINT check_candidate_count_positive
  CHECK (candidate_count IS NULL OR candidate_count > 0);

ALTER TABLE arbitration
  ADD CONSTRAINT check_runner_up_importance_range
  CHECK (runner_up_importance IS NULL OR (runner_up_importance >= 0 AND runner_up_importance <= 100));

-- Add index for querying by winner_importance (useful for analytics)
CREATE INDEX IF NOT EXISTS idx_arbitration_winner_importance
  ON arbitration(winner_importance);

-- Add index for querying by candidate_count (useful for analytics)
CREATE INDEX IF NOT EXISTS idx_arbitration_candidate_count
  ON arbitration(candidate_count);
