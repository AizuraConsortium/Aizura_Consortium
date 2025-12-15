/*
  # Add Proposal Queue System

  ## Overview
  This migration adds a proposal queue system to handle incoming proposals when
  the consortium is already processing another proposal.

  ## New Tables

  ### 1. `proposal_queue`
  Queue for proposals waiting to be processed by the consortium.
  - `id` (uuid, primary key)
  - `proposal_id` (uuid) - Reference to proposals table
  - `priority` (int) - Queue priority (higher = process first)
  - `status` (text) - queued, processing, completed
  - `created_at` (timestamptz) - When added to queue
  - `started_at` (timestamptz) - When processing started
  - `completed_at` (timestamptz) - When processing completed

  ## Security
  - Enable RLS on proposal_queue table
  - Public can read queue status
  - Only service role can write to queue

  ## Functions
  - Helper function to clear agent votes for a topic (for vote retries)
*/

-- proposal_queue table
CREATE TABLE IF NOT EXISTS proposal_queue (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  proposal_id uuid UNIQUE REFERENCES proposals(id) ON DELETE CASCADE NOT NULL,
  priority int DEFAULT 0,
  status text CHECK (status IN ('queued', 'processing', 'completed')) DEFAULT 'queued',
  created_at timestamptz DEFAULT now(),
  started_at timestamptz,
  completed_at timestamptz
);

CREATE INDEX IF NOT EXISTS idx_proposal_queue_status ON proposal_queue(status, priority DESC, created_at);
CREATE INDEX IF NOT EXISTS idx_proposal_queue_proposal ON proposal_queue(proposal_id);

ALTER TABLE proposal_queue ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read proposal queue"
  ON proposal_queue FOR SELECT
  USING (true);

-- Function to clear agent votes (for vote retries)
CREATE OR REPLACE FUNCTION clear_agent_votes_for_topic(topic_id_param uuid)
RETURNS void AS $$
BEGIN
  DELETE FROM agent_votes WHERE topic_id = topic_id_param;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to automatically queue proposals when they reach vote threshold
CREATE OR REPLACE FUNCTION auto_queue_approved_proposals()
RETURNS TRIGGER AS $$
BEGIN
  -- If proposal just reached 10 votes and is still queued
  IF NEW.votes_for >= 10 AND NEW.status = 'queued' THEN
    -- Check if not already in queue
    IF NOT EXISTS (SELECT 1 FROM proposal_queue WHERE proposal_id = NEW.id) THEN
      INSERT INTO proposal_queue (proposal_id, priority)
      VALUES (NEW.id, NEW.votes_for);
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-queue proposals
DROP TRIGGER IF EXISTS trigger_auto_queue_proposals ON proposals;
CREATE TRIGGER trigger_auto_queue_proposals
  AFTER UPDATE ON proposals
  FOR EACH ROW
  WHEN (NEW.votes_for >= 10 AND NEW.status = 'queued')
  EXECUTE FUNCTION auto_queue_approved_proposals();
