export type AgentId = 'claude' | 'chatgpt' | 'grok' | 'gemini' | 'deepseek' | 'qwen';

export type AgentRole =
  | 'product-strategy'
  | 'engineering-arch'
  | 'gtm-marketing'
  | 'ops-automation'
  | 'finance-tokenomics'
  | 'risk-compliance';

export type Phase =
  | 'intake'
  | 'debate'
  | 'plan_drafting'
  | 'pre_vote'
  | 'vote'
  | 'commit'
  | 'idle';

export type VoteChoice = 'approve' | 'reject' | 'abstain';

export type PlanOperation = 'upsert_section' | 'append' | 'replace' | 'delete' | 'move';

export type ProposalStatus = 'queued' | 'in_debate' | 'adopted' | 'rejected';

export type StepStatus = 'todo' | 'in_progress' | 'blocked' | 'done';

export interface AgentMessage {
  type: 'message';
  topic_id: string;
  agent_id: AgentId;
  importance: number;
  phase: Phase;
  message: {
    title: string;
    body_md: string;
    citations?: string[];
    proposed_actions?: Array<{
      kind: string;
      [key: string]: any;
    }>;
  };
  tool_calls?: ToolCall[];
}

export interface AgentVoteMessage {
  type: 'vote';
  topic_id: string;
  agent_id: AgentId;
  importance: number;
  vote: {
    choice: VoteChoice;
    rationale_md: string;
    conditions?: string[];
  };
}

export interface ToolCall {
  tool: 'plan_editor';
  args: PlanEditorArgs;
}

export interface PlanEditorArgs {
  op: PlanOperation;
  path: string;
  target_path?: string;
  after?: string;
  content_md?: string;
  metadata?: {
    attribution_agent_id: AgentId;
    tags?: string[];
  };
}

export interface RefusalNotice {
  type: 'notice';
  reason: 'lower_importance';
  losing_message_id: string;
  winning_message_id: string;
  losing_importance: number;
  winning_importance: number;
  instruction: string;
}

export interface Proposal {
  id: string;
  title: string;
  summary: string | null;
  submitted_by: string | null;
  status: ProposalStatus;
  votes_for: number;
  votes_against: number;
  voting_ends_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface Topic {
  id: string;
  proposal_id: string | null;
  state: Phase;
  started_at: string;
  ended_at: string | null;
}

export interface Message {
  id: string;
  topic_id: string;
  agent_id: AgentId;
  agent_role: AgentRole;
  phase: Phase;
  importance: number;
  body: AgentMessage | AgentVoteMessage;
  selected: boolean;
  created_at: string;
}

export interface Plan {
  id: string;
  topic_id: string;
  title: string | null;
  current_revision_id: string | null;
  status: 'draft' | 'final' | 'adopted';
  created_at: string;
}

export interface PlanRevision {
  id: string;
  plan_id: string;
  agent_id: AgentId;
  op: PlanOperation;
  path: string;
  content_md: string | null;
  diff: any;
  created_at: string;
}

export interface Step {
  id: string;
  plan_id: string;
  title: string;
  owner_agent_role: AgentRole;
  status: StepStatus;
  depends_on: string | null;
  eta_days: number | null;
  created_at: string;
}

export interface AgentVote {
  id: string;
  topic_id: string;
  agent_id: AgentId;
  choice: VoteChoice;
  rationale_md: string | null;
  conditions: string[];
  created_at: string;
}

export interface ArbitrationEntry {
  id: string;
  topic_id: string;
  winner_message_id: string;
  decision: any;
  created_at: string;
}

export interface ProposalQueue {
  id: string;
  proposal_id: string;
  priority: number;
  status: 'queued' | 'processing' | 'completed';
  created_at: string;
  started_at: string | null;
  completed_at: string | null;
}

export type ErrorSource = 'backend' | 'frontend' | 'agent';
export type ErrorSeverity = 'info' | 'warning' | 'error' | 'critical';

export const AGENT_ROLE_MAPPING: Record<AgentId, AgentRole> = {
  claude: 'engineering-arch',
  chatgpt: 'product-strategy',
  grok: 'gtm-marketing',
  gemini: 'ops-automation',
  deepseek: 'finance-tokenomics',
  qwen: 'risk-compliance'
};

export const AGENT_DISPLAY_NAMES: Record<AgentId, string> = {
  claude: 'Claude (Anthropic)',
  chatgpt: 'ChatGPT (OpenAI)',
  grok: 'Grok (xAI)',
  gemini: 'Gemini (Google)',
  deepseek: 'DeepSeek',
  qwen: 'Qwen (Alibaba)'
};

export const ROLE_DISPLAY_NAMES: Record<AgentRole, string> = {
  'product-strategy': 'Product & Strategy Lead',
  'engineering-arch': 'Engineering & Architecture Lead',
  'gtm-marketing': 'GTM & Marketing Lead',
  'ops-automation': 'Ops & Automation Lead',
  'finance-tokenomics': 'Finance & Tokenomics Lead',
  'risk-compliance': 'Risk, Compliance & Trust Lead'
};

export interface QueueOperationResult {
  success: boolean;
  wasAlreadyQueued: boolean;
  message: string;
}

export * from './api';
export * from './forms';
