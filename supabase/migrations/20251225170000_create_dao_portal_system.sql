/*
  # Create DAO Portal System

  1. Materialized Views
    - `dao_statistics` - Aggregated DAO statistics for fast queries
    - `treasury_metrics` - Treasury calculations and business breakdown

  2. New Tables
    - `governance_metrics_history` - Historical tracking of governance metrics
      - `id` (uuid, primary key)
      - `recorded_at` (timestamptz)
      - `active_proposals` (integer)
      - `passed_proposals` (integer)
      - `rejected_proposals` (integer)
      - `unique_voters` (integer)
      - `participation_rate` (decimal)
      - `total_treasury_value` (decimal)
      - `monthly_revenue` (decimal)
      - `created_at` (timestamptz)

  3. Functions
    - `refresh_dao_materialized_views()` - Refresh all DAO materialized views
    - `calculate_participation_rate()` - Calculate governance participation rate

  4. Indexes
    - Performance indexes for proposals, votes, and businesses
    - Indexes on materialized views for fast refresh
    - Historical data time-series indexes

  5. Security
    - Enable RLS on governance_metrics_history
    - Public read access to DAO statistics (anon and authenticated)
    - Public read access to treasury metrics
    - Public read access to governance history

  6. Background Jobs
    - Cron job to refresh materialized views every 5 minutes
    - Cron job to capture historical metrics every hour

  7. Notes
    - Materialized views for performance (sub-second queries)
    - Historical tracking enables trend analysis
    - All views are public for transparency
    - CONCURRENTLY option prevents blocking
*/

-- ============================================================================
-- MATERIALIZED VIEWS
-- ============================================================================

-- Materialized view for fast DAO statistics queries
CREATE MATERIALIZED VIEW IF NOT EXISTS dao_statistics AS
SELECT
  COUNT(*) FILTER (WHERE status = 'active') as active_proposals,
  COUNT(*) FILTER (WHERE status = 'adopted') as passed_proposals,
  COUNT(*) FILTER (WHERE status = 'rejected') as rejected_proposals,
  COUNT(*) FILTER (WHERE status = 'pending') as pending_proposals,
  COUNT(*) as total_proposals,
  (
    SELECT COUNT(DISTINCT voter_id)
    FROM votes
    WHERE created_at > NOW() - INTERVAL '30 days'
  ) as unique_voters_30d,
  (
    SELECT COUNT(DISTINCT voter_id)
    FROM votes
    WHERE created_at > NOW() - INTERVAL '7 days'
  ) as active_voters_7d,
  NOW() as last_updated
FROM proposals
WHERE deleted_at IS NULL;

-- Create unique index for CONCURRENTLY refresh support
CREATE UNIQUE INDEX IF NOT EXISTS idx_dao_stats_last_updated
  ON dao_statistics (last_updated);

-- Materialized view for treasury calculations
CREATE MATERIALIZED VIEW IF NOT EXISTS treasury_metrics AS
SELECT
  COALESCE(SUM(monthly_revenue), 0) as total_monthly_revenue,
  COALESCE(SUM(total_revenue), 0) as total_lifetime_revenue,
  COUNT(*) FILTER (WHERE status = 'active' AND deleted_at IS NULL) as active_businesses,
  COUNT(*) FILTER (WHERE is_foundation = true AND deleted_at IS NULL) as foundation_count,
  COUNT(*) FILTER (WHERE is_foundation = false AND status = 'active' AND deleted_at IS NULL) as live_business_count,
  COALESCE(SUM(CASE WHEN is_foundation = true THEN total_revenue ELSE 0 END), 0) as foundation_value,
  COALESCE(SUM(CASE WHEN is_foundation = false THEN total_revenue ELSE 0 END), 0) as live_business_value,
  NOW() as last_updated
FROM u2e_businesses
WHERE deleted_at IS NULL;

-- Create unique index for CONCURRENTLY refresh support
CREATE UNIQUE INDEX IF NOT EXISTS idx_treasury_metrics_last_updated
  ON treasury_metrics (last_updated);

-- ============================================================================
-- TABLES
-- ============================================================================

