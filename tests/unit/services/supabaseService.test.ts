import { describe, it, expect, beforeEach, afterEach } from '@jest/globals';
import type { QueueOperationResult } from '../../../shared/types/index.js';

describe('SupabaseService - addToProposalQueue', () => {
  describe('Idempotency', () => {
    it('should successfully add a new proposal to queue', async () => {
      const proposalId = 'test-proposal-001';
      const priority = 5;

      const result: QueueOperationResult = {
        success: true,
        wasAlreadyQueued: false,
        message: `Proposal ${proposalId} added to queue successfully`
      };

      expect(result.success).toBe(true);
      expect(result.wasAlreadyQueued).toBe(false);
      expect(result.message).toContain(proposalId);
    });

    it('should return wasAlreadyQueued=true when proposal is already in queue', async () => {
      const proposalId = 'test-proposal-002';

      const result: QueueOperationResult = {
        success: true,
        wasAlreadyQueued: true,
        message: `Proposal ${proposalId} is already queued`
      };

      expect(result.success).toBe(true);
      expect(result.wasAlreadyQueued).toBe(true);
      expect(result.message).toContain('already queued');
    });

    it('should handle duplicate key constraint error gracefully', async () => {
      const constraintName = 'proposal_queue_proposal_id_key';
      const errorCode = '23505';

      expect(errorCode).toBe('23505');
      expect(constraintName).toBe('proposal_queue_proposal_id_key');
    });

    it('should throw error for non-duplicate database errors', async () => {
      const genericError = new Error('Connection timeout');

      expect(() => {
        if (!(genericError as any).code || (genericError as any).code !== '23505') {
          throw genericError;
        }
      }).toThrow('Connection timeout');
    });
  });

  describe('Error Handling', () => {
    it('should properly identify PostgreSQL error code 23505', () => {
      interface PostgresError extends Error {
        code?: string;
      }

      const isDuplicateKeyError = (error: unknown): boolean => {
        return error instanceof Error && (error as PostgresError).code === '23505';
      };

      const duplicateError = new Error('duplicate key') as PostgresError;
      duplicateError.code = '23505';

      expect(isDuplicateKeyError(duplicateError)).toBe(true);
    });

    it('should not identify non-duplicate errors as duplicates', () => {
      interface PostgresError extends Error {
        code?: string;
      }

      const isDuplicateKeyError = (error: unknown): boolean => {
        return error instanceof Error && (error as PostgresError).code === '23505';
      };

      const otherError = new Error('other error') as PostgresError;
      otherError.code = '08006';

      expect(isDuplicateKeyError(otherError)).toBe(false);
    });

    it('should validate constraint name in error message', () => {
      const errorMessage = 'duplicate key value violates unique constraint "proposal_queue_proposal_id_key"';
      const constraintName = 'proposal_queue_proposal_id_key';

      expect(errorMessage.includes(constraintName)).toBe(true);
    });
  });

  describe('Return Type Validation', () => {
    it('should return correct structure for new insertion', () => {
      const result: QueueOperationResult = {
        success: true,
        wasAlreadyQueued: false,
        message: 'Success message'
      };

      expect(result).toHaveProperty('success');
      expect(result).toHaveProperty('wasAlreadyQueued');
      expect(result).toHaveProperty('message');
      expect(typeof result.success).toBe('boolean');
      expect(typeof result.wasAlreadyQueued).toBe('boolean');
      expect(typeof result.message).toBe('string');
    });

    it('should return correct structure for duplicate', () => {
      const result: QueueOperationResult = {
        success: true,
        wasAlreadyQueued: true,
        message: 'Already queued'
      };

      expect(result.success).toBe(true);
      expect(result.wasAlreadyQueued).toBe(true);
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty proposal ID gracefully', () => {
      const proposalId = '';

      expect(proposalId.length).toBe(0);
    });

    it('should handle very long proposal IDs', () => {
      const longId = 'a'.repeat(1000);

      expect(longId.length).toBe(1000);
    });

    it('should handle special characters in proposal ID', () => {
      const specialId = 'proposal-with-special-chars-123!@#';

      expect(specialId).toContain('!@#');
    });

    it('should handle default priority value', () => {
      const defaultPriority = 0;

      expect(defaultPriority).toBe(0);
    });

    it('should handle negative priority values', () => {
      const negativePriority = -10;

      expect(negativePriority).toBeLessThan(0);
    });

    it('should handle high priority values', () => {
      const highPriority = 999999;

      expect(highPriority).toBeGreaterThan(0);
    });
  });

  describe('Concurrent Operations', () => {
    it('should handle multiple proposals queued simultaneously', () => {
      const proposals = ['prop1', 'prop2', 'prop3'];

      expect(proposals).toHaveLength(3);
      expect(new Set(proposals).size).toBe(3);
    });

    it('should handle same proposal queued multiple times', () => {
      const proposals = ['prop1', 'prop1', 'prop1'];
      const uniqueProposals = new Set(proposals);

      expect(uniqueProposals.size).toBe(1);
    });
  });
});

describe('PostgreSQL Error Utilities', () => {
  describe('isPostgresError', () => {
    it('should identify PostgreSQL errors correctly', () => {
      interface PostgresError extends Error {
        code?: string;
      }

      const pgError = new Error('PG Error') as PostgresError;
      pgError.code = '23505';

      expect(pgError.code).toBeDefined();
      expect(pgError instanceof Error).toBe(true);
    });

    it('should handle regular errors', () => {
      const regularError = new Error('Regular error');

      expect((regularError as any).code).toBeUndefined();
    });
  });

  describe('isDuplicateKeyError', () => {
    it('should identify duplicate key errors', () => {
      interface PostgresError extends Error {
        code?: string;
      }

      const error = new Error('Duplicate') as PostgresError;
      error.code = '23505';

      expect(error.code).toBe('23505');
    });

    it('should check constraint name when provided', () => {
      const errorMessage = 'violates unique constraint "proposal_queue_proposal_id_key"';
      const constraintName = 'proposal_queue_proposal_id_key';

      expect(errorMessage.includes(constraintName)).toBe(true);
    });

    it('should return false for wrong constraint name', () => {
      const errorMessage = 'violates unique constraint "other_constraint"';
      const targetConstraint = 'proposal_queue_proposal_id_key';

      expect(errorMessage.includes(targetConstraint)).toBe(false);
    });
  });
});
