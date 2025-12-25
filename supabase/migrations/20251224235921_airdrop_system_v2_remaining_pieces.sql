/*
  # Airdrop System V2 - Add Remaining Components

  This migration adds the missing pieces for the airdrop system:
  - Missing OAuth columns (GitHub, token storage)
  - Helper functions for point management
  - Referral milestone checking
  - Public leaderboard view
  - Drop old tier function
*/

-- ============================================================================
-- STEP 1: Add missing OAuth columns to airdrop_leaderboard
-- ============================================================================

DO $$
BEGIN
  -- GitHub OAuth token column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'airdrop_leaderboard' AND column_name = 'github_oauth_token'
  ) THEN
    ALTER TABLE airdrop_leaderboard ADD COLUMN github_oauth_token text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'airdrop_leaderboard' AND column_name = 'github_user_id'
  ) THEN
    ALTER TABLE airdrop_leaderboard ADD COLUMN github_user_id text;
    CREATE INDEX idx_airdrop_github_id ON airdrop_leaderboard(github_user_id) WHERE github_user_id IS NOT NULL;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'airdrop_leaderboard' AND column_name = 'github_username'
  ) THEN
    ALTER TABLE airdrop_leaderboard ADD COLUMN github_username text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'airdrop_leaderboard' AND column_name = 'github_verified_at'
  ) THEN
    ALTER TABLE airdrop_leaderboard ADD COLUMN github_verified_at timestamptz;
  END IF;

  -- Twitter OAuth token
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'airdrop_leaderboard' AND column_name = 'twitter_oauth_token'
  ) THEN
    ALTER TABLE airdrop_leaderboard ADD COLUMN twitter_oauth_token text;
  END IF;

  -- Discord OAuth token
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'airdrop_leaderboard' AND column_name = 'discord_oauth_token'
  ) THEN
    ALTER TABLE airdrop_leaderboard ADD COLUMN discord_oauth_token text;
  END IF;
END $$;

-- ============================================================================
-- STEP 2: Add metadata column to point_transactions
-- ============================================================================

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'point_transactions' AND column_name = 'metadata'
  ) THEN
    ALTER TABLE point_transactions ADD COLUMN metadata jsonb DEFAULT '{}'::jsonb;
  END IF;
END $$;

-- ============================================================================
-- STEP 3: Update point_transactions reference_type check constraint
-- ============================================================================

DO $$
BEGIN
  -- Drop old constraint if exists
  IF EXISTS (
    SELECT 1 FROM information_schema.constraint_column_usage 
    WHERE table_name = 'point_transactions' 
    AND constraint_name = 'point_transactions_reference_type_check'
  ) THEN
    ALTER TABLE point_transactions DROP CONSTRAINT point_transactions_reference_type_check;
  END IF;

  -- Add new constraint with all types
  ALTER TABLE point_transactions ADD CONSTRAINT point_transactions_reference_type_check
    CHECK (reference_type IN (
      'social_connection',
      'social_follow',
      'content_submission',
      'referral',
      'daily_activity',
      'login_streak',
      'governance',
      'manual_adjustment',
      'penalty',
      'onchain_activity',
      'oauth_connection',
      'streak_bonus',
      'governance_vote',
      'governance_comment'
    ));
END $$;

-- ============================================================================
-- STEP 4: Helper Functions
-- ============================================================================

-- Function to award points and log transaction
CREATE OR REPLACE FUNCTION award_points(
  p_user_id uuid,
  p_amount integer,
  p_reason text,
  p_reference_id uuid DEFAULT NULL,
  p_reference_type text DEFAULT NULL,
  p_created_by uuid DEFAULT NULL,
  p_metadata jsonb DEFAULT '{}'::jsonb
)
RETURNS void AS $$
BEGIN
  -- Insert into point_transactions
  INSERT INTO point_transactions (
    user_id,
    amount,
    reason,
    reference_id,
    reference_type,
    created_by,
    metadata
  ) VALUES (
    p_user_id,
    p_amount,
    p_reason,
    p_reference_id,
    p_reference_type,
    p_created_by,
    p_metadata
  );

  -- Update airdrop_leaderboard score
  UPDATE airdrop_leaderboard
  SET
    score = score + p_amount,
    last_activity = now(),
    updated_at = now()
  WHERE user_id = p_user_id;

  -- If no airdrop_leaderboard entry exists, create one
  IF NOT FOUND THEN
    INSERT INTO airdrop_leaderboard (user_id, wallet_address, score)
    SELECT p_user_id, wallet_address, p_amount
    FROM users
    WHERE id = p_user_id;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to generate unique referral code
CREATE OR REPLACE FUNCTION generate_referral_code()
RETURNS text AS $$
DECLARE
  v_code text;
  v_exists boolean;
BEGIN
  LOOP
    -- Generate code: AIZURA-XXXXXX (6 random alphanumeric chars)
    v_code := 'AIZURA-' || upper(substring(md5(random()::text || clock_timestamp()::text) from 1 for 6));

    -- Check if code already exists
    SELECT EXISTS(SELECT 1 FROM users WHERE referral_code = v_code) INTO v_exists;

    -- If unique, return it
    IF NOT v_exists THEN
      RETURN v_code;
    END IF;
  END LOOP;
