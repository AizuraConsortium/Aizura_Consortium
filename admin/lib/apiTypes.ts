import type { ErrorLog, SystemHealth } from '@shared/types';

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

export type SystemHealthResponse = SystemHealth;

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
