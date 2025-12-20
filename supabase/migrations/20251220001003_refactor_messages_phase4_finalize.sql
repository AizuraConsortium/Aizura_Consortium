/*
  # Refactor messages.body Phase 4: Finalize Migration

  ## Changes
  1. Drop body JSONB column (data has been migrated to new columns)
  2. Add NOT NULL constraints on required columns
  3. Add check constraints to ensure data integrity

  ## Data Safety
  - This migration is safe because:
    - All data has been migrated in Phase 3
    - New columns have been populated
    - Applications should verify data before running this

  ## Validation Rules
  - If message_type = 'message', then message_title and message_body_md must be NOT NULL
  - If message_type = 'vote', then vote_choice and vote_rationale_md must be NOT NULL
*/

-- Add NOT NULL constraint to message_type
ALTER TABLE messages
  ALTER COLUMN message_type SET NOT NULL;

-- Add check constraint: message type must have message fields populated
ALTER TABLE messages
  ADD CONSTRAINT check_message_fields
  CHECK (
    message_type != 'message' OR
    (message_title IS NOT NULL AND message_body_md IS NOT NULL)
  );

-- Add check constraint: vote type must have vote fields populated
ALTER TABLE messages
  ADD CONSTRAINT check_vote_fields
  CHECK (
    message_type != 'vote' OR
    (vote_choice IS NOT NULL AND vote_rationale_md IS NOT NULL)
  );

-- Drop the body column (all data has been migrated)
ALTER TABLE messages DROP COLUMN IF EXISTS body;
