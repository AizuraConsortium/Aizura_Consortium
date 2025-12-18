import { describe, it, expect, beforeEach, vi } from 'vitest';
import express, { Request, Response, NextFunction } from 'express';
import { createRateLimit } from '../../../backend/src/middleware/validation';
import { RateLimiterService } from '../../../backend/src/services/rateLimiter';

vi.mock('../../../backend/src/services/rateLimiter');

describe('Rate Limit Middleware Integration', () => {
  let app: express.Application;
  let mockRateLimiter: any;

  beforeEach(() => {
    app = express();
    app.use(express.json());

    mockRateLimiter = {
      checkLimit: vi.fn(),
      logViolation: vi.fn()
    };

    vi.mocked(RateLimiterService.getInstance).mockReturnValue(mockRateLimiter);
  });

  describe('createRateLimit middleware', () => {
    it('should allow request when under rate limit', async () => {
      mockRateLimiter.checkLimit.mockResolvedValue({
        allowed: true,
        remaining: 50,
        resetAt: new Date(Date.now() + 60000),
        limit: 100
      });

      app.get('/test', createRateLimit('GET:/test'), (req: Request, res: Response) => {
        res.json({ success: true });
      });

      const mockReq = {
        method: 'GET',
        path: '/test',
        ip: '127.0.0.1',
        headers: {}
      } as Request;
      const mockRes = {
        status: vi.fn().mockReturnThis(),
        json: vi.fn().mockReturnThis(),
        set: vi.fn().mockReturnThis()
      } as unknown as Response;
      const mockNext = vi.fn() as NextFunction;

      const middleware = createRateLimit('GET:/test');
      await middleware(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalled();
      expect(mockRes.set).toHaveBeenCalledWith('X-RateLimit-Limit', '100');
      expect(mockRes.set).toHaveBeenCalledWith('X-RateLimit-Remaining', '50');
      expect(mockRes.set).toHaveBeenCalledWith('X-RateLimit-Reset', expect.any(String));
    });

    it('should block request when over rate limit', async () => {
      mockRateLimiter.checkLimit.mockResolvedValue({
        allowed: false,
        remaining: 0,
        resetAt: new Date(Date.now() + 60000),
        limit: 100
      });

      const mockReq = {
        method: 'GET',
        path: '/test',
        ip: '127.0.0.1',
        headers: {}
      } as Request;
      const mockRes = {
        status: vi.fn().mockReturnThis(),
        json: vi.fn().mockReturnThis(),
        set: vi.fn().mockReturnThis()
      } as unknown as Response;
      const mockNext = vi.fn() as NextFunction;

      const middleware = createRateLimit('GET:/test');
      await middleware(mockReq, mockRes, mockNext);

      expect(mockNext).not.toHaveBeenCalled();
      expect(mockRes.status).toHaveBeenCalledWith(429);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'Rate limit exceeded',
        retryAfter: expect.any(Number)
      });
      expect(mockRateLimiter.logViolation).toHaveBeenCalled();
    });

    it('should use IP address as identifier when no auth header present', async () => {
      mockRateLimiter.checkLimit.mockResolvedValue({
        allowed: true,
        remaining: 50,
        resetAt: new Date(Date.now() + 60000),
        limit: 100
      });

      const mockReq = {
        method: 'GET',
        path: '/test',
        ip: '192.168.1.100',
        headers: {}
      } as Request;
      const mockRes = {
        status: vi.fn().mockReturnThis(),
        json: vi.fn().mockReturnThis(),
        set: vi.fn().mockReturnThis()
      } as unknown as Response;
      const mockNext = vi.fn() as NextFunction;

      const middleware = createRateLimit('GET:/test');
      await middleware(mockReq, mockRes, mockNext);

      expect(mockRateLimiter.checkLimit).toHaveBeenCalledWith(
        '192.168.1.100',
        'GET:/test',
        expect.any(Number),
        expect.any(Number)
      );
    });

    it('should use auth token as identifier when present', async () => {
      mockRateLimiter.checkLimit.mockResolvedValue({
        allowed: true,
        remaining: 50,
        resetAt: new Date(Date.now() + 60000),
        limit: 100
      });

      const mockReq = {
        method: 'GET',
        path: '/test',
        ip: '192.168.1.100',
        headers: {
          authorization: 'Bearer test-token-123'
        }
      } as Request;
      const mockRes = {
        status: vi.fn().mockReturnThis(),
        json: vi.fn().mockReturnThis(),
        set: vi.fn().mockReturnThis()
      } as unknown as Response;
      const mockNext = vi.fn() as NextFunction;

      const middleware = createRateLimit('GET:/test');
      await middleware(mockReq, mockRes, mockNext);

      expect(mockRateLimiter.checkLimit).toHaveBeenCalledWith(
        expect.stringContaining('test-token-123'),
        'GET:/test',
        expect.any(Number),
        expect.any(Number)
      );
    });

    it('should log user agent and IP with violation', async () => {
      mockRateLimiter.checkLimit.mockResolvedValue({
        allowed: false,
        remaining: 0,
        resetAt: new Date(Date.now() + 60000),
        limit: 100
      });

      const mockReq = {
        method: 'GET',
        path: '/test',
        ip: '192.168.1.100',
        headers: {
          'user-agent': 'TestBot/1.0'
        }
      } as Request;
      const mockRes = {
        status: vi.fn().mockReturnThis(),
        json: vi.fn().mockReturnThis(),
        set: vi.fn().mockReturnThis()
      } as unknown as Response;
      const mockNext = vi.fn() as NextFunction;

      const middleware = createRateLimit('GET:/test');
      await middleware(mockReq, mockRes, mockNext);

      expect(mockRateLimiter.logViolation).toHaveBeenCalledWith({
        identifier: '192.168.1.100',
        endpoint: 'GET:/test',
        tokensRequested: expect.any(Number),
        userAgent: 'TestBot/1.0',
        ipAddress: '192.168.1.100'
      });
    });

    it('should include Retry-After header in rate limit response', async () => {
      const resetTime = new Date(Date.now() + 120000);
      mockRateLimiter.checkLimit.mockResolvedValue({
        allowed: false,
        remaining: 0,
        resetAt: resetTime,
        limit: 100
      });

      const mockReq = {
        method: 'GET',
        path: '/test',
        ip: '127.0.0.1',
        headers: {}
      } as Request;
      const mockRes = {
        status: vi.fn().mockReturnThis(),
        json: vi.fn().mockReturnThis(),
        set: vi.fn().mockReturnThis()
      } as unknown as Response;
      const mockNext = vi.fn() as NextFunction;

      const middleware = createRateLimit('GET:/test');
      await middleware(mockReq, mockRes, mockNext);

      expect(mockRes.set).toHaveBeenCalledWith('Retry-After', expect.any(String));
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'Rate limit exceeded',
        retryAfter: expect.any(Number)
      });
    });

    it('should handle rate limiter errors gracefully', async () => {
      mockRateLimiter.checkLimit.mockRejectedValue(new Error('Database error'));

      const mockReq = {
        method: 'GET',
        path: '/test',
        ip: '127.0.0.1',
        headers: {}
      } as Request;
      const mockRes = {
        status: vi.fn().mockReturnThis(),
        json: vi.fn().mockReturnThis(),
        set: vi.fn().mockReturnThis()
      } as unknown as Response;
      const mockNext = vi.fn() as NextFunction;

      const middleware = createRateLimit('GET:/test');
      await middleware(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalled();
    });
  });

  describe('Different endpoint configurations', () => {
    it('should apply different limits to different endpoints', async () => {
      mockRateLimiter.checkLimit.mockResolvedValue({
        allowed: true,
        remaining: 50,
        resetAt: new Date(Date.now() + 60000),
        limit: 100
      });

      const mockReq1 = {
        method: 'GET',
        path: '/api/public',
        ip: '127.0.0.1',
        headers: {}
      } as Request;

      const mockReq2 = {
        method: 'POST',
        path: '/api/expensive',
        ip: '127.0.0.1',
        headers: {}
      } as Request;

      const mockRes = {
        status: vi.fn().mockReturnThis(),
        json: vi.fn().mockReturnThis(),
        set: vi.fn().mockReturnThis()
      } as unknown as Response;
      const mockNext = vi.fn() as NextFunction;

      const middleware1 = createRateLimit('GET:/api/public');
      await middleware1(mockReq1, mockRes, mockNext);

      const middleware2 = createRateLimit('POST:/api/expensive');
      await middleware2(mockReq2, mockRes, mockNext);

      expect(mockRateLimiter.checkLimit).toHaveBeenCalledWith(
        expect.any(String),
        'GET:/api/public',
        expect.any(Number),
        expect.any(Number)
      );

      expect(mockRateLimiter.checkLimit).toHaveBeenCalledWith(
        expect.any(String),
        'POST:/api/expensive',
        expect.any(Number),
        expect.any(Number)
      );
    });
  });

  describe('Concurrent request handling', () => {
    it('should handle multiple concurrent requests', async () => {
      mockRateLimiter.checkLimit.mockResolvedValue({
        allowed: true,
        remaining: 50,
        resetAt: new Date(Date.now() + 60000),
        limit: 100
      });

      const middleware = createRateLimit('GET:/test');

      const requests = Array.from({ length: 10 }, (_, i) => ({
        method: 'GET',
        path: '/test',
        ip: `192.168.1.${i}`,
        headers: {}
      } as Request));

      const mockRes = {
        status: vi.fn().mockReturnThis(),
        json: vi.fn().mockReturnThis(),
        set: vi.fn().mockReturnThis()
      } as unknown as Response;
      const mockNext = vi.fn() as NextFunction;

      await Promise.all(
        requests.map(req => middleware(req, mockRes, mockNext))
      );

      expect(mockRateLimiter.checkLimit).toHaveBeenCalledTimes(10);
      expect(mockNext).toHaveBeenCalledTimes(10);
    });
  });

  describe('Edge cases', () => {
    it('should handle missing IP address', async () => {
      mockRateLimiter.checkLimit.mockResolvedValue({
        allowed: true,
        remaining: 50,
        resetAt: new Date(Date.now() + 60000),
        limit: 100
      });

      const mockReq = {
        method: 'GET',
        path: '/test',
        ip: undefined,
        headers: {}
      } as Request;
      const mockRes = {
        status: vi.fn().mockReturnThis(),
        json: vi.fn().mockReturnThis(),
        set: vi.fn().mockReturnThis()
      } as unknown as Response;
      const mockNext = vi.fn() as NextFunction;

      const middleware = createRateLimit('GET:/test');
      await middleware(mockReq, mockRes, mockNext);

      expect(mockRateLimiter.checkLimit).toHaveBeenCalledWith(
        expect.any(String),
        'GET:/test',
        expect.any(Number),
        expect.any(Number)
      );
      expect(mockNext).toHaveBeenCalled();
    });

    it('should handle malformed authorization header', async () => {
      mockRateLimiter.checkLimit.mockResolvedValue({
        allowed: true,
        remaining: 50,
        resetAt: new Date(Date.now() + 60000),
        limit: 100
      });

      const mockReq = {
        method: 'GET',
        path: '/test',
        ip: '127.0.0.1',
        headers: {
          authorization: 'InvalidFormat'
        }
      } as Request;
      const mockRes = {
        status: vi.fn().mockReturnThis(),
        json: vi.fn().mockReturnThis(),
        set: vi.fn().mockReturnThis()
      } as unknown as Response;
      const mockNext = vi.fn() as NextFunction;

      const middleware = createRateLimit('GET:/test');
      await middleware(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalled();
    });
  });
});
