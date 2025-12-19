const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export const WEBSITE_API = {
  topics: {
    getCurrent: () =>
      `${API_BASE}/api/website/topics/current`,
    getById: (topicId: string) =>
      `${API_BASE}/api/website/topics/${topicId}`,
  },
  messages: {
    getByTopic: (topicId: string, limit: number = 50, offset: number = 0) =>
      `${API_BASE}/api/website/messages/topic/${topicId}?limit=${limit}&offset=${offset}`,
    getById: (messageId: string) =>
      `${API_BASE}/api/website/messages/${messageId}`,
  },
  proposals: {
    getAll: (status?: string) =>
      `${API_BASE}/api/website/proposals${status ? `?status=${status}` : ''}`,
    getById: (id: string) =>
      `${API_BASE}/api/website/proposals/${id}`,
    create: () =>
      `${API_BASE}/api/website/proposals`,
    vote: (id: string) =>
      `${API_BASE}/api/website/proposals/${id}/vote`,
    getUserVote: (id: string, userId: string) =>
      `${API_BASE}/api/website/proposals/${id}/vote?userId=${userId}`,
  },
};
