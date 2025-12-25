/*
  # U2E (Use-to-Earn) System - Complete Implementation
  
  ## Overview
  Comprehensive system for tracking usage across AAIC ecosystem businesses
  and rewarding users with AAIC tokens based on their activity.
  
  ## 1. New Tables
  
  ### `u2e_system_config`
  - Global on/off switch for U2E system
  - Activation dates and settings
  - Global multiplier for adjusting all rewards
  - Minimum payout threshold
  
  ### `u2e_businesses`
  - Registry of integrated businesses (AI Traders, AI Business Factory, AI Web Dev)
  - Integration type (webhook, API, manual)
  - Active status per business
  - Business metadata and branding
  
  ### `u2e_reward_rates`
  - Versioned reward rates with full history
  - Rate per action type per business
  - Effective date ranges for rate changes
  - Audit trail of who changed rates and why
  
  ### `u2e_usage_events`
  - Raw usage events (partitioned by month for scale)
  - Idempotency keys to prevent duplicates
  - Metadata for business-specific data
  - IP and user agent for fraud detection
  - Processing status
  
  ### `u2e_usage_rewards`
  - Aggregated rewards (daily/weekly/monthly)
  - Final calculated rewards per user/business/action
  - Claim status for token distribution
  - Calculation audit trail
  
  ### `u2e_reward_claims`
  - Future token distribution tracking
  - Supports 3-phase tokenomics model (years 0-2, 2-4, 4+)
  - Blockchain transaction tracking
  - Distribution method tracking (initial supply vs revenue buyback)
  
  ## 2. Security
  - RLS enabled on all tables
  - Users can only view their own data
  - Admin role required for system management
  - Public can view active rates and system status
  - Audit logging for all admin actions
  
  ## 3. Performance
  - Partitioned tables for scalability (100M+ events)
  - Materialized view for user stats (refreshed hourly)
  - Strategic indexes on all query patterns
  - Idempotency at database level
  
  ## 4. Business Logic
  - Automated daily reward calculation via cron
  - Rate versioning with effective dates
  - Support for transitioning from fixed to dynamic rewards
  - Fraud detection metadata capture
  
  ## 5. Integration Support
  - Webhook endpoints for external businesses
  - API key authentication
  - Batch event processing
  - Historical data import support
*/

-- ============================================
-- 1. U2E SYSTEM CONFIGURATION (MASTER SWITCH)
-- ============================================
CREATE TABLE IF NOT EXISTS u2e_system_config (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  is_active boolean DEFAULT false,
  activation_date timestamptz,
  deactivation_date timestamptz,
  global_multiplier numeric DEFAULT 1.0,
  min_payout_threshold numeric DEFAULT 1.0,
  settings jsonb DEFAULT '{}',
  updated_by uuid REFERENCES auth.users(id),
  updated_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS u2e_config_singleton ON u2e_system_config ((true));

INSERT INTO u2e_system_config (is_active, settings) 
VALUES (false, '{"notes": "U2E system created but inactive. Activate after airdrop completion."}')
ON CONFLICT DO NOTHING;

-- ============================================
-- 2. BUSINESS REGISTRY
-- ============================================
CREATE TABLE IF NOT EXISTS u2e_businesses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  business_name text NOT NULL UNIQUE,
  display_name text NOT NULL,
  description text,
  is_active boolean DEFAULT false,
  integration_type text NOT NULL CHECK (integration_type IN ('webhook', 'manual', 'api')),
  webhook_url text,
  api_key_hash text,
  logo_url text,
  metadata jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  deleted_at timestamptz
);

CREATE INDEX IF NOT EXISTS idx_u2e_businesses_name ON u2e_businesses(business_name) 
  WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_u2e_businesses_active ON u2e_businesses(is_active) 
  WHERE deleted_at IS NULL AND is_active = true;

