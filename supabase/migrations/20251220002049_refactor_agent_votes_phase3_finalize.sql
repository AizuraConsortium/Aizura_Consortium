/*
  # Refactor agent_votes.conditions Phase 3: Finalize Migration

  ## Changes
  1. Drop conditions JSONB column (data has been migrated to agent_vote_conditions)

  ## Data Safety
  - This migration is safe because:
    - All data has been migrated in Phase 2
    - New table has been populated
    - Applications should verify data before running this

  ## Post-Migration
  - Conditions are now stored in agent_vote_conditions table
  - Use JOIN to retrieve conditions for a vote
  - Use ORDER BY order_index to maintain original array order
*/

-- Drop the conditions column (all data has been migrated)
ALTER TABLE agent_votes DROP COLUMN IF EXISTS conditions;
