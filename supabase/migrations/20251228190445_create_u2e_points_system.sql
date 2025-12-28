/*
  # U2E Points System

  1. New Tables
    - `u2e_point_values`
      - Stores base point values for each action type
      - Includes daily/monthly caps and decay rates
      - Allows dynamic adjustment via governance
    - `u2e_user_points`
      - Tracks individual user point accumulation
      - Monthly breakdown by action type
      - Timestamped for audit trail
    - `u2e_monthly_distributions`
      - Stores monthly distribution calculations
      - Total points pool and AAIC distributed
      - Distribution status tracking

  2. Security
    - Enable RLS on all tables
    - Users can read their own points
    - Only service role can write points
    - Admin role can update point values

  3. Indexes
    - Optimized for monthly aggregations
    - Fast user point lookups
    - Distribution calculation queries
*/

-- Point values configuration table
CREATE TABLE IF NOT EXISTS u2e_point_values (
  action_type TEXT PRIMARY KEY,
  base_points INTEGER NOT NULL CHECK (base_points > 0),
  max_per_day INTEGER CHECK (max_per_day > 0),
  max_per_month INTEGER CHECK (max_per_month > 0),
  decay_rate DECIMAL(5,4) DEFAULT 0.0 CHECK (decay_rate >= 0 AND decay_rate <= 1),
  description TEXT,
  business_name TEXT,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- User points tracking table
CREATE TABLE IF NOT EXISTS u2e_user_points (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  month INTEGER NOT NULL CHECK (month >= 1 AND month <= 12),
  year INTEGER NOT NULL CHECK (year >= 2024),
  action_type TEXT NOT NULL REFERENCES u2e_point_values(action_type),
  points_earned INTEGER NOT NULL CHECK (points_earned >= 0),
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Monthly distribution tracking
CREATE TABLE IF NOT EXISTS u2e_monthly_distributions (
  month INTEGER NOT NULL CHECK (month >= 1 AND month <= 12),
  year INTEGER NOT NULL CHECK (year >= 2024),
  total_points BIGINT NOT NULL DEFAULT 0 CHECK (total_points >= 0),
  aaic_pool_size INTEGER NOT NULL DEFAULT 458333,
  aaic_distributed DECIMAL(18,8),
  unique_participants INTEGER DEFAULT 0,
  distribution_complete BOOLEAN DEFAULT false,
  distributed_at TIMESTAMPTZ,
  metadata JSONB DEFAULT '{}'::jsonb,
  PRIMARY KEY (month, year)
);

-- User monthly point summaries (materialized for performance)
CREATE TABLE IF NOT EXISTS u2e_user_monthly_summary (
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  month INTEGER NOT NULL CHECK (month >= 1 AND month <= 12),
  year INTEGER NOT NULL CHECK (year >= 2024),
  total_points BIGINT NOT NULL DEFAULT 0,
  aaic_earned DECIMAL(18,8) DEFAULT 0,
  actions_count INTEGER DEFAULT 0,
  last_action_at TIMESTAMPTZ,
  PRIMARY KEY (user_id, month, year)
);

-- Anti-abuse tracking
CREATE TABLE IF NOT EXISTS u2e_abuse_flags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  flag_type TEXT NOT NULL,
  severity TEXT NOT NULL CHECK (severity IN ('low', 'medium', 'high', 'critical')),
  description TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  resolved BOOLEAN DEFAULT false,
  resolved_at TIMESTAMPTZ,
  resolved_by UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_u2e_user_points_user_month ON u2e_user_points(user_id, year, month);
CREATE INDEX IF NOT EXISTS idx_u2e_user_points_month ON u2e_user_points(year, month);
CREATE INDEX IF NOT EXISTS idx_u2e_user_points_action ON u2e_user_points(action_type);
CREATE INDEX IF NOT EXISTS idx_u2e_user_points_created ON u2e_user_points(created_at);
CREATE INDEX IF NOT EXISTS idx_u2e_monthly_summary_user ON u2e_user_monthly_summary(user_id);
CREATE INDEX IF NOT EXISTS idx_u2e_abuse_flags_user ON u2e_abuse_flags(user_id, resolved);

-- Enable RLS
ALTER TABLE u2e_point_values ENABLE ROW LEVEL SECURITY;
ALTER TABLE u2e_user_points ENABLE ROW LEVEL SECURITY;
ALTER TABLE u2e_monthly_distributions ENABLE ROW LEVEL SECURITY;
ALTER TABLE u2e_user_monthly_summary ENABLE ROW LEVEL SECURITY;
ALTER TABLE u2e_abuse_flags ENABLE ROW LEVEL SECURITY;

-- RLS Policies for u2e_point_values
CREATE POLICY "Anyone can view active point values"
  ON u2e_point_values FOR SELECT
  USING (active = true);

CREATE POLICY "Service role can manage point values"
  ON u2e_point_values FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- RLS Policies for u2e_user_points
CREATE POLICY "Users can view own points"
  ON u2e_user_points FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Service role can insert user points"
  ON u2e_user_points FOR INSERT
  TO service_role
  WITH CHECK (true);

CREATE POLICY "Service role can view all user points"
  ON u2e_user_points FOR SELECT
  TO service_role
  USING (true);

-- RLS Policies for u2e_monthly_distributions
CREATE POLICY "Anyone can view completed distributions"
  ON u2e_monthly_distributions FOR SELECT
  USING (distribution_complete = true);

CREATE POLICY "Service role can manage distributions"
  ON u2e_monthly_distributions FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- RLS Policies for u2e_user_monthly_summary
CREATE POLICY "Users can view own summary"
  ON u2e_user_monthly_summary FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Service role can manage summaries"
  ON u2e_user_monthly_summary FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- RLS Policies for u2e_abuse_flags
CREATE POLICY "Service role can manage abuse flags"
  ON u2e_abuse_flags FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Function to update user monthly summary
CREATE OR REPLACE FUNCTION update_u2e_user_monthly_summary()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO u2e_user_monthly_summary (user_id, month, year, total_points, actions_count, last_action_at)
  VALUES (NEW.user_id, NEW.month, NEW.year, NEW.points_earned, 1, NEW.created_at)
  ON CONFLICT (user_id, month, year) 
  DO UPDATE SET
    total_points = u2e_user_monthly_summary.total_points + NEW.points_earned,
    actions_count = u2e_user_monthly_summary.actions_count + 1,
    last_action_at = GREATEST(u2e_user_monthly_summary.last_action_at, NEW.created_at);
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to maintain summary table
CREATE TRIGGER trigger_update_u2e_summary
  AFTER INSERT ON u2e_user_points
  FOR EACH ROW
  EXECUTE FUNCTION update_u2e_user_monthly_summary();

-- Function to calculate monthly distribution
CREATE OR REPLACE FUNCTION calculate_u2e_monthly_distribution(
  p_month INTEGER,
  p_year INTEGER
)
RETURNS TABLE (
  user_id UUID,
  total_points BIGINT,
  pool_share DECIMAL,
  aaic_amount DECIMAL
) AS $$
DECLARE
  v_total_points BIGINT;
  v_aaic_pool INTEGER := 458333;
BEGIN
  -- Get total points for the month
  SELECT COALESCE(SUM(total_points), 0)
  INTO v_total_points
  FROM u2e_user_monthly_summary
  WHERE month = p_month AND year = p_year;

  -- Return distribution calculation
  RETURN QUERY
  SELECT 
    s.user_id,
    s.total_points,
    CASE 
      WHEN v_total_points > 0 THEN (s.total_points::DECIMAL / v_total_points::DECIMAL)
      ELSE 0
    END as pool_share,
    CASE 
      WHEN v_total_points > 0 THEN (s.total_points::DECIMAL / v_total_points::DECIMAL) * v_aaic_pool
      ELSE 0
    END as aaic_amount
  FROM u2e_user_monthly_summary s
  WHERE s.month = p_month AND s.year = p_year
  ORDER BY s.total_points DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Insert initial point values
INSERT INTO u2e_point_values (action_type, base_points, max_per_day, max_per_month, description, business_name) VALUES
  ('ai_trader_trade', 100, 50, 1000, 'Automated trade executed via AI Traders', 'AI Traders'),
  ('web_dev_project', 500, 10, 100, 'Web project created via AI Web Dev', 'AI Web Dev'),
  ('business_factory_plan', 1000, 5, 50, 'Business plan generated via AI Business Factory', 'AI Business Factory'),
  ('coinfusion_search', 10, 200, 5000, 'Data search performed on Coinfusion', 'Coinfusion'),
  ('proposal_vote', 50, 10, 100, 'Vote cast on governance proposal', 'Governance'),
  ('proposal_submit', 500, 1, 10, 'New proposal submitted', 'Governance'),
  ('social_share', 20, 5, 100, 'Platform content shared on social media', 'Marketing'),
  ('referral_signup', 1000, 10, 100, 'Successful referral signup', 'Growth')
ON CONFLICT (action_type) DO NOTHING;
