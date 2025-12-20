/*
  # Refactor messages.body Phase 1: Add New Columns

  ## Changes
  1. Add new columns to messages table to replace JSONB body column
     - message_type: enum ('message' or 'vote') - replaces body.type
     - message_title: text - stores message.title
     - message_body_md: text - stores message.body_md
     - message_citations: text[] - stores message.citations array
     - vote_choice: text - stores vote.choice (will reference agent_votes choice enum)
     - vote_rationale_md: text - stores vote.rationale_md
     - vote_conditions: text[] - stores vote.conditions array

  2. All columns are nullable initially to allow gradual migration

  ## Notes
  - Phase 1: Add columns (this migration)
  - Phase 2: Migrate data from body JSONB to new columns
  - Phase 3: Drop body column and add constraints
  - This preserves data safety by keeping body column until migration is complete
*/

-- Add message_type enum
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'message_type') THEN
    CREATE TYPE message_type AS ENUM ('message', 'vote');
  END IF;
END $$;

-- Add new columns to messages table
DO $$
BEGIN
  -- Add message_type column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'messages' AND column_name = 'message_type'
  ) THEN
    ALTER TABLE messages ADD COLUMN message_type message_type;
  END IF;

  -- Add message_title column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'messages' AND column_name = 'message_title'
  ) THEN
    ALTER TABLE messages ADD COLUMN message_title text;
  END IF;

  -- Add message_body_md column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'messages' AND column_name = 'message_body_md'
  ) THEN
    ALTER TABLE messages ADD COLUMN message_body_md text;
  END IF;

  -- Add message_citations column (text array)
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'messages' AND column_name = 'message_citations'
  ) THEN
    ALTER TABLE messages ADD COLUMN message_citations text[];
  END IF;

  -- Add vote_choice column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'messages' AND column_name = 'vote_choice'
  ) THEN
    ALTER TABLE messages ADD COLUMN vote_choice text;
  END IF;

  -- Add vote_rationale_md column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'messages' AND column_name = 'vote_rationale_md'
  ) THEN
    ALTER TABLE messages ADD COLUMN vote_rationale_md text;
  END IF;

  -- Add vote_conditions column (text array)
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'messages' AND column_name = 'vote_conditions'
  ) THEN
    ALTER TABLE messages ADD COLUMN vote_conditions text[];
  END IF;
END $$;

-- Add index on message_type for faster queries
CREATE INDEX IF NOT EXISTS idx_messages_message_type ON messages(message_type);
