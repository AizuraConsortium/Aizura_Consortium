import { describe, it, expect, vi, beforeEach } from 'vitest';
import { api } from '../api';
import { apiClient } from '@shared/lib/apiClient';

vi.mock('@shared/lib/apiClient', () => ({
  apiClient: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  },
  APIError: class APIError extends Error {},
}));

describe('Website API', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getProposals', () => {
    it('should call apiClient.get with correct endpoint', async () => {
      const mockData = { proposals: [] };
      vi.mocked(apiClient.get).mockResolvedValue(mockData);

      const result = await api.getProposals();

      expect(apiClient.get).toHaveBeenCalledWith('/website/proposals');
      expect(result).toEqual(mockData);
    });

    it('should handle errors properly', async () => {
      const error = new Error('Network error');
      vi.mocked(apiClient.get).mockRejectedValue(error);

      await expect(api.getProposals()).rejects.toThrow('Network error');
    });
  });

  describe('getPlan', () => {
    it('should call apiClient.get with topic ID', async () => {
      const mockData = { plan: { id: '123' } };
      vi.mocked(apiClient.get).mockResolvedValue(mockData);

      const result = await api.getPlan('123');

      expect(apiClient.get).toHaveBeenCalledWith('/website/topics/123');
      expect(result).toEqual(mockData);
    });
  });

  describe('getMessages', () => {
    it('should call apiClient.get with topic ID', async () => {
      const mockData = { messages: [] };
      vi.mocked(apiClient.get).mockResolvedValue(mockData);

      const result = await api.getMessages('789');

      expect(apiClient.get).toHaveBeenCalledWith('/website/messages/topic/789?limit=50&offset=0');
      expect(result).toEqual(mockData);
    });
  });
});
