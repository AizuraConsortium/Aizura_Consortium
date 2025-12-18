import { describe, it, expect, beforeEach, vi } from 'vitest';
import { RateLimiterService } from '../../../backend/src/services/rateLimiter';
import { SupabaseService } from '../../../backend/src/services/supabase';
import { ErrorLogger } from '../../../backend/src/services/errorLogger';

vi.mock('../../../backend/src/services/supabase');
vi.mock('../../../backend/src/services/errorLogger');

describe('RateLimiterService', () => {
  let rateLimiter: RateLimiterService;
  let mockSupabaseClient: any;
  let mockErrorLogger: any;

  beforeEach(() => {
    mockSupabaseClient = {
      rpc: vi.fn(),
      from: vi.fn(() => ({
        insert: vi.fn().mockResolvedValue({ error: null }),
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        order: vi.fn().mockReturnThis(),
        gte: vi.fn().mockReturnThis()
      }))
    };

    mockErrorLogger = {
      logError: vi.fn().mockResolvedValue(undefined)
    };

    vi.mocked(SupabaseService.getInstance).mockReturnValue({
      getClient: () => mockSupabaseClient
    } as any);

    vi.mocked(ErrorLogger.getInstance).mockReturnValue(mockErrorLogger);

    rateLimiter = RateLimiterService.getInstance();
  });

  describe('checkLimit', () => {
    it('should allow request when under limit', async () => {
      mockSupabaseClient.rpc.mockResolvedValue({
        data: { allowed: true, remaining_tokens: 50 },
        error: null
      });

      const result = await rateLimiter.checkLimit('user123', '/api/test', 100, 60);

      expect(result.allowed).toBe(true);
      expect(result.remaining).toBe(50);
      expect(result.limit).toBe(100);
      expect(mockSupabaseClient.rpc).toHaveBeenCalledWith('check_rate_limit', {
        p_identifier: 'user123',
        p_endpoint: '/api/test',
        p_max_tokens: 100,
        p_refill_rate: 100 / 3600
      });
    });

    it('should block request when over limit', async () => {
      mockSupabaseClient.rpc.mockResolvedValue({
        data: { allowed: false, remaining_tokens: 0 },
        error: null
      });

      const result = await rateLimiter.checkLimit('user123', '/api/test', 100, 60);

      expect(result.allowed).toBe(false);
      expect(result.remaining).toBe(0);
      expect(result.limit).toBe(100);
    });

    it('should handle array response from rpc', async () => {
      mockSupabaseClient.rpc.mockResolvedValue({
        data: [{ allowed: true, remaining_tokens: 30 }],
        error: null
      });

      const result = await rateLimiter.checkLimit('user123', '/api/test', 100, 60);

      expect(result.allowed).toBe(true);
      expect(result.remaining).toBe(30);
    });

    it('should fail open on database error when failOpen is enabled', async () => {
      mockSupabaseClient.rpc.mockResolvedValue({
        data: null,
        error: { message: 'Database connection failed' }
      });

      rateLimiter.setFailOpen(true);
      const result = await rateLimiter.checkLimit('user123', '/api/test', 100, 60);

      expect(result.allowed).toBe(true);
      expect(mockErrorLogger.logError).toHaveBeenCalledWith(
        expect.objectContaining({
          source: 'backend',
          severity: 'error',
          errorType: 'rate_limit_check_failed'
        })
      );
    });

    it('should fail closed on database error when failOpen is disabled', async () => {
      mockSupabaseClient.rpc.mockResolvedValue({
        data: null,
        error: { message: 'Database connection failed' }
      });

      rateLimiter.setFailOpen(false);
      const result = await rateLimiter.checkLimit('user123', '/api/test', 100, 60);

      expect(result.allowed).toBe(false);
      expect(result.remaining).toBe(0);
    });

    it('should log warning for slow queries', async () => {
      mockSupabaseClient.rpc.mockImplementation(
        () => new Promise(resolve => {
          setTimeout(() => {
            resolve({ data: { allowed: true, remaining_tokens: 50 }, error: null });
          }, 600);
        })
      );

      await rateLimiter.checkLimit('user123', '/api/test', 100, 60);

      expect(mockErrorLogger.logError).toHaveBeenCalledWith(
        expect.objectContaining({
          severity: 'warning',
          errorType: 'rate_limit_slow_query'
        })
      );
    });

    it('should handle exceptions gracefully when failOpen enabled', async () => {
      mockSupabaseClient.rpc.mockRejectedValue(new Error('Unexpected error'));

      rateLimiter.setFailOpen(true);
      const result = await rateLimiter.checkLimit('user123', '/api/test', 100, 60);

      expect(result.allowed).toBe(true);
      expect(mockErrorLogger.logError).toHaveBeenCalledWith(
        expect.objectContaining({
          severity: 'critical',
          errorType: 'rate_limit_exception'
        })
      );
    });
  });

  describe('logViolation', () => {
    it('should log rate limit violation to database', async () => {
      const violation = {
        identifier: 'user123',
        endpoint: '/api/test',
        tokensRequested: 10,
        userAgent: 'TestAgent',
        ipAddress: '192.168.1.1'
      };

      await rateLimiter.logViolation(violation);

      const fromMock = mockSupabaseClient.from();
      expect(mockSupabaseClient.from).toHaveBeenCalledWith('rate_limit_violations');
      expect(fromMock.insert).toHaveBeenCalledWith({
        identifier: 'user123',
        endpoint: '/api/test',
        tokens_requested: 10,
        user_agent: 'TestAgent',
        ip_address: '192.168.1.1'
      });
    });

    it('should log violation to error logger', async () => {
      const violation = {
        identifier: 'user123',
        endpoint: '/api/test',
        tokensRequested: 10
      };

      await rateLimiter.logViolation(violation);

      expect(mockErrorLogger.logError).toHaveBeenCalledWith({
        source: 'backend',
        severity: 'warning',
        errorType: 'rate_limit_exceeded',
        message: 'Rate limit exceeded for /api/test',
        details: {
          identifier: 'user123',
          endpoint: '/api/test',
          tokensRequested: 10
        }
      });
    });

    it('should handle database errors gracefully', async () => {
      mockSupabaseClient.from = vi.fn(() => ({
        insert: vi.fn().mockResolvedValue({
          error: { message: 'Insert failed' }
        })
      }));

      const violation = {
        identifier: 'user123',
        endpoint: '/api/test',
        tokensRequested: 10
      };

      await expect(rateLimiter.logViolation(violation)).resolves.not.toThrow();
    });
  });

  describe('getViolationStats', () => {
    it('should fetch violation statistics', async () => {
      const mockStats = [
        {
          endpoint: '/api/test1',
          total_violations: '10',
          unique_identifiers: '5',
          avg_tokens_requested: '8.5'
        },
        {
          endpoint: '/api/test2',
          total_violations: '20',
          unique_identifiers: '8',
          avg_tokens_requested: '12.3'
        }
      ];

      mockSupabaseClient.rpc.mockResolvedValue({
        data: mockStats,
        error: null
      });

      const stats = await rateLimiter.getViolationStats(24);

      expect(mockSupabaseClient.rpc).toHaveBeenCalledWith('get_rate_limit_stats', {
        p_hours: 24
      });
      expect(stats).toHaveLength(2);
      expect(stats[0]).toEqual({
        endpoint: '/api/test1',
        totalViolations: 10,
        uniqueIdentifiers: 5,
        avgTokensRequested: 8.5
      });
    });

    it('should return empty array on error', async () => {
      mockSupabaseClient.rpc.mockResolvedValue({
        data: null,
        error: { message: 'Query failed' }
      });

      const stats = await rateLimiter.getViolationStats(24);

      expect(stats).toEqual([]);
    });

    it('should handle exceptions gracefully', async () => {
      mockSupabaseClient.rpc.mockRejectedValue(new Error('Unexpected error'));

      const stats = await rateLimiter.getViolationStats(24);

      expect(stats).toEqual([]);
    });
  });

  describe('cleanupOldLimits', () => {
    it('should cleanup old rate limit entries', async () => {
      mockSupabaseClient.rpc.mockResolvedValue({
        data: 42,
        error: null
      });

      const deletedCount = await rateLimiter.cleanupOldLimits();

      expect(mockSupabaseClient.rpc).toHaveBeenCalledWith('cleanup_old_rate_limits');
      expect(deletedCount).toBe(42);
    });

    it('should return 0 on error', async () => {
      mockSupabaseClient.rpc.mockResolvedValue({
        data: null,
        error: { message: 'Cleanup failed' }
      });

      const deletedCount = await rateLimiter.cleanupOldLimits();

      expect(deletedCount).toBe(0);
    });

    it('should handle exceptions gracefully', async () => {
      mockSupabaseClient.rpc.mockRejectedValue(new Error('Unexpected error'));

      const deletedCount = await rateLimiter.cleanupOldLimits();

      expect(deletedCount).toBe(0);
    });
  });

  describe('getCurrentLimits', () => {
    it('should fetch current limits for identifier', async () => {
      const mockLimits = [
        {
          identifier: 'user123',
          endpoint: '/api/test',
          tokens: 75,
          max_tokens: 100,
          last_refill: '2024-01-01T00:00:00Z'
        }
      ];

      mockSupabaseClient.from = vi.fn(() => ({
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        order: vi.fn().mockResolvedValue({ data: mockLimits, error: null })
      }));

      const limits = await rateLimiter.getCurrentLimits('user123');

      expect(limits).toEqual(mockLimits);
    });

    it('should return empty array on error', async () => {
      mockSupabaseClient.from = vi.fn(() => ({
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        order: vi.fn().mockResolvedValue({
          data: null,
          error: { message: 'Query failed' }
        })
      }));

      const limits = await rateLimiter.getCurrentLimits('user123');

      expect(limits).toEqual([]);
    });
  });

  describe('getDashboardStats', () => {
    it('should return comprehensive dashboard statistics', async () => {
      const mockLimits = [
        {
          endpoint: '/api/test',
          tokens: 75,
          max_tokens: 100,
          last_refill: new Date('2024-01-01T00:00:00Z')
        }
      ];

      const mockViolations = [
        { endpoint: '/api/test', created_at: new Date().toISOString() },
        { endpoint: '/api/test', created_at: new Date().toISOString() },
        { endpoint: '/api/other', created_at: new Date().toISOString() }
      ];

      mockSupabaseClient.from = vi.fn((table: string) => {
        if (table === 'rate_limits') {
          return {
            select: vi.fn().mockReturnThis(),
            order: vi.fn().mockResolvedValue({ data: mockLimits, error: null })
          };
        }
        if (table === 'rate_limit_violations') {
          return {
            select: vi.fn().mockReturnThis(),
            gte: vi.fn().mockResolvedValue({ data: mockViolations, error: null })
          };
        }
      });

      const stats = await rateLimiter.getDashboardStats();

      expect(stats.active_limits).toHaveLength(1);
      expect(stats.active_limits[0].usage_percentage).toBe(75);
      expect(stats.total_blocked_today).toBe(3);
      expect(stats.most_active_endpoint).toBe('/api/test');
      expect(stats.system_health).toBe('warning');
    });

    it('should return default values on error', async () => {
      mockSupabaseClient.from = vi.fn(() => ({
        select: vi.fn().mockReturnThis(),
        order: vi.fn().mockRejectedValue(new Error('Database error'))
      }));

      const stats = await rateLimiter.getDashboardStats();

      expect(stats).toEqual({
        active_limits: [],
        total_blocked_today: 0,
        most_active_endpoint: 'N/A',
        system_health: 'healthy'
      });
    });
  });

  describe('setFailOpen', () => {
    it('should update fail open mode', () => {
      rateLimiter.setFailOpen(false);
      rateLimiter.setFailOpen(true);
    });
  });
});
