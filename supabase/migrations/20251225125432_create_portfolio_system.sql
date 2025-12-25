/*
  # Portfolio System - Real Data Connection

  Creates portfolio system infrastructure to track business performance,
  user exposure, and real-time metrics.
*/

-- 1. EXTEND U2E_BUSINESSES TABLE
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'u2e_businesses' AND column_name = 'slug') THEN ALTER TABLE u2e_businesses ADD COLUMN slug text; END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'u2e_businesses' AND column_name = 'category') THEN ALTER TABLE u2e_businesses ADD COLUMN category text CHECK (category IN ('Trading', 'SaaS', 'Infrastructure', 'Data', 'Content')); END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'u2e_businesses' AND column_name = 'status') THEN ALTER TABLE u2e_businesses ADD COLUMN status text DEFAULT 'planning' CHECK (status IN ('planning', 'development', 'live', 'paused')); END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'u2e_businesses' AND column_name = 'development_progress') THEN ALTER TABLE u2e_businesses ADD COLUMN development_progress integer DEFAULT 0 CHECK (development_progress >= 0 AND development_progress <= 100); END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'u2e_businesses' AND column_name = 'website_url') THEN ALTER TABLE u2e_businesses ADD COLUMN website_url text; END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'u2e_businesses' AND column_name = 'github_url') THEN ALTER TABLE u2e_businesses ADD COLUMN github_url text; END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'u2e_businesses' AND column_name = 'docs_url') THEN ALTER TABLE u2e_businesses ADD COLUMN docs_url text; END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'u2e_businesses' AND column_name = 'featured_image') THEN ALTER TABLE u2e_businesses ADD COLUMN featured_image text; END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'u2e_businesses' AND column_name = 'proposal_id') THEN ALTER TABLE u2e_businesses ADD COLUMN proposal_id uuid REFERENCES proposals(id); END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'u2e_businesses' AND column_name = 'plan_id') THEN ALTER TABLE u2e_businesses ADD COLUMN plan_id uuid REFERENCES plans(id); END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'u2e_businesses' AND column_name = 'launch_date') THEN ALTER TABLE u2e_businesses ADD COLUMN launch_date timestamptz; END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'u2e_businesses' AND column_name = 'is_foundation') THEN ALTER TABLE u2e_businesses ADD COLUMN is_foundation boolean DEFAULT false; END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_u2e_businesses_slug ON u2e_businesses(slug) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_u2e_businesses_status ON u2e_businesses(status) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_u2e_businesses_category ON u2e_businesses(category) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_u2e_businesses_proposal ON u2e_businesses(proposal_id) WHERE deleted_at IS NULL;

DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'u2e_businesses_slug_unique') THEN ALTER TABLE u2e_businesses ADD CONSTRAINT u2e_businesses_slug_unique UNIQUE (slug); END IF; END $$;

-- 2. BUSINESS METRICS HISTORY TABLE
CREATE TABLE IF NOT EXISTS business_metrics_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id uuid NOT NULL REFERENCES u2e_businesses(id) ON DELETE CASCADE,
  metric_type text NOT NULL CHECK (metric_type IN ('revenue', 'users', 'transactions', 'api_calls')),
  value numeric NOT NULL CHECK (value >= 0),
  period_start timestamptz NOT NULL,
  period_end timestamptz NOT NULL,
  metadata jsonb DEFAULT '{}',
  recorded_at timestamptz DEFAULT now(),
  CONSTRAINT valid_period CHECK (period_end >= period_start)
);

CREATE INDEX IF NOT EXISTS idx_metrics_business ON business_metrics_history(business_id);
CREATE INDEX IF NOT EXISTS idx_metrics_period ON business_metrics_history(period_start DESC, period_end DESC);
CREATE INDEX IF NOT EXISTS idx_metrics_type ON business_metrics_history(metric_type);
CREATE INDEX IF NOT EXISTS idx_metrics_composite ON business_metrics_history(business_id, metric_type, period_start DESC);

