import { describe, it, expect, vi, beforeEach } from 'vitest';
import { api } from '../api';
import { apiClient } from '@shared/lib';

vi.mock('@shared/lib', () => ({
  apiClient: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  },
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

  describe('getProposalById', () => {
    it('should call apiClient.get with proposal ID', async () => {
      const mockData = { proposal: { id: '123', title: 'Test' } };
      vi.mocked(apiClient.get).mockResolvedValue(mockData);

      const result = await api.getProposalById('123');

      expect(apiClient.get).toHaveBeenCalledWith('/website/proposals/123');
      expect(result).toEqual(mockData);
    });
  });

  describe('getTopic', () => {
    it('should call apiClient.get with topic ID', async () => {
      const mockData = { topic: { id: '456' } };
      vi.mocked(apiClient.get).mockResolvedValue(mockData);

      const result = await api.getTopic('456');

      expect(apiClient.get).toHaveBeenCalledWith('/website/topics/456');
      expect(result).toEqual(mockData);
    });
  });

  describe('getMessages', () => {
    it('should call apiClient.get with topic ID', async () => {
      const mockData = { messages: [] };
      vi.mocked(apiClient.get).mockResolvedValue(mockData);

      const result = await api.getMessages('789');

      expect(apiClient.get).toHaveBeenCalledWith('/website/topics/789/messages');
      expect(result).toEqual(mockData);
    });
  });
});
