import { createClient, SupabaseClient } from '@supabase/supabase-js';
import type {
  Proposal,
  Topic,
  Message,
  Plan,
  PlanRevision,
  Step,
  AgentVote,
  ArbitrationEntry,
  ProposalQueue,
  ErrorLog,
  AgentId,
  AgentRole,
  Phase,
  AgentMessage,
  AgentVoteMessage
} from '../../../shared/types/index.js';

export class SupabaseService {
  private static instance: SupabaseService | null = null;
  private client: SupabaseClient;

  private constructor() {
    const supabaseUrl = process.env.SUPABASE_URL!;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

    this.client = createClient(supabaseUrl, supabaseKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      },
      db: {
        schema: 'public'
      },
      global: {
        headers: {
          'X-Client-Info': 'aizura-consortium-backend'
        }
      }
    });
  }

  static getInstance(): SupabaseService {
    if (!SupabaseService.instance) {
      SupabaseService.instance = new SupabaseService();
    }
    return SupabaseService.instance;
  }

  async createTopic(proposalId: string): Promise<Topic> {
    const { data, error } = await this.client
      .from('topics')
      .insert({ proposal_id: proposalId, state: 'intake' })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async updateTopicState(topicId: string, state: Phase): Promise<void> {
    const { error } = await this.client
      .from('topics')
      .update({ state })
      .eq('id', topicId);

    if (error) throw error;
  }

  async endTopic(topicId: string): Promise<void> {
    const { error } = await this.client
      .from('topics')
      .update({ ended_at: new Date().toISOString(), state: 'commit' })
      .eq('id', topicId);

    if (error) throw error;
  }

  async getCurrentTopic(): Promise<Topic | null> {
    const { data, error } = await this.client
      .from('topics')
      .select('*')
      .is('ended_at', null)
      .order('started_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) throw error;
    return data;
  }

  async insertMessage(
    topicId: string,
    agentId: AgentId,
    agentRole: AgentRole,
    phase: Phase,
    importance: number,
    body: AgentMessage | AgentVoteMessage,
    selected: boolean
  ): Promise<Message> {
    const { data, error } = await this.client
      .from('messages')
      .insert({
        topic_id: topicId,
        agent_id: agentId,
        agent_role: agentRole,
        phase,
        importance,
        body,
        selected
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async getRecentMessages(topicId: string, limit: number = 20): Promise<Message[]> {
    const { data, error } = await this.client
      .from('messages')
      .select('*')
      .eq('topic_id', topicId)
      .eq('selected', true)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data || [];
  }

  async createPlan(topicId: string, title: string, initialContent: string): Promise<Plan> {
    const { data: plan, error: planError } = await this.client
      .from('plans')
      .insert({
        topic_id: topicId,
        title,
        status: 'draft'
      })
      .select()
      .single();

    if (planError) throw planError;

    const { data: revision, error: revError } = await this.client
      .from('plan_revisions')
      .insert({
        plan_id: plan.id,
        agent_id: 'chatgpt',
        op: 'upsert_section',
        path: 'root',
        content_md: initialContent,
        diff: { op: 'init', addedChars: initialContent.length }
      })
      .select()
      .single();

    if (revError) throw revError;

    const { error: updateError } = await this.client
      .from('plans')
      .update({ current_revision_id: revision.id })
      .eq('id', plan.id);

    if (updateError) throw updateError;

    return { ...plan, current_revision_id: revision.id };
  }

  async getPlan(topicId: string): Promise<Plan | null> {
    const { data, error } = await this.client
      .from('plans')
      .select('*')
      .eq('topic_id', topicId)
      .maybeSingle();

    if (error) throw error;
    return data;
  }

  async getCurrentPlanContent(topicId: string): Promise<string> {
    const plan = await this.getPlan(topicId);
    if (!plan || !plan.current_revision_id) {
      return '';
    }

    const { data, error } = await this.client
      .from('plan_revisions')
      .select('content_md')
      .eq('id', plan.current_revision_id)
      .single();

    if (error) throw error;
    return data?.content_md || '';
  }

  async addPlanRevision(
    planId: string,
    agentId: AgentId,
    op: string,
    path: string,
    contentMd: string,
    diff: any
  ): Promise<PlanRevision> {
    const { data: revision, error: revError } = await this.client
      .from('plan_revisions')
      .insert({
        plan_id: planId,
        agent_id: agentId,
        op,
        path,
        content_md: contentMd,
        diff
      })
      .select()
      .single();

    if (revError) throw revError;

    const { error: updateError } = await this.client
      .from('plans')
      .update({ current_revision_id: revision.id })
      .eq('id', planId);

    if (updateError) throw updateError;

    return revision;
  }

  async addAgentVote(
    topicId: string,
    agentId: AgentId,
    choice: 'approve' | 'reject' | 'abstain',
    rationaleMd: string,
    conditions: string[]
  ): Promise<AgentVote> {
    const { data, error } = await this.client
      .from('agent_votes')
      .insert({
        topic_id: topicId,
        agent_id: agentId,
        choice,
        rationale_md: rationaleMd,
        conditions
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async getAgentVotes(topicId: string): Promise<AgentVote[]> {
    const { data, error } = await this.client
      .from('agent_votes')
      .select('*')
      .eq('topic_id', topicId);

    if (error) throw error;
    return data || [];
  }

  async logArbitration(
    topicId: string,
    winnerMessageId: string,
    decision: any
  ): Promise<ArbitrationEntry> {
    const { data, error } = await this.client
      .from('arbitration')
      .insert({
        topic_id: topicId,
        winner_message_id: winnerMessageId,
        decision
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async getProposal(proposalId: string): Promise<Proposal> {
    const { data, error } = await this.client
      .from('proposals')
      .select('*')
      .eq('id', proposalId)
      .single();

    if (error) throw error;
    return data;
  }

  async updateProposalStatus(proposalId: string, status: string): Promise<void> {
    const { error } = await this.client
      .from('proposals')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', proposalId);

    if (error) throw error;
  }

  async markPlanAsAdopted(planId: string): Promise<void> {
    const { error } = await this.client
      .from('plans')
      .update({ status: 'adopted' })
      .eq('id', planId);

    if (error) throw error;
  }

  async addToProposalQueue(proposalId: string, priority: number = 0): Promise<void> {
    const { error } = await this.client
      .from('proposal_queue')
      .insert({
        proposal_id: proposalId,
        priority,
        status: 'queued'
      });

    if (error) throw error;
  }

  async getNextQueuedProposal(): Promise<ProposalQueue | null> {
    const { data, error } = await this.client
      .from('proposal_queue')
      .select('*')
      .eq('status', 'queued')
      .order('priority', { ascending: false })
      .order('created_at', { ascending: true })
      .limit(1)
      .maybeSingle();

    if (error) throw error;

    if (!data) return null;

    // Mark as processing
    await this.client
      .from('proposal_queue')
      .update({ status: 'processing', started_at: new Date().toISOString() })
      .eq('proposal_id', data.proposal_id);

    return data;
  }

  async clearAgentVotes(topicId: string): Promise<void> {
    const { error } = await this.client
      .rpc('clear_agent_votes_for_topic', { topic_id_param: topicId });

    if (error) throw error;
  }

  async getMessagesInCurrentTick(topicId: string, agentIds: AgentId[]): Promise<Message[]> {
    const { data, error } = await this.client
      .from('messages')
      .select('*')
      .eq('topic_id', topicId)
      .in('agent_id', agentIds)
      .order('created_at', { ascending: false })
      .limit(agentIds.length);

    if (error) throw error;
    return data || [];
  }

  async markMessageAsSelected(messageId: string): Promise<void> {
    const { error } = await this.client
      .from('messages')
      .update({ selected: true })
      .eq('id', messageId);

    if (error) throw error;
  }

  async healthCheck(): Promise<{ healthy: boolean; error?: string }> {
    try {
      const { data, error } = await this.client
        .from('proposals')
        .select('id')
        .limit(1);

      if (error) {
        return { healthy: false, error: error.message };
      }

      return { healthy: true };
    } catch (error: any) {
      return { healthy: false, error: error.message };
    }
  }

  getClient(): SupabaseClient {
    return this.client;
  }
}
