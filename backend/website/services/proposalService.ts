import { supabase } from '../../shared/services/supabase/client.js';
import type { Database } from '../../../shared/types/database.types.js';

type Proposal = Database['public']['Tables']['proposals']['Row'];

export class ProposalService {
  async getProposals(status?: string): Promise<Proposal[]> {
    let query = supabase
      .from('proposals')
      .select('*')
      .order('created_at', { ascending: false });

    if (status) {
      query = query.eq('status', status);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  }

  async getProposalById(id: string): Promise<Proposal | null> {
    const { data, error } = await supabase
      .from('proposals')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (error) throw error;
    return data;
  }
}
