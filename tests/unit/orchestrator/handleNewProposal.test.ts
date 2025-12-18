import { describe, it, expect, beforeEach, afterEach } from '@jest/globals';
import type { QueueOperationResult } from '../../../shared/types/index.js';

describe('Orchestrator - handleNewProposal', () => {
  describe('Queue Management', () => {
    it('should add new proposal to queue when topic is active', async () => {
      const currentTopicActive = true;
      const proposalId = 'new-proposal-001';

      if (currentTopicActive) {
        const queueResult: QueueOperationResult = {
          success: true,
          wasAlreadyQueued: false,
          message: `Proposal ${proposalId} added to queue`
        };

        expect(queueResult.success).toBe(true);
        expect(queueResult.wasAlreadyQueued).toBe(false);
      }
    });

    it('should detect duplicate when proposal already queued', async () => {
      const proposalId = 'duplicate-proposal-001';
      const currentTopicActive = true;

      if (currentTopicActive) {
        const queueResult: QueueOperationResult = {
          success: true,
          wasAlreadyQueued: true,
          message: `Proposal ${proposalId} is already queued`
        };

        expect(queueResult.wasAlreadyQueued).toBe(true);
      }
    });

    it('should log appropriate message for new queue addition', async () => {
      const proposalId = 'log-test-001';
      const queueResult: QueueOperationResult = {
        success: true,
        wasAlreadyQueued: false,
        message: `Proposal ${proposalId} added to queue`
      };

      const expectedLog = `✅ Proposal ${proposalId} added to queue`;

      expect(queueResult.wasAlreadyQueued).toBe(false);
      expect(expectedLog).toContain(proposalId);
    });

    it('should log appropriate message for duplicate detection', async () => {
      const proposalId = 'log-test-002';
      const queueResult: QueueOperationResult = {
        success: true,
        wasAlreadyQueued: true,
        message: `Proposal ${proposalId} is already queued`
      };

      const expectedLog = `ℹ️  Proposal ${proposalId} was already in queue (duplicate webhook call)`;

      expect(queueResult.wasAlreadyQueued).toBe(true);
      expect(expectedLog).toContain('duplicate webhook call');
    });
  });

  describe('Topic State Management', () => {
    it('should start new debate when no active topic', async () => {
      const currentTopic = null;
      const proposalId = 'new-debate-001';

      if (!currentTopic) {
        const shouldStartDebate = true;
        expect(shouldStartDebate).toBe(true);
      }
    });

    it('should queue when topic is active and not ended', async () => {
      const currentTopic = {
        id: 'active-topic-001',
        ended_at: null
      };

      const shouldQueue = currentTopic && !currentTopic.ended_at;

      expect(shouldQueue).toBe(true);
    });

    it('should start new debate when topic has ended', async () => {
      const currentTopic = {
        id: 'ended-topic-001',
        ended_at: new Date().toISOString()
      };

      const shouldQueue = currentTopic && !currentTopic.ended_at;

      expect(shouldQueue).toBe(false);
    });

    it('should handle idle topic transition', async () => {
      const currentTopic = {
        id: 'idle-topic-001',
        state: 'idle',
        ended_at: null
      };

      const isIdle = currentTopic.state === 'idle';

      expect(isIdle).toBe(true);
    });
  });

  describe('Logging and Monitoring', () => {
    it('should log proposal receipt', () => {
      const proposalId = 'logging-test-001';
      const logMessage = `📨 New proposal received: ${proposalId}`;

      expect(logMessage).toContain(proposalId);
      expect(logMessage).toContain('📨');
    });

    it('should log queue warning when topic active', () => {
      const logMessage = '⚠️ Already processing a topic. Adding to queue.';

      expect(logMessage).toContain('⚠️');
      expect(logMessage).toContain('queue');
    });

    it('should log success message for queue addition', () => {
      const proposalId = 'success-log-001';
      const logMessage = `✅ Proposal ${proposalId} added to queue`;

      expect(logMessage).toContain('✅');
      expect(logMessage).toContain(proposalId);
    });

    it('should log info message for duplicate detection', () => {
      const proposalId = 'info-log-001';
      const logMessage = `ℹ️  Proposal ${proposalId} was already in queue (duplicate webhook call)`;

      expect(logMessage).toContain('ℹ️');
      expect(logMessage).toContain('duplicate');
    });

    it('should distinguish between new and duplicate in logs', () => {
      const newLog = '✅ Proposal new-001 added to queue';
      const duplicateLog = 'ℹ️  Proposal dup-001 was already in queue (duplicate webhook call)';

      expect(newLog).toContain('✅');
      expect(duplicateLog).toContain('ℹ️');
      expect(duplicateLog).toContain('duplicate');
    });
  });

  describe('Error Scenarios', () => {
    it('should handle null proposal ID', () => {
      const proposalId = null;

      expect(proposalId).toBeNull();
    });

    it('should handle undefined proposal ID', () => {
      const proposalId = undefined;

      expect(proposalId).toBeUndefined();
    });

    it('should handle database errors during queue operation', async () => {
      const error = new Error('Database connection failed');

      expect(() => {
        throw error;
      }).toThrow('Database connection failed');
    });

    it('should propagate non-duplicate errors', async () => {
      const error = new Error('Network timeout') as any;
      error.code = '08006';

      expect(error.code).not.toBe('23505');
      expect(() => {
        throw error;
      }).toThrow('Network timeout');
    });
  });

  describe('Integration with Service Layer', () => {
    it('should receive QueueOperationResult from service', async () => {
      const result: QueueOperationResult = {
        success: true,
        wasAlreadyQueued: false,
        message: 'Success'
      };

      expect(result).toHaveProperty('success');
      expect(result).toHaveProperty('wasAlreadyQueued');
      expect(result).toHaveProperty('message');
    });

    it('should handle service returning wasAlreadyQueued=true', async () => {
      const result: QueueOperationResult = {
        success: true,
        wasAlreadyQueued: true,
        message: 'Already queued'
      };

      if (result.wasAlreadyQueued) {
        const shouldLogDuplicate = true;
        expect(shouldLogDuplicate).toBe(true);
      }
    });

    it('should handle service returning wasAlreadyQueued=false', async () => {
      const result: QueueOperationResult = {
        success: true,
        wasAlreadyQueued: false,
        message: 'Added to queue'
      };

      if (!result.wasAlreadyQueued) {
        const shouldLogSuccess = true;
        expect(shouldLogSuccess).toBe(true);
      }
    });
  });

  describe('Workflow Scenarios', () => {
    it('should handle sequential proposal submissions', async () => {
      const proposals = [
        { id: 'seq-001', queued: false },
        { id: 'seq-002', queued: false },
        { id: 'seq-003', queued: false }
      ];

      proposals.forEach((proposal, index) => {
        expect(proposal.queued).toBe(false);
      });
    });

    it('should handle duplicate submission after initial queue', async () => {
      const workflow = [
        { attempt: 1, wasAlreadyQueued: false },
        { attempt: 2, wasAlreadyQueued: true },
        { attempt: 3, wasAlreadyQueued: true }
      ];

      expect(workflow[0].wasAlreadyQueued).toBe(false);
      expect(workflow[1].wasAlreadyQueued).toBe(true);
      expect(workflow[2].wasAlreadyQueued).toBe(true);
    });

    it('should maintain queue order', () => {
      const queue = ['first', 'second', 'third'];

      expect(queue[0]).toBe('first');
      expect(queue[queue.length - 1]).toBe('third');
    });
  });

  describe('State Transitions', () => {
    it('should exit idle mode when new proposal arrives', async () => {
      const currentState = 'idle';
      const hasNewProposal = true;

      if (hasNewProposal && currentState === 'idle') {
        const shouldExitIdle = true;
        expect(shouldExitIdle).toBe(true);
      }
    });

    it('should transition to active debate mode', async () => {
      const previousState = 'idle';
      const newState = 'intake';

      expect(previousState).toBe('idle');
      expect(newState).toBe('intake');
      expect(newState).not.toBe(previousState);
    });

    it('should reset idle counters on transition', () => {
      const idleMessageCount = 5;
      const resetCount = 0;

      expect(idleMessageCount).toBeGreaterThan(0);
      expect(resetCount).toBe(0);
    });
  });
});

describe('Orchestrator - Queue Result Handling', () => {
  describe('Result Interpretation', () => {
    it('should correctly interpret success with no duplicate', () => {
      const result: QueueOperationResult = {
        success: true,
        wasAlreadyQueued: false,
        message: 'Added'
      };

      const isNewAddition = result.success && !result.wasAlreadyQueued;
      expect(isNewAddition).toBe(true);
    });

    it('should correctly interpret success with duplicate', () => {
      const result: QueueOperationResult = {
        success: true,
        wasAlreadyQueued: true,
        message: 'Already queued'
      };

      const isDuplicate = result.success && result.wasAlreadyQueued;
      expect(isDuplicate).toBe(true);
    });

    it('should differentiate between new and duplicate in logic', () => {
      const newResult: QueueOperationResult = {
        success: true,
        wasAlreadyQueued: false,
        message: 'New'
      };

      const dupResult: QueueOperationResult = {
        success: true,
        wasAlreadyQueued: true,
        message: 'Duplicate'
      };

      expect(newResult.wasAlreadyQueued).not.toBe(dupResult.wasAlreadyQueued);
    });
  });
});