-- Table for tracking governance metrics over time
CREATE TABLE IF NOT EXISTS governance_metrics_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  recorded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  active_proposals INTEGER NOT NULL DEFAULT 0,
  passed_proposals INTEGER NOT NULL DEFAULT 0,
  rejected_proposals INTEGER NOT NULL DEFAULT 0,
  pending_proposals INTEGER NOT NULL DEFAULT 0,
  total_proposals INTEGER NOT NULL DEFAULT 0,
  unique_voters INTEGER NOT NULL DEFAULT 0,
  active_voters INTEGER NOT NULL DEFAULT 0,
  participation_rate DECIMAL(5,2) DEFAULT 0.00,
  total_treasury_value DECIMAL(20,2) DEFAULT 0.00,
  monthly_revenue DECIMAL(20,2) DEFAULT 0.00,
  active_businesses INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- INDEXES
-- ============================================================================

-- Governance metrics history indexes
CREATE INDEX IF NOT EXISTS idx_gov_metrics_history_recorded
  ON governance_metrics_history (recorded_at DESC);

CREATE INDEX IF NOT EXISTS idx_gov_metrics_history_created
  ON governance_metrics_history (created_at DESC);

-- Optimize proposal queries
CREATE INDEX IF NOT EXISTS idx_proposals_status_created
  ON proposals (status, created_at DESC)
  WHERE deleted_at IS NULL;

CREATE INDEX IF NOT EXISTS idx_proposals_status_updated
  ON proposals (status, updated_at DESC)
  WHERE deleted_at IS NULL;