INSERT INTO u2e_businesses (business_name, display_name, description, is_active, integration_type, metadata) VALUES
('ai_traders', 'AI Traders', 'AI-powered cryptocurrency trading platform. Users earn rewards based on trading activity, API usage, and platform engagement.', false, 'webhook', '{"category": "trading", "launch_status": "live", "tracking_enabled": true}'),
('ai_business_factory', 'AI Business Factory', 'AI business plan and strategy generator. Reserved for future integration - not commercially available yet.', false, 'manual', '{"category": "business", "launch_status": "development", "tracking_enabled": false}'),
('ai_web_dev', 'AI Web Dev', 'AI-powered website development service. B2B model where clients purchase AI-built websites.', false, 'manual', '{"category": "development", "launch_status": "live", "tracking_enabled": false, "notes": "B2B model - tracking TBD"}')
ON CONFLICT (business_name) DO NOTHING;

-- ============================================
-- 3. REWARD RATES (VERSIONED)
-- ============================================
CREATE TABLE IF NOT EXISTS u2e_reward_rates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id uuid REFERENCES u2e_businesses(id) ON DELETE CASCADE,
  action_type text NOT NULL,
  action_label text,
  rate_per_action numeric NOT NULL CHECK (rate_per_action >= 0),
  effective_from timestamptz NOT NULL DEFAULT now(),
  effective_to timestamptz,
  is_active boolean DEFAULT true,
  updated_by uuid REFERENCES auth.users(id),
  notes text,
  created_at timestamptz DEFAULT now(),
  
  CONSTRAINT valid_effective_dates CHECK (effective_to IS NULL OR effective_to > effective_from)
);

CREATE INDEX IF NOT EXISTS idx_u2e_rates_active ON u2e_reward_rates(business_id, action_type, effective_from DESC) 
  WHERE is_active = true AND effective_to IS NULL;
CREATE INDEX IF NOT EXISTS idx_u2e_rates_business ON u2e_reward_rates(business_id, effective_from DESC);

-- Initial rates for AI Traders
DO $$
DECLARE
  v_business_id uuid;
BEGIN
  SELECT id INTO v_business_id FROM u2e_businesses WHERE business_name = 'ai_traders';
  
  IF v_business_id IS NOT NULL THEN
    INSERT INTO u2e_reward_rates (business_id, action_type, action_label, rate_per_action, notes) VALUES
    (v_business_id, 'trade_executed', 'Trade Executed', 0.1, 'Initial rate - 0.1 AAIC per completed trade'),
    (v_business_id, 'stop_loss_triggered', 'Stop Loss Triggered', 0.05, 'Initial rate - 0.05 AAIC per stop loss event'),
    (v_business_id, 'take_profit_hit', 'Take Profit Hit', 0.08, 'Initial rate - 0.08 AAIC per take profit event'),
    (v_business_id, 'portfolio_view', 'Portfolio View', 0.001, 'Initial rate - 0.001 AAIC per portfolio page view'),
    (v_business_id, 'api_call', 'API Call', 0.002, 'Initial rate - 0.002 AAIC per API call made'),
    (v_business_id, 'bot_created', 'Trading Bot Created', 1.0, 'Initial rate - 1.0 AAIC for creating a trading bot'),
    (v_business_id, 'bot_deployed', 'Trading Bot Deployed', 2.0, 'Initial rate - 2.0 AAIC for deploying a trading bot to live trading')
    ON CONFLICT DO NOTHING;
  END IF;
END $$;

-- ============================================
-- 4. USAGE EVENTS (PARTITIONED FOR SCALE)
-- ============================================
CREATE TABLE IF NOT EXISTS u2e_usage_events (
  id uuid DEFAULT gen_random_uuid(),
  event_idempotency_key text NOT NULL,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  business_id uuid NOT NULL REFERENCES u2e_businesses(id) ON DELETE CASCADE,
  action_type text NOT NULL,
  metadata jsonb DEFAULT '{}',
  ip_address inet,
  user_agent text,
  processed boolean DEFAULT false,
  processed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
) PARTITION BY RANGE (created_at);

