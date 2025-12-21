/**
 * Website Plans Repository
 *
 * Handles all plan-related database queries for the public website backend.
 * Uses anon-key Supabase client for read-only access with proper RLS policies.
 *
 * Security Context: ANON_KEY (read-only, RLS enforced)
 */

import { getOne, getById } from './queryBuilder.js';
import type { Plan, PlanRevision } from '../../../shared/types/index.js';

/**
 * Retrieves a plan by topic ID
 *
 * @param {string} topicId - The topic UUID
 * @returns {Promise<Plan | null>} The plan associated with the topic or null if not found
 * @throws {Error} If database query fails
 * @example
 * const plan = await getPlan('topic-123');
 */
export async function getPlan(topicId: string): Promise<Plan | null> {
  return getOne<Plan>('plans', { topic_id: topicId });
}

/**
 * Retrieves the current plan content (markdown) for a topic
 *
 * Fetches the plan and its current revision content. If the plan has a
 * current_revision_id, retrieves the content_md from plan_revisions.
 *
 * @param {string} topicId - The topic UUID
 * @returns {Promise<string>} The plan content markdown or empty string if not found
 * @example
 * const content = await getPlanContent('topic-123');
 * console.log(content); // Markdown text
 */
export async function getPlanContent(topicId: string): Promise<string> {
  try {
    const plan = await getPlan(topicId);

    if (!plan || !plan.current_revision_id) {
      return '';
    }

    const revision = await getById<PlanRevision>(
      'plan_revisions',
      plan.current_revision_id
    );

    return revision?.content_md || '';
  } catch (error) {
    return '';
  }
}
