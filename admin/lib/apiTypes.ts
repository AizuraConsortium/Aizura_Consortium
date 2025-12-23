import type { ErrorLog } from '@shared/types/models';
import type { SystemHealth } from '@shared/types/api';

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
  endpoint: string;
  current_count: number;
  limit: number;
  window_seconds: number;
  blocked_requests: number;
  reset_at: string;
  usage_percentage: number;
}

export interface RateLimitResponse {
  active_limits: RateLimitStats[];
  total_blocked_today: number;
  most_active_endpoint: string;
  system_health: 'healthy' | 'warning' | 'critical';
}