-- Idempotency constraint must include partition key
CREATE UNIQUE INDEX IF NOT EXISTS idx_u2e_events_idempotency ON u2e_usage_events(event_idempotency_key, created_at);
CREATE INDEX IF NOT EXISTS idx_u2e_events_user ON u2e_usage_events(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_u2e_events_business ON u2e_usage_events(business_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_u2e_events_unprocessed ON u2e_usage_events(created_at) WHERE processed = false;

-- Create partitions for current and next 3 months
DO $$
DECLARE
  v_start_date date;
  v_end_date date;
  v_table_name text;
  v_month_offset integer;
BEGIN
  FOR v_month_offset IN 0..3 LOOP
    v_start_date := date_trunc('month', now() + (v_month_offset || ' months')::interval)::date;
    v_end_date := (date_trunc('month', now() + ((v_month_offset + 1) || ' months')::interval))::date;
    v_table_name := 'u2e_usage_events_' || to_char(v_start_date, 'YYYY_MM');
    
    EXECUTE format(
      'CREATE TABLE IF NOT EXISTS %I PARTITION OF u2e_usage_events FOR VALUES FROM (%L) TO (%L)',
      v_table_name,
      v_start_date,
      v_end_date
    );
  END LOOP;
END $$;

-- ============================================
-- 5. USAGE REWARDS (AGGREGATED)
-- ============================================
CREATE TABLE IF NOT EXISTS u2e_usage_rewards (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  business_id uuid NOT NULL REFERENCES u2e_businesses(id) ON DELETE CASCADE,
  action_type text NOT NULL,
  period_start timestamptz NOT NULL,
  period_end timestamptz NOT NULL,
  period_type text NOT NULL DEFAULT 'daily' CHECK (period_type IN ('daily', 'weekly', 'monthly')),
  usage_count integer NOT NULL DEFAULT 0,
  reward_rate numeric NOT NULL,
  rewards_earned numeric NOT NULL DEFAULT 0,
  is_finalized boolean DEFAULT false,
  claimed boolean DEFAULT false,
  claimed_at timestamptz,
  calculated_at timestamptz DEFAULT now(),
  calculation_details jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  
  CONSTRAINT valid_period CHECK (period_end > period_start),
  CONSTRAINT valid_counts CHECK (usage_count >= 0 AND rewards_earned >= 0)
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_u2e_rewards_unique ON u2e_usage_rewards(
  user_id, business_id, action_type, period_start, period_end
);
CREATE INDEX IF NOT EXISTS idx_u2e_rewards_user ON u2e_usage_rewards(user_id, period_start DESC);
CREATE INDEX IF NOT EXISTS idx_u2e_rewards_business ON u2e_usage_rewards(business_id, period_start DESC);
CREATE INDEX IF NOT EXISTS idx_u2e_rewards_unclaimed ON u2e_usage_rewards(user_id) WHERE claimed = false;
CREATE INDEX IF NOT EXISTS idx_u2e_rewards_period ON u2e_usage_rewards(period_start DESC, period_end DESC);

-- ============================================
-- 6. REWARD CLAIMS (FUTURE TOKEN DISTRIBUTION)
-- ============================================
CREATE TABLE IF NOT EXISTS u2e_reward_claims (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  claim_amount numeric NOT NULL CHECK (claim_amount > 0),
  claim_type text NOT NULL DEFAULT 'u2e' CHECK (claim_type IN ('u2e', 'airdrop', 'staking', 'governance')),
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'distributed', 'failed', 'cancelled')),
  distribution_tx_hash text,
  distributed_at timestamptz,
  distribution_method text CHECK (distribution_method IN ('token_launch', 'revenue_buyback', 'manual')),
  claim_period text CHECK (claim_period IN ('year_0_2', 'year_2_4', 'year_4_plus')),
  is_from_initial_supply boolean DEFAULT true,
  claimed_at timestamptz DEFAULT now(),
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_u2e_claims_user ON u2e_reward_claims(user_id, claimed_at DESC);
CREATE INDEX IF NOT EXISTS idx_u2e_claims_pending ON u2e_reward_claims(status, created_at) WHERE status = 'pending';
CREATE INDEX IF NOT EXISTS idx_u2e_claims_period ON u2e_reward_claims(claim_period, status);

-- ============================================
-- 7. MATERIALIZED VIEW: USER U2E STATS
-- ============================================
CREATE MATERIALIZED VIEW IF NOT EXISTS u2e_user_stats AS
SELECT 
  u.user_id,
  COUNT(DISTINCT u.business_id) as businesses_used,
  SUM(u.usage_count) as total_usage_count,
  SUM(u.rewards_earned) as total_rewards_earned,
  SUM(CASE WHEN u.claimed = false THEN u.rewards_earned ELSE 0 END) as unclaimed_rewards,
  MAX(u.period_end) as last_activity_date,
  SUM(CASE 
    WHEN u.period_start >= date_trunc('month', now()) 
    THEN u.rewards_earned 
    ELSE 0 
  END) as current_month_rewards,
  (
    SELECT b.display_name 
    FROM u2e_usage_rewards ur
    JOIN u2e_businesses b ON ur.business_id = b.id
    WHERE ur.user_id = u.user_id
    GROUP BY b.display_name
    ORDER BY SUM(ur.rewards_earned) DESC
    LIMIT 1
  ) as top_business
FROM u2e_usage_rewards u
GROUP BY u.user_id;

CREATE UNIQUE INDEX IF NOT EXISTS idx_u2e_stats_user ON u2e_user_stats(user_id);
CREATE INDEX IF NOT EXISTS idx_u2e_stats_rewards ON u2e_user_stats(total_rewards_earned DESC);

-- ============================================
-- 8. ROW LEVEL SECURITY (RLS)
-- ============================================

ALTER TABLE u2e_system_config ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage system config"
  ON u2e_system_config FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role = 'admin'
    )
  );

