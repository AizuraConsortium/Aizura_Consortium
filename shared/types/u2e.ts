/**
 * U2E (Use-to-Earn) Type Definitions
 *
 * These types are shared between frontend and backend
 * to ensure type safety across the entire U2E system.
 */

export type U2ESystemStatus = 'active' | 'inactive' | 'paused';

export type IntegrationType = 'webhook' | 'manual' | 'api';

export type PeriodType = 'daily' | 'weekly' | 'monthly';

export type RewardClaimStatus = 'pending' | 'approved' | 'distributed' | 'failed' | 'cancelled';

export type RewardClaimPeriod = 'year_0_2' | 'year_2_4' | 'year_4_plus';

export type ActionType =
  | 'trade_executed'
  | 'stop_loss_triggered'
  | 'take_profit_hit'
  | 'portfolio_view'
  | 'api_call'
  | 'bot_created'
  | 'bot_deployed'
  | 'document_generated'
  | 'page_created'
  | 'deployment'
  | string;

export interface U2ESystemConfig {
  id: string;
  is_active: boolean;
  activation_date: string | null;
  deactivation_date: string | null;
  global_multiplier: number;
  min_payout_threshold: number;
  settings: Record<string, any>;
  updated_by: string | null;
  updated_at: string;
  created_at: string;
}

export interface U2EBusiness {
  id: string;
  business_name: string;
  display_name: string;
  description: string | null;
  is_active: boolean;
  integration_type: IntegrationType;
  webhook_url: string | null;
  api_key_hash: string | null;
  logo_url: string | null;
  metadata: Record<string, any>;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export interface U2ERewardRate {
  id: string;
  business_id: string;
  action_type: ActionType;
  action_label: string | null;
  rate_per_action: number;
  effective_from: string;
  effective_to: string | null;
  is_active: boolean;
  updated_by: string | null;
  notes: string | null;
  created_at: string;
}

export interface U2EUsageEvent {
  id: string;
  event_idempotency_key: string;
  user_id: string;
  business_id: string;
  action_type: ActionType;
  metadata: Record<string, any>;
  ip_address: string | null;
  user_agent: string | null;
  processed: boolean;
  processed_at: string | null;
  created_at: string;
}

export interface U2EUsageReward {
  id: string;
  user_id: string;
  business_id: string;
  action_type: ActionType;
  period_start: string;
  period_end: string;
  period_type: PeriodType;
  usage_count: number;
  reward_rate: number;
  rewards_earned: number;
  is_finalized: boolean;
  claimed: boolean;
  claimed_at: string | null;
  calculated_at: string;
  calculation_details: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface U2ERewardClaim {
  id: string;
  user_id: string;
  claim_amount: number;
  claim_type: string;
  status: RewardClaimStatus;
  distribution_tx_hash: string | null;
  distributed_at: string | null;
  distribution_method: string | null;
  claim_period: RewardClaimPeriod;
  is_from_initial_supply: boolean;
  claimed_at: string;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface U2EUserStats {
  user_id: string;
  businesses_used: number;
  total_usage_count: number;
  total_rewards_earned: number;
  unclaimed_rewards: number;
  last_activity_date: string;
  current_month_rewards: number;
  top_business: string | null;
}

export interface TrackUsageRequest {
  event_idempotency_key: string;
  business_name: string;
  action_type: ActionType;
  metadata?: Record<string, any>;
}

export interface TrackUsageResponse {
  success: boolean;
  event_id?: string;
  error?: string;
  message?: string;
}

export interface GetU2EStatsResponse {
  total_earned: number;
  current_month_earned: number;
  projected_monthly: number;
  total_usage_count: number;
  businesses_used: number;
  top_business: string | null;
  last_activity: string | null;
  is_system_active: boolean;
  claimable_at_launch: number;
}

export interface BusinessUsageSummary {
  business_id: string;
  business_name: string;
  display_name: string;
  logo_url: string | null;
  total_usage: number;
  total_rewards: number;
  actions: {
    action_type: ActionType;
    action_label: string;
    count: number;
    rewards: number;
  }[];
}

export interface GetBusinessBreakdownResponse {
  businesses: BusinessUsageSummary[];
  total_rewards: number;
}

export interface UsageHistoryItem {
  id: string;
  business_name: string;
  display_name: string;
  action_type: ActionType;
  action_label: string | null;
  rewards_earned: number;
  usage_count: number;
  date: string;
}

export interface GetUsageHistoryRequest {
  period?: '7d' | '30d' | '90d' | 'all';
  business_name?: string;
  page?: number;
  limit?: number;
}

export interface GetUsageHistoryResponse {
  items: UsageHistoryItem[];
  total: number;
  page: number;
  limit: number;
  has_more: boolean;
}

export interface RewardRateInfo {
  business_id: string;
  business_name: string;
  display_name: string;
  action_type: ActionType;
  action_label: string;
  rate_per_action: number;
  effective_from: string;
  notes: string | null;
}

export interface GetRewardRatesResponse {
  rates: RewardRateInfo[];
  global_multiplier: number;
  last_updated: string;
  next_rate_review: string | null;
}

export interface UpdateSystemConfigRequest {
  is_active?: boolean;
  global_multiplier?: number;
  min_payout_threshold?: number;
  settings?: Record<string, any>;
}

export interface UpdateRewardRateRequest {
  business_name: string;
  action_type: ActionType;
  new_rate: number;
  notes?: string;
}

export interface CreateBusinessRequest {
  business_name: string;
  display_name: string;
  description: string;
  integration_type: IntegrationType;
  webhook_url?: string;
  logo_url?: string;
}

export interface ToggleBusinessRequest {
  business_name: string;
  is_active: boolean;
}

export interface U2EWebhookPayload {
  api_key: string;
  user_id: string;
  action_type: ActionType;
  timestamp: string;
  metadata?: Record<string, any>;
  idempotency_key: string;
}

export interface U2EWebhookResponse {
  success: boolean;
  event_id?: string;
  error?: string;
}

export interface U2ECalculation {
  usage_count: number;
  rate_per_action: number;
  global_multiplier: number;
  total_reward: number;
}

export interface U2EPeriodSummary {
  period_start: string;
  period_end: string;
  period_type: PeriodType;
  total_usage: number;
  total_rewards: number;
  businesses: {
    business_name: string;
    usage: number;
    rewards: number;
  }[];
}

export function isValidActionType(value: string): value is ActionType {
  const validTypes = [
    'trade_executed',
    'stop_loss_triggered',
    'take_profit_hit',
    'portfolio_view',
    'api_call',
    'bot_created',
    'bot_deployed',
    'document_generated',
    'page_created',
    'deployment',
  ];
  return validTypes.includes(value) || typeof value === 'string';
}

export function isValidIntegrationType(value: string): value is IntegrationType {
  return ['webhook', 'manual', 'api'].includes(value);
}

export function isValidPeriodType(value: string): value is PeriodType {
  return ['daily', 'weekly', 'monthly'].includes(value);
}
