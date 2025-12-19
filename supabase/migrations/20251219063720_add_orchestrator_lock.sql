/*
  # Add Orchestrator Leader Election System

  ## Overview
  This migration implements database-based leader election for the Orchestrator
  to enable horizontal scaling of backend instances. Only one backend instance
  will run the orchestrator at any time, with automatic failover if the leader dies.

  ## New Tables

  ### 1. `orchestrator_locks`
  Singleton table for orchestrator leadership coordination.
  - `lock_id` (text, primary key) - Always 'global' (singleton)
  - `instance_id` (text) - Unique identifier of the backend instance holding the lock
  - `acquired_at` (timestamptz) - When the lock was first acquired
  - `last_heartbeat` (timestamptz) - Last time the leader sent a heartbeat
  - `expires_at` (timestamptz) - When the lock expires if no heartbeat

  ## Functions

  ### 1. `try_acquire_orchestrator_lock`
  Attempts to acquire or refresh the orchestrator lock for a specific instance.
  Returns true if successful, false if another instance holds the lock.

  ### 2. `refresh_orchestrator_lock`
  Updates the heartbeat timestamp and extends lock expiration.
  Called every 30 seconds by the leader to maintain lock ownership.

  ### 3. `release_orchestrator_lock`
  Explicitly releases the lock when the orchestrator shuts down gracefully.

  ## Security
  - No RLS needed - this is backend-only infrastructure
  - Service role access only (already enforced by backend)

  ## Lock Behavior
  - TTL: 120 seconds (2 minutes)
  - Heartbeat interval: 30 seconds
  - If leader crashes, lock expires after 2 minutes and another instance takes over
  - Prevents split-brain scenarios through atomic database operations
*/

-- Create orchestrator locks table (singleton)
CREATE TABLE IF NOT EXISTS orchestrator_locks (
  lock_id text PRIMARY KEY CHECK (lock_id = 'global'),
  instance_id text NOT NULL,
  acquired_at timestamptz NOT NULL DEFAULT now(),
  last_heartbeat timestamptz NOT NULL DEFAULT now(),
  expires_at timestamptz NOT NULL
);

-- Ensure only one lock can exist at a time
CREATE UNIQUE INDEX IF NOT EXISTS idx_orchestrator_lock_singleton
  ON orchestrator_locks(lock_id);

-- Index for checking expired locks
CREATE INDEX IF NOT EXISTS idx_orchestrator_lock_expires
  ON orchestrator_locks(expires_at);

-- Function to acquire orchestrator lock
CREATE OR REPLACE FUNCTION try_acquire_orchestrator_lock(
  p_instance_id text,
  p_ttl_seconds int DEFAULT 120
) RETURNS boolean AS $$
DECLARE
  v_acquired boolean;
BEGIN
  -- Try to acquire or refresh lock
  INSERT INTO orchestrator_locks (
    lock_id,
    instance_id,
    acquired_at,
    last_heartbeat,
    expires_at
  ) VALUES (
    'global',
    p_instance_id,
    now(),
    now(),
    now() + (p_ttl_seconds || ' seconds')::interval
  )
  ON CONFLICT (lock_id) DO UPDATE SET
    instance_id = EXCLUDED.instance_id,
    acquired_at = EXCLUDED.acquired_at,
    last_heartbeat = EXCLUDED.last_heartbeat,
    expires_at = EXCLUDED.expires_at
  WHERE
    orchestrator_locks.instance_id = p_instance_id
    OR orchestrator_locks.expires_at < now();

  -- Check if we successfully acquired the lock
  SELECT EXISTS (
    SELECT 1 FROM orchestrator_locks
    WHERE lock_id = 'global'
      AND instance_id = p_instance_id
      AND expires_at > now()
  ) INTO v_acquired;

  RETURN v_acquired;
END;
$$ LANGUAGE plpgsql;

-- Function to refresh heartbeat
CREATE OR REPLACE FUNCTION refresh_orchestrator_lock(
  p_instance_id text,
  p_ttl_seconds int DEFAULT 120
) RETURNS boolean AS $$
DECLARE
  v_refreshed boolean;
BEGIN
  UPDATE orchestrator_locks
  SET
    last_heartbeat = now(),
    expires_at = now() + (p_ttl_seconds || ' seconds')::interval
  WHERE lock_id = 'global'
    AND instance_id = p_instance_id;

  v_refreshed := FOUND;
  RETURN v_refreshed;
END;
$$ LANGUAGE plpgsql;

-- Function to release lock
CREATE OR REPLACE FUNCTION release_orchestrator_lock(
  p_instance_id text
) RETURNS boolean AS $$
DECLARE
  v_released boolean;
BEGIN
  DELETE FROM orchestrator_locks
  WHERE lock_id = 'global'
    AND instance_id = p_instance_id;

  v_released := FOUND;
  RETURN v_released;
END;
$$ LANGUAGE plpgsql;

-- Function to get current lock holder
CREATE OR REPLACE FUNCTION get_orchestrator_lock_status()
RETURNS jsonb AS $$
DECLARE
  v_lock_info jsonb;
BEGIN
  SELECT jsonb_build_object(
    'is_locked', EXISTS(SELECT 1 FROM orchestrator_locks WHERE expires_at > now()),
    'instance_id', instance_id,
    'acquired_at', acquired_at,
    'last_heartbeat', last_heartbeat,
    'expires_at', expires_at,
    'age_seconds', EXTRACT(EPOCH FROM (now() - acquired_at)),
    'heartbeat_age_seconds', EXTRACT(EPOCH FROM (now() - last_heartbeat)),
    'expires_in_seconds', EXTRACT(EPOCH FROM (expires_at - now()))
  ) INTO v_lock_info
  FROM orchestrator_locks
  WHERE lock_id = 'global';

  IF v_lock_info IS NULL THEN
    v_lock_info := jsonb_build_object(
      'is_locked', false,
      'instance_id', null
    );
  END IF;

  RETURN v_lock_info;
END;
$$ LANGUAGE plpgsql;

-- Function to get and lock next queued proposal
CREATE OR REPLACE FUNCTION get_and_lock_next_proposal()
RETURNS proposal_queue AS $$
DECLARE
  v_proposal proposal_queue;
BEGIN
  SELECT * INTO v_proposal
  FROM proposal_queue
  WHERE status = 'queued'
  ORDER BY priority DESC, created_at ASC
  LIMIT 1
  FOR UPDATE SKIP LOCKED;

  IF FOUND THEN
    UPDATE proposal_queue
    SET
      status = 'processing',
      started_at = now()
    WHERE id = v_proposal.id;

    SELECT * INTO v_proposal
    FROM proposal_queue
    WHERE id = v_proposal.id;
  END IF;

  RETURN v_proposal;
END;
$$ LANGUAGE plpgsql;