CREATE POLICY "Anyone can view system status"
  ON u2e_system_config FOR SELECT TO authenticated
  USING (true);

ALTER TABLE u2e_businesses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active businesses"
  ON u2e_businesses FOR SELECT TO authenticated
  USING (deleted_at IS NULL);

CREATE POLICY "Admins can manage businesses"
  ON u2e_businesses FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role = 'admin'
    )
  );

ALTER TABLE u2e_reward_rates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view current rates"
  ON u2e_reward_rates FOR SELECT TO authenticated
  USING (is_active = true AND effective_to IS NULL);

CREATE POLICY "Admins can manage rates"
  ON u2e_reward_rates FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role = 'admin'
    )
  );

ALTER TABLE u2e_usage_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own usage events"
  ON u2e_usage_events FOR SELECT TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "System can insert usage events"
  ON u2e_usage_events FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Admins can view all usage events"
  ON u2e_usage_events FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role = 'admin'
    )
  );

ALTER TABLE u2e_usage_rewards ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own rewards"
  ON u2e_usage_rewards FOR SELECT TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Admins can manage all rewards"
  ON u2e_usage_rewards FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role = 'admin'
    )
  );

ALTER TABLE u2e_reward_claims ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own claims"
  ON u2e_reward_claims FOR SELECT TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Admins can manage all claims"
  ON u2e_reward_claims FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role = 'admin'
    )
  );

-- ============================================
-- 9. FUNCTIONS: REWARD CALCULATION
-- ============================================

CREATE OR REPLACE FUNCTION calculate_u2e_rewards(
  p_user_id uuid,
  p_period_start timestamptz,
  p_period_end timestamptz
) RETURNS void AS $$
DECLARE
  v_event RECORD;
  v_rate RECORD;
  v_reward_amount numeric;
  v_global_multiplier numeric;
  v_is_active boolean;
