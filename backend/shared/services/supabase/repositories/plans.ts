import { createQueryBuilder, type WriteQueryBuilder } from '../queryBuilderFactory.js';
import { getSupabaseClient } from '../client.js';
import type { Plan, PlanRevision, AgentId, PlanOperation } from '../../../../../shared/types/index.js';
import type { SupabaseClient } from '@supabase/supabase-js';

function createPlansRepository(client?: SupabaseClient) {
  const supabase = client || getSupabaseClient();
  const builder = createQueryBuilder(supabase, { readOnly: false }) as WriteQueryBuilder;

  async function createPlan(
    topicId: string,
    title: string,
    initialContent: string
  ): Promise<Plan> {
    return builder.rpc<Plan>('create_plan_with_revision', {
      p_topic_id: topicId,
      p_title: title,
      p_initial_content: initialContent
    });
  }

  async function getPlan(topicId: string): Promise<Plan | null> {
    return builder.getOne<Plan>('plans', { topic_id: topicId });
  }

  async function getCurrentPlanContent(topicId: string): Promise<string> {
    const plan = await getPlan(topicId);
    if (!plan || !plan.current_revision_id) {
      return '';
    }

    const { data, error } = await supabase
      .from('plan_revisions')
      .select('content_md')
      .eq('id', plan.current_revision_id)
      .single();

    if (error) throw error;
    return data?.content_md || '';
  }

  async function addPlanRevision(
    planId: string,
    agentId: AgentId,
    op: PlanOperation,
    path: string,
    contentMd: string,
    addedChars: number,
    removedChars: number
  ): Promise<PlanRevision> {
    const revision = await builder.create<PlanRevision>('plan_revisions', {
      plan_id: planId,
      agent_id: agentId,
      op,
      path,
      content_md: contentMd,
      added_chars: addedChars,
      removed_chars: removedChars
    });

    await builder.updateById('plans', planId, {
      current_revision_id: revision.id
    });

    return revision;
  }

  async function markPlanAsAdopted(planId: string): Promise<void> {
    await builder.updateById('plans', planId, { status: 'adopted' });
  }

  return {
    createPlan,
    getPlan,
    getCurrentPlanContent,
    addPlanRevision,
    markPlanAsAdopted,
  };
}

const defaultRepository = createPlansRepository();

export const {
  createPlan,
  getPlan,
  getCurrentPlanContent,
  addPlanRevision,
  markPlanAsAdopted,
} = defaultRepository;

export { createPlansRepository };
