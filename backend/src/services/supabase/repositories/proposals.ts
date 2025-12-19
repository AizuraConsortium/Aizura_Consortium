import { getById, updateById, create, rpc } from '../queryBuilder.js';
import { isDuplicateKeyError } from '../errorHandlers.js';
import type { Proposal, ProposalQueue, QueueOperationResult } from '../../../../../shared/types/index.js';

export async function getProposal(proposalId: string): Promise<Proposal> {
  return getById<Proposal>('proposals', proposalId);
}

export async function updateProposalStatus(
  proposalId: string,
  status: string
): Promise<void> {
  await updateById('proposals', proposalId, {
    status,
    updated_at: new Date().toISOString()
  });
}

export async function addToProposalQueue(
  proposalId: string,
  priority: number = 0
): Promise<QueueOperationResult> {
  try {
    await create('proposal_queue', {
      proposal_id: proposalId,
      priority,
      status: 'queued'
    });

    return {
      success: true,
      wasAlreadyQueued: false,
      message: `Proposal ${proposalId} added to queue successfully`
    };
  } catch (error) {
    if (isDuplicateKeyError(error, 'proposal_queue_proposal_id_key')) {
      return {
        success: true,
        wasAlreadyQueued: true,
        message: `Proposal ${proposalId} is already queued`
      };
    }
    throw error;
  }
}

export async function getNextQueuedProposal(): Promise<ProposalQueue | null> {
  return rpc<ProposalQueue | null>('get_and_lock_next_proposal');
}
