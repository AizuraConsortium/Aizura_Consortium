/*
  # Extend Users Table for Enhanced Profile and Airdrop System

  ## Summary
  Adds profile fields and airdrop-related fields to the users table to support:
  - Enhanced user profiles (display name, bio, avatar)
  - Airdrop system integration (wallet, referral codes)
  - User engagement tracking (login streaks, activity)

  ## Changes

  1. New Profile Fields
    - `display_name` (text, optional) - User's display name
    - `bio` (text, optional) - User biography/description
    - `avatar_url` (text, optional) - URL to user's avatar image

  2. Airdrop Integration Fields
    - `wallet_address` (text, unique, optional) - Cryptocurrency wallet for airdrop
    - `referral_code` (text, unique, optional) - Unique referral code for this user
    - `referred_by` (text, optional) - Referral code of user who referred them

  3. Engagement Tracking Fields
    - `login_streak` (integer) - Current consecutive login streak in days
    - `total_logins` (integer) - Total number of logins
    - `last_login_date` (timestamptz) - Last login timestamp

  4. Security
    - RLS remains enabled with server-side RBAC
    - Service role key bypasses RLS for all operations
    - Backend middleware controls all access

  5. Indexes
    - Index on wallet_address for airdrop lookups
    - Index on referral_code for referral system
    - Index on referred_by for referral tree queries

  ## Notes
  - All new fields are optional (nullable) to maintain backward compatibility
  - Profile fields support user customization
  - Airdrop fields enable points and referral system
  - Engagement fields track user activity and streaks
*/

-- ============================================================================
-- STEP 1: Add profile fields
-- ============================================================================

DO $$
BEGIN
  -- Display name
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'users' AND column_name = 'display_name'
  ) THEN
    ALTER TABLE users ADD COLUMN display_name text;
  END IF;

  -- Bio
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'users' AND column_name = 'bio'
  ) THEN
    ALTER TABLE users ADD COLUMN bio text;
  END IF;

  -- Avatar URL
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'users' AND column_name = 'avatar_url'
  ) THEN
    ALTER TABLE users ADD COLUMN avatar_url text;
  END IF;
END $$;

-- ============================================================================
-- STEP 2: Add airdrop integration fields
-- ============================================================================

DO $$
BEGIN
  -- Wallet address
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'users' AND column_name = 'wallet_address'
  ) THEN
    ALTER TABLE users ADD COLUMN wallet_address text UNIQUE;
    CREATE INDEX IF NOT EXISTS idx_users_wallet_address ON users(wallet_address) WHERE wallet_address IS NOT NULL;
  END IF;

  -- Referral code
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'users' AND column_name = 'referral_code'
  ) THEN
    ALTER TABLE users ADD COLUMN referral_code text UNIQUE;
    CREATE INDEX IF NOT EXISTS idx_users_referral_code ON users(referral_code) WHERE referral_code IS NOT NULL;
  END IF;

  -- Referred by
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'users' AND column_name = 'referred_by'
  ) THEN
    ALTER TABLE users ADD COLUMN referred_by text;
    CREATE INDEX IF NOT EXISTS idx_users_referred_by ON users(referred_by) WHERE referred_by IS NOT NULL;
  END IF;
END $$;

-- ============================================================================
-- STEP 3: Add engagement tracking fields
-- ============================================================================

DO $$
BEGIN
  -- Login streak
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'users' AND column_name = 'login_streak'
  ) THEN
    ALTER TABLE users ADD COLUMN login_streak integer DEFAULT 0;
  END IF;

  -- Total logins
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'users' AND column_name = 'total_logins'
  ) THEN
    ALTER TABLE users ADD COLUMN total_logins integer DEFAULT 0;
  END IF;

  -- Last login date
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'users' AND column_name = 'last_login_date'
  ) THEN
    ALTER TABLE users ADD COLUMN last_login_date timestamptz;
  END IF;
END $$;

-- ============================================================================
-- STEP 4: Add helper function to generate display name from email
-- ============================================================================

CREATE OR REPLACE FUNCTION get_display_name_fallback(p_user_id uuid)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_display_name text;
  v_email text;
BEGIN
  -- Try to get display_name, fallback to email username
  SELECT display_name, email INTO v_display_name, v_email
  FROM users
  WHERE id = p_user_id;

  -- If display_name exists, return it
  IF v_display_name IS NOT NULL AND v_display_name != '' THEN
    RETURN v_display_name;
  END IF;

  -- Otherwise, return email username (part before @)
  IF v_email IS NOT NULL THEN
    RETURN split_part(v_email, '@', 1);
  END IF;

  -- Last resort, return 'User'
  RETURN 'User';
END;
$$;

-- ============================================================================
-- STEP 5: Add comment explaining the table structure
-- ============================================================================

COMMENT ON COLUMN users.display_name IS 'User customizable display name. Falls back to email username if not set.';
COMMENT ON COLUMN users.bio IS 'User biography or description for their profile.';
COMMENT ON COLUMN users.avatar_url IS 'URL to user avatar image. Can be uploaded or linked externally.';
COMMENT ON COLUMN users.wallet_address IS 'Cryptocurrency wallet address for airdrop rewards. Must be unique.';
COMMENT ON COLUMN users.referral_code IS 'Unique referral code generated for this user to share with others.';
COMMENT ON COLUMN users.referred_by IS 'Referral code of the user who referred this user.';
COMMENT ON COLUMN users.login_streak IS 'Current consecutive login streak in days.';
COMMENT ON COLUMN users.total_logins IS 'Total number of times user has logged in.';
COMMENT ON COLUMN users.last_login_date IS 'Timestamp of the last login.';
