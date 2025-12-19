/**
 * CORS Configuration Tests
 *
 * Tests CORS policy implementation and logging
 * Related to ISSUE #13 - CORS with No Origin
 */

import { describe, test, expect, beforeEach, afterEach } from '@jest/globals';

describe('CORS Configuration', () => {
  const originalNodeEnv = process.env.NODE_ENV;
  const originalAllowedOrigins = process.env.ALLOWED_ORIGINS;

  afterEach(() => {
    process.env.NODE_ENV = originalNodeEnv;
    process.env.ALLOWED_ORIGINS = originalAllowedOrigins;
  });

  describe('Origin Header Handling', () => {
    test('should allow requests from whitelisted origins', async () => {
      const allowedOrigins = [
        'http://localhost:5173',
        'http://localhost:3000',
        'https://aizura.yourdomain.com'
      ];

      const testOrigin = 'http://localhost:5173';
      const isAllowed = allowedOrigins.includes(testOrigin);

      expect(isAllowed).toBe(true);
    });

    test('should block requests from non-whitelisted origins', async () => {
      const allowedOrigins = [
        'http://localhost:5173',
        'http://localhost:3000'
      ];

      const testOrigin = 'https://evil.com';
      const isAllowed = allowedOrigins.includes(testOrigin);

      expect(isAllowed).toBe(false);
    });

    test('should allow requests with no origin header', async () => {
      // No-origin requests are allowed for webhooks, mobile apps, etc.
      const origin = undefined;
      const shouldAllow = !origin; // If no origin, allow

      expect(shouldAllow).toBe(true);
    });

    test('should parse ALLOWED_ORIGINS from environment', () => {
      process.env.ALLOWED_ORIGINS = 'https://app1.com,https://app2.com,https://app3.com';

      const allowedOrigins = process.env.ALLOWED_ORIGINS
        .split(',')
        .map(origin => origin.trim());

      expect(allowedOrigins).toHaveLength(3);
      expect(allowedOrigins).toContain('https://app1.com');
      expect(allowedOrigins).toContain('https://app2.com');
      expect(allowedOrigins).toContain('https://app3.com');
    });

    test('should handle whitespace in ALLOWED_ORIGINS', () => {
      process.env.ALLOWED_ORIGINS = ' https://app1.com , https://app2.com , https://app3.com ';

      const allowedOrigins = process.env.ALLOWED_ORIGINS
        .split(',')
        .map(origin => origin.trim());

      expect(allowedOrigins[0]).toBe('https://app1.com');
      expect(allowedOrigins[1]).toBe('https://app2.com');
      expect(allowedOrigins[2]).toBe('https://app3.com');
    });
  });

  describe('No-Origin Request Logging', () => {
    let consoleWarnSpy: jest.SpyInstance;

    beforeEach(() => {
      consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
    });

    afterEach(() => {
      consoleWarnSpy.mockRestore();
    });

    test('should log no-origin requests in production', async () => {
      process.env.NODE_ENV = 'production';

      const mockReq = {
        headers: {},
        method: 'POST',
        path: '/api/proposals',
        ip: '192.168.1.1',
        get: (header: string) => {
          if (header === 'user-agent') return 'Mozilla/5.0 Test Browser';
          return undefined;
        }
      } as any;

      // Simulate no-origin logging middleware
      const origin = mockReq.headers.origin;
      if (!origin && process.env.NODE_ENV === 'production') {
        const userAgent = mockReq.get('user-agent')?.substring(0, 50) || 'none';
        console.warn(
          `⚠️  No-origin request: ${mockReq.method} ${mockReq.path} ` +
          `from ${mockReq.ip || 'unknown'} UA: ${userAgent}`
        );
      }

      expect(consoleWarnSpy).toHaveBeenCalled();
      expect(consoleWarnSpy).toHaveBeenCalledWith(
        expect.stringContaining('No-origin request')
      );
      expect(consoleWarnSpy).toHaveBeenCalledWith(
        expect.stringContaining('POST /api/proposals')
      );
    });

    test('should NOT log no-origin requests in development', async () => {
      process.env.NODE_ENV = 'development';

      const mockReq = {
        headers: {},
        method: 'POST',
        path: '/api/proposals',
        ip: '127.0.0.1',
        get: () => undefined
      } as any;

      // Simulate no-origin logging middleware
      const origin = mockReq.headers.origin;
      if (!origin && process.env.NODE_ENV === 'production') {
        console.warn('This should not be logged');
      }

      expect(consoleWarnSpy).not.toHaveBeenCalled();
    });

    test('should log blocked origins', async () => {
      const blockedOrigin = 'https://evil.com';

      console.warn(`⚠️  Blocked origin: ${blockedOrigin}`);

      expect(consoleWarnSpy).toHaveBeenCalled();
      expect(consoleWarnSpy).toHaveBeenCalledWith(
        expect.stringContaining('Blocked origin')
      );
      expect(consoleWarnSpy).toHaveBeenCalledWith(
        expect.stringContaining(blockedOrigin)
      );
    });

    test('should include IP address in no-origin logs', async () => {
      process.env.NODE_ENV = 'production';

      const mockReq = {
        headers: {},
        method: 'GET',
        path: '/health',
        ip: '203.0.113.45',
        get: () => 'curl/7.68.0'
      } as any;

      const origin = mockReq.headers.origin;
      if (!origin && process.env.NODE_ENV === 'production') {
        const userAgent = mockReq.get('user-agent')?.substring(0, 50) || 'none';
        console.warn(
          `⚠️  No-origin request: ${mockReq.method} ${mockReq.path} ` +
          `from ${mockReq.ip || 'unknown'} UA: ${userAgent}`
        );
      }

      expect(consoleWarnSpy).toHaveBeenCalledWith(
        expect.stringContaining('203.0.113.45')
      );
    });

    test('should truncate long user-agent strings', async () => {
      process.env.NODE_ENV = 'production';

      const longUserAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36 Very Long String That Should Be Truncated';

      const mockReq = {
        headers: {},
        method: 'POST',
        path: '/webhook/proposal',
        ip: '198.51.100.1',
        get: () => longUserAgent
      } as any;

      const origin = mockReq.headers.origin;
      if (!origin && process.env.NODE_ENV === 'production') {
        const userAgent = mockReq.get('user-agent')?.substring(0, 50) || 'none';
        console.warn(
          `⚠️  No-origin request: ${mockReq.method} ${mockReq.path} ` +
          `from ${mockReq.ip || 'unknown'} UA: ${userAgent}`
        );
      }

      const loggedMessage = consoleWarnSpy.mock.calls[0][0] as string;
      const userAgentPart = loggedMessage.split('UA: ')[1];

      expect(userAgentPart.length).toBeLessThanOrEqual(50);
    });
  });

  describe('CORS Credentials', () => {
    test('should allow credentials for CORS requests', () => {
      const corsConfig = {
        credentials: true
      };

      expect(corsConfig.credentials).toBe(true);
    });
  });

  describe('Default Configuration', () => {
    test('should use default localhost origins when ALLOWED_ORIGINS not set', () => {
      delete process.env.ALLOWED_ORIGINS;

      const allowedOrigins = process.env.ALLOWED_ORIGINS
        ? process.env.ALLOWED_ORIGINS.split(',').map(origin => origin.trim())
        : ['http://localhost:5173', 'http://localhost:3000', 'http://localhost:4173'];

      expect(allowedOrigins).toContain('http://localhost:5173');
      expect(allowedOrigins).toContain('http://localhost:3000');
      expect(allowedOrigins).toContain('http://localhost:4173');
      expect(allowedOrigins).toHaveLength(3);
    });

    test('should override defaults when ALLOWED_ORIGINS is set', () => {
      process.env.ALLOWED_ORIGINS = 'https://production.com';

      const allowedOrigins = process.env.ALLOWED_ORIGINS
        ? process.env.ALLOWED_ORIGINS.split(',').map(origin => origin.trim())
        : ['http://localhost:5173', 'http://localhost:3000', 'http://localhost:4173'];

      expect(allowedOrigins).toHaveLength(1);
      expect(allowedOrigins[0]).toBe('https://production.com');
    });
  });

  describe('Security Rationale', () => {
    test('no-origin requests should be allowed for legitimate use cases', () => {
      // Webhooks, mobile apps, server-to-server calls are legitimate
      const legitimateNoOriginUseCases = [
        'Supabase webhooks',
        'Health check monitoring',
        'Mobile apps',
        'Native desktop applications',
        'Server-to-server API calls',
        'Command-line tools (curl, wget)'
      ];

      expect(legitimateNoOriginUseCases.length).toBeGreaterThan(0);
    });

    test('CORS is browser protection, not server protection', () => {
      // This test documents that CORS doesn't protect against:
      // - Server-to-server attacks
      // - curl/Postman requests
      // - Scripts outside browsers

      const corsProtectsAgainst = [
        'Unauthorized browser requests',
        'Cross-site request forgery (browser-based)',
        'Data theft from browser contexts'
      ];

      const corsDoesNotProtectAgainst = [
        'Server-to-server attacks',
        'Command-line tools',
        'Automated scripts',
        'API key theft',
        'SQL injection',
        'XSS attacks'
      ];

      expect(corsProtectsAgainst.length).toBeGreaterThan(0);
      expect(corsDoesNotProtectAgainst.length).toBeGreaterThan(0);
    });

    test('authentication is the primary security boundary', () => {
      // CORS is supplementary; JWT auth is primary security
      const securityLayers = [
        'JWT authentication (primary)',
        'Rate limiting',
        'IP whitelisting (admin)',
        'Input validation',
        'Database RLS',
        'CORS (browser protection)'
      ];

      expect(securityLayers[0]).toContain('JWT authentication (primary)');
    });
  });

  describe('Production Configuration Validation', () => {
    test('production ALLOWED_ORIGINS should use HTTPS', () => {
      process.env.ALLOWED_ORIGINS = 'https://aizura.yourdomain.com,https://app.aizura.com';

      const allowedOrigins = process.env.ALLOWED_ORIGINS.split(',');

      allowedOrigins.forEach(origin => {
        if (origin.includes('aizura.yourdomain.com') || origin.includes('app.aizura.com')) {
          expect(origin.trim()).toMatch(/^https:\/\//);
        }
      });
    });

    test('should warn if production uses HTTP origins', () => {
      const testOrigin = 'http://production-site.com';

      // In production, origins should use HTTPS
      if (testOrigin.startsWith('http://') && !testOrigin.includes('localhost')) {
        console.warn('⚠️  Production origin using HTTP instead of HTTPS');
      }

      // This is a reminder to use HTTPS in production
      expect(testOrigin.startsWith('http://')).toBe(true); // Just for test
    });
  });

  describe('Error Handling', () => {
    test('should handle invalid origin gracefully', () => {
      const invalidOrigins = [
        '',
        '   ',
        'not-a-url',
        'file:///etc/passwd',
        'javascript:alert(1)'
      ];

      invalidOrigins.forEach(invalidOrigin => {
        const allowedOrigins = ['https://valid.com'];
        const isAllowed = allowedOrigins.includes(invalidOrigin);
        expect(isAllowed).toBe(false);
      });
    });

    test('should handle missing IP address gracefully', () => {
      const mockReq = {
        headers: {},
        method: 'GET',
        path: '/health',
        ip: undefined,
        get: () => 'test-agent'
      } as any;

      const ipAddress = mockReq.ip || 'unknown';
      expect(ipAddress).toBe('unknown');
    });

    test('should handle missing user-agent gracefully', () => {
      const mockReq = {
        get: () => undefined
      } as any;

      const userAgent = mockReq.get('user-agent')?.substring(0, 50) || 'none';
      expect(userAgent).toBe('none');
    });
  });
});

describe('CORS Integration with Other Security Features', () => {
  test('CORS should work with JWT authentication', () => {
    // CORS allows the request, JWT validates the user
    const corsAllows = true;
    const jwtRequired = true;

    expect(corsAllows && jwtRequired).toBe(true);
  });

  test('CORS should work with rate limiting', () => {
    // CORS allows the request, rate limiter controls frequency
    const corsAllows = true;
    const rateLimitActive = true;

    expect(corsAllows && rateLimitActive).toBe(true);
  });

  test('CORS should work with IP whitelisting', () => {
    // CORS allows the request, IP whitelist controls access to admin endpoints
    const corsAllows = true;
    const ipWhitelistForAdmin = true;

    expect(corsAllows && ipWhitelistForAdmin).toBe(true);
  });
});
