/*
  # Add Automated Rate Limit Cleanup

  1. Changes
    - Enable pg_cron extension for scheduled tasks
    - Create cron job to clean up old rate limit entries every 6 hours
    - Remove rate_limits entries older than 24 hours
    - Remove rate_limit_violations older than 7 days

  2. Rationale
    - Prevents database bloat from stale rate limit data
    - Keeps violation logs for analysis but removes old data
    - Runs automatically without manual intervention
    - 6-hour schedule balances cleanup frequency with load

  3. Notes
    - pg_cron extension must be available in Supabase
    - Cron job runs as superuser automatically
    - Can be monitored via pg_cron.job_run_details
    - Job can be disabled/modified by updating pg_cron.job table
*/

-- Enable pg_cron extension if not already enabled
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Schedule cleanup job to run every 6 hours
-- Format: minute hour day month weekday
SELECT cron.schedule(
  'cleanup-old-rate-limits',
  '0 */6 * * *',
  $$
    -- Clean up old rate limit entries (older than 24 hours)
    DELETE FROM rate_limits
    WHERE last_refill < now() - interval '24 hours';

    -- Clean up old violation logs (older than 7 days)
    DELETE FROM rate_limit_violations
    WHERE created_at < now() - interval '7 days';
  $$
);

-- Verify the job was created
SELECT 
  jobid,
  schedule,
  command,
  active
FROM cron.job
WHERE jobname = 'cleanup-old-rate-limits';
