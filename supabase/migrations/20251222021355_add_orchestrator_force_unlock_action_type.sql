/*
  # Add orchestrator_force_unlock Action Type

  ## Summary
  Adds the 'orchestrator_force_unlock' action type to the admin_actions table
  to support auditing of dangerous orchestrator lock release operations.

  ## Changes
  1. Drop the existing CHECK constraint on action_type
  2. Add new CHECK constraint including 'orchestrator_force_unlock'

  ## Notes
  - This is a non-destructive change
  - Existing data is not affected
  - The new action type can now be logged by the admin action logger
*/

-- Drop existing constraint
ALTER TABLE admin_actions DROP CONSTRAINT IF EXISTS admin_actions_action_type_check;

-- Add new constraint with orchestrator_force_unlock
ALTER TABLE admin_actions ADD CONSTRAINT admin_actions_action_type_check
CHECK (action_type IN (
  'error_delete',
  'error_bulk_cleanup',
  'rate_limit_clear',
  'rate_limit_view',
  'user_role_update',
  'user_create',
  'user_view',
  'user_delete',
  'orchestrator_start',
  'orchestrator_stop',
  'orchestrator_pause',
  'orchestrator_resume',
  'orchestrator_status',
  'orchestrator_force_unlock',
  'system_health_check',
  'system_config_update'
));
