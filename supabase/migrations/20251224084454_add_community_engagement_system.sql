/*
  # Community Engagement & Growth Infrastructure

  1. New Tables
    - `news_articles`
      - `id` (uuid, primary key)
      - `slug` (text, unique) - URL-friendly identifier
      - `title` (text)
      - `content` (text) - Markdown or HTML content
      - `excerpt` (text) - Short description for listings
      - `category` (text) - Development Updates, Partnerships, Governance, Community, Press Releases
      - `author` (text) - AI agent name or Anonymous Team
      - `featured_image` (text) - URL to image
      - `published` (boolean) - Whether article is live
      - `featured` (boolean) - Show on homepage/featured section
      - `read_time` (integer) - Estimated minutes to read
      - `views` (integer) - View counter
      - `publish_date` (timestamptz)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

    - `newsletter_subscribers`
      - `id` (uuid, primary key)
      - `email` (text, unique)
      - `subscribed_at` (timestamptz)
      - `preferences` (jsonb) - Email preferences (frequency, topics, etc.)
      - `verified` (boolean) - Email verification status
      - `verification_token` (text) - Token for email verification
      - `unsubscribed_at` (timestamptz, optional)

    - `airdrop_leaderboard`
      - `id` (uuid, primary key)
      - `wallet_address` (text, unique)
      - `score` (integer) - Total points
      - `tier` (text) - Tier 1, Tier 2, Tier 3
      - `referral_count` (integer) - Number of successful referrals
      - `twitter_connected` (boolean)
      - `discord_connected` (boolean)
      - `telegram_connected` (boolean)
      - `github_connected` (boolean)
      - `completed_tasks` (jsonb) - Array of completed task IDs
      - `last_activity` (timestamptz)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Public can read published articles
    - Only admins can create/update articles
    - Public can subscribe to newsletter
    - Airdrop leaderboard public readable, user can update own entry

  3. Indexes
    - Index on slug for news articles
    - Index on category and publish_date for filtering
    - Index on email for newsletter lookups
    - Index on wallet_address for airdrop lookups
    - Index on score for leaderboard rankings
*/

-- News Articles Table
CREATE TABLE IF NOT EXISTS news_articles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  title text NOT NULL,
  content text NOT NULL,
  excerpt text NOT NULL,
  category text NOT NULL CHECK (category IN ('Development Updates', 'Partnerships', 'Governance', 'Community', 'Press Releases')),
  author text NOT NULL DEFAULT 'Anonymous Team',
  featured_image text,
  published boolean NOT NULL DEFAULT false,
  featured boolean NOT NULL DEFAULT false,
  read_time integer NOT NULL DEFAULT 5,
  views integer NOT NULL DEFAULT 0,
  publish_date timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Newsletter Subscribers Table
CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  subscribed_at timestamptz NOT NULL DEFAULT now(),
  preferences jsonb DEFAULT '{"frequency": "weekly", "topics": ["all"]}'::jsonb,
  verified boolean NOT NULL DEFAULT false,
  verification_token text,
  unsubscribed_at timestamptz
);

-- Airdrop Leaderboard Table
CREATE TABLE IF NOT EXISTS airdrop_leaderboard (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  wallet_address text UNIQUE NOT NULL,
  score integer NOT NULL DEFAULT 0,
  tier text CHECK (tier IN ('Tier 1', 'Tier 2', 'Tier 3')),
  referral_count integer NOT NULL DEFAULT 0,
  twitter_connected boolean NOT NULL DEFAULT false,
  discord_connected boolean NOT NULL DEFAULT false,
  telegram_connected boolean NOT NULL DEFAULT false,
  github_connected boolean NOT NULL DEFAULT false,
  completed_tasks jsonb DEFAULT '[]'::jsonb,
  last_activity timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE news_articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE airdrop_leaderboard ENABLE ROW LEVEL SECURITY;

-- Policies for news_articles

-- Public can view published articles
CREATE POLICY "Public can view published articles"
  ON news_articles
  FOR SELECT
  TO anon, authenticated
  USING (published = true);

-- Admins can view all articles
CREATE POLICY "Admins can view all articles"
  ON news_articles
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'admin'
    )
  );

