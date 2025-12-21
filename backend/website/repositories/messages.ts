/**
 * Website Messages Repository
 *
 * Handles all message-related database queries for the public website backend.
 * Uses anon-key Supabase client for read-only access with proper RLS policies.
 * Provides pagination support for efficient message loading.
 *
 * Security Context: ANON_KEY (read-only, RLS enforced)
 */

import { getById, query } from './queryBuilder.js';
import type { Message } from '../../../shared/types/index.js';

/**
 * Pagination parameters for message queries
 */
export interface Pagination {
  limit?: number;
  offset?: number;
}

/**
 * Paginated message response with metadata
 */
export interface PaginatedMessages {
  messages: Message[];
  total: number;
  hasMore: boolean;
}

/**
 * Retrieves paginated messages for a specific topic
 *
 * Only returns selected messages (selected = true) ordered chronologically.
 * Includes pagination metadata to support infinite scroll or page-based navigation.
 *
 * @param {string} topicId - The topic UUID
 * @param {Pagination} [pagination] - Optional pagination parameters (default: limit=50, offset=0)
 * @returns {Promise<PaginatedMessages>} Paginated messages with total count and hasMore flag
 * @throws {Error} If database query fails
 * @example
 * // Get first page
 * const page1 = await getTopicMessages('topic-123');
 * console.log(page1.messages.length); // Up to 50 messages
 * console.log(page1.hasMore); // true if more messages exist
 *
 * // Get next page
 * const page2 = await getTopicMessages('topic-123', { limit: 50, offset: 50 });
 */
export async function getTopicMessages(
  topicId: string,
  pagination: Pagination = {}
): Promise<PaginatedMessages> {
  const limit = pagination.limit || 50;
  const offset = pagination.offset || 0;

  const { data, error, count } = await query('messages')
    .select('*', { count: 'exact' })
    .eq('topic_id', topicId)
    .eq('selected', true)
    .order('created_at', { ascending: true })
    .range(offset, offset + limit - 1);

  if (error) throw error;

  const total = count || 0;
  const hasMore = offset + limit < total;

  return {
    messages: data || [],
    total,
    hasMore
  };
}

/**
 * Retrieves a specific message by ID
 *
 * Only returns the message if it is selected (selected = true).
 *
 * @param {string} messageId - The message UUID
 * @returns {Promise<Message | null>} The requested message or null if not found or not selected
 * @example
 * const message = await getMessageById('msg-123');
 */
export async function getMessageById(messageId: string): Promise<Message | null> {
  try {
    const { data, error } = await query('messages')
      .select('*')
      .eq('id', messageId)
      .eq('selected', true)
      .maybeSingle();

    if (error) throw error;
    return data;
  } catch (error) {
    return null;
  }
}