-- 3. MATERIALIZED VIEW: USER PORTFOLIO EXPOSURE
DROP MATERIALIZED VIEW IF EXISTS user_portfolio_exposure CASCADE;

CREATE MATERIALIZED VIEW user_portfolio_exposure AS
SELECT
  u.id as user_id, b.id as business_id, b.display_name as business_name, b.slug as business_slug,
  COUNT(DISTINCT pv.id) FILTER (WHERE pv.vote = 'for') as votes_for,
  COUNT(DISTINCT pv.id) FILTER (WHERE pv.vote = 'against') as votes_against,
  COUNT(DISTINCT p.id) FILTER (WHERE p.submitted_by = u.id) as proposals_submitted,
  COALESCE(SUM(ur.rewards_earned), 0) as total_rewards_earned,
  COALESCE(SUM(ur.usage_count), 0) as total_usage_count,
  MIN(LEAST(COALESCE(pv.created_at, 'infinity'::timestamptz), COALESCE(p.created_at, 'infinity'::timestamptz), COALESCE(ur.period_start, 'infinity'::timestamptz))) 
    FILTER (WHERE pv.created_at IS NOT NULL OR p.created_at IS NOT NULL OR ur.period_start IS NOT NULL) as first_interaction,
  LEAST(100, GREATEST(0, (COUNT(DISTINCT pv.id) FILTER (WHERE pv.vote = 'for')) * 10 + (COUNT(DISTINCT p.id) FILTER (WHERE p.submitted_by = u.id)) * 50 + LEAST(40, (COALESCE(SUM(ur.usage_count), 0) / 10)::integer))) as exposure_score
FROM users u
CROSS JOIN u2e_businesses b
LEFT JOIN proposals p ON p.id = b.proposal_id
LEFT JOIN proposal_votes pv ON pv.proposal_id = p.id AND pv.user_id = u.id
LEFT JOIN u2e_usage_rewards ur ON ur.user_id = u.id AND ur.business_id = b.id
WHERE b.deleted_at IS NULL AND b.is_active = true
GROUP BY u.id, b.id, b.display_name, b.slug;

CREATE UNIQUE INDEX IF NOT EXISTS idx_portfolio_exposure_user_business ON user_portfolio_exposure(user_id, business_id);
CREATE INDEX IF NOT EXISTS idx_portfolio_exposure_user ON user_portfolio_exposure(user_id);
CREATE INDEX IF NOT EXISTS idx_portfolio_exposure_business ON user_portfolio_exposure(business_id);
CREATE INDEX IF NOT EXISTS idx_portfolio_exposure_score ON user_portfolio_exposure(exposure_score DESC);

-- 4. MATERIALIZED VIEW: BUSINESS PERFORMANCE STATS
DROP MATERIALIZED VIEW IF EXISTS business_performance_stats CASCADE;

CREATE MATERIALIZED VIEW business_performance_stats AS
SELECT
  b.id as business_id, b.display_name as business_name, b.slug as business_slug, b.status, b.category, b.is_foundation, b.development_progress, b.launch_date,
  COALESCE(SUM(m.value) FILTER (WHERE m.metric_type = 'revenue' AND m.period_start >= date_trunc('month', now())), 0) as monthly_revenue,
  COALESCE(SUM(m.value) FILTER (WHERE m.metric_type = 'revenue'), 0) as total_revenue,
  COALESCE((SELECT value FROM business_metrics_history WHERE business_id = b.id AND metric_type = 'users' ORDER BY period_end DESC LIMIT 1), 0) as current_users,
  COALESCE(SUM(m.value) FILTER (WHERE m.metric_type = 'transactions'), 0) as total_transactions,
  COALESCE(SUM(m.value) FILTER (WHERE m.metric_type = 'api_calls'), 0) as total_api_calls,
  COUNT(DISTINCT ue.user_id) as active_u2e_users,
  COUNT(ue.id) as total_usage_events,
  COUNT(DISTINCT pv.user_id) as unique_voters,
  COUNT(DISTINCT pv.id) FILTER (WHERE pv.vote = 'for') as votes_for,
  COUNT(DISTINCT pv.id) FILTER (WHERE pv.vote = 'against') as votes_against,
  CASE WHEN COUNT(DISTINCT ue.user_id) > 100 THEN 'high' WHEN COUNT(DISTINCT ue.user_id) > 10 THEN 'medium' ELSE 'low' END as activity_level,
  GREATEST(COALESCE(MAX(m.recorded_at), b.updated_at), COALESCE(MAX(ue.created_at), b.updated_at), b.updated_at) as last_updated