END;
$$ LANGUAGE plpgsql VOLATILE;

-- Function to calculate login streak bonus (adjusted for 60-day max)
CREATE OR REPLACE FUNCTION calculate_streak_bonus(p_streak integer)
RETURNS integer AS $$
BEGIN
  CASE
    WHEN p_streak = 7 THEN RETURN 50;
    WHEN p_streak = 14 THEN RETURN 150;
    WHEN p_streak = 30 THEN RETURN 300;
    WHEN p_streak = 60 THEN RETURN 1000;
    ELSE RETURN 0;
  END CASE;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Function to check referral milestones and award points
CREATE OR REPLACE FUNCTION check_referral_milestones(p_referee_id uuid)
RETURNS void AS $$
DECLARE
  v_referrer_id uuid;
  v_referee_points integer;
  v_connected_socials integer;
  v_was_inserted boolean;
BEGIN
  -- Get referrer ID
  SELECT u_ref.id INTO v_referrer_id
  FROM users u_self
  JOIN users u_ref ON u_self.referred_by = u_ref.referral_code
  WHERE u_self.id = p_referee_id;

  -- If no referrer, exit
  IF v_referrer_id IS NULL THEN
    RETURN;
  END IF;

  -- Get referee's current points and connected socials
  SELECT
    COALESCE(al.score, 0),
    (CASE WHEN al.twitter_connected THEN 1 ELSE 0 END +
     CASE WHEN al.discord_connected THEN 1 ELSE 0 END +
     CASE WHEN al.telegram_connected THEN 1 ELSE 0 END +
     CASE WHEN al.github_connected THEN 1 ELSE 0 END)
  INTO v_referee_points, v_connected_socials
  FROM airdrop_leaderboard al
  WHERE al.user_id = p_referee_id;

  -- Default to 0 if no leaderboard entry
  v_referee_points := COALESCE(v_referee_points, 0);
  v_connected_socials := COALESCE(v_connected_socials, 0);

  -- Milestone 1: 2+ socials connected (100 points)
  IF v_connected_socials >= 2 THEN
    INSERT INTO referral_rewards (referrer_id, referee_id, milestone, points_awarded)
    VALUES (v_referrer_id, p_referee_id, '2_socials', 100)
    ON CONFLICT (referrer_id, referee_id, milestone) DO NOTHING
    RETURNING true INTO v_was_inserted;

    -- Award points if this is first time
    IF v_was_inserted THEN
      PERFORM award_points(
        v_referrer_id,
        100,
        'Referral milestone: User connected 2+ social accounts',
        p_referee_id,
        'referral'
      );
    END IF;
  END IF;

  -- Milestone 2: 500 points (200 points)
  IF v_referee_points >= 500 THEN
    INSERT INTO referral_rewards (referrer_id, referee_id, milestone, points_awarded)
    VALUES (v_referrer_id, p_referee_id, '500_points', 200)
    ON CONFLICT (referrer_id, referee_id, milestone) DO NOTHING
    RETURNING true INTO v_was_inserted;

    IF v_was_inserted THEN
      PERFORM award_points(
        v_referrer_id,
        200,
        'Referral milestone: User reached 500 points',
        p_referee_id,
        'referral'
      );
    END IF;
  END IF;

  -- Milestone 3: 2000 points (300 points)
  IF v_referee_points >= 2000 THEN
    INSERT INTO referral_rewards (referrer_id, referee_id, milestone, points_awarded)
    VALUES (v_referrer_id, p_referee_id, '2000_points', 300)
    ON CONFLICT (referrer_id, referee_id, milestone) DO NOTHING
    RETURNING true INTO v_was_inserted;

    IF v_was_inserted THEN
      PERFORM award_points(
        v_referrer_id,
        300,
        'Referral milestone: User reached 2000 points',
        p_referee_id,
        'referral'
      );
    END IF;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to recalculate user's total points from transaction log
CREATE OR REPLACE FUNCTION recalculate_user_points(p_user_id uuid)
RETURNS integer AS $$
DECLARE
  v_total integer;
BEGIN
  -- Sum all point transactions
  SELECT COALESCE(SUM(amount), 0) INTO v_total
  FROM point_transactions
  WHERE user_id = p_user_id;

  -- Update airdrop_leaderboard
  UPDATE airdrop_leaderboard
  SET score = v_total, updated_at = now()
  WHERE user_id = p_user_id;

  RETURN v_total;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- STEP 5: Drop old tier calculation function (no longer needed)
-- ============================================================================

DROP FUNCTION IF EXISTS calculate_airdrop_tier(integer);

-- ============================================================================
-- STEP 6: Create view for public leaderboard
-- ============================================================================

CREATE OR REPLACE VIEW airdrop_leaderboard_public AS
SELECT
  ROW_NUMBER() OVER (ORDER BY al.score DESC) as rank,
  al.id,
  al.wallet_address,
  al.score,
  al.referral_count,
  al.twitter_connected,
  al.discord_connected,
  al.telegram_connected,
  al.github_connected,
  al.total_content_approved,
  al.last_activity,
  al.created_at
FROM airdrop_leaderboard al
WHERE al.banned = false
ORDER BY al.score DESC;

-- Grant access to view
GRANT SELECT ON airdrop_leaderboard_public TO anon, authenticated;