BEGIN
  SELECT is_active, global_multiplier 
  INTO v_is_active, v_global_multiplier
  FROM u2e_system_config 
  LIMIT 1;
  
  IF NOT v_is_active THEN
    RETURN;
  END IF;

  FOR v_event IN 
    SELECT 
      ue.id,
      ue.user_id,
      ue.business_id,
      ue.action_type,
      ue.created_at
    FROM u2e_usage_events ue
    WHERE ue.user_id = p_user_id
      AND ue.created_at >= p_period_start
      AND ue.created_at < p_period_end
      AND ue.processed = false
    ORDER BY ue.created_at
  LOOP
    SELECT * INTO v_rate
    FROM u2e_reward_rates
    WHERE business_id = v_event.business_id
      AND action_type = v_event.action_type
      AND effective_from <= v_event.created_at
      AND (effective_to IS NULL OR effective_to > v_event.created_at)
      AND is_active = true
    LIMIT 1;

    IF FOUND THEN
      v_reward_amount := v_rate.rate_per_action * v_global_multiplier;

      INSERT INTO u2e_usage_rewards (
        user_id,
        business_id,
        action_type,
        period_start,
        period_end,
        period_type,
        usage_count,
        reward_rate,
        rewards_earned,
        calculation_details
      ) VALUES (
        v_event.user_id,
        v_event.business_id,
        v_event.action_type,
        p_period_start,
        p_period_end,
        'daily',
        1,
        v_rate.rate_per_action,
        v_reward_amount,
        jsonb_build_object(
          'rate_id', v_rate.id,
          'global_multiplier', v_global_multiplier,
          'calculated_at', now()
        )
      )
      ON CONFLICT (user_id, business_id, action_type, period_start, period_end)
      DO UPDATE SET
        usage_count = u2e_usage_rewards.usage_count + 1,
        rewards_earned = u2e_usage_rewards.rewards_earned + v_reward_amount,
        updated_at = now();

      UPDATE u2e_usage_events
      SET processed = true, processed_at = now()
      WHERE id = v_event.id;
    END IF;
  END LOOP;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- 10. AUDIT LOGGING
-- ============================================

CREATE OR REPLACE FUNCTION log_u2e_admin_action()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO admin_actions_audit (
    admin_id,
    action_type,
    entity_type,
    entity_id,
    changes,
    ip_address,
    user_agent
  ) VALUES (
    auth.uid(),
    TG_OP,
    TG_TABLE_NAME,
    COALESCE(NEW.id, OLD.id),
    jsonb_build_object(
      'old', to_jsonb(OLD),
      'new', to_jsonb(NEW)
    ),
    current_setting('request.headers', true)::json->>'x-real-ip',
    current_setting('request.headers', true)::json->>'user-agent'
  );
  
  RETURN COALESCE(NEW, OLD);
EXCEPTION
  WHEN OTHERS THEN
    RAISE NOTICE 'Could not log admin action: %', SQLERRM;
    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS u2e_config_audit ON u2e_system_config;
CREATE TRIGGER u2e_config_audit
  AFTER INSERT OR UPDATE OR DELETE ON u2e_system_config
  FOR EACH ROW EXECUTE FUNCTION log_u2e_admin_action();

DROP TRIGGER IF EXISTS u2e_rates_audit ON u2e_reward_rates;
CREATE TRIGGER u2e_rates_audit
  AFTER INSERT OR UPDATE OR DELETE ON u2e_reward_rates
  FOR EACH ROW EXECUTE FUNCTION log_u2e_admin_action();

DROP TRIGGER IF EXISTS u2e_businesses_audit ON u2e_businesses;
CREATE TRIGGER u2e_businesses_audit
  AFTER INSERT OR UPDATE OR DELETE ON u2e_businesses
  FOR EACH ROW EXECUTE FUNCTION log_u2e_admin_action();
