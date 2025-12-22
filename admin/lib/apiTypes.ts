import type { ErrorLog } from '@shared/types';

export interface AdminAPIEndpoints {
  errors: {
    recent: '/admin/errors/recent';
    admin: '/admin/errors/admin';
    delete: (id: string) => `/admin/errors/${string}`;
    cleanup: '/admin/errors/cleanup';
  };
  system: {
    health: '/admin/system/health';
    rateLimits: '/admin/system/rate-limits';
    clearRateLimits: '/admin/system/rate-limits/clear';
  };
}

export interface ErrorLogResponse {
  errors: ErrorLog[];
  total: number;
}

export interface SystemHealthResponse {
  status: 'healthy' | 'degraded' | 'unhealthy';
  uptime: number;
  errors: {
    last24h: number;
    bySeverity: {
      info: number;
      warning: number;
      error: number;
      critical: number;
    };
  };
  database: {
    connected: boolean;
  };
}

export interface RateLimitStats {
  identifier: string;
  endpoint: string;
  count: number;
  first_request_at: string;
  last_request_at: string;
}

export interface RateLimitResponse {
  active_limits: RateLimitStats[];
  total_blocked_today: number;
  most_active_endpoint: string;
  system_health: 'healthy' | 'warning' | 'critical';
}
