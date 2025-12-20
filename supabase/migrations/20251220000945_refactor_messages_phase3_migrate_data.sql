/*
  # Refactor messages.body Phase 3: Migrate JSONB Data

  ## Changes
  1. Extract data from body JSONB column into new columns
     - Parse body.type -> message_type
     - Parse body.message.title -> message_title
     - Parse body.message.body_md -> message_body_md
     - Parse body.message.citations -> message_citations
     - Parse body.vote.choice -> vote_choice
     - Parse body.vote.rationale_md -> vote_rationale_md
     - Parse body.vote.conditions -> vote_conditions

  2. Migrate tool_calls from JSONB array to message_tool_calls table
  3. Migrate proposed_actions from JSONB array to message_proposed_actions table

  ## Data Safety
  - This is a one-way migration that preserves the original body column
  - The body column will be dropped in Phase 4 only after verification
  - Uses safe JSONB extraction with null handling
*/

-- Migrate message data from body JSONB to new columns
UPDATE messages
SET
  message_type = CASE
    WHEN body->>'type' = 'message' THEN 'message'::message_type
    WHEN body->>'type' = 'vote' THEN 'vote'::message_type
    ELSE 'message'::message_type
  END,
  message_title = body->'message'->>'title',
  message_body_md = body->'message'->>'body_md',
  message_citations = CASE
    WHEN body->'message'->'citations' IS NOT NULL THEN
      ARRAY(SELECT jsonb_array_elements_text(body->'message'->'citations'))
    ELSE NULL
  END,
  vote_choice = body->'vote'->>'choice',
  vote_rationale_md = body->'vote'->>'rationale_md',
  vote_conditions = CASE
    WHEN body->'vote'->'conditions' IS NOT NULL THEN
      ARRAY(SELECT jsonb_array_elements_text(body->'vote'->'conditions'))
    ELSE NULL
  END
WHERE body IS NOT NULL;

-- Migrate tool_calls from JSONB array to message_tool_calls table
INSERT INTO message_tool_calls (
  message_id,
  tool,
  op,
  path,
  target_path,
  after_section,
  content_md,
  attribution_agent_id,
  tags
)
SELECT
  m.id,
  COALESCE(tc->>'tool', 'plan_editor'),
  tc->'args'->>'op',
  tc->'args'->>'path',
  tc->'args'->>'target_path',
  tc->'args'->>'after',
  tc->'args'->>'content_md',
  tc->'args'->'metadata'->>'attribution_agent_id',
  CASE
    WHEN tc->'args'->'metadata'->'tags' IS NOT NULL THEN
      ARRAY(SELECT jsonb_array_elements_text(tc->'args'->'metadata'->'tags'))
    ELSE NULL
  END
FROM messages m
CROSS JOIN LATERAL jsonb_array_elements(m.body->'tool_calls') AS tc
WHERE m.body->'tool_calls' IS NOT NULL
  AND jsonb_typeof(m.body->'tool_calls') = 'array';

-- Migrate proposed_actions from JSONB array to message_proposed_actions table
INSERT INTO message_proposed_actions (
  message_id,
  kind,
  data
)
SELECT
  m.id,
  pa->>'kind',
  pa - 'kind'
FROM messages m
CROSS JOIN LATERAL jsonb_array_elements(m.body->'message'->'proposed_actions') AS pa
WHERE m.body->'message'->'proposed_actions' IS NOT NULL
  AND jsonb_typeof(m.body->'message'->'proposed_actions') = 'array';
