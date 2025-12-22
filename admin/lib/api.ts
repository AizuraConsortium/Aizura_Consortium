import { apiClient, APIError } from '@shared/lib';

export const api = {
  ...apiClient,

  async getRecentErrors(hours?: number, token?: string) {
    const endpoint = hours ? `/admin/errors/recent?hours=${hours}` : '/admin/errors/recent';
    return this.get(endpoint, token);
  },

  async getAdminErrors(queryString: string, token?: string) {
    return this.get(`/admin/errors/admin?${queryString}`, token);
  },

  async deleteError(id: string, token: string) {
    return this.delete(`/admin/errors/${id}`, token);
  },

  async cleanupErrors(token: string) {
    return this.post('/admin/errors/cleanup', {}, token);
  },

  async getSystemHealth(token: string) {
    return this.get('/admin/system/health', token);
  },

  async getRateLimits(hours?: number, token?: string) {
    const endpoint = hours ? `/admin/system/rate-limits?hours=${hours}` : '/admin/system/rate-limits';
    return this.get(endpoint, token);
  },

  async clearRateLimits(token: string) {
    return this.post('/admin/system/rate-limits/clear', {}, token);
  }
};

export { APIError };
