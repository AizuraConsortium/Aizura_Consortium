/*
  # Add Rate Limiting Infrastructure

  1. New Tables
    - `rate_limits`
      - Stores token bucket state for each identifier-endpoint combination
      - `identifier` (text) - IP address or user ID
      - `endpoint` (text) - Route identifier (e.g., 'GET:/api/home')
      - `tokens` (integer) - Current tokens remaining in bucket
      - `last_refill` (timestamptz) - Last time tokens were refilled
      - Composite primary key on (identifier, endpoint)
      - Index on last_refill for efficient cleanup

    - `rate_limit_violations`
      - Logs all rate limit violation attempts for security monitoring
      - `id` (uuid) - Primary key
      - `identifier` (text) - Who violated the limit
      - `endpoint` (text) - Which endpoint was accessed
      - `timestamp` (timestamptz) - When violation occurred
      - `tokens_requested` (integer) - How many tokens were requested
      - Index on timestamp for analytics queries

  2. Functions
    - `check_rate_limit()` - Atomic token bucket algorithm implementation
      - Implements row-level locking for concurrency safety
      - Automatically refills tokens based on elapsed time
      - Returns (allowed boolean, remaining_tokens integer)

    - `cleanup_old_rate_limits()` - Maintenance function
      - Removes stale rate limit entries (>1 hour old)
      - Keeps database size manageable

  3. Security
    - Enable RLS on both tables
    - Service role bypass for backend access
    - No public access (all access via backend)
*/

-- Create rate_limits table
CREATE TABLE IF NOT EXISTS rate_limits (
  identifier text NOT NULL,
  endpoint text NOT NULL,
  tokens integer NOT NULL DEFAULT 0,
  last_refill timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (identifier, endpoint)
);

-- Create index for cleanup queries
CREATE INDEX IF NOT EXISTS idx_rate_limits_last_refill ON rate_limits(last_refill);

-- Create rate_limit_violations table
CREATE TABLE IF NOT EXISTS rate_limit_violations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  identifier text NOT NULL,
  endpoint text NOT NULL,
  timestamp timestamptz NOT NULL DEFAULT now(),
  tokens_requested integer NOT NULL DEFAULT 1,
  user_agent text,
  ip_address text
);

-- Create index for analytics
CREATE INDEX IF NOT EXISTS idx_rate_limit_violations_timestamp ON rate_limit_violations(timestamp);
CREATE INDEX IF NOT EXISTS idx_rate_limit_violations_identifier ON rate_limit_violations(identifier);
CREATE INDEX IF NOT EXISTS idx_rate_limit_violations_endpoint ON rate_limit_violations(endpoint);

-- Enable Row Level Security
ALTER TABLE rate_limits ENABLE ROW LEVEL SECURITY;
ALTER TABLE rate_limit_violations ENABLE ROW LEVEL SECURITY;

-- RLS Policies: Service role has full access, no public access
CREATE POLICY "Service role has full access to rate_limits"
  ON rate_limits
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Service role has full access to rate_limit_violations"
  ON rate_limit_violations
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Function: Token bucket rate limiting algorithm
CREATE OR REPLACE FUNCTION check_rate_limit(
  p_identifier text,
  p_endpoint text,
  p_max_tokens integer,
  p_refill_rate numeric  -- tokens per second
) RETURNS TABLE(allowed boolean, remaining_tokens integer) AS $$
DECLARE
  v_current_tokens integer;
  v_last_refill timestamptz;
  v_elapsed_seconds numeric;
  v_new_tokens numeric;
  v_final_tokens integer;
BEGIN
  -- Lock the row for this identifier-endpoint combination
  SELECT tokens, last_refill INTO v_current_tokens, v_last_refill
  FROM rate_limits
  WHERE identifier = p_identifier AND endpoint = p_endpoint
  FOR UPDATE;

  -- If no record exists, create one with full tokens
  IF NOT FOUND THEN
    INSERT INTO rate_limits (identifier, endpoint, tokens, last_refill)
    VALUES (p_identifier, p_endpoint, p_max_tokens - 1, now())
    ON CONFLICT (identifier, endpoint) DO NOTHING;

    RETURN QUERY SELECT true, p_max_tokens - 1;
    RETURN;
  END IF;

  -- Calculate elapsed time since last refill
  v_elapsed_seconds := EXTRACT(EPOCH FROM (now() - v_last_refill));

  -- Calculate new tokens (refilled based on time elapsed)
  v_new_tokens := v_current_tokens + (v_elapsed_seconds * p_refill_rate);

  -- Cap at max tokens (bucket can't overflow)
  v_final_tokens := LEAST(v_new_tokens::integer, p_max_tokens);

  -- Check if request is allowed (at least 1 token available)
  IF v_final_tokens >= 1 THEN
    -- Allow request and consume 1 token
    UPDATE rate_limits
    SET tokens = v_final_tokens - 1,
        last_refill = now()
    WHERE identifier = p_identifier AND endpoint = p_endpoint;

    RETURN QUERY SELECT true, v_final_tokens - 1;
  ELSE
    -- Deny request, no tokens consumed
    UPDATE rate_limits
    SET tokens = v_final_tokens,
        last_refill = now()
    WHERE identifier = p_identifier AND endpoint = p_endpoint;

    RETURN QUERY SELECT false, v_final_tokens;
  END IF;
END;
$$ LANGUAGE plpgsql;

-- Function: Cleanup old rate limit entries
CREATE OR REPLACE FUNCTION cleanup_old_rate_limits()
RETURNS integer AS $$
DECLARE
  v_deleted_count integer;
BEGIN
  -- Delete entries older than 1 hour
  DELETE FROM rate_limits
  WHERE last_refill < (now() - interval '1 hour');

  GET DIAGNOSTICS v_deleted_count = ROW_COUNT;

  RETURN v_deleted_count;
END;
$$ LANGUAGE plpgsql;

-- Function: Get rate limit statistics
CREATE OR REPLACE FUNCTION get_rate_limit_stats(p_hours integer DEFAULT 24)
RETURNS TABLE(
  endpoint text,
  total_violations bigint,
  unique_identifiers bigint,
  avg_tokens_requested numeric
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    v.endpoint,
    COUNT(*)::bigint as total_violations,
    COUNT(DISTINCT v.identifier)::bigint as unique_identifiers,
    AVG(v.tokens_requested)::numeric as avg_tokens_requested
  FROM rate_limit_violations v
  WHERE v.timestamp > (now() - (p_hours || ' hours')::interval)
  GROUP BY v.endpoint
  ORDER BY total_violations DESC;
END;
$$ LANGUAGE plpgsql;
