/*
  # Refactor agent_votes.conditions Phase 1: Add Conditions Table

  ## Changes
  1. Create new agent_vote_conditions table
     - id: uuid primary key
     - agent_vote_id: uuid foreign key to agent_votes
     - condition_text: text - the actual condition string
     - order_index: integer - preserves array order from original JSONB
     - created_at: timestamptz

  2. Add indexes for efficient querying
     - Index on agent_vote_id for joins
     - Index on (agent_vote_id, order_index) for ordered retrieval

  3. Enable RLS on new table
     - Same security policies as agent_votes

  ## Notes
  - Phase 1: Create new table (this migration)
  - Phase 2: Migrate data from conditions JSONB array to new table
  - Phase 3: Drop conditions column from agent_votes
  - Each array element becomes a row with its index preserved
*/

-- Create agent_vote_conditions table
CREATE TABLE IF NOT EXISTS agent_vote_conditions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_vote_id uuid NOT NULL REFERENCES agent_votes(id) ON DELETE CASCADE,
  condition_text text NOT NULL,
  order_index integer NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Add indexes for efficient querying
CREATE INDEX IF NOT EXISTS idx_agent_vote_conditions_vote_id 
  ON agent_vote_conditions(agent_vote_id);

CREATE INDEX IF NOT EXISTS idx_agent_vote_conditions_vote_id_order 
  ON agent_vote_conditions(agent_vote_id, order_index);

-- Enable RLS
ALTER TABLE agent_vote_conditions ENABLE ROW LEVEL SECURITY;

-- RLS Policies: Match agent_votes security model
-- Public read access (consortium is transparent)
CREATE POLICY "Anyone can view agent vote conditions"
  ON agent_vote_conditions FOR SELECT
  USING (true);

-- Only backend service role can insert/update/delete
CREATE POLICY "Service role can insert agent vote conditions"
  ON agent_vote_conditions FOR INSERT
  TO service_role
  WITH CHECK (true);

CREATE POLICY "Service role can update agent vote conditions"
  ON agent_vote_conditions FOR UPDATE
  TO service_role
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Service role can delete agent vote conditions"
  ON agent_vote_conditions FOR DELETE
  TO service_role
  USING (true);

-- Add check constraint to ensure non-negative order_index
ALTER TABLE agent_vote_conditions
  ADD CONSTRAINT check_order_index_non_negative
  CHECK (order_index >= 0);

-- Add check constraint to ensure condition_text is not empty
ALTER TABLE agent_vote_conditions
  ADD CONSTRAINT check_condition_text_not_empty
  CHECK (length(trim(condition_text)) > 0);