FROM u2e_businesses b
LEFT JOIN business_metrics_history m ON m.business_id = b.id
LEFT JOIN u2e_usage_events ue ON ue.business_id = b.id
LEFT JOIN proposals p ON p.id = b.proposal_id
LEFT JOIN proposal_votes pv ON pv.proposal_id = p.id
WHERE b.deleted_at IS NULL
GROUP BY b.id, b.display_name, b.slug, b.status, b.category, b.is_foundation, b.development_progress, b.launch_date, b.updated_at;

CREATE UNIQUE INDEX IF NOT EXISTS idx_performance_stats_business ON business_performance_stats(business_id);
CREATE INDEX IF NOT EXISTS idx_performance_stats_status ON business_performance_stats(status);
CREATE INDEX IF NOT EXISTS idx_performance_stats_category ON business_performance_stats(category);
CREATE INDEX IF NOT EXISTS idx_performance_stats_revenue ON business_performance_stats(total_revenue DESC);
CREATE INDEX IF NOT EXISTS idx_performance_stats_activity ON business_performance_stats(activity_level);

-- 5. ROW LEVEL SECURITY POLICIES
ALTER TABLE business_metrics_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can read business metrics" ON business_metrics_history FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admins can insert business metrics" ON business_metrics_history FOR INSERT TO authenticated WITH CHECK (EXISTS (SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role = 'admin'));
CREATE POLICY "Admins can update business metrics" ON business_metrics_history FOR UPDATE TO authenticated USING (EXISTS (SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role = 'admin')) WITH CHECK (EXISTS (SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role = 'admin'));
CREATE POLICY "Admins can delete business metrics" ON business_metrics_history FOR DELETE TO authenticated USING (EXISTS (SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role = 'admin'));

-- 6. MATERIALIZED VIEW REFRESH FUNCTION
CREATE OR REPLACE FUNCTION refresh_portfolio_views() RETURNS void LANGUAGE plpgsql SECURITY DEFINER AS $$ BEGIN REFRESH MATERIALIZED VIEW CONCURRENTLY user_portfolio_exposure; REFRESH MATERIALIZED VIEW CONCURRENTLY business_performance_stats; RAISE NOTICE 'Portfolio views refreshed at %', now(); END; $$;

GRANT EXECUTE ON FUNCTION refresh_portfolio_views() TO authenticated;

-- 7. SEED FOUNDATION BUSINESSES
INSERT INTO u2e_businesses (business_name, display_name, description, slug, category, status, development_progress, is_foundation, is_active, integration_type, website_url, github_url, logo_url, launch_date) 
VALUES ('ai_traders', 'AI Traders', 'Autonomous AI agents executing cryptocurrency trading strategies.', 'ai-traders', 'Trading', 'live', 100, true, true, 'webhook', 'https://aitraders.aizura.io', 'https://github.com/aizura/ai-traders', '/logos/ai-traders.svg', '2024-10-15'::timestamptz) 
ON CONFLICT (business_name) DO UPDATE SET slug = EXCLUDED.slug, category = EXCLUDED.category, status = EXCLUDED.status, development_progress = EXCLUDED.development_progress, is_foundation = EXCLUDED.is_foundation, website_url = EXCLUDED.website_url, github_url = EXCLUDED.github_url, logo_url = EXCLUDED.logo_url, launch_date = EXCLUDED.launch_date, updated_at = now();

