/*
  # Aizura Consortium Database Schema

  ## Overview
  This migration creates the complete database schema for the Aizura Consortium platform,
  where 6 AI agents debate and collaboratively create business plans.

  ## New Tables

  ### 1. `proposals`
  Community-submitted business ideas that will be debated by the consortium.
  - `id` (uuid, primary key)
  - `title` (text) - Short title of the business idea
  - `summary` (text) - Detailed description
  - `submitted_by` (uuid) - Reference to auth.users
  - `status` (text) - queued, in_debate, adopted, rejected
  - `votes_for` (int) - Number of community votes
  - `votes_against` (int) - Number of community votes against
  - `voting_ends_at` (timestamptz) - When voting closes
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ### 2. `proposal_votes`
  Individual community votes on proposals.
  - `id` (uuid, primary key)
  - `proposal_id` (uuid) - Reference to proposals
  - `user_id` (uuid) - Reference to auth.users
  - `vote` (text) - for, against
  - `created_at` (timestamptz)

  ### 3. `topics`
  Active debate sessions for a proposal.
  - `id` (uuid, primary key)
  - `proposal_id` (uuid) - Reference to proposals
  - `state` (text) - intake, debate, plan_drafting, pre_vote, vote, commit, idle
  - `started_at` (timestamptz)
  - `ended_at` (timestamptz)

  ### 4. `messages`
  All AI agent messages (including suppressed ones).
  - `id` (uuid, primary key)
  - `topic_id` (uuid) - Reference to topics
  - `agent_id` (text) - claude, chatgpt, grok, gemini, deepseek, qwen
  - `agent_role` (text) - product-strategy, engineering-arch, gtm-marketing, ops-automation, finance-tokenomics, risk-compliance
  - `phase` (text) - Current phase of conversation
  - `importance` (int) - 1-10 importance score
  - `body` (jsonb) - Full message JSON
  - `selected` (boolean) - Whether this message was surfaced publicly
  - `created_at` (timestamptz)

  ### 5. `plans`
  Business plan documents.
  - `id` (uuid, primary key)
  - `topic_id` (uuid) - Reference to topics
  - `title` (text) - Business name
  - `current_revision_id` (uuid) - Reference to latest revision
  - `status` (text) - draft, final, adopted
  - `created_at` (timestamptz)

  ### 6. `plan_revisions`
  Version history of plan edits.
  - `id` (uuid, primary key)
  - `plan_id` (uuid) - Reference to plans
  - `agent_id` (text) - Which agent made the edit
  - `op` (text) - Operation type (upsert_section, append, replace, delete, move)
  - `path` (text) - Section path
  - `content_md` (text) - Markdown content
  - `diff` (jsonb) - Change metadata
  - `created_at` (timestamptz)

  ### 7. `steps`
  Implementation tasks/checklist for a business plan.
  - `id` (uuid, primary key)
  - `plan_id` (uuid) - Reference to plans
  - `title` (text) - Task description
  - `owner_agent_role` (text) - Responsible agent role
  - `status` (text) - todo, in_progress, blocked, done
  - `depends_on` (uuid) - Reference to prerequisite step
  - `eta_days` (int) - Estimated days to complete
  - `created_at` (timestamptz)

  ### 8. `agent_votes`
  AI agent votes on business plans (requires 6/6 unanimous).
  - `id` (uuid, primary key)
  - `topic_id` (uuid) - Reference to topics
  - `agent_id` (text) - Which agent voted
  - `choice` (text) - approve, reject, abstain
  - `rationale_md` (text) - Reasoning
  - `conditions` (jsonb) - Any conditions for approval
  - `created_at` (timestamptz)

  ### 9. `arbitration`
  Log of which message won each tick (5-10s intervals).
  - `id` (uuid, primary key)
  - `topic_id` (uuid) - Reference to topics
  - `winner_message_id` (uuid) - Reference to messages
  - `decision` (jsonb) - Metadata about the selection
  - `created_at` (timestamptz)

  ## Security
  - Enable RLS on all tables
  - Public read access to proposals (status != 'rejected'), topics, messages (selected=true), plans, steps
  - Authenticated users can vote on proposals
  - Writes restricted to service role (backend orchestrator)
*/

