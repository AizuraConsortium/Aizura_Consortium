import { create, getOne, updateById, rpc } from '../queryBuilder.js';
import type { Plan, PlanRevision, AgentId, PlanOperation } from '../../../../../shared/types/index.js';
import { getSupabaseClient } from '../client.js';

export async function createPlan(
  topicId: string,
  title: string,
  initialContent: string
): Promise<Plan> {
  return rpc<Plan>('create_plan_with_revision', {
    p_topic_id: topicId,
    p_title: title,
    p_initial_content: initialContent
  });
}

export async function getPlan(topicId: string): Promise<Plan | null> {
  return getOne<Plan>('plans', { topic_id: topicId });
}

export async function getCurrentPlanContent(topicId: string): Promise<string> {
  const plan = await getPlan(topicId);
  if (!plan || !plan.current_revision_id) {
    return '';
  }

  const { data, error } = await getSupabaseClient()
    .from('plan_revisions')
    .select('content_md')
    .eq('id', plan.current_revision_id)
    .single();

  if (error) throw error;
  return data?.content_md || '';
}

export async function addPlanRevision(
  planId: string,
  agentId: AgentId,
  op: PlanOperation,
  path: string,
  contentMd: string,
  diff: any
): Promise<PlanRevision> {
  const revision = await create<PlanRevision>('plan_revisions', {
    plan_id: planId,
    agent_id: agentId,
    op,
    path,
    content_md: contentMd,
    diff
  });

  await updateById('plans', planId, {
    current_revision_id: revision.id
  });

  return revision;
}

export async function markPlanAsAdopted(planId: string): Promise<void> {
  await updateById('plans', planId, { status: 'adopted' });
}
