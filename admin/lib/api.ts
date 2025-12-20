import { apiClient, APIError } from '@shared/lib';

export const api = {
  ...apiClient,

  async getRecentErrors(hours?: number, token?: string) {
    const endpoint = hours ? `/errors/admin?hours=${hours}` : '/errors/admin';
    return this.get(endpoint, token);
  },

  async getAdminErrors(queryString: string, token?: string) {
    return this.get(`/errors/admin?${queryString}`, token);
  },

  async deleteError(id: string, token: string) {
    return this.delete(`/errors/admin/${id}`, token);
  },

  async cleanupErrors(token: string) {
    return this.post('/errors/cleanup', {}, token);
  },

  async getSystemHealth(token: string) {
    return this.get('/system/health', token);
  },

  async getRateLimits(hours?: number, token?: string) {
    const endpoint = hours ? `/system/rate-limits?hours=${hours}` : '/system/rate-limits';
    return this.get(endpoint, token);
  },

  async clearRateLimits(token: string) {
    return this.post('/system/rate-limits/clear', {}, token);
  }
};

export { APIError };
