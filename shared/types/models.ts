import type { Database } from './database.types';

export type AgentId = Database['public']['Tables']['messages']['Row']['agent_id'];

export type AgentRole = Database['public']['Tables']['messages']['Row']['agent_role'];

export type Phase = Database['public']['Tables']['topics']['Row']['state'];

export type VoteChoice = Database['public']['Tables']['agent_votes']['Row']['choice'];

export type PlanOperation = Database['public']['Tables']['plan_revisions']['Row']['op'];

export type ProposalStatus = Database['public']['Tables']['proposals']['Row']['status'];

export type StepStatus = Database['public']['Tables']['steps']['Row']['status'];

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

export type Proposal = Database['public']['Tables']['proposals']['Row'];

export type Topic = Database['public']['Tables']['topics']['Row'];

export type Message = Database['public']['Tables']['messages']['Row'];

export type MessageToolCall = Database['public']['Tables']['message_tool_calls']['Row'];

export type MessageProposedAction = Database['public']['Tables']['message_proposed_actions']['Row'];

export type Plan = Database['public']['Tables']['plans']['Row'];

export type PlanRevision = Database['public']['Tables']['plan_revisions']['Row'];

export type Step = Database['public']['Tables']['steps']['Row'];

export type AgentVote = Database['public']['Tables']['agent_votes']['Row'];

export type ArbitrationEntry = Database['public']['Tables']['arbitration']['Row'];

export type ProposalQueue = Database['public']['Tables']['proposal_queue']['Row'];

export type User = Database['public']['Tables']['users']['Row'];

export type ErrorLog = Database['public']['Tables']['error_logs']['Row'];

export type ErrorSource = Database['public']['Tables']['error_logs']['Row']['source'];
export type ErrorSeverity = Database['public']['Tables']['error_logs']['Row']['severity'];

export type RateLimit = Database['public']['Tables']['rate_limits']['Row'];

export type OrchestratorLock = Database['public']['Tables']['orchestrator_locks']['Row'];

export type AdminAction = Database['public']['Tables']['admin_actions']['Row'];

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

export interface PaginatedMessages<T = any> {
  messages: T[];
  total: number;
  hasMore: boolean;
}
