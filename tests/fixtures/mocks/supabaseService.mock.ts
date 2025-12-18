import type { QueueOperationResult } from '../../../shared/types/index.js';

export class MockSupabaseService {
  private queuedProposals: Set<string> = new Set();

  async addToProposalQueue(proposalId: string, priority: number = 0): Promise<QueueOperationResult> {
    if (this.queuedProposals.has(proposalId)) {
      return {
        success: true,
        wasAlreadyQueued: true,
        message: `Proposal ${proposalId} is already queued`
      };
    }

    this.queuedProposals.add(proposalId);
    return {
      success: true,
      wasAlreadyQueued: false,
      message: `Proposal ${proposalId} added to queue successfully`
    };
  }

  async getProposal(proposalId: string) {
    return {
      id: proposalId,
      title: 'Test Proposal',
      summary: 'Test summary',
      submitted_by: 'test@example.com',
      status: 'queued' as const,
      votes_for: 0,
      votes_against: 0,
      voting_ends_at: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
  }

  reset() {
    this.queuedProposals.clear();
  }

  getQueuedProposals(): string[] {
    return Array.from(this.queuedProposals);
  }
}

export interface PostgresError extends Error {
  code?: string;
  details?: string;
  hint?: string;
}

export function createDuplicateKeyError(constraintName: string): PostgresError {
  const error = new Error(`duplicate key value violates unique constraint "${constraintName}"`) as PostgresError;
  error.code = '23505';
  error.details = `Key (proposal_id)=(test-id) already exists.`;
  return error;
}

export function createGenericDatabaseError(): PostgresError {
  const error = new Error('Database connection failed') as PostgresError;
  error.code = '08006';
  return error;
}