-- proposals table
CREATE TABLE IF NOT EXISTS proposals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  summary text,
  submitted_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  status text CHECK (status IN ('queued', 'in_debate', 'adopted', 'rejected')) DEFAULT 'queued',
  votes_for int DEFAULT 0,
  votes_against int DEFAULT 0,
  voting_ends_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_proposals_status ON proposals(status);
CREATE INDEX IF NOT EXISTS idx_proposals_voting_ends ON proposals(voting_ends_at);

ALTER TABLE proposals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read non-rejected proposals"
  ON proposals FOR SELECT
  USING (status != 'rejected');

CREATE POLICY "Authenticated users can create proposals"
  ON proposals FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = submitted_by);

-- proposal_votes table
CREATE TABLE IF NOT EXISTS proposal_votes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  proposal_id uuid REFERENCES proposals(id) ON DELETE CASCADE,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  vote text CHECK (vote IN ('for', 'against')) NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(proposal_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_proposal_votes_proposal ON proposal_votes(proposal_id);
CREATE INDEX IF NOT EXISTS idx_proposal_votes_user ON proposal_votes(user_id);

ALTER TABLE proposal_votes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read proposal votes"
  ON proposal_votes FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can vote"
  ON proposal_votes FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own votes"
  ON proposal_votes FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- topics table
CREATE TABLE IF NOT EXISTS topics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  proposal_id uuid REFERENCES proposals(id) ON DELETE CASCADE,
  state text CHECK (state IN ('intake', 'debate', 'plan_drafting', 'pre_vote', 'vote', 'commit', 'idle')) DEFAULT 'intake',
  started_at timestamptz DEFAULT now(),
  ended_at timestamptz
);

CREATE INDEX IF NOT EXISTS idx_topics_state ON topics(state);
CREATE INDEX IF NOT EXISTS idx_topics_proposal ON topics(proposal_id);

ALTER TABLE topics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read active topics"
  ON topics FOR SELECT
  USING (ended_at IS NULL OR ended_at > now() - interval '24 hours');

-- messages table
CREATE TABLE IF NOT EXISTS messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  topic_id uuid REFERENCES topics(id) ON DELETE CASCADE,
  agent_id text CHECK (agent_id IN ('claude', 'chatgpt', 'grok', 'gemini', 'deepseek', 'qwen')) NOT NULL,
  agent_role text CHECK (agent_role IN ('product-strategy', 'engineering-arch', 'gtm-marketing', 'ops-automation', 'finance-tokenomics', 'risk-compliance')) NOT NULL,
  phase text NOT NULL,
  importance int CHECK (importance BETWEEN 1 AND 10) NOT NULL,
  body jsonb NOT NULL,
  selected boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_messages_topic ON messages(topic_id, created_at);
CREATE INDEX IF NOT EXISTS idx_messages_importance ON messages(topic_id, importance DESC, created_at);
CREATE INDEX IF NOT EXISTS idx_messages_selected ON messages(topic_id, selected, created_at);

ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read selected messages"
  ON messages FOR SELECT
  USING (selected = true);

-- plans table
CREATE TABLE IF NOT EXISTS plans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  topic_id uuid UNIQUE REFERENCES topics(id) ON DELETE CASCADE,
  title text,
  current_revision_id uuid,
  status text CHECK (status IN ('draft', 'final', 'adopted')) DEFAULT 'draft',
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_plans_topic ON plans(topic_id);

ALTER TABLE plans ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read plans"
  ON plans FOR SELECT
  USING (true);

