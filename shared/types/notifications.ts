export type NotificationType =
  | 'governance_new_proposal'
  | 'governance_vote_started'
  | 'governance_vote_ending'
  | 'governance_vote_passed'
  | 'governance_vote_failed'
  | 'governance_executed'
  | 'launchpad_proposal_published'
  | 'launchpad_voting_started'
  | 'launchpad_voting_ending'
  | 'launchpad_approved'
  | 'launchpad_rejected'
  | 'launchpad_in_development'
  | 'launchpad_launched'
  | 'launchpad_profitable'
  | 'voting_confirmation'
  | 'voting_reminder'
  | 'voting_outcome'
  | 'rewards_distributed'
  | 'rewards_available'
  | 'rewards_vesting_milestone'
  | 'rewards_airdrop_eligible'
  | 'rewards_airdrop_available'
  | 'ecosystem_business_launched'
  | 'ecosystem_business_profitable'
  | 'ecosystem_milestone'
  | 'security_wallet_connected'
  | 'security_wallet_disconnected'
  | 'security_network_change'
  | 'security_suspicious_activity'
  | 'security_platform_update';

export type NotificationPriority = 'critical' | 'high' | 'medium' | 'low';

export type NotificationCategory =
  | 'governance'
  | 'launchpad'
  | 'voting'
  | 'rewards'
  | 'ecosystem'
  | 'security';

export type NotificationChannel = 'in_app' | 'email' | 'push';

export interface Notification {
  id: string;
  user_id: string;
  type: NotificationType;
  priority: NotificationPriority;
  title: string;
  message: string;
  action_url?: string;
  action_label?: string;
  metadata: Record<string, unknown>;
  read_at?: string;
  archived_at?: string;
  delivered_channels: NotificationChannel[];
  created_at: string;
}

export interface NotificationPreference {
  id: string;
  user_id: string;
  category: NotificationCategory;
  in_app_enabled: boolean;
  email_enabled: boolean;
  push_enabled: boolean;
  updated_at: string;
}

export interface NotificationLog {
  id: string;
  notification_id: string;
  user_id: string;
  action: 'created' | 'read' | 'archived' | 'delivered';
  channel?: NotificationChannel;
  metadata: Record<string, unknown>;
  created_at: string;
}

export interface CreateNotificationPayload {
  user_id: string;
  type: NotificationType;
  priority?: NotificationPriority;
  title: string;
  message: string;
  action_url?: string;
  action_label?: string;
  metadata?: Record<string, unknown>;
  delivered_channels?: NotificationChannel[];
}

export interface NotificationFilters {
  type?: NotificationType;
  priority?: NotificationPriority;
  category?: NotificationCategory;
  read?: boolean;
  archived?: boolean;
  limit?: number;
  offset?: number;
}

export interface NotificationStats {
  total: number;
  unread: number;
  by_priority: Record<NotificationPriority, number>;
  by_category: Record<NotificationCategory, number>;
}

export const notificationCategoryMap: Record<NotificationType, NotificationCategory> = {
  governance_new_proposal: 'governance',
  governance_vote_started: 'governance',
  governance_vote_ending: 'governance',
  governance_vote_passed: 'governance',
  governance_vote_failed: 'governance',
  governance_executed: 'governance',
  launchpad_proposal_published: 'launchpad',
  launchpad_voting_started: 'launchpad',
  launchpad_voting_ending: 'launchpad',
  launchpad_approved: 'launchpad',
  launchpad_rejected: 'launchpad',
  launchpad_in_development: 'launchpad',
  launchpad_launched: 'launchpad',
  launchpad_profitable: 'launchpad',
  voting_confirmation: 'voting',
  voting_reminder: 'voting',
  voting_outcome: 'voting',
  rewards_distributed: 'rewards',
  rewards_available: 'rewards',
  rewards_vesting_milestone: 'rewards',
  rewards_airdrop_eligible: 'rewards',
  rewards_airdrop_available: 'rewards',
  ecosystem_business_launched: 'ecosystem',
  ecosystem_business_profitable: 'ecosystem',
  ecosystem_milestone: 'ecosystem',
  security_wallet_connected: 'security',
  security_wallet_disconnected: 'security',
  security_network_change: 'security',
  security_suspicious_activity: 'security',
  security_platform_update: 'security',
};

export const priorityOrder: Record<NotificationPriority, number> = {
  critical: 0,
  high: 1,
  medium: 2,
  low: 3,
};

export const categoryLabels: Record<NotificationCategory, string> = {
  governance: 'Governance',
  launchpad: 'Launchpad',
  voting: 'Voting',
  rewards: 'Rewards',
  ecosystem: 'Ecosystem',
  security: 'Security',
};

export const priorityLabels: Record<NotificationPriority, string> = {
  critical: 'Critical',
  high: 'High',
  medium: 'Medium',
  low: 'Low',
};
