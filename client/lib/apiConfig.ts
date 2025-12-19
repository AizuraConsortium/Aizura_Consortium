const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export const CLIENT_API = {
  proposals: {
    getAll: (userId: string) =>
      `${API_BASE}/api/client/proposals?userId=${userId}`,
    getById: (id: string, userId: string) =>
      `${API_BASE}/api/client/proposals/${id}?userId=${userId}`,
  },
};
