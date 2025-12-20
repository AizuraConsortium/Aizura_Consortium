/*
  # Refactor plan_revisions.diff Phase 2: Migrate JSONB Data

  ## Changes
  1. Extract data from diff JSONB column into new columns
     - Parse diff.addedChars -> added_chars
     - Parse diff.removedChars -> removed_chars

  2. Use safe JSONB extraction with null handling and defaults

  ## Data Safety
  - This is a one-way migration that preserves the original diff column
  - The diff column will be dropped in Phase 3 only after verification
  - Uses COALESCE to provide safe defaults if values are missing
*/

-- Migrate diff data to new columns
UPDATE plan_revisions
SET
  added_chars = COALESCE(
    CASE
      WHEN diff IS NOT NULL AND diff ? 'addedChars' THEN
        (diff->>'addedChars')::integer
      ELSE 0
    END,
    0
  ),
  removed_chars = COALESCE(
    CASE
      WHEN diff IS NOT NULL AND diff ? 'removedChars' THEN
        (diff->>'removedChars')::integer
      ELSE 0
    END,
    0
  )
WHERE diff IS NOT NULL;

-- For revisions with null diff, ensure they have default values
UPDATE plan_revisions
SET
  added_chars = 0,
  removed_chars = 0
WHERE diff IS NULL
  AND (added_chars IS NULL OR removed_chars IS NULL);
