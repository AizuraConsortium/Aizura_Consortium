/*
  # Update Error Logs RLS for Server-Side RBAC

  ## Summary
  Updates the error_logs table to use server-side RBAC instead of database-level policies.
  This migration removes all existing RLS policies while keeping RLS enabled.

  ## Changes
  
  1. RLS Policy Updates
    - Drop all existing policies on error_logs table
    - Keep RLS enabled on error_logs
    - Service role key (used by backend) bypasses RLS automatically
  
  2. Security Approach
    - All authorization is now handled server-side via Express middleware
    - Backend uses service role key for all database operations
    - Public endpoints provide limited, sanitized data
    - Admin endpoints require authentication + role check + IP whitelist
  
  ## Notes
  - RLS remains enabled as a safety mechanism
  - Service role bypasses RLS, allowing backend full control
  - This approach centralizes all access control logic in the application layer
  - Makes it easier to implement complex authorization rules
  - Provides better audit trail through application logging
*/

-- Drop all existing policies on error_logs
DO $$ 
DECLARE
  policy_record RECORD;
BEGIN
  FOR policy_record IN 
    SELECT policyname 
    FROM pg_policies 
    WHERE tablename = 'error_logs' AND schemaname = 'public'
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON error_logs', policy_record.policyname);
  END LOOP;
END $$;

-- Ensure RLS is enabled (it should already be, but this is defensive)
ALTER TABLE error_logs ENABLE ROW LEVEL SECURITY;

-- Add comment explaining the server-side RBAC approach
COMMENT ON TABLE error_logs IS 'Error logging table with server-side RBAC. RLS is enabled but has no policies. Backend uses service role key (which bypasses RLS) for all operations. Access control is enforced through Express middleware: public endpoints provide sanitized/limited data, admin endpoints require authentication + role verification + IP whitelist.';
