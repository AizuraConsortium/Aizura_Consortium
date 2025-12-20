/*
  # Refactor plan_revisions.diff Phase 1: Add New Columns

  ## Changes
  1. Add new columns to plan_revisions table to replace JSONB diff column
     - added_chars: integer - stores number of characters added in revision
     - removed_chars: integer - stores number of characters removed in revision

  2. Both columns are nullable initially to allow gradual migration
  3. Default to 0 for consistency

  ## Notes
  - Phase 1: Add columns (this migration)
  - Phase 2: Migrate data from diff JSONB to new columns
  - Phase 3: Drop diff column and add constraints
  - The diff JSONB currently stores: { op, path, addedChars, removedChars }
  - op and path are already stored as top-level columns
  - We only need to extract addedChars and removedChars
*/

-- Add added_chars column
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'plan_revisions' AND column_name = 'added_chars'
  ) THEN
    ALTER TABLE plan_revisions ADD COLUMN added_chars integer DEFAULT 0;
  END IF;
END $$;

-- Add removed_chars column
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'plan_revisions' AND column_name = 'removed_chars'
  ) THEN
    ALTER TABLE plan_revisions ADD COLUMN removed_chars integer DEFAULT 0;
  END IF;
END $$;

-- Add index for querying plan revisions by character changes
CREATE INDEX IF NOT EXISTS idx_plan_revisions_char_changes ON plan_revisions(added_chars, removed_chars);
