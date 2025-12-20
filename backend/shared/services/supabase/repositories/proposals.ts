import { getById, updateById, create, rpc, getMany, getOne, query } from '../queryBuilder.js';
import { isDuplicateKeyError } from '../errorHandlers.js';
import type { Proposal, ProposalQueue, QueueOperationResult } from '../../../../../shared/types/index.js';
import type { Database } from '../../../../../shared/types/database.types.js';

type ProposalInsert = Database['public']['Tables']['proposals']['Insert'];
type ProposalVote = Database['public']['Tables']['proposal_votes']['Row'];
type ProposalVoteInsert = Database['public']['Tables']['proposal_votes']['Insert'];

export async function getProposal(proposalId: string): Promise<Proposal> {
  return getById<Proposal>('proposals', proposalId);
}

export async function getProposals(status?: string): Promise<Proposal[]> {
  if (status) {
    return getMany<Proposal>('proposals', { status }, { orderBy: 'created_at', ascending: false });
  }
  return getMany<Proposal>('proposals', undefined, { orderBy: 'created_at', ascending: false });
}

export async function getProposalById(id: string): Promise<Proposal | null> {
  try {
    return await getById<Proposal>('proposals', id);
  } catch (error) {
    return null;
  }
}

export async function getClientProposals(userId: string): Promise<Proposal[]> {
  return getMany<Proposal>(
    'proposals',
    { submitted_by: userId },
    { orderBy: 'created_at', ascending: false }
  );
}

export async function getProposalByIdForUser(id: string, userId: string): Promise<Proposal | null> {
  return getOne<Proposal>('proposals', { id, submitted_by: userId });
}

export async function createProposal(data: ProposalInsert): Promise<Proposal> {
  return create<Proposal>('proposals', data);
}

export async function voteOnProposal(
  proposalId: string,
  userId: string,
  vote: 'for' | 'against'
): Promise<ProposalVote> {
  const voteData: ProposalVoteInsert = {
    proposal_id: proposalId,
    user_id: userId,
    vote,
  };

  const { data, error } = await query('proposal_votes')
    .upsert(voteData, { onConflict: 'proposal_id,user_id' })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getUserVote(proposalId: string, userId: string): Promise<ProposalVote | null> {
  return getOne<ProposalVote>('proposal_votes', { proposal_id: proposalId, user_id: userId });
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
