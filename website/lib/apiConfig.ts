function resolveApiBase(): string {
  const configuredUrl = import.meta.env.VITE_API_URL?.trim();

  if (!configuredUrl) {
    return 'http://localhost:3001';
  }

  const normalizedUrl = configuredUrl.replace(/\/+$/, '');
  return normalizedUrl.endsWith('/api')
    ? normalizedUrl.slice(0, -4)
    : normalizedUrl;
}

const API_BASE = resolveApiBase();

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
  },
};
