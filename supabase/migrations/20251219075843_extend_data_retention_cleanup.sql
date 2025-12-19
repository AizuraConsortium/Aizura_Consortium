/*
  # Extend Data Retention Cleanup Policy

  1. Overview
    - Extends existing automated cleanup cron job
    - Adds retention policies for error_logs and messages tables
    - Maintains existing rate limiting cleanup (24h and 7d)
    - Balances system performance with auditability needs

  2. Retention Periods
    - Rate limit data: 24 hours (existing)
    - Rate limit violations: 7 days (existing)
    - Error logs: 365 days (1 year) - NEW
    - AI messages: 180 days (6 months) - NEW

  3. Rationale
    - Error logs: 1 year retention allows annual trend analysis and compliance
    - AI messages: 6 months provides sufficient context while reducing database bloat
    - Critical data (proposals, plans, votes) remains permanent
    - High-volume operational data auto-cleaned to optimize performance

  4. Important Notes
    - Cron job runs every 6 hours via pg_cron extension
    - Deletes messages older than 180 days (including arbitration via CASCADE)
    - Arbitration records cascade-delete when winner_message_id is removed
    - This is intentional: arbitration decisions preserved in jsonb, messages cleaned
    - Permanent data (proposals, plans, votes, topics) excluded from cleanup
    - Job can be monitored via cron.job_run_details view
    - Can be disabled by: SELECT cron.unschedule('cleanup-old-rate-limits');

  5. Affected Tables
    - rate_limits (24h) - operational data
    - rate_limit_violations (7d) - security monitoring
    - error_logs (365d) - system health tracking
    - messages (180d) - AI debate history
*/

-- First, unschedule the existing job to update it
SELECT cron.unschedule('cleanup-old-rate-limits');

-- Re-create the cron job with extended cleanup tasks
-- Runs every 6 hours at minute 0 (00:00, 06:00, 12:00, 18:00)
SELECT cron.schedule(
  'cleanup-old-rate-limits',
  '0 */6 * * *',
  $$
    -- Clean up old rate limit entries (older than 24 hours)
    -- Prevents table bloat from token bucket state tracking
    DELETE FROM rate_limits
    WHERE last_refill < now() - interval '24 hours';

    -- Clean up old violation logs (older than 7 days)
    -- Keeps recent security events for analysis
    DELETE FROM rate_limit_violations
    WHERE created_at < now() - interval '7 days';

    -- Clean up old error logs (older than 365 days)
    -- Maintains 1 year of error history for trend analysis
    DELETE FROM error_logs
    WHERE created_at < now() - interval '365 days';

    -- Clean up old AI messages (older than 180 days)
    -- Reduces high-volume debate data while preserving recent context
    -- Note: Arbitration records with winner_message_id will cascade delete
    DELETE FROM messages
    WHERE created_at < now() - interval '180 days';
  $$
);

-- Verify the job was created successfully
SELECT
  jobid,
  schedule,
  command,
  active
FROM cron.job
WHERE jobname = 'cleanup-old-rate-limits';