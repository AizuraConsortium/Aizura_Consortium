import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { handleSupabaseQueryRequired } from '../utils/supabaseErrorHandler.js';
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
  AgentVoteMessage,
  QueueOperationResult
} from '../../../shared/types/index.js';

interface PostgresError extends Error {
  code?: string;
  details?: string;
  hint?: string;
}

function isPostgresError(error: unknown): error is PostgresError {
  return error instanceof Error && 'code' in error;
}

function isDuplicateKeyError(error: unknown, constraintName?: string): boolean {
  if (!isPostgresError(error)) return false;

  if (error.code !== '23505') return false;

  if (constraintName && error.message) {
    return error.message.includes(constraintName);
  }

  return true;
}

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
    const { data, error } = await this.client.rpc('create_plan_with_revision', {
      p_topic_id: topicId,
      p_title: title,
      p_initial_content: initialContent
    });

    if (error) throw error;
    return data as Plan;
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

  async addToProposalQueue(proposalId: string, priority: number = 0): Promise<QueueOperationResult> {
    const { error } = await this.client
      .from('proposal_queue')
      .insert({
        proposal_id: proposalId,
        priority,
        status: 'queued'
      });

    if (error) {
      if (isDuplicateKeyError(error, 'proposal_queue_proposal_id_key')) {
        return {
          success: true,
          wasAlreadyQueued: true,
          message: `Proposal ${proposalId} is already queued`
        };
      }

      throw error;
    }

    return {
      success: true,
      wasAlreadyQueued: false,
      message: `Proposal ${proposalId} added to queue successfully`
    };
  }

  async getNextQueuedProposal(): Promise<ProposalQueue | null> {
    const { data, error } = await this.client
      .rpc('get_and_lock_next_proposal');

    if (error) throw error;
    return data || null;
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

  async tryAcquireOrchestratorLock(instanceId: string, ttlSeconds: number = 120): Promise<boolean> {
    const { data, error } = await this.client
      .rpc('try_acquire_orchestrator_lock', {
        p_instance_id: instanceId,
        p_ttl_seconds: ttlSeconds
      });

    if (error) throw error;
    return data || false;
  }

  async refreshOrchestratorLock(instanceId: string, ttlSeconds: number = 120): Promise<boolean> {
    const { data, error } = await this.client
      .rpc('refresh_orchestrator_lock', {
        p_instance_id: instanceId,
        p_ttl_seconds: ttlSeconds
      });

    if (error) throw error;
    return data || false;
  }

  async releaseOrchestratorLock(instanceId: string): Promise<boolean> {
    const { data, error } = await this.client
      .rpc('release_orchestrator_lock', {
        p_instance_id: instanceId
      });

    if (error) throw error;
    return data || false;
  }

  async getOrchestratorLockStatus(): Promise<{
    isLocked: boolean;
    instanceId: string | null;
    acquiredAt?: string;
    lastHeartbeat?: string;
    expiresAt?: string;
    ageSeconds?: number;
    heartbeatAgeSeconds?: number;
    expiresInSeconds?: number;
  }> {
    const { data, error } = await this.client
      .rpc('get_orchestrator_lock_status');

    if (error) throw error;

    return {
      isLocked: data?.is_locked || false,
      instanceId: data?.instance_id || null,
      acquiredAt: data?.acquired_at,
      lastHeartbeat: data?.last_heartbeat,
      expiresAt: data?.expires_at,
      ageSeconds: data?.age_seconds,
      heartbeatAgeSeconds: data?.heartbeat_age_seconds,
      expiresInSeconds: data?.expires_in_seconds
    };
  }

  getClient(): SupabaseClient {
    return this.client;
  }
}
