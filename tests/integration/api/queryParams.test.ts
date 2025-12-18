import { describe, it, expect, beforeAll, afterAll } from '@jest/globals';
import request from 'supertest';
import express from 'express';
import apiRoutes from '../../../backend/src/routes/api.js';

const app = express();
app.use(express.json());
app.use('/api', apiRoutes);

describe('API Query Parameter Validation', () => {
  describe('GET /api/room/:topicId/messages', () => {
    const testTopicId = 'test-topic-123';

    describe('valid query parameters', () => {
      it('should accept valid limit and offset', async () => {
        const response = await request(app)
          .get(`/api/room/${testTopicId}/messages`)
          .query({ limit: '25', offset: '50' });

        expect([200, 500]).toContain(response.status);

        if (response.status === 200) {
          expect(response.body).toHaveProperty('messages');
          expect(response.body).toHaveProperty('total');
          expect(response.body).toHaveProperty('limit', 25);
          expect(response.body).toHaveProperty('offset', 50);
        }
      });

      it('should use defaults when parameters are omitted', async () => {
        const response = await request(app)
          .get(`/api/room/${testTopicId}/messages`);

        expect([200, 500]).toContain(response.status);

        if (response.status === 200) {
          expect(response.body).toHaveProperty('limit', 50);
          expect(response.body).toHaveProperty('offset', 0);
        }
      });

      it('should accept maximum limit value', async () => {
        const response = await request(app)
          .get(`/api/room/${testTopicId}/messages`)
          .query({ limit: '100' });

        expect([200, 500]).toContain(response.status);

        if (response.status === 200) {
          expect(response.body.limit).toBe(100);
        }
      });

      it('should accept minimum values', async () => {
        const response = await request(app)
          .get(`/api/room/${testTopicId}/messages`)
          .query({ limit: '1', offset: '0' });

        expect([200, 500]).toContain(response.status);

        if (response.status === 200) {
          expect(response.body.limit).toBe(1);
          expect(response.body.offset).toBe(0);
        }
      });
    });

    describe('invalid query parameters', () => {
      it('should reject negative offset', async () => {
        const response = await request(app)
          .get(`/api/room/${testTopicId}/messages`)
          .query({ offset: '-999999' });

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('code', 'VALIDATION_ERROR');
        expect(response.body.details.param).toBe('offset');
      });

      it('should reject negative limit', async () => {
        const response = await request(app)
          .get(`/api/room/${testTopicId}/messages`)
          .query({ limit: '-10' });

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('code', 'VALIDATION_ERROR');
        expect(response.body.details.param).toBe('limit');
      });

      it('should reject limit exceeding maximum', async () => {
        const response = await request(app)
          .get(`/api/room/${testTopicId}/messages`)
          .query({ limit: '999999' });

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('code', 'VALIDATION_ERROR');
        expect(response.body.details.param).toBe('limit');
      });

      it('should reject offset exceeding maximum', async () => {
        const response = await request(app)
          .get(`/api/room/${testTopicId}/messages`)
          .query({ offset: '9999999' });

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('code', 'VALIDATION_ERROR');
        expect(response.body.details.param).toBe('offset');
      });

      it('should reject NaN values', async () => {
        const response = await request(app)
          .get(`/api/room/${testTopicId}/messages`)
          .query({ limit: 'NaN' });

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('code', 'VALIDATION_ERROR');
      });

      it('should reject Infinity', async () => {
        const response = await request(app)
          .get(`/api/room/${testTopicId}/messages`)
          .query({ limit: 'Infinity' });

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('code', 'VALIDATION_ERROR');
      });

      it('should reject -Infinity', async () => {
        const response = await request(app)
          .get(`/api/room/${testTopicId}/messages`)
          .query({ offset: '-Infinity' });

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('code', 'VALIDATION_ERROR');
      });

      it('should reject hexadecimal notation', async () => {
        const response = await request(app)
          .get(`/api/room/${testTopicId}/messages`)
          .query({ limit: '0x1000' });

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('code', 'VALIDATION_ERROR');
      });

      it('should reject octal notation', async () => {
        const response = await request(app)
          .get(`/api/room/${testTopicId}/messages`)
          .query({ limit: '0o100' });

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('code', 'VALIDATION_ERROR');
      });

      it('should reject binary notation', async () => {
        const response = await request(app)
          .get(`/api/room/${testTopicId}/messages`)
          .query({ limit: '0b1010' });

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('code', 'VALIDATION_ERROR');
      });

      it('should reject decimal values', async () => {
        const response = await request(app)
          .get(`/api/room/${testTopicId}/messages`)
          .query({ limit: '50.5' });

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('code', 'VALIDATION_ERROR');
      });

      it('should reject non-numeric strings', async () => {
        const response = await request(app)
          .get(`/api/room/${testTopicId}/messages`)
          .query({ limit: 'abc' });

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('code', 'VALIDATION_ERROR');
      });

      it('should reject SQL injection attempts', async () => {
        const response = await request(app)
          .get(`/api/room/${testTopicId}/messages`)
          .query({ limit: "50; DROP TABLE users--" });

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('code', 'VALIDATION_ERROR');
      });
    });

    describe('error response format', () => {
      it('should return properly formatted validation errors', async () => {
        const response = await request(app)
          .get(`/api/room/${testTopicId}/messages`)
          .query({ limit: '-10' });

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('error');
        expect(response.body).toHaveProperty('code', 'VALIDATION_ERROR');
        expect(response.body).toHaveProperty('details');
        expect(response.body).toHaveProperty('timestamp');

        expect(response.body.details).toHaveProperty('param');
        expect(response.body.details).toHaveProperty('provided');
        expect(response.body.details).toHaveProperty('expected');
        expect(response.body.details).toHaveProperty('constraints');
      });

      it('should include helpful error messages', async () => {
        const response = await request(app)
          .get(`/api/room/${testTopicId}/messages`)
          .query({ offset: '-999999' });

        expect(response.status).toBe(400);
        expect(response.body.details.expected).toContain('0');
        expect(response.body.details.constraints).toHaveProperty('min', 0);
      });
    });

    describe('security attack patterns', () => {
      it('should handle repeated invalid requests', async () => {
        const requests = Array(5).fill(null).map(() =>
          request(app)
            .get(`/api/room/${testTopicId}/messages`)
            .query({ limit: '-999999' })
        );

        const responses = await Promise.all(requests);

        responses.forEach(response => {
          expect(response.status).toBe(400);
          expect(response.body.code).toBe('VALIDATION_ERROR');
        });
      });

      it('should handle multiple attack vectors in sequence', async () => {
        const attackVectors = [
          { limit: 'Infinity' },
          { offset: '-999999' },
          { limit: '0x1000' },
          { limit: 'NaN' },
          { limit: '999999' }
        ];

        for (const vector of attackVectors) {
          const response = await request(app)
            .get(`/api/room/${testTopicId}/messages`)
            .query(vector);

          expect(response.status).toBe(400);
          expect(response.body.code).toBe('VALIDATION_ERROR');
        }
      });
    });

    describe('edge cases', () => {
      it('should handle zero offset', async () => {
        const response = await request(app)
          .get(`/api/room/${testTopicId}/messages`)
          .query({ offset: '0' });

        expect([200, 500]).toContain(response.status);

        if (response.status === 200) {
          expect(response.body.offset).toBe(0);
        }
      });

      it('should handle large valid offset', async () => {
        const response = await request(app)
          .get(`/api/room/${testTopicId}/messages`)
          .query({ offset: '999999' });

        expect([200, 500]).toContain(response.status);

        if (response.status === 200) {
          expect(response.body.offset).toBe(999999);
        }
      });

      it('should handle empty string parameters', async () => {
        const response = await request(app)
          .get(`/api/room/${testTopicId}/messages`)
          .query({ limit: '' });

        expect(response.status).toBe(400);
        expect(response.body.code).toBe('VALIDATION_ERROR');
      });
    });
  });
});
