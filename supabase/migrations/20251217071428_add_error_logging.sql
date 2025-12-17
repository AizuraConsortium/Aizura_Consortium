/*
  # Add Error Logging System

  1. New Tables
    - `error_logs`
      - `id` (uuid, primary key)
      - `source` (text) - backend, frontend, agent
      - `severity` (text) - info, warning, error, critical
      - `agent_id` (text) - Which agent if applicable
      - `error_type` (text) - Type of error
      - `message` (text) - Error message
      - `details` (jsonb) - Additional context
      - `topic_id` (uuid) - Related topic if applicable
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on error_logs table
    - Public read access to error logs (for transparency)
    - Only service role can write
*/

CREATE TABLE IF NOT EXISTS error_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  source text CHECK (source IN ('backend', 'frontend', 'agent')) NOT NULL,
  severity text CHECK (severity IN ('info', 'warning', 'error', 'critical')) NOT NULL DEFAULT 'error',
  agent_id text CHECK (agent_id IN ('claude', 'chatgpt', 'grok', 'gemini', 'deepseek', 'qwen', NULL)),
  error_type text NOT NULL,
  message text NOT NULL,
  details jsonb DEFAULT '{}'::jsonb,
  topic_id uuid REFERENCES topics(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_error_logs_created ON error_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_error_logs_source ON error_logs(source);
CREATE INDEX IF NOT EXISTS idx_error_logs_severity ON error_logs(severity);
CREATE INDEX IF NOT EXISTS idx_error_logs_agent ON error_logs(agent_id);
CREATE INDEX IF NOT EXISTS idx_error_logs_topic ON error_logs(topic_id);

ALTER TABLE error_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read error logs"
  ON error_logs FOR SELECT
  USING (true);