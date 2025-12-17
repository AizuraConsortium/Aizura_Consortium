/*
  # Add Atomic Plan Creation Function

  ## Overview
  This migration addresses the circular dependency issue between `plans.current_revision_id`
  and `plan_revisions.plan_id` by wrapping the multi-step plan creation process in a single
  atomic database transaction.

  ## Problem
  Previously, plan creation required 3 separate operations:
  1. Insert plan with current_revision_id = NULL
  2. Insert first revision referencing the plan
  3. Update plan to set current_revision_id

  If the process crashed between steps 2 and 3, the database would be left in an
  inconsistent state with orphaned revisions.

  ## Solution
  Create a PostgreSQL function that executes all three steps atomically within a single
  transaction. This ensures either all steps succeed or all fail together, preventing
  data inconsistency.

  ## Changes
  1. New Functions
    - `create_plan_with_revision()` - Atomically creates a plan and its first revision

  ## Security
  - Function executes with caller's privileges
  - No additional RLS policies needed (existing policies apply)
*/

-- Function to atomically create a plan with its first revision
CREATE OR REPLACE FUNCTION create_plan_with_revision(
  p_topic_id uuid,
  p_title text,
  p_initial_content text
)
RETURNS json AS $$
DECLARE
  v_plan_id uuid;
  v_revision_id uuid;
  v_result json;
BEGIN
  -- Step 1: Create the plan
  INSERT INTO plans (topic_id, title, status)
  VALUES (p_topic_id, p_title, 'draft')
  RETURNING id INTO v_plan_id;

  -- Step 2: Create the first revision
  INSERT INTO plan_revisions (plan_id, agent_id, op, path, content_md, diff)
  VALUES (
    v_plan_id,
    'chatgpt',
    'upsert_section',
    'root',
    p_initial_content,
    jsonb_build_object(
      'op', 'init',
      'addedChars', length(p_initial_content)
    )
  )
  RETURNING id INTO v_revision_id;

  -- Step 3: Update the plan with the revision reference
  UPDATE plans
  SET current_revision_id = v_revision_id
  WHERE id = v_plan_id;

  -- Return the complete plan as JSON
  SELECT row_to_json(p.*) INTO v_result
  FROM plans p
  WHERE p.id = v_plan_id;

  RETURN v_result;
END;
$$ LANGUAGE plpgsql;