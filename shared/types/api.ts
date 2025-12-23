import type { ErrorLog, Plan } from './models';

export interface ApiResponse<T = any> {
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface ApiError {
  status: number;
  message: string;
  details?: any;
}

export interface SystemHealth {
  status: 'healthy' | 'degraded' | 'unhealthy';
  uptime: number;
  timestamp: string;
  database: {
    connected: boolean;
    responseTimeMs?: number;
  };
  errors: {
    last24h: number;
    bySeverity: {
      info: number;
      warning: number;
      error: number;
      critical: number;
    };
    recentCritical: Array<{
      id: string;
      severity: 'critical';
      error_type: string;
      message: string;
      created_at: string;
    }>;
  };
  rateLimits: {
    violationsLast24h: number;
    topViolators: Array<{
      identifier: string;
      count: number;
    }>;
  };
}

export interface TopicWithDetails {
  id: string;
  title: string;
  description: string;
  state: string;
  proposal_id: string;
  created_at: string;
  updated_at: string;
  proposal: {
    id: string;
    title: string;
    description: string;
    status: string;
    created_at: string;
    user_id: string | null;
  } | null;
  plan: {
    id: string;
    topic_id: string;
    content_md: string;
    created_at: string;
    updated_at: string;
  } | null;
}

export interface PaginatedMessages<T = any> {
  messages: T[];
  total: number;
  hasMore: boolean;
}

export interface FullMessageData {
  id: string;
  topic_id: string;
  agent_id: string;
  agent_role: string;
  phase: string;
  importance: number;
  message_type: 'message' | 'vote';
  message_title: string | null;
  message_body_md: string | null;
  message_citations: string[] | null;
  vote_choice: string | null;
  vote_rationale_md: string | null;
  vote_conditions: string[] | null;
  selected: boolean;
  created_at: string;
}

export interface ProposalsResponse {
  proposals: Array<{
    id: string;
    title: string;
    description: string;
    status: string;
    created_at: string;
    user_id: string | null;
  }>;
  count: number;
}

export interface ErrorsResponse {
  errors: ErrorLog[];
  count: number;
}

export type RealtimeMessageType =
  | 'connected'
  | 'message_added'
  | 'topic_updated'
  | 'error'
  | 'ping'
  | 'pong';

export interface RealtimeMessage {
  type: RealtimeMessageType;
  data?: any;
  timestamp: string;
}

export interface RealtimeMessageAdded {
  type: 'message_added';
  data: {
    id: string;
    topic_id: string;
    agent_id: string;
    agent_role: string;
    phase: string;
    importance: number;
    message_type: 'message' | 'vote';
    message_title: string | null;
    message_body_md: string | null;
    message_citations: string[] | null;
    vote_choice: string | null;
    vote_rationale_md: string | null;
    vote_conditions: string[] | null;
    selected: boolean;
    created_at: string;
  };
  timestamp: string;
}

export interface RealtimeTopicUpdated {
  type: 'topic_updated';
  data: {
    topic_id: string;
    state?: string;
    updated_at: string;
  };
  timestamp: string;
}

export interface RealtimeError {
  type: 'error';
  data: {
    message: string;
    code?: string;
  };
  timestamp: string;
}

export interface RealtimeConnected {
  type: 'connected';
  data: {
    topic_id: string;
    client_id: string;
  };
  timestamp: string;
}

export interface TimeInfo {
  startTime: string;
  elapsedDays: number;
  remainingHours: number;
}

export interface HomeData {
  id: string | null;
  status: 'active' | 'idle';
  title?: string;
  description?: string;
  state?: string;
  voteProgress?: string;
  timeInfo?: TimeInfo;
  plan?: {
    id: string;
    content_md: string;
  } | null;
  proposal?: {
    id: string;
    title: string;
    description: string;
    status: string;
    created_at: string;
  } | null;
}

export interface TopicInfo {
  id?: string;
  status: 'active' | 'idle';
  title?: string;
  description?: string;
  state?: string;
  voteProgress?: string;
  timeInfo?: TimeInfo;
  plan?: {
    id: string;
    content_md: string;
  } | null;
  proposal?: {
    id: string;
    title: string;
    description: string;
    status: string;
    created_at: string;
  } | null;
}

export interface PlanStep {
  title: string;
  content: string;
  level: number;
}

export interface PlanData {
  plan: Plan | null;
  topic: {
    id: string;
    title: string;
    description: string;
    state: string;
  } | null;
  steps: PlanStep[];
}
