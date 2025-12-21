/**
 * Website Realtime Repository
 *
 * Handles Supabase realtime subscriptions for the public website backend.
 * Uses anon-key Supabase client for proper RLS enforcement on realtime events.
 * Manages channel lifecycle and provides clean subscription/unsubscription APIs.
 *
 * Security Context: ANON_KEY (read-only, RLS enforced)
 */

import { websiteSupabase } from '../config/supabaseWebsiteClient.js';
import type { RealtimeChannel } from '@supabase/supabase-js';
import type { Message } from '../../../shared/types/index.js';

/**
 * RealtimeRepository manages Supabase realtime subscriptions
 *
 * Maintains a map of active channels for proper cleanup and prevents duplicate subscriptions.
 *
 * @example
 * const realtimeRepo = new RealtimeRepository();
 *
 * // Subscribe to topic
 * await realtimeRepo.subscribeToTopicMessages(
 *   'topic-123',
 *   (message) => console.log('New message:', message),
 *   (update) => console.log('Topic updated:', update)
 * );
 *
 * // Cleanup when done
 * await realtimeRepo.unsubscribe('topic-123');
 */
export class RealtimeRepository {
  private channels: Map<string, RealtimeChannel> = new Map();

  /**
   * Subscribes to real-time updates for a specific topic
   *
   * Listens for:
   * - INSERT events on messages table (filtered by topic_id, only selected=true)
   * - UPDATE events on topics table (filtered by topic_id)
   *
   * @param {string} topicId - The topic UUID to subscribe to
   * @param {Function} onMessageInsert - Callback when a new message is inserted
   * @param {Function} onTopicUpdate - Callback when the topic is updated
   * @returns {Promise<RealtimeChannel>} The created channel for advanced usage
   * @throws {Error} If subscription fails
   * @example
   * await realtimeRepo.subscribeToTopicMessages(
   *   'topic-123',
   *   (message) => {
   *     console.log(`New message from ${message.agent_id}`);
   *   },
   *   (update) => {
   *     console.log(`Topic state changed to ${update.state}`);
   *   }
   * );
   */
  async subscribeToTopicMessages(
    topicId: string,
    onMessageInsert: (message: Message) => void,
    onTopicUpdate: (update: any) => void
  ): Promise<RealtimeChannel> {
    if (this.channels.has(topicId)) {
      await this.unsubscribe(topicId);
    }

    const channel = websiteSupabase.channel(`topic:${topicId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `topic_id=eq.${topicId}`
        },
        (payload) => {
          const message = payload.new as Message;
          if (message.selected) {
            onMessageInsert(message);
          }
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'topics',
          filter: `id=eq.${topicId}`
        },
        (payload) => {
          onTopicUpdate(payload.new);
        }
      )
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          console.log(`[RealtimeRepository] Subscribed to topic:${topicId}`);
        } else if (status === 'CHANNEL_ERROR') {
          console.error(`[RealtimeRepository] Error subscribing to topic:${topicId}`);
        } else if (status === 'TIMED_OUT') {
          console.error(`[RealtimeRepository] Subscription timeout for topic:${topicId}`);
        }
      });

    this.channels.set(topicId, channel);
    return channel;
  }

  /**
   * Unsubscribes from real-time updates for a specific topic
   *
   * @param {string} topicId - The topic UUID to unsubscribe from
   * @returns {Promise<void>}
   * @example
   * await realtimeRepo.unsubscribe('topic-123');
   */
  async unsubscribe(topicId: string): Promise<void> {
    const channel = this.channels.get(topicId);
    if (channel) {
      await websiteSupabase.removeChannel(channel);
      this.channels.delete(topicId);
      console.log(`[RealtimeRepository] Unsubscribed from topic:${topicId}`);
    }
  }

  /**
   * Unsubscribes from all active channels
   *
   * Useful for cleanup when shutting down the service or during testing.
   *
   * @returns {Promise<void>}
   * @example
   * // Cleanup all subscriptions
   * await realtimeRepo.unsubscribeAll();
   */
  async unsubscribeAll(): Promise<void> {
    const unsubscribePromises = Array.from(this.channels.keys()).map(topicId =>
      this.unsubscribe(topicId)
    );
    await Promise.all(unsubscribePromises);
    console.log('[RealtimeRepository] Unsubscribed from all channels');
  }

  /**
   * Returns the number of active subscriptions
   *
   * @returns {number} Count of active channels
   */
  getActiveSubscriptionCount(): number {
    return this.channels.size;
  }

  /**
   * Checks if a topic has an active subscription
   *
   * @param {string} topicId - The topic UUID to check
   * @returns {boolean} True if subscribed, false otherwise
   */
  isSubscribed(topicId: string): boolean {
    return this.channels.has(topicId);
  }
}
