/*
  # Refactor messages.body Phase 2: Add Related Tables

  ## Changes
  1. Create message_tool_calls table
     - Stores tool_calls that were in body.tool_calls JSONB array
     - Links to messages table
     - Stores tool name and arguments

  2. Create message_proposed_actions table
     - Stores proposed_actions that were in body.message.proposed_actions JSONB array
     - Links to messages table
     - Stores action kind and data

  ## Security
  - Enable RLS on both tables
  - Add policies for authenticated access

  ## Notes
  - These tables normalize the JSONB arrays into proper relational structure
  - Allows for proper type safety and querying
*/

-- Create message_tool_calls table
CREATE TABLE IF NOT EXISTS message_tool_calls (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  message_id uuid NOT NULL REFERENCES messages(id) ON DELETE CASCADE,
  tool text NOT NULL DEFAULT 'plan_editor',
  op text NOT NULL,
  path text NOT NULL,
  target_path text,
  after_section text,
  content_md text,
  attribution_agent_id text,
  tags text[],
  created_at timestamptz DEFAULT now()
);

-- Create message_proposed_actions table
CREATE TABLE IF NOT EXISTS message_proposed_actions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  message_id uuid NOT NULL REFERENCES messages(id) ON DELETE CASCADE,
  kind text NOT NULL,
  data jsonb NOT NULL DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

-- Add indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_message_tool_calls_message_id ON message_tool_calls(message_id);
CREATE INDEX IF NOT EXISTS idx_message_proposed_actions_message_id ON message_proposed_actions(message_id);

-- Enable RLS
ALTER TABLE message_tool_calls ENABLE ROW LEVEL SECURITY;
ALTER TABLE message_proposed_actions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for message_tool_calls
CREATE POLICY "Anyone can view message tool calls"
  ON message_tool_calls
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Service role can insert message tool calls"
  ON message_tool_calls
  FOR INSERT
  TO service_role
  WITH CHECK (true);

CREATE POLICY "Service role can update message tool calls"
  ON message_tool_calls
  FOR UPDATE
  TO service_role
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Service role can delete message tool calls"
  ON message_tool_calls
  FOR DELETE
  TO service_role
  USING (true);

-- RLS Policies for message_proposed_actions
CREATE POLICY "Anyone can view message proposed actions"
  ON message_proposed_actions
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Service role can insert message proposed actions"
  ON message_proposed_actions
  FOR INSERT
  TO service_role
  WITH CHECK (true);

CREATE POLICY "Service role can update message proposed actions"
  ON message_proposed_actions
  FOR UPDATE
  TO service_role
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Service role can delete message proposed actions"
  ON message_proposed_actions
  FOR DELETE
  TO service_role
  USING (true);
