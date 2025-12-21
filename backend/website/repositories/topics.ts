/**
 * Website Topics Repository
 *
 * Handles all topic-related database queries for the public website backend.
 * Uses anon-key Supabase client for read-only access with proper RLS policies.
 *
 * Security Context: ANON_KEY (read-only, RLS enforced)
 */

import { getById, query } from './queryBuilder.js';
import type { Topic } from '../../../shared/types/index.js';

/**
 * Retrieves the current active topic
 *
 * Returns the most recent topic that has not ended (ended_at IS NULL).
 * Used by the website to display real-time consortium activity.
 *
 * @returns {Promise<Topic | null>} The current active topic or null if none exists
 * @throws {Error} If database query fails
 * @example
 * const topic = await getCurrentTopic();
 * if (topic) {
 *   console.log(`Active topic: ${topic.title}`);
 * }
 */
export async function getCurrentTopic(): Promise<Topic | null> {
  const { data, error } = await query('topics')
    .select('*')
    .is('ended_at', null)
    .order('started_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) throw error;
  return data;
}

/**
 * Retrieves a specific topic by ID
 *
 * @param {string} topicId - The topic UUID
 * @returns {Promise<Topic | null>} The requested topic or null if not found
 * @example
 * const topic = await getTopic('abc-123');
 */
export async function getTopic(topicId: string): Promise<Topic | null> {
  try {
    return await getById<Topic>('topics', topicId);
  } catch (error) {
    return null;
  }
}
