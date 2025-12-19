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