INSERT INTO u2e_businesses (business_name, display_name, description, slug, category, status, development_progress, is_foundation, is_active, integration_type, website_url, github_url, logo_url, launch_date) 
VALUES ('coinfusion', 'Coinfusion', 'Decentralized infrastructure for cross-chain bridges and liquidity.', 'coinfusion', 'Infrastructure', 'live', 100, true, true, 'webhook', 'https://coinfusion.aizura.io', 'https://github.com/aizura/coinfusion', '/logos/coinfusion.svg', '2024-09-20'::timestamptz) 
ON CONFLICT (business_name) DO UPDATE SET slug = EXCLUDED.slug, category = EXCLUDED.category, status = EXCLUDED.status, development_progress = EXCLUDED.development_progress, is_foundation = EXCLUDED.is_foundation, website_url = EXCLUDED.website_url, github_url = EXCLUDED.github_url, logo_url = EXCLUDED.logo_url, launch_date = EXCLUDED.launch_date, updated_at = now();

INSERT INTO u2e_businesses (business_name, display_name, description, slug, category, status, development_progress, is_foundation, is_active, integration_type, website_url, github_url, logo_url) 
VALUES ('ai_web_dev', 'AI Web Dev Platform', 'AI-powered web development platform.', 'ai-web-dev', 'SaaS', 'development', 65, true, false, 'webhook', 'https://webdev.aizura.io', 'https://github.com/aizura/ai-web-dev', '/logos/ai-web-dev.svg') 
ON CONFLICT (business_name) DO UPDATE SET slug = EXCLUDED.slug, category = EXCLUDED.category, status = EXCLUDED.status, development_progress = EXCLUDED.development_progress, is_foundation = EXCLUDED.is_foundation, website_url = EXCLUDED.website_url, github_url = EXCLUDED.github_url, logo_url = EXCLUDED.logo_url, updated_at = now();

INSERT INTO u2e_businesses (business_name, display_name, description, slug, category, status, development_progress, is_foundation, is_active, integration_type, website_url, github_url, logo_url) 
VALUES ('ai_business_factory', 'AI Business Factory', 'Automated business generation platform.', 'ai-business-factory', 'SaaS', 'development', 45, true, false, 'webhook', 'https://businessfactory.aizura.io', 'https://github.com/aizura/ai-business-factory', '/logos/ai-business-factory.svg') 
ON CONFLICT (business_name) DO UPDATE SET slug = EXCLUDED.slug, category = EXCLUDED.category, status = EXCLUDED.status, development_progress = EXCLUDED.development_progress, is_foundation = EXCLUDED.is_foundation, website_url = EXCLUDED.website_url, github_url = EXCLUDED.github_url, logo_url = EXCLUDED.logo_url, updated_at = now();

INSERT INTO u2e_businesses (business_name, display_name, description, slug, category, status, development_progress, is_foundation, is_active, integration_type, website_url, logo_url) 
VALUES ('content_gen', 'AI Content Generation', 'Multi-modal content generation platform.', 'content-generation', 'Content', 'planning', 15, true, false, 'manual', 'https://content.aizura.io', '/logos/content-gen.svg') 
ON CONFLICT (business_name) DO UPDATE SET slug = EXCLUDED.slug, category = EXCLUDED.category, status = EXCLUDED.status, development_progress = EXCLUDED.development_progress, is_foundation = EXCLUDED.is_foundation, website_url = EXCLUDED.website_url, logo_url = EXCLUDED.logo_url, updated_at = now();

