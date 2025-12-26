/*
  # Add Referral Leaderboard Function

  1. New Functions
    - `get_referral_leaderboard` - Returns top referrers with stats
      - Parameters: limit_count (default 100)
      - Returns: rank, user_id, wallet_address, referral_count, qualified_count, total_points_earned
      - Anonymizes wallet addresses (first 6 + last 4 chars)
      - Orders by points earned and qualified referrals

  2. Changes
    - Creates a ranked leaderboard of top referrers
    - Includes only users with at least 1 referral
    - Qualified referrals are those with >= 1000 points

  3. Security
    - Function uses SECURITY DEFINER for controlled access
    - Wallet addresses are anonymized for privacy
*/

CREATE OR REPLACE FUNCTION get_referral_leaderboard(limit_count integer DEFAULT 100)
RETURNS TABLE (
  rank bigint,
  user_id uuid,
  wallet_address text,
  referral_count bigint,
  qualified_count bigint,
  total_points_earned numeric
) AS $$
BEGIN
  RETURN QUERY
  WITH referrer_stats AS (
    SELECT
      u.id,
      u.wallet_address as full_wallet,
      u.referral_code,
      COUNT(DISTINCT ref_users.id) as total_referrals,
      COUNT(DISTINCT CASE WHEN ref_users.id IN (
        SELECT user_id FROM airdrop_leaderboard WHERE score >= 1000
      ) THEN ref_users.id END) as qualified_referrals,
      COALESCE(SUM(rr.points_awarded), 0) as points_earned
    FROM users u
    LEFT JOIN users ref_users ON ref_users.referred_by = u.referral_code
    LEFT JOIN referral_rewards rr ON rr.referrer_id = u.id
    WHERE u.referral_code IS NOT NULL
    GROUP BY u.id, u.wallet_address, u.referral_code
    HAVING COUNT(DISTINCT ref_users.id) > 0
  )
  SELECT
    ROW_NUMBER() OVER (ORDER BY points_earned DESC, qualified_referrals DESC) as rank,
    id as user_id,
    CONCAT(SUBSTRING(full_wallet, 1, 6), '...', SUBSTRING(full_wallet, LENGTH(full_wallet)-3)) as wallet_address,
    total_referrals as referral_count,
    qualified_referrals as qualified_count,
    points_earned as total_points_earned
  FROM referrer_stats
  ORDER BY points_earned DESC, qualified_referrals DESC
  LIMIT limit_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
