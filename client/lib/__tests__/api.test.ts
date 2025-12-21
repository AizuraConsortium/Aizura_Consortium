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
  APIError: class APIError extends Error {
    constructor(message: string, public status: number, public statusText: string, public data?: any) {
      super(message);
    }
  },
  logError: vi.fn(),
}));

describe('Client API', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getProposals', () => {
    it('should call apiClient.get with correct endpoint and token', async () => {
      const mockData = { proposals: [] };
      const token = 'test-token';
      vi.mocked(apiClient.get).mockResolvedValue(mockData);

      const result = await api.getProposals(token);

      expect(apiClient.get).toHaveBeenCalledWith('/client/proposals', token);
      expect(result).toEqual(mockData);
    });

    it('should work without token', async () => {
      const mockData = { proposals: [] };
      vi.mocked(apiClient.get).mockResolvedValue(mockData);

      const result = await api.getProposals();

      expect(apiClient.get).toHaveBeenCalledWith('/client/proposals', undefined);
      expect(result).toEqual(mockData);
    });

    it('should handle errors properly', async () => {
      const error = new Error('Unauthorized');
      vi.mocked(apiClient.get).mockRejectedValue(error);

      await expect(api.getProposals('token')).rejects.toThrow('Unauthorized');
    });
  });

  describe('createProposal', () => {
    it('should call apiClient.post with title, summary, and token', async () => {
      const mockData = { success: true };
      const token = 'test-token';
      vi.mocked(apiClient.post).mockResolvedValue(mockData);

      const result = await api.createProposal('Valid Title', 'Valid Summary Here', token);

      expect(apiClient.post).toHaveBeenCalledWith(
        '/client/proposals',
        { title: 'Valid Title', summary: 'Valid Summary Here' },
        token
      );
      expect(result).toEqual(mockData);
    });

    it('should throw validation error if title is too short', async () => {
      await expect(
        api.createProposal('ab', 'Valid Summary', 'token')
      ).rejects.toThrow('Title must be at least 3 characters');

      expect(apiClient.post).not.toHaveBeenCalled();
    });

    it('should throw validation error if title is too long', async () => {
      const longTitle = 'a'.repeat(201);

      await expect(
        api.createProposal(longTitle, 'Valid Summary', 'token')
      ).rejects.toThrow('Title must be 200 characters or less');

      expect(apiClient.post).not.toHaveBeenCalled();
    });

    it('should throw validation error if summary is too short', async () => {
      await expect(
        api.createProposal('Valid Title', 'Short', 'token')
      ).rejects.toThrow('Summary must be at least 10 characters');

      expect(apiClient.post).not.toHaveBeenCalled();
    });

    it('should throw validation error if summary is too long', async () => {
      const longSummary = 'a'.repeat(5001);

      await expect(
        api.createProposal('Valid Title', longSummary, 'token')
      ).rejects.toThrow('Summary must be 5000 characters or less');

      expect(apiClient.post).not.toHaveBeenCalled();
    });

    it('should throw validation error if title is empty', async () => {
      await expect(
        api.createProposal('', 'Valid Summary', 'token')
      ).rejects.toThrow('Title is required');

      expect(apiClient.post).not.toHaveBeenCalled();
    });

    it('should throw validation error if summary is empty', async () => {
      await expect(
        api.createProposal('Valid Title', '', 'token')
      ).rejects.toThrow('Summary is required');

      expect(apiClient.post).not.toHaveBeenCalled();
    });
  });

  describe('voteOnProposal', () => {
    it('should call apiClient.post with proposal ID, vote, and token', async () => {
      const mockData = { success: true };
      const token = 'test-token';
      vi.mocked(apiClient.post).mockResolvedValue(mockData);

      const result = await api.voteOnProposal('123', 'for', token);

      expect(apiClient.post).toHaveBeenCalledWith(
        '/client/proposals/123/vote',
        { vote: 'for' },
        token
      );
      expect(result).toEqual(mockData);
    });

    it('should handle "against" vote', async () => {
      const mockData = { success: true };
      vi.mocked(apiClient.post).mockResolvedValue(mockData);

      await api.voteOnProposal('456', 'against', 'token');

      expect(apiClient.post).toHaveBeenCalledWith(
        '/client/proposals/456/vote',
        { vote: 'against' },
        'token'
      );
    });

    it('should throw validation error for invalid vote value', async () => {
      await expect(
        api.voteOnProposal('123', 'invalid' as any, 'token')
      ).rejects.toThrow('Invalid vote value');

      expect(apiClient.post).not.toHaveBeenCalled();
    });
  });

  describe('getMyProposals', () => {
    it('should call apiClient.get with correct endpoint and token', async () => {
      const mockData = { proposals: [] };
      const token = 'test-token';
      vi.mocked(apiClient.get).mockResolvedValue(mockData);

      const result = await api.getMyProposals(token);

      expect(apiClient.get).toHaveBeenCalledWith('/client/proposals/my', token);
      expect(result).toEqual(mockData);
    });
  });

  describe('getUserVote', () => {
    it('should call apiClient.get with correct endpoint and token', async () => {
      const mockData = { vote: 'for' };
      const token = 'test-token';
      vi.mocked(apiClient.get).mockResolvedValue(mockData);

      const result = await api.getUserVote('123', token);

      expect(apiClient.get).toHaveBeenCalledWith('/client/proposals/123/vote', token);
      expect(result).toEqual(mockData);
    });
  });
});
