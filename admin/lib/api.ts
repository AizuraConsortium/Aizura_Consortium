import { apiClient } from '@shared/lib/apiClient';
import { APIError } from '@shared/lib/apiClient';
import type { ErrorLogResponse, SystemHealthResponse, RateLimitResponse } from './apiTypes';

const ADMIN_PREFIX = '/admin' as const;

export const api = {
  ...apiClient,

  async getRecentErrors(hours?: number, token?: string): Promise<ErrorLogResponse> {
    const endpoint = hours
      ? `${ADMIN_PREFIX}/errors/recent?hours=${hours}`
      : `${ADMIN_PREFIX}/errors/recent`;

    return this.get<ErrorLogResponse>(endpoint, token);
  },

  async getAdminErrors(queryString: string, token?: string): Promise<ErrorLogResponse> {
    return this.get<ErrorLogResponse>(`${ADMIN_PREFIX}/errors/admin?${queryString}`, token);
  },

  async deleteError(id: string, token: string): Promise<{ success: boolean }> {
    return this.delete<{ success: boolean }>(`${ADMIN_PREFIX}/errors/${id}`, token);
  },

  async cleanupErrors(token: string): Promise<{ deleted: number }> {
    return this.post<{ deleted: number }>(`${ADMIN_PREFIX}/errors/cleanup`, {}, token);
  },

  async getSystemHealth(token: string): Promise<SystemHealthResponse> {
    return this.get<SystemHealthResponse>(`${ADMIN_PREFIX}/system/health`, token);
  },

  async getRateLimits(hours?: number, token?: string): Promise<RateLimitResponse> {
    const endpoint = hours
      ? `${ADMIN_PREFIX}/system/rate-limits?hours=${hours}`
      : `${ADMIN_PREFIX}/system/rate-limits`;

    return this.get<RateLimitResponse>(endpoint, token);
  },

  async clearRateLimits(token: string): Promise<{ cleared: number }> {
    return this.post<{ cleared: number }>(`${ADMIN_PREFIX}/system/rate-limits/clear`, {}, token);
  }
};

export { APIError };