-- 8. SEED SAMPLE METRICS
DO $$
DECLARE ai_traders_id uuid; coinfusion_id uuid;
BEGIN
  SELECT id INTO ai_traders_id FROM u2e_businesses WHERE business_name = 'ai_traders';
  SELECT id INTO coinfusion_id FROM u2e_businesses WHERE business_name = 'coinfusion';
  IF ai_traders_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM business_metrics_history WHERE business_id = ai_traders_id) THEN
    INSERT INTO business_metrics_history (business_id, metric_type, value, period_start, period_end) VALUES
      (ai_traders_id, 'revenue', 8500, '2024-07-01'::timestamptz, '2024-07-31'::timestamptz), (ai_traders_id, 'revenue', 9200, '2024-08-01'::timestamptz, '2024-08-31'::timestamptz), (ai_traders_id, 'revenue', 10100, '2024-09-01'::timestamptz, '2024-09-30'::timestamptz),
      (ai_traders_id, 'revenue', 11300, '2024-10-01'::timestamptz, '2024-10-31'::timestamptz), (ai_traders_id, 'revenue', 11800, '2024-11-01'::timestamptz, '2024-11-30'::timestamptz), (ai_traders_id, 'revenue', 12500, '2024-12-01'::timestamptz, '2024-12-31'::timestamptz),
      (ai_traders_id, 'users', 245, '2024-10-31 00:00:00'::timestamptz, '2024-10-31 23:59:59'::timestamptz), (ai_traders_id, 'users', 312, '2024-11-30 00:00:00'::timestamptz, '2024-11-30 23:59:59'::timestamptz), (ai_traders_id, 'users', 387, '2024-12-25 00:00:00'::timestamptz, '2024-12-25 23:59:59'::timestamptz),
      (ai_traders_id, 'transactions', 1543, '2024-11-01'::timestamptz, '2024-11-30'::timestamptz), (ai_traders_id, 'transactions', 1876, '2024-12-01'::timestamptz, '2024-12-25'::timestamptz);
  END IF;
  IF coinfusion_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM business_metrics_history WHERE business_id = coinfusion_id) THEN
    INSERT INTO business_metrics_history (business_id, metric_type, value, period_start, period_end) VALUES
      (coinfusion_id, 'revenue', 5200, '2024-07-01'::timestamptz, '2024-07-31'::timestamptz), (coinfusion_id, 'revenue', 6100, '2024-08-01'::timestamptz, '2024-08-31'::timestamptz), (coinfusion_id, 'revenue', 6800, '2024-09-01'::timestamptz, '2024-09-30'::timestamptz),
      (coinfusion_id, 'revenue', 7500, '2024-10-01'::timestamptz, '2024-10-31'::timestamptz), (coinfusion_id, 'revenue', 7900, '2024-11-01'::timestamptz, '2024-11-30'::timestamptz), (coinfusion_id, 'revenue', 8300, '2024-12-01'::timestamptz, '2024-12-31'::timestamptz),
      (coinfusion_id, 'users', 156, '2024-10-31 00:00:00'::timestamptz, '2024-10-31 23:59:59'::timestamptz), (coinfusion_id, 'users', 189, '2024-11-30 00:00:00'::timestamptz, '2024-11-30 23:59:59'::timestamptz), (coinfusion_id, 'users', 223, '2024-12-25 00:00:00'::timestamptz, '2024-12-25 23:59:59'::timestamptz),
      (coinfusion_id, 'api_calls', 45230, '2024-11-01'::timestamptz, '2024-11-30'::timestamptz), (coinfusion_id, 'api_calls', 52180, '2024-12-01'::timestamptz, '2024-12-25'::timestamptz);
  END IF;
END $$;

-- 9. INITIAL REFRESH
SELECT refresh_portfolio_views();

-- COMPLETE
DO $$
DECLARE business_count integer; metric_count integer;
BEGIN
  SELECT COUNT(*) INTO business_count FROM u2e_businesses WHERE is_foundation = true;
  SELECT COUNT(*) INTO metric_count FROM business_metrics_history;
  RAISE NOTICE 'Portfolio System Complete | Businesses: % | Metrics: %', business_count, metric_count;
END $$;