-- Admins can insert articles
CREATE POLICY "Admins can insert articles"
  ON news_articles
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'admin'
    )
  );

-- Admins can update articles
CREATE POLICY "Admins can update articles"
  ON news_articles
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'admin'
    )
  );

-- Admins can delete articles
CREATE POLICY "Admins can delete articles"
  ON news_articles
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'admin'
    )
  );

-- Policies for newsletter_subscribers

-- Anyone can subscribe
CREATE POLICY "Anyone can subscribe to newsletter"
  ON newsletter_subscribers
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Users can update own subscription
CREATE POLICY "Users can update own subscription"
  ON newsletter_subscribers
  FOR UPDATE
  TO authenticated
  USING (email = (SELECT email FROM users WHERE users.id = auth.uid()))
  WITH CHECK (email = (SELECT email FROM users WHERE users.id = auth.uid()));

-- Admins can view all subscribers
CREATE POLICY "Admins can view all subscribers"
  ON newsletter_subscribers
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'admin'
    )
  );

-- Policies for airdrop_leaderboard

-- Public can view leaderboard (for transparency)
CREATE POLICY "Public can view airdrop leaderboard"
  ON airdrop_leaderboard
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- Anyone can insert their entry
CREATE POLICY "Anyone can insert airdrop entry"
  ON airdrop_leaderboard
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Users can update own entry
CREATE POLICY "Users can update own airdrop entry"
  ON airdrop_leaderboard
  FOR UPDATE
  TO authenticated
  USING (
    wallet_address = (SELECT wallet_address FROM users WHERE users.id = auth.uid())
  )
  WITH CHECK (
    wallet_address = (SELECT wallet_address FROM users WHERE users.id = auth.uid())
  );

-- Admins can update any entry
CREATE POLICY "Admins can update any airdrop entry"
  ON airdrop_leaderboard
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'admin'
    )
  );

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_news_articles_slug ON news_articles(slug);
CREATE INDEX IF NOT EXISTS idx_news_articles_category ON news_articles(category);
CREATE INDEX IF NOT EXISTS idx_news_articles_published ON news_articles(published) WHERE published = true;
CREATE INDEX IF NOT EXISTS idx_news_articles_publish_date ON news_articles(publish_date DESC) WHERE published = true;
CREATE INDEX IF NOT EXISTS idx_news_articles_featured ON news_articles(featured) WHERE featured = true AND published = true;

CREATE INDEX IF NOT EXISTS idx_newsletter_email ON newsletter_subscribers(email);
CREATE INDEX IF NOT EXISTS idx_newsletter_verified ON newsletter_subscribers(verified) WHERE verified = true;
CREATE INDEX IF NOT EXISTS idx_newsletter_active ON newsletter_subscribers(unsubscribed_at) WHERE unsubscribed_at IS NULL;

CREATE INDEX IF NOT EXISTS idx_airdrop_wallet ON airdrop_leaderboard(wallet_address);
CREATE INDEX IF NOT EXISTS idx_airdrop_score ON airdrop_leaderboard(score DESC);
CREATE INDEX IF NOT EXISTS idx_airdrop_tier ON airdrop_leaderboard(tier);

-- Trigger to update updated_at timestamp
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'update_news_articles_updated_at'
  ) THEN
    CREATE TRIGGER update_news_articles_updated_at
      BEFORE UPDATE ON news_articles
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column();
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'update_airdrop_leaderboard_updated_at'
  ) THEN
    CREATE TRIGGER update_airdrop_leaderboard_updated_at
      BEFORE UPDATE ON airdrop_leaderboard
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column();
  END IF;
END $$;

-- Function to increment article views
CREATE OR REPLACE FUNCTION increment_article_views(article_slug text)
RETURNS void AS $$
BEGIN
  UPDATE news_articles
  SET views = views + 1
  WHERE slug = article_slug AND published = true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to calculate airdrop tier based on score
CREATE OR REPLACE FUNCTION calculate_airdrop_tier(points integer)
RETURNS text AS $$
BEGIN
  IF points >= 1000 THEN
    RETURN 'Tier 1';
  ELSIF points >= 500 THEN
    RETURN 'Tier 2';
  ELSE
    RETURN 'Tier 3';
  END IF;
END;
$$ LANGUAGE plpgsql IMMUTABLE;
