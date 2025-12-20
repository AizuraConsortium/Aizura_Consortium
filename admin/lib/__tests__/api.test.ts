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
    constructor(message: string) {
      super(message);
      this.name = 'APIError';
    }
  },
}));

describe('Admin API', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getRecentErrors', () => {
    it('should call apiClient.get with default endpoint when no hours specified', async () => {
      const mockData = { errors: [] };
      const token = 'admin-token';
      vi.mocked(apiClient.get).mockResolvedValue(mockData);

      const result = await api.getRecentErrors(undefined, token);

      expect(apiClient.get).toHaveBeenCalledWith('/errors/admin', token);
      expect(result).toEqual(mockData);
    });

    it('should include hours parameter when specified', async () => {
      const mockData = { errors: [] };
      vi.mocked(apiClient.get).mockResolvedValue(mockData);

      await api.getRecentErrors(24, 'token');

      expect(apiClient.get).toHaveBeenCalledWith('/errors/admin?hours=24', 'token');
    });
  });

  describe('getAdminErrors', () => {
    it('should call apiClient.get with query string', async () => {
      const mockData = { errors: [], total: 0 };
      vi.mocked(apiClient.get).mockResolvedValue(mockData);

      const result = await api.getAdminErrors('severity=critical&limit=10', 'token');

      expect(apiClient.get).toHaveBeenCalledWith(
        '/errors/admin?severity=critical&limit=10',
        'token'
      );
      expect(result).toEqual(mockData);
    });
  });

  describe('deleteError', () => {
    it('should call apiClient.delete with error ID', async () => {
      const mockData = { success: true };
      vi.mocked(apiClient.delete).mockResolvedValue(mockData);

      const result = await api.deleteError('error-123', 'token');

      expect(apiClient.delete).toHaveBeenCalledWith('/errors/admin/error-123', 'token');
      expect(result).toEqual(mockData);
    });
  });

  describe('cleanupErrors', () => {
    it('should call apiClient.post for cleanup', async () => {
      const mockData = { deleted: 10 };
      vi.mocked(apiClient.post).mockResolvedValue(mockData);

      const result = await api.cleanupErrors('token');

      expect(apiClient.post).toHaveBeenCalledWith('/errors/cleanup', {}, 'token');
      expect(result).toEqual(mockData);
    });
  });

  describe('getSystemHealth', () => {
    it('should call apiClient.get for system health', async () => {
      const mockData = {
        status: 'healthy',
        uptime: 99.9,
        errors: { last24h: 5, bySeverity: {} },
        database: { connected: true },
      };
      vi.mocked(apiClient.get).mockResolvedValue(mockData);

      const result = await api.getSystemHealth('token');

      expect(apiClient.get).toHaveBeenCalledWith('/system/health', 'token');
      expect(result).toEqual(mockData);
    });
  });

  describe('getRateLimits', () => {
    it('should call apiClient.get with default endpoint', async () => {
      const mockData = { active_limits: [] };
      vi.mocked(apiClient.get).mockResolvedValue(mockData);

      await api.getRateLimits(undefined, 'token');

      expect(apiClient.get).toHaveBeenCalledWith('/system/rate-limits', 'token');
    });

    it('should include hours parameter when specified', async () => {
      const mockData = { active_limits: [] };
      vi.mocked(apiClient.get).mockResolvedValue(mockData);

      await api.getRateLimits(12, 'token');

      expect(apiClient.get).toHaveBeenCalledWith('/system/rate-limits?hours=12', 'token');
    });
  });

  describe('clearRateLimits', () => {
    it('should call apiClient.post to clear rate limits', async () => {
      const mockData = { success: true };
      vi.mocked(apiClient.post).mockResolvedValue(mockData);

      const result = await api.clearRateLimits('token');

      expect(apiClient.post).toHaveBeenCalledWith('/system/rate-limits/clear', {}, 'token');
      expect(result).toEqual(mockData);
    });
  });

  describe('error handling', () => {
    it('should propagate errors from apiClient', async () => {
      const error = new Error('Server error');
      vi.mocked(apiClient.get).mockRejectedValue(error);

      await expect(api.getSystemHealth('token')).rejects.toThrow('Server error');
    });
  });
});
