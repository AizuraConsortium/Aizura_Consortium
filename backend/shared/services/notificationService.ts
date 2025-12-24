import { SupabaseClient } from '@supabase/supabase-js';
import type {
  Notification,
  NotificationPreference,
  NotificationFilters,
  CreateNotificationPayload,
  NotificationStats,
  NotificationCategory,
  NotificationChannel,
} from '../../../shared/types/notifications';
import { notificationCategoryMap } from '../../../shared/types/notifications';

export class NotificationService {
  constructor(private supabase: SupabaseClient) {}

  async createNotification(payload: CreateNotificationPayload): Promise<Notification | null> {
    const category = notificationCategoryMap[payload.type];

    const preferences = await this.getUserPreferences(payload.user_id, category);
    if (!preferences || !preferences.in_app_enabled) {
      return null;
    }

    const { data, error } = await this.supabase
      .from('notifications')
      .insert({
        user_id: payload.user_id,
        type: payload.type,
        priority: payload.priority || 'medium',
        title: payload.title,
        message: payload.message,
        action_url: payload.action_url,
        action_label: payload.action_label,
        metadata: payload.metadata || {},
        delivered_channels: payload.delivered_channels || ['in_app'],
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating notification:', error);
      return null;
    }

    await this.logAction(data.id, payload.user_id, 'created', 'in_app');

    return data as Notification;
  }

  async createBulkNotifications(payloads: CreateNotificationPayload[]): Promise<Notification[]> {
    const notifications: Notification[] = [];

    for (const payload of payloads) {
      const notification = await this.createNotification(payload);
      if (notification) {
        notifications.push(notification);
      }
    }

    return notifications;
  }

  async getUserNotifications(
    userId: string,
    filters?: NotificationFilters
  ): Promise<{ notifications: Notification[]; total: number }> {
    let query = this.supabase
      .from('notifications')
      .select('*', { count: 'exact' })
      .eq('user_id', userId);

    if (filters?.type) {
      query = query.eq('type', filters.type);
    }

    if (filters?.priority) {
      query = query.eq('priority', filters.priority);
    }

    if (filters?.read !== undefined) {
      if (filters.read) {
        query = query.not('read_at', 'is', null);
      } else {
        query = query.is('read_at', null);
      }
    }

    if (filters?.archived !== undefined) {
      if (filters.archived) {
        query = query.not('archived_at', 'is', null);
      } else {
        query = query.is('archived_at', null);
      }
    }

    query = query.order('created_at', { ascending: false });

    if (filters?.limit) {
      query = query.limit(filters.limit);
    }

    if (filters?.offset) {
      query = query.range(filters.offset, filters.offset + (filters.limit || 50) - 1);
    }

    const { data, error, count } = await query;

    if (error) {
      console.error('Error fetching notifications:', error);
      return { notifications: [], total: 0 };
    }

    return {
      notifications: (data as Notification[]) || [],
      total: count || 0,
    };
  }

  async markAsRead(notificationId: string, userId: string): Promise<boolean> {
    const { error } = await this.supabase
      .from('notifications')
      .update({ read_at: new Date().toISOString() })
      .eq('id', notificationId)
      .eq('user_id', userId);

    return !error;
  }

  async markAllAsRead(userId: string): Promise<boolean> {
    const { error } = await this.supabase
      .from('notifications')
      .update({ read_at: new Date().toISOString() })
      .eq('user_id', userId)
      .is('read_at', null);

    return !error;
  }

  async archiveNotification(notificationId: string, userId: string): Promise<boolean> {
    const { error } = await this.supabase
      .from('notifications')
      .update({ archived_at: new Date().toISOString() })
      .eq('id', notificationId)
      .eq('user_id', userId);

    return !error;
  }

  async getUnreadCount(userId: string): Promise<number> {
    const { data, error } = await this.supabase
      .rpc('get_unread_notification_count', { p_user_id: userId });

    if (error) {
      console.error('Error getting unread count:', error);
      return 0;
    }

    return data || 0;
  }

  async getNotificationStats(userId: string): Promise<NotificationStats> {
    const { data, error } = await this.supabase
      .from('notifications')
      .select('priority, type')
      .eq('user_id', userId)
      .is('archived_at', null);

    if (error || !data) {
      return {
        total: 0,
        unread: 0,
        by_priority: { critical: 0, high: 0, medium: 0, low: 0 },
        by_category: { governance: 0, launchpad: 0, voting: 0, rewards: 0, ecosystem: 0, security: 0 },
      };
    }

    const unreadCount = await this.getUnreadCount(userId);

    const byPriority: NotificationStats['by_priority'] = {
      critical: 0,
      high: 0,
      medium: 0,
      low: 0,
    };

    const byCategory: NotificationStats['by_category'] = {
      governance: 0,
      launchpad: 0,
      voting: 0,
      rewards: 0,
      ecosystem: 0,
      security: 0,
    };

    data.forEach((notification: { priority: string; type: string }) => {
      byPriority[notification.priority as keyof typeof byPriority]++;
      const category = notificationCategoryMap[notification.type as keyof typeof notificationCategoryMap];
      if (category) {
        byCategory[category]++;
      }
    });

    return {
      total: data.length,
      unread: unreadCount,
      by_priority: byPriority,
      by_category: byCategory,
    };
  }

  async getUserPreferences(userId: string, category?: NotificationCategory): Promise<NotificationPreference | null> {
    let query = this.supabase
      .from('notification_preferences')
      .select('*')
      .eq('user_id', userId);

    if (category) {
      query = query.eq('category', category);
    }

    const { data, error } = await query.maybeSingle();

    if (error) {
      console.error('Error fetching preferences:', error);
      return null;
    }

    return data as NotificationPreference | null;
  }

  async getAllUserPreferences(userId: string): Promise<NotificationPreference[]> {
    const { data, error } = await this.supabase
      .from('notification_preferences')
      .select('*')
      .eq('user_id', userId);

    if (error) {
      console.error('Error fetching all preferences:', error);
      return [];
    }

    return (data as NotificationPreference[]) || [];
  }

  async updatePreferences(
    userId: string,
    category: NotificationCategory,
    preferences: Partial<Omit<NotificationPreference, 'id' | 'user_id' | 'category'>>
  ): Promise<NotificationPreference | null> {
    const { data, error } = await this.supabase
      .from('notification_preferences')
      .update({
        ...preferences,
        updated_at: new Date().toISOString(),
      })
      .eq('user_id', userId)
      .eq('category', category)
      .select()
      .single();

    if (error) {
      console.error('Error updating preferences:', error);
      return null;
    }

    return data as NotificationPreference;
  }

  private async logAction(
    notificationId: string,
    userId: string,
    action: 'created' | 'read' | 'archived' | 'delivered',
    channel?: NotificationChannel,
    metadata?: Record<string, unknown>
  ): Promise<void> {
    await this.supabase.from('notification_logs').insert({
      notification_id: notificationId,
      user_id: userId,
      action,
      channel,
      metadata: metadata || {},
    });
  }

  async notifyGovernanceProposal(proposalId: string, title: string, userIds: string[]): Promise<void> {
    const payloads: CreateNotificationPayload[] = userIds.map((userId) => ({
      user_id: userId,
      type: 'governance_new_proposal',
      priority: 'high',
      title: 'New Governance Proposal',
      message: `A new governance proposal is live: ${title}`,
      action_url: `/governance/proposals/${proposalId}`,
      action_label: 'View Proposal',
      metadata: { proposal_id: proposalId },
    }));

    await this.createBulkNotifications(payloads);
  }

  async notifyVoteStarted(proposalId: string, title: string, userId: string): Promise<void> {
    await this.createNotification({
      user_id: userId,
      type: 'launchpad_voting_started',
      priority: 'high',
      title: 'Voting Started',
      message: `Voting has started for your proposal: ${title}`,
      action_url: `/launchpad/proposals/${proposalId}`,
      action_label: 'View Proposal',
      metadata: { proposal_id: proposalId },
    });
  }

  async notifyRewardsAvailable(userId: string, amount: string): Promise<void> {
    await this.createNotification({
      user_id: userId,
      type: 'rewards_available',
      priority: 'high',
      title: 'Rewards Available',
      message: `You have ${amount} AAIC in rewards ready to claim`,
      action_url: '/app/rewards',
      action_label: 'Claim Rewards',
      metadata: { amount },
    });
  }
}
