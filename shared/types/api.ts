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

export interface ErrorLog {
  id: string;
  source: 'frontend' | 'backend' | 'agent';
  severity: 'info' | 'warning' | 'error' | 'critical';
  error_type: string;
  message: string;
  details?: any;
  created_at: string;
  agent_id?: string;
  topic_id?: string;
}

export interface SystemHealth {
  status: 'healthy' | 'degraded' | 'unhealthy';
  uptime: number;
  errors: {
    last24h: number;
    recent: Array<{
      severity: string;
      message: string;
      timestamp: string;
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

export interface PaginatedMessages {
  messages: Array<{
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
  }>;
  total: number;
  hasMore: boolean;
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
