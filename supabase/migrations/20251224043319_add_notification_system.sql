/*
  # Notification System

  1. New Tables
    - `notifications`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references users) - recipient
      - `type` (text) - notification category
      - `priority` (text) - critical, high, medium, low
      - `title` (text) - notification title
      - `message` (text) - notification content
      - `action_url` (text) - CTA link
      - `action_label` (text) - CTA text
      - `metadata` (jsonb) - additional data
      - `read_at` (timestamptz) - when marked as read
      - `archived_at` (timestamptz) - when archived
      - `delivered_channels` (text[]) - channels delivered to
      - `created_at` (timestamptz)
      
    - `notification_preferences`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references users)
      - `category` (text) - notification category
      - `in_app_enabled` (boolean)
      - `email_enabled` (boolean)
      - `push_enabled` (boolean) - future use
      - `updated_at` (timestamptz)
      
    - `notification_logs`
      - `id` (uuid, primary key)
      - `notification_id` (uuid, references notifications)
      - `user_id` (uuid, references users)
      - `action` (text) - created, read, archived, delivered
      - `channel` (text) - in_app, email, push
      - `metadata` (jsonb)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Users can only access their own notifications
    - Server role can create and manage all notifications
    - Notification logs are append-only
*/

-- Create notification type enum
CREATE TYPE notification_type AS ENUM (
  'governance_new_proposal',
  'governance_vote_started',
  'governance_vote_ending',
  'governance_vote_passed',
  'governance_vote_failed',
  'governance_executed',
  'launchpad_proposal_published',
  'launchpad_voting_started',
  'launchpad_voting_ending',
  'launchpad_approved',
  'launchpad_rejected',
  'launchpad_in_development',
  'launchpad_launched',
  'launchpad_profitable',
  'voting_confirmation',
  'voting_reminder',
  'voting_outcome',
  'rewards_distributed',
  'rewards_available',
  'rewards_vesting_milestone',
  'rewards_airdrop_eligible',
  'rewards_airdrop_available',
  'ecosystem_business_launched',
  'ecosystem_business_profitable',
  'ecosystem_milestone',
  'security_wallet_connected',
  'security_wallet_disconnected',
  'security_network_change',
  'security_suspicious_activity',
  'security_platform_update'
);

-- Create priority enum
CREATE TYPE notification_priority AS ENUM ('critical', 'high', 'medium', 'low');

-- Create notifications table
CREATE TABLE IF NOT EXISTS notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type notification_type NOT NULL,
  priority notification_priority NOT NULL DEFAULT 'medium',
  title text NOT NULL,
  message text NOT NULL,
  action_url text,
  action_label text,
  metadata jsonb DEFAULT '{}'::jsonb,
  read_at timestamptz,
  archived_at timestamptz,
  delivered_channels text[] DEFAULT ARRAY['in_app']::text[],
  created_at timestamptz DEFAULT now()
);

-- Create notification preferences table
CREATE TABLE IF NOT EXISTS notification_preferences (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  category text NOT NULL,
  in_app_enabled boolean DEFAULT true,
  email_enabled boolean DEFAULT true,
  push_enabled boolean DEFAULT false,
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, category)
);

-- Create notification logs table
CREATE TABLE IF NOT EXISTS notification_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  notification_id uuid NOT NULL REFERENCES notifications(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  action text NOT NULL,
  channel text,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON notifications(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_notifications_type ON notifications(type);
CREATE INDEX IF NOT EXISTS idx_notifications_read_at ON notifications(read_at) WHERE read_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_notification_preferences_user_id ON notification_preferences(user_id);
CREATE INDEX IF NOT EXISTS idx_notification_logs_notification_id ON notification_logs(notification_id);
CREATE INDEX IF NOT EXISTS idx_notification_logs_user_id ON notification_logs(user_id);

-- Enable RLS
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE notification_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE notification_logs ENABLE ROW LEVEL SECURITY;

-- Notifications policies
CREATE POLICY "Users can view own notifications"
  ON notifications FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own notifications"
  ON notifications FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Server can create notifications"
  ON notifications FOR INSERT
  TO authenticated
  WITH CHECK (
    (SELECT role FROM users WHERE id = auth.uid()) = 'server'
  );

CREATE POLICY "Server can view all notifications"
  ON notifications FOR SELECT
  TO authenticated
  USING (
    (SELECT role FROM users WHERE id = auth.uid()) = 'server'
  );

-- Notification preferences policies
CREATE POLICY "Users can view own preferences"
  ON notification_preferences FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own preferences"
  ON notification_preferences FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own preferences"
  ON notification_preferences FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Server can manage all preferences"
  ON notification_preferences FOR ALL
  TO authenticated
  USING (
    (SELECT role FROM users WHERE id = auth.uid()) = 'server'
  );

-- Notification logs policies (read-only for users)
CREATE POLICY "Users can view own logs"
  ON notification_logs FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Server can insert logs"
  ON notification_logs FOR INSERT
  TO authenticated
  WITH CHECK (
    (SELECT role FROM users WHERE id = auth.uid()) = 'server'
  );

CREATE POLICY "Server can view all logs"
  ON notification_logs FOR SELECT
  TO authenticated
  USING (
    (SELECT role FROM users WHERE id = auth.uid()) = 'server'
  );

-- Function to auto-create default preferences for new users
CREATE OR REPLACE FUNCTION create_default_notification_preferences()
RETURNS TRIGGER AS $$
BEGIN
  -- Create default preferences for all categories
  INSERT INTO notification_preferences (user_id, category, in_app_enabled, email_enabled, push_enabled)
  VALUES
    (NEW.id, 'governance', true, true, false),
    (NEW.id, 'launchpad', true, true, false),
    (NEW.id, 'voting', true, true, false),
    (NEW.id, 'rewards', true, true, false),
    (NEW.id, 'ecosystem', true, false, false),
    (NEW.id, 'security', true, true, false)
  ON CONFLICT (user_id, category) DO NOTHING;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create default preferences
CREATE TRIGGER create_notification_preferences_trigger
  AFTER INSERT ON users
  FOR EACH ROW
  EXECUTE FUNCTION create_default_notification_preferences();

-- Function to log notification actions
CREATE OR REPLACE FUNCTION log_notification_action()
RETURNS TRIGGER AS $$
BEGIN
  -- Log read action
  IF OLD.read_at IS NULL AND NEW.read_at IS NOT NULL THEN
    INSERT INTO notification_logs (notification_id, user_id, action, channel, metadata)
    VALUES (NEW.id, NEW.user_id, 'read', 'in_app', jsonb_build_object('read_at', NEW.read_at));
  END IF;
  
  -- Log archive action
  IF OLD.archived_at IS NULL AND NEW.archived_at IS NOT NULL THEN
    INSERT INTO notification_logs (notification_id, user_id, action, channel, metadata)
    VALUES (NEW.id, NEW.user_id, 'archived', 'in_app', jsonb_build_object('archived_at', NEW.archived_at));
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to log notification actions
CREATE TRIGGER log_notification_actions_trigger
  AFTER UPDATE ON notifications
  FOR EACH ROW
  EXECUTE FUNCTION log_notification_action();

-- Function to get unread notification count
CREATE OR REPLACE FUNCTION get_unread_notification_count(p_user_id uuid)
RETURNS integer AS $$
BEGIN
  RETURN (
    SELECT COUNT(*)::integer
    FROM notifications
    WHERE user_id = p_user_id
      AND read_at IS NULL
      AND archived_at IS NULL
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