-- plan_revisions table
CREATE TABLE IF NOT EXISTS plan_revisions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  plan_id uuid REFERENCES plans(id) ON DELETE CASCADE,
  agent_id text NOT NULL,
  op text CHECK (op IN ('upsert_section', 'append', 'replace', 'delete', 'move')) NOT NULL,
  path text NOT NULL,
  content_md text,
  diff jsonb,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_plan_revisions_plan ON plan_revisions(plan_id, created_at DESC);

ALTER TABLE plan_revisions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read plan revisions"
  ON plan_revisions FOR SELECT
  USING (true);

-- steps table
CREATE TABLE IF NOT EXISTS steps (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  plan_id uuid REFERENCES plans(id) ON DELETE CASCADE,
  title text NOT NULL,
  owner_agent_role text NOT NULL,
  status text CHECK (status IN ('todo', 'in_progress', 'blocked', 'done')) DEFAULT 'todo',
  depends_on uuid REFERENCES steps(id) ON DELETE SET NULL,
  eta_days int,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_steps_plan ON steps(plan_id);
CREATE INDEX IF NOT EXISTS idx_steps_status ON steps(status);

ALTER TABLE steps ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read steps"
  ON steps FOR SELECT
  USING (true);

-- agent_votes table
CREATE TABLE IF NOT EXISTS agent_votes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  topic_id uuid REFERENCES topics(id) ON DELETE CASCADE,
  agent_id text CHECK (agent_id IN ('claude', 'chatgpt', 'grok', 'gemini', 'deepseek', 'qwen')) NOT NULL,
  choice text CHECK (choice IN ('approve', 'reject', 'abstain')) NOT NULL,
  rationale_md text,
  conditions jsonb DEFAULT '[]'::jsonb,
  created_at timestamptz DEFAULT now(),
  UNIQUE(topic_id, agent_id)
);

CREATE INDEX IF NOT EXISTS idx_agent_votes_topic ON agent_votes(topic_id);

ALTER TABLE agent_votes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read agent votes"
  ON agent_votes FOR SELECT
  USING (true);

-- arbitration table
CREATE TABLE IF NOT EXISTS arbitration (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  topic_id uuid REFERENCES topics(id) ON DELETE CASCADE,
  winner_message_id uuid REFERENCES messages(id) ON DELETE CASCADE,
  decision jsonb,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_arbitration_topic ON arbitration(topic_id, created_at);

ALTER TABLE arbitration ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read arbitration log"
  ON arbitration FOR SELECT
  USING (true);

-- Add foreign key constraint for plans.current_revision_id
ALTER TABLE plans ADD CONSTRAINT fk_plans_current_revision 
  FOREIGN KEY (current_revision_id) REFERENCES plan_revisions(id) ON DELETE SET NULL;

-- Function to update proposal vote counts
CREATE OR REPLACE FUNCTION update_proposal_vote_counts()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN
    UPDATE proposals
    SET 
      votes_for = (SELECT COUNT(*) FROM proposal_votes WHERE proposal_id = NEW.proposal_id AND vote = 'for'),
      votes_against = (SELECT COUNT(*) FROM proposal_votes WHERE proposal_id = NEW.proposal_id AND vote = 'against'),
      updated_at = now()
    WHERE id = NEW.proposal_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE proposals
    SET 
      votes_for = (SELECT COUNT(*) FROM proposal_votes WHERE proposal_id = OLD.proposal_id AND vote = 'for'),
      votes_against = (SELECT COUNT(*) FROM proposal_votes WHERE proposal_id = OLD.proposal_id AND vote = 'against'),
      updated_at = now()
    WHERE id = OLD.proposal_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Trigger for vote count updates
DROP TRIGGER IF EXISTS trigger_update_proposal_votes ON proposal_votes;
CREATE TRIGGER trigger_update_proposal_votes
  AFTER INSERT OR UPDATE OR DELETE ON proposal_votes
  FOR EACH ROW
  EXECUTE FUNCTION update_proposal_vote_counts();
