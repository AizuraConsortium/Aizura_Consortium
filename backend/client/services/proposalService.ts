import { supabase } from '../../shared/services/supabase/client.js';
import type { Database } from '../../../shared/types/database.types.js';

type Proposal = Database['public']['Tables']['proposals']['Row'];
type ProposalInsert = Database['public']['Tables']['proposals']['Insert'];
type ProposalVote = Database['public']['Tables']['proposal_votes']['Row'];

export class ProposalService {
  async getClientProposals(userId: string): Promise<Proposal[]> {
    const { data, error } = await supabase
      .from('proposals')
      .select('*')
      .eq('submitted_by', userId)
      .order('created_at', { ascending: false});

    if (error) throw error;
    return data || [];
  }

  async getAllProposals(): Promise<Proposal[]> {
    const { data, error } = await supabase
      .from('proposals')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  async getProposalById(id: string, userId: string): Promise<Proposal | null> {
    const { data, error } = await supabase
      .from('proposals')
      .select('*')
      .eq('id', id)
      .eq('submitted_by', userId)
      .maybeSingle();

    if (error) throw error;
    return data;
  }

  async createProposal(proposal: ProposalInsert): Promise<Proposal> {
    const { data, error } = await supabase
      .from('proposals')
      .insert(proposal)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async voteOnProposal(
    proposalId: string,
    userId: string,
    vote: 'for' | 'against'
  ): Promise<ProposalVote> {
    const { data, error } = await supabase
      .from('proposal_votes')
      .upsert(
        {
          proposal_id: proposalId,
          user_id: userId,
          vote,
        },
        {
          onConflict: 'proposal_id,user_id',
        }
      )
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async getUserVote(proposalId: string, userId: string): Promise<ProposalVote | null> {
    const { data, error } = await supabase
      .from('proposal_votes')
      .select('*')
      .eq('proposal_id', proposalId)
      .eq('user_id', userId)
      .maybeSingle();

    if (error) throw error;
    return data;
  }
}