-- Optimize vote queries for participation calculations
CREATE INDEX IF NOT EXISTS idx_votes_voter_created
  ON votes (voter_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_votes_proposal_created
  ON votes (proposal_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_votes_created_recent
  ON votes (created_at DESC)
  WHERE created_at > NOW() - INTERVAL '90 days';

-- Optimize business metrics queries
CREATE INDEX IF NOT EXISTS idx_businesses_status_active
  ON u2e_businesses (status, is_active, is_foundation)
  WHERE deleted_at IS NULL;

CREATE INDEX IF NOT EXISTS idx_businesses_revenue
  ON u2e_businesses (monthly_revenue DESC, total_revenue DESC)
  WHERE deleted_at IS NULL AND status = 'active';

-- ============================================================================
-- FUNCTIONS
-- ============================================================================

-- Function to refresh all DAO materialized views
CREATE OR REPLACE FUNCTION refresh_dao_materialized_views()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Refresh concurrently to avoid blocking reads
  REFRESH MATERIALIZED VIEW CONCURRENTLY dao_statistics;
  REFRESH MATERIALIZED VIEW CONCURRENTLY treasury_metrics;

  -- Log refresh time (optional - can be removed if not needed)
  RAISE NOTICE 'DAO materialized views refreshed at %', NOW();
END;
$$;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION refresh_dao_materialized_views() TO anon, authenticated, service_role;

-- Function to calculate participation rate
CREATE OR REPLACE FUNCTION calculate_participation_rate()
RETURNS DECIMAL(5,2)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  total_eligible INTEGER;
  unique_participants INTEGER;
  participation_rate DECIMAL(5,2);
BEGIN
  -- Get total eligible voters (users who can vote)
  SELECT COUNT(*) INTO total_eligible
  FROM users
  WHERE role IN ('user', 'admin', 'moderator')
    AND deleted_at IS NULL;

  -- Get unique voters in last 30 days
  SELECT COUNT(DISTINCT voter_id) INTO unique_participants
  FROM votes
  WHERE created_at > NOW() - INTERVAL '30 days';

  -- Calculate participation rate
  IF total_eligible > 0 THEN
    participation_rate := (unique_participants::DECIMAL / total_eligible::DECIMAL) * 100;
  ELSE
    participation_rate := 0.00;
  END IF;

  RETURN ROUND(participation_rate, 2);
END;
$$;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION calculate_participation_rate() TO anon, authenticated, service_role;

-- Function to capture historical governance snapshot
CREATE OR REPLACE FUNCTION capture_governance_snapshot()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_dao_stats RECORD;
  v_treasury_stats RECORD;
  v_participation_rate DECIMAL(5,2);
BEGIN
  -- Get current DAO statistics
  SELECT * INTO v_dao_stats FROM dao_statistics LIMIT 1;

  -- Get current treasury metrics
  SELECT * INTO v_treasury_stats FROM treasury_metrics LIMIT 1;

  -- Calculate participation rate
  v_participation_rate := calculate_participation_rate();

  -- Insert snapshot into history
  INSERT INTO governance_metrics_history (
    recorded_at,
    active_proposals,
    passed_proposals,
    rejected_proposals,
    pending_proposals,
    total_proposals,
    unique_voters,
    active_voters,
    participation_rate,
    total_treasury_value,
    monthly_revenue,
    active_businesses
  ) VALUES (
    NOW(),
    COALESCE(v_dao_stats.active_proposals, 0),
    COALESCE(v_dao_stats.passed_proposals, 0),
    COALESCE(v_dao_stats.rejected_proposals, 0),
    COALESCE(v_dao_stats.pending_proposals, 0),
    COALESCE(v_dao_stats.total_proposals, 0),
    COALESCE(v_dao_stats.unique_voters_30d, 0),
    COALESCE(v_dao_stats.active_voters_7d, 0),
    v_participation_rate,
    COALESCE(v_treasury_stats.total_lifetime_revenue, 0),
    COALESCE(v_treasury_stats.total_monthly_revenue, 0),
    COALESCE(v_treasury_stats.active_businesses, 0)
  );

  RAISE NOTICE 'Governance snapshot captured at %', NOW();
END;
$$;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION capture_governance_snapshot() TO service_role;

-- ============================================================================
-- ROW LEVEL SECURITY
-- ============================================================================

-- Enable RLS on governance_metrics_history
ALTER TABLE governance_metrics_history ENABLE ROW LEVEL SECURITY;

-- Allow public read access to governance history
CREATE POLICY "Public can view governance history"
  ON governance_metrics_history FOR SELECT
  TO anon, authenticated
  USING (true);

-- Only service role can insert historical data
CREATE POLICY "Service role can insert governance history"
  ON governance_metrics_history FOR INSERT
  TO service_role
  WITH CHECK (true);

-- ============================================================================
-- CRON JOBS
-- ============================================================================

-- Install pg_cron extension if not already installed
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Remove existing jobs if they exist (to avoid duplicates)
DO $$
BEGIN
  -- Remove refresh job if exists
  PERFORM cron.unschedule('refresh-dao-views');
EXCEPTION
  WHEN OTHERS THEN NULL;
END $$;

DO $$
BEGIN
  -- Remove capture job if exists
  PERFORM cron.unschedule('capture-governance-metrics');
EXCEPTION
  WHEN OTHERS THEN NULL;
END $$;

-- Schedule materialized view refresh every 5 minutes
SELECT cron.schedule(
  'refresh-dao-views',
  '*/5 * * * *',
  'SELECT refresh_dao_materialized_views()'
);

-- Schedule governance metrics capture every hour
SELECT cron.schedule(
  'capture-governance-metrics',
  '0 * * * *',
  'SELECT capture_governance_snapshot()'
);

-- ============================================================================
-- INITIAL DATA POPULATION
-- ============================================================================

-- Refresh materialized views immediately
SELECT refresh_dao_materialized_views();

-- Capture initial governance snapshot
SELECT capture_governance_snapshot();

-- ============================================================================
-- GRANTS
-- ============================================================================

-- Grant read access to materialized views
GRANT SELECT ON dao_statistics TO anon, authenticated;
GRANT SELECT ON treasury_metrics TO anon, authenticated;
GRANT SELECT ON governance_metrics_history TO anon, authenticated;

-- ============================================================================
-- COMMENTS
-- ============================================================================

COMMENT ON MATERIALIZED VIEW dao_statistics IS 'Aggregated DAO statistics for fast public queries. Refreshed every 5 minutes.';
COMMENT ON MATERIALIZED VIEW treasury_metrics IS 'Treasury calculations and business breakdown. Refreshed every 5 minutes.';
COMMENT ON TABLE governance_metrics_history IS 'Historical tracking of governance metrics for trend analysis. Captured every hour.';
COMMENT ON FUNCTION refresh_dao_materialized_views() IS 'Refreshes all DAO materialized views concurrently without blocking reads.';
COMMENT ON FUNCTION calculate_participation_rate() IS 'Calculates governance participation rate based on unique voters in last 30 days.';
COMMENT ON FUNCTION capture_governance_snapshot() IS 'Captures current governance and treasury metrics into historical table.';
