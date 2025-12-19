const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export const ADMIN_API = {
  errors: {
    getRecent: (hours?: number) =>
      `${API_BASE}/api/admin/errors/recent${hours ? `?hours=${hours}` : ''}`,
    getAll: (query: string) =>
      `${API_BASE}/api/admin/errors/admin?${query}`,
    delete: (id: string) =>
      `${API_BASE}/api/admin/errors/${id}`,
    cleanup: () =>
      `${API_BASE}/api/admin/errors/cleanup`,
  },
  system: {
    health: () =>
      `${API_BASE}/api/admin/system/health`,
    rateLimits: (hours?: number) =>
      `${API_BASE}/api/admin/system/rate-limits${hours ? `?hours=${hours}` : ''}`,
    clearRateLimits: () =>
      `${API_BASE}/api/admin/system/rate-limits/clear`,
  },
};
