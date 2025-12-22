/*
  # Admin Actions Audit Trail

  ## Summary
  Creates a comprehensive audit log for all administrative actions performed
  in the system. This provides compliance, security monitoring, and debugging
  capabilities for admin operations with 2-year retention.

  ## Changes

  1. New Tables
    - `admin_actions` table
      - `id` (uuid, primary key) - Unique action identifier
      - `admin_user_id` (uuid, references users) - Admin who performed action
      - `action_type` (text) - Type of action (see enum below)
      - `resource_type` (text) - What resource was affected
      - `resource_id` (text) - ID of affected resource
      - `action_details` (jsonb) - Detailed action information
      - `ip_address` (text) - IP address of admin
      - `user_agent` (text) - Browser/client user agent
      - `request_path` (text) - API endpoint path
      - `request_method` (text) - HTTP method (GET, POST, etc)
      - `success` (boolean) - Whether action succeeded
      - `error_message` (text) - Error if action failed
      - `created_at` (timestamptz) - When action occurred

  2. Action Types Enum
    - error_delete, error_bulk_cleanup
    - rate_limit_clear, rate_limit_view
    - user_role_update, user_create, user_view, user_delete
    - orchestrator_start, orchestrator_stop, orchestrator_pause, orchestrator_resume, orchestrator_status
    - system_health_check, system_config_update

  3. Security
    - Enable RLS (service role bypasses)
    - No public access policies
    - Server-side RBAC handles all operations

  4. Indexes
    - Index on admin_user_id for user-specific queries
    - Index on action_type for filtering
    - Index on created_at for time-range queries
    - Index on resource_type and resource_id for resource tracking
    - Index on success for error analysis
    - Composite indexes for common query patterns

  5. Retention Policy
    - Automatic cleanup of actions older than 2 years
    - Cron job runs monthly on 1st at 3 AM
    - Longer retention than error logs for compliance
*/

-- Create admin_actions table
CREATE TABLE IF NOT EXISTS admin_actions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_user_id uuid NOT NULL REFERENCES users(auth_user_id) ON DELETE CASCADE,
  action_type text NOT NULL CHECK (action_type IN (
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
    'system_health_check',
    'system_config_update'
  )),
  resource_type text NOT NULL CHECK (resource_type IN (
    'error_log',
    'rate_limit',
    'user',
    'orchestrator',
    'system'
  )),
  resource_id text,
  action_details jsonb DEFAULT '{}'::jsonb,
  ip_address text,
  user_agent text,
  request_path text,
  request_method text CHECK (request_method IN ('GET', 'POST', 'PUT', 'PATCH', 'DELETE')),
  success boolean DEFAULT true,
  error_message text,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS (service role bypasses)
ALTER TABLE admin_actions ENABLE ROW LEVEL SECURITY;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_admin_actions_admin_user_id ON admin_actions(admin_user_id);
CREATE INDEX IF NOT EXISTS idx_admin_actions_action_type ON admin_actions(action_type);
CREATE INDEX IF NOT EXISTS idx_admin_actions_resource_type ON admin_actions(resource_type);
CREATE INDEX IF NOT EXISTS idx_admin_actions_resource_id ON admin_actions(resource_id);
CREATE INDEX IF NOT EXISTS idx_admin_actions_created_at ON admin_actions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_admin_actions_success ON admin_actions(success) WHERE success = false;

-- Composite indexes for common queries
CREATE INDEX IF NOT EXISTS idx_admin_actions_user_time
  ON admin_actions(admin_user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_admin_actions_type_time
  ON admin_actions(action_type, created_at DESC);

-- Create cleanup function for old admin actions (keep 2 years for compliance)
CREATE OR REPLACE FUNCTION cleanup_old_admin_actions()
RETURNS integer
LANGUAGE plpgsql
AS $$
DECLARE
  deleted_count integer;
BEGIN
  DELETE FROM admin_actions
  WHERE created_at < now() - INTERVAL '2 years';

  GET DIAGNOSTICS deleted_count = ROW_COUNT;

  RAISE NOTICE 'Cleaned up % old admin action records', deleted_count;
  RETURN deleted_count;
END;
$$;

-- Schedule monthly cleanup using pg_cron
SELECT cron.schedule(
  'cleanup-old-admin-actions',
  '0 3 1 * *', -- 3 AM on the 1st of each month
  $$SELECT cleanup_old_admin_actions();$$
);

-- Add helpful comments
COMMENT ON TABLE admin_actions IS 'Comprehensive audit trail for all administrative actions. Tracks who did what, when, from where, and whether it succeeded. Retention: 2 years for compliance.';
COMMENT ON COLUMN admin_actions.action_details IS 'JSON object containing action-specific details like old/new values, affected count, query parameters, etc.';
COMMENT ON COLUMN admin_actions.resource_id IS 'ID of the resource affected. Can be UUID, string, or null for bulk operations or read-only actions.';
COMMENT ON COLUMN admin_actions.request_path IS 'Full API endpoint path that was called (e.g., /api/admin/errors/cleanup)';
COMMENT ON COLUMN admin_actions.request_method IS 'HTTP method used (GET, POST, PUT, PATCH, DELETE)';
