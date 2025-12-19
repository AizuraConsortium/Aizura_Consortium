import { supabase } from '../../shared/services/supabase/client.js';
import type { Database } from '../../shared/types/database.types.js';

type Proposal = Database['public']['Tables']['proposals']['Row'];

export class ProposalService {
  async getClientProposals(userId: string): Promise<Proposal[]> {
    const { data, error } = await supabase
      .from('proposals')
      .select('*')
      .eq('submitted_by', userId)
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
}
