/*
  # Security Incident Reporting System

  1. New Tables
    - `security_incidents`
      - `id` (uuid, primary key)
      - `category` (text) - Smart Contract Bug, Security Vulnerability, Suspicious Activity, Other
      - `severity` (text) - Critical, High, Medium, Low
      - `title` (text)
      - `description` (text)
      - `reporter_email` (text, optional for anonymous reports)
      - `reporter_name` (text, optional)
      - `contact_method` (text, optional)
      - `affected_systems` (text, optional)
      - `steps_to_reproduce` (text, optional)
      - `status` (text) - New, Under Review, In Progress, Resolved, Dismissed
      - `public` (boolean) - Whether incident can be shown in public log
      - `resolution_notes` (text, optional)
      - `resolved_at` (timestamptz, optional)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

    - `bug_bounty_submissions`
      - `id` (uuid, primary key)
      - `title` (text)
      - `description` (text)
      - `severity` (text) - Critical, High, Medium, Low
      - `category` (text) - Smart Contract, Frontend, Backend, Infrastructure, Other
      - `reporter_email` (text, optional for anonymous)
      - `reporter_name` (text, optional)
      - `wallet_address` (text, optional for rewards)
      - `proof_of_concept` (text, optional)
      - `status` (text) - Submitted, Under Review, Accepted, Rejected, Rewarded
      - `reward_amount` (numeric, optional)
      - `reward_currency` (text, optional) - USD or AAIC
      - `public` (boolean) - Show in hall of fame
      - `hall_of_fame_name` (text, optional)
      - `resolved_at` (timestamptz, optional)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on both tables
    - Public can insert (for anonymous reporting)
    - Only admins can read/update

  3. Indexes
    - Index on status for filtering
    - Index on severity for prioritization
    - Index on created_at for sorting
*/

-- Security Incidents Table
CREATE TABLE IF NOT EXISTS security_incidents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category text NOT NULL CHECK (category IN ('Smart Contract Bug', 'Security Vulnerability', 'Suspicious Activity', 'Other')),
  severity text NOT NULL CHECK (severity IN ('Critical', 'High', 'Medium', 'Low')),
  title text NOT NULL,
  description text NOT NULL,
  reporter_email text,
  reporter_name text,
  contact_method text,
  affected_systems text,
  steps_to_reproduce text,
  status text NOT NULL DEFAULT 'New' CHECK (status IN ('New', 'Under Review', 'In Progress', 'Resolved', 'Dismissed')),
  public boolean NOT NULL DEFAULT false,
  resolution_notes text,
  resolved_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Bug Bounty Submissions Table
CREATE TABLE IF NOT EXISTS bug_bounty_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  severity text NOT NULL CHECK (severity IN ('Critical', 'High', 'Medium', 'Low')),
  category text NOT NULL CHECK (category IN ('Smart Contract', 'Frontend', 'Backend', 'Infrastructure', 'Other')),
  reporter_email text,
  reporter_name text,
  wallet_address text,
  proof_of_concept text,
  status text NOT NULL DEFAULT 'Submitted' CHECK (status IN ('Submitted', 'Under Review', 'Accepted', 'Rejected', 'Rewarded')),
  reward_amount numeric,
  reward_currency text CHECK (reward_currency IN ('USD', 'AAIC')),
  public boolean NOT NULL DEFAULT false,
  hall_of_fame_name text,
  resolved_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE security_incidents ENABLE ROW LEVEL SECURITY;
ALTER TABLE bug_bounty_submissions ENABLE ROW LEVEL SECURITY;

-- Policies for security_incidents

-- Anyone can submit (anonymous reporting supported)
CREATE POLICY "Anyone can submit security incidents"
  ON security_incidents
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Only admins can view all incidents
CREATE POLICY "Admins can view all security incidents"
  ON security_incidents
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'admin'
    )
  );

-- Only admins can update incidents
CREATE POLICY "Admins can update security incidents"
  ON security_incidents
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

-- Public can view resolved public incidents (for transparency log)
CREATE POLICY "Public can view resolved public incidents"
  ON security_incidents
  FOR SELECT
  TO anon, authenticated
  USING (public = true AND status = 'Resolved');

-- Policies for bug_bounty_submissions

-- Anyone can submit (anonymous supported)
CREATE POLICY "Anyone can submit bug bounty reports"
  ON bug_bounty_submissions
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Only admins can view all submissions
CREATE POLICY "Admins can view all bug bounty submissions"
  ON bug_bounty_submissions
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'admin'
    )
  );

-- Only admins can update submissions
CREATE POLICY "Admins can update bug bounty submissions"
  ON bug_bounty_submissions
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

-- Public can view hall of fame entries
CREATE POLICY "Public can view hall of fame entries"
  ON bug_bounty_submissions
  FOR SELECT
  TO anon, authenticated
  USING (public = true AND status = 'Rewarded');

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_security_incidents_status ON security_incidents(status);
CREATE INDEX IF NOT EXISTS idx_security_incidents_severity ON security_incidents(severity);
CREATE INDEX IF NOT EXISTS idx_security_incidents_created_at ON security_incidents(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_security_incidents_public ON security_incidents(public) WHERE public = true;

CREATE INDEX IF NOT EXISTS idx_bug_bounty_status ON bug_bounty_submissions(status);
CREATE INDEX IF NOT EXISTS idx_bug_bounty_severity ON bug_bounty_submissions(severity);
CREATE INDEX IF NOT EXISTS idx_bug_bounty_created_at ON bug_bounty_submissions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_bug_bounty_hall_of_fame ON bug_bounty_submissions(public) WHERE public = true AND status = 'Rewarded';

-- Trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'update_security_incidents_updated_at'
  ) THEN
    CREATE TRIGGER update_security_incidents_updated_at
      BEFORE UPDATE ON security_incidents
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column();
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'update_bug_bounty_updated_at'
  ) THEN
    CREATE TRIGGER update_bug_bounty_updated_at
      BEFORE UPDATE ON bug_bounty_submissions
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column();
  END IF;
END $$;
