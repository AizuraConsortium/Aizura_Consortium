/**
 * Portfolio API Integration Tests
 *
 * Tests the portfolio API endpoints to ensure they work correctly end-to-end.
 */

import { describe, it, expect, beforeAll, afterAll } from 'vitest';

describe('Portfolio API Integration Tests', () => {
  const baseUrl = process.env.VITE_API_URL || 'http://localhost:3000/api';
  let authToken: string;

  beforeAll(async () => {
    authToken = 'test-token';
  });

  describe('GET /portfolio/overview', () => {
    it('should return portfolio overview for authenticated user', async () => {
      const response = await fetch(`${baseUrl}/portfolio/overview`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      expect(response.status).toBe(200);
      const data = await response.json();

      expect(data).toHaveProperty('total_businesses');
      expect(data).toHaveProperty('total_exposure_score');
      expect(data).toHaveProperty('total_portfolio_revenue');
      expect(data).toHaveProperty('total_users');
      expect(data).toHaveProperty('businesses');
      expect(Array.isArray(data.businesses)).toBe(true);
    });

    it('should return 401 for unauthenticated request', async () => {
      const response = await fetch(`${baseUrl}/portfolio/overview`);
      expect(response.status).toBe(401);
    });

    it('should filter by status when provided', async () => {
      const response = await fetch(`${baseUrl}/portfolio/overview?status=live`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      expect(response.status).toBe(200);
      const data = await response.json();

      data.businesses.forEach((business: any) => {
        expect(business.status).toBe('live');
      });
    });

    it('should filter by category when provided', async () => {
      const response = await fetch(`${baseUrl}/portfolio/overview?category=trading`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      expect(response.status).toBe(200);
      const data = await response.json();

      data.businesses.forEach((business: any) => {
        expect(business.category).toBe('trading');
      });
    });
  });

  describe('GET /portfolio/businesses', () => {
    it('should return paginated list of businesses', async () => {
      const response = await fetch(`${baseUrl}/portfolio/businesses?limit=5&offset=0`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      expect(response.status).toBe(200);
      const data = await response.json();

      expect(data).toHaveProperty('businesses');
      expect(data).toHaveProperty('total');
      expect(data).toHaveProperty('limit');
      expect(data).toHaveProperty('offset');
      expect(data.businesses.length).toBeLessThanOrEqual(5);
    });

    it('should sort businesses by specified field', async () => {
      const response = await fetch(`${baseUrl}/portfolio/businesses?sort=created_at&order=desc`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      expect(response.status).toBe(200);
      const data = await response.json();

      const dates = data.businesses.map((b: any) => new Date(b.created_at).getTime());
      const sortedDates = [...dates].sort((a, b) => b - a);
      expect(dates).toEqual(sortedDates);
    });

    it('should search businesses by name', async () => {
      const response = await fetch(`${baseUrl}/portfolio/businesses?search=AI`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      expect(response.status).toBe(200);
      const data = await response.json();

      data.businesses.forEach((business: any) => {
        expect(business.display_name.toLowerCase()).toContain('ai');
      });
    });
  });

  describe('GET /portfolio/businesses/:id', () => {
    it('should return business details with metrics', async () => {
      const response = await fetch(`${baseUrl}/portfolio/businesses/test-business-id`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      expect(response.status).toBe(200);
      const data = await response.json();

      expect(data).toHaveProperty('id');
      expect(data).toHaveProperty('display_name');
      expect(data).toHaveProperty('status');
      expect(data).toHaveProperty('current_metrics');
      expect(data).toHaveProperty('exposure');
    });

    it('should return 404 for non-existent business', async () => {
      const response = await fetch(`${baseUrl}/portfolio/businesses/non-existent-id`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      expect(response.status).toBe(404);
    });

    it('should return 400 for invalid UUID', async () => {
      const response = await fetch(`${baseUrl}/portfolio/businesses/invalid-uuid`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      expect(response.status).toBe(400);
    });
  });

  describe('GET /portfolio/businesses/:id/metrics', () => {
    it('should return time-series metrics for business', async () => {
      const response = await fetch(
        `${baseUrl}/portfolio/businesses/test-business-id/metrics?metric_type=revenue`,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      expect(response.status).toBe(200);
      const data = await response.json();

      expect(data).toHaveProperty('business_id');
      expect(data).toHaveProperty('metric_type');
      expect(data).toHaveProperty('data_points');
      expect(data).toHaveProperty('trend');
      expect(Array.isArray(data.data_points)).toBe(true);

      if (data.data_points.length > 0) {
        const point = data.data_points[0];
        expect(point).toHaveProperty('period_start');
        expect(point).toHaveProperty('period_end');
        expect(point).toHaveProperty('value');
      }
    });

    it('should filter metrics by date range', async () => {
      const startDate = '2024-01-01';
      const endDate = '2024-12-31';

      const response = await fetch(
        `${baseUrl}/portfolio/businesses/test-business-id/metrics?metric_type=revenue&start_date=${startDate}&end_date=${endDate}`,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      expect(response.status).toBe(200);
      const data = await response.json();

      data.data_points.forEach((point: any) => {
        const pointDate = new Date(point.period_start);
        expect(pointDate >= new Date(startDate)).toBe(true);
        expect(pointDate <= new Date(endDate)).toBe(true);
      });
    });

    it('should return 400 for invalid metric type', async () => {
      const response = await fetch(
        `${baseUrl}/portfolio/businesses/test-business-id/metrics?metric_type=invalid`,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      expect(response.status).toBe(400);
    });
  });

  describe('GET /portfolio/exposure', () => {
    it('should return user exposure breakdown', async () => {
      const response = await fetch(`${baseUrl}/portfolio/exposure`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      expect(response.status).toBe(200);
      const data = await response.json();

      expect(data).toHaveProperty('total_exposure_score');
      expect(data).toHaveProperty('by_type');
      expect(data).toHaveProperty('by_business');
      expect(Array.isArray(data.by_business)).toBe(true);
    });
  });

  describe('Error Handling', () => {
    it('should handle malformed requests gracefully', async () => {
      const response = await fetch(`${baseUrl}/portfolio/businesses?limit=invalid`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      expect(response.status).toBe(400);
    });

    it('should return proper error format', async () => {
      const response = await fetch(`${baseUrl}/portfolio/businesses/invalid-id`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      const data = await response.json();
      expect(data).toHaveProperty('error');
      expect(data.error).toHaveProperty('message');
    });
  });

  describe('Caching Headers', () => {
    it('should include cache-control headers', async () => {
      const response = await fetch(`${baseUrl}/portfolio/overview`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      expect(response.headers.has('cache-control')).toBe(true);
    });
  });

  describe('Rate Limiting', () => {
    it('should enforce rate limits on portfolio endpoints', async () => {
      const requests = Array.from({ length: 100 }, () =>
        fetch(`${baseUrl}/portfolio/overview`, {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        })
      );

      const responses = await Promise.all(requests);
      const rateLimited = responses.some((r) => r.status === 429);

      expect(rateLimited).toBe(true);
    });
  });
});
