/*
  # Refactor agent_votes.conditions Phase 2: Migrate Conditions Data

  ## Changes
  1. Extract conditions array from agent_votes.conditions JSONB
  2. Create individual rows in agent_vote_conditions for each condition
  3. Preserve array order using order_index

  ## Data Safety
  - This is a one-way migration that preserves the original conditions column
  - The conditions column will be dropped in Phase 3 only after verification
  - Uses jsonb_array_elements_text to safely extract array elements
  - WITH ORDINALITY preserves array order (1-indexed)

  ## Migration Logic
  - For each agent_vote with non-null conditions
  - Expand the JSONB array into individual rows
  - Insert each condition as a separate row with its index
*/

-- Migrate conditions data from JSONB array to new table
-- Using jsonb_array_elements_text with ORDINALITY to preserve order
INSERT INTO agent_vote_conditions (agent_vote_id, condition_text, order_index, created_at)
SELECT 
  av.id as agent_vote_id,
  elem.value as condition_text,
  (elem.ordinality - 1) as order_index,  -- Convert from 1-indexed to 0-indexed
  av.created_at
FROM agent_votes av
CROSS JOIN LATERAL (
  SELECT value::text, ordinality
  FROM jsonb_array_elements_text(
    CASE 
      WHEN jsonb_typeof(av.conditions) = 'array' THEN av.conditions
      ELSE '[]'::jsonb
    END
  ) WITH ORDINALITY AS t(value, ordinality)
) AS elem
WHERE av.conditions IS NOT NULL
  AND jsonb_typeof(av.conditions) = 'array'
  AND jsonb_array_length(av.conditions) > 0
ON CONFLICT DO NOTHING;  -- Skip if already migrated
