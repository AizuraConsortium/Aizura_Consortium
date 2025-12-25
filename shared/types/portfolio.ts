/**
 * Portfolio Type Definitions
 *
 * Type definitions for the portfolio system tracking business performance,
 * user exposure, and metrics.
 */

export type BusinessCategory = 'Trading' | 'SaaS' | 'Infrastructure' | 'Data' | 'Content';
export type BusinessStatus = 'planning' | 'development' | 'live' | 'paused';
export type MetricType = 'revenue' | 'users' | 'transactions' | 'api_calls';
export type ActivityLevel = 'high' | 'medium' | 'low';
export type ExposureType = 'voting' | 'usage' | 'proposal' | 'mixed';

/**
 * Business entity from u2e_businesses table
 */
export interface Business {
  id: string;
  business_name: string;
  display_name: string;
  description: string | null;
  slug: string | null;
  category: BusinessCategory | null;
  status: BusinessStatus;
  development_progress: number;
  is_foundation: boolean;
  is_active: boolean;
  integration_type: string;

  // Links
  website_url: string | null;
  github_url: string | null;
  docs_url: string | null;
  logo_url: string | null;
  featured_image: string | null;

  // Relations
  proposal_id: string | null;
  plan_id: string | null;

  // Dates
  launch_date: string | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

/**
 * Business metric history entry
 */
export interface BusinessMetric {
  id: string;
  business_id: string;
  metric_type: MetricType;
  value: number;
  period_start: string;
  period_end: string;
  metadata: Record<string, any>;
  recorded_at: string;
}

/**
 * Aggregated business performance statistics
 * From business_performance_stats materialized view
 */
export interface BusinessPerformance {
  business_id: string;
  business_name: string;
  business_slug: string | null;
  status: BusinessStatus;
  category: BusinessCategory | null;
  is_foundation: boolean;
  development_progress: number;
  launch_date: string | null;

  // Revenue metrics
  monthly_revenue: number;
  total_revenue: number;

  // User metrics
  current_users: number;

  // Activity metrics
  total_transactions: number;
  total_api_calls: number;
  active_u2e_users: number;
  total_usage_events: number;

  // Engagement metrics
  unique_voters: number;
  votes_for: number;
  votes_against: number;

  // Performance indicator
  activity_level: ActivityLevel;

  // Metadata
  last_updated: string;
}

/**
 * User's exposure to a business
 * From user_portfolio_exposure materialized view
 */
export interface UserExposure {
  user_id: string;
  business_id: string;
  business_name: string;
  business_slug: string | null;

  // Voting participation
  votes_for: number;
  votes_against: number;

  // Proposal submission
  proposals_submitted: number;

  // Usage activity
  total_rewards_earned: number;
  total_usage_count: number;

  // Timeline
  first_interaction: string | null;

  // Calculated metrics
  exposure_score: number; // 0-100
}

/**
 * Combined business view with performance and exposure
 */
export interface BusinessWithMetrics extends Business {
  performance: BusinessPerformance | null;
  exposure: UserExposure | null;
}

/**
 * Portfolio overview for a user
 */
export interface PortfolioOverview {
  user_id: string;

  // Summary counts
  total_businesses: number;
  businesses_live: number;
  businesses_development: number;
  businesses_planning: number;

  // Exposure summary
  businesses_voted: number;
  businesses_used: number;
  businesses_proposed: number;

  // Performance summary
  total_portfolio_revenue: number;
  total_rewards_earned: number;

  // Business list
  businesses: BusinessWithMetrics[];
}

/**
 * Metric trend calculation
 */
export interface MetricTrend {
  current_value: number;
  previous_value: number;
  change_amount: number;
  change_percentage: number;
  direction: 'up' | 'down' | 'stable';
  period: string;
}

/**
 * Time-series metric data point
 */
export interface MetricDataPoint {
  period_start: string;
  period_end: string;
  value: number;
  metric_type: MetricType;
}

/**
 * Business metrics over time
 */
export interface BusinessMetricsTimeSeries {
  business_id: string;
  business_name: string;
  metric_type: MetricType;
  data_points: MetricDataPoint[];
  trend: MetricTrend | null;
}

/**
 * Filters for business queries
 */
export interface BusinessFilters {
  status?: BusinessStatus;
  category?: BusinessCategory;
  is_foundation?: boolean;
  is_active?: boolean;
  search?: string;
  sort?: 'name' | 'revenue' | 'users' | 'activity' | 'launch_date';
  order?: 'asc' | 'desc';
  limit?: number;
  offset?: number;
}

/**
 * Filters for metric queries
 */
export interface MetricFilters {
  business_id?: string;
  metric_type?: MetricType;
  start_date?: string;
  end_date?: string;
  limit?: number;
  offset?: number;
}

/**
 * Request payload for creating a business metric
 */
export interface CreateBusinessMetricPayload {
  business_id: string;
  metric_type: MetricType;
  value: number;
  period_start: string;
  period_end: string;
  metadata?: Record<string, any>;
}

/**
 * Request payload for updating a business
 */
export interface UpdateBusinessPayload {
  display_name?: string;
  description?: string;
  slug?: string;
  category?: BusinessCategory;
  status?: BusinessStatus;
  development_progress?: number;
  website_url?: string;
  github_url?: string;
  docs_url?: string;
  logo_url?: string;
  featured_image?: string;
  launch_date?: string;
}

/**
 * API response for portfolio data
 */
export interface PortfolioResponse {
  portfolio: PortfolioOverview;
  last_refreshed: string;
}

/**
 * API response for business list
 */
export interface BusinessListResponse {
  businesses: BusinessWithMetrics[];
  total: number;
  limit: number;
  offset: number;
}

/**
 * API response for business metrics
 */
export interface BusinessMetricsResponse {
  business_id: string;
  business_name: string;
  metrics: BusinessMetricsTimeSeries[];
}

/**
 * Helper type for exposure type calculation
 */
export function calculateExposureType(exposure: UserExposure): ExposureType {
  const hasVotes = exposure.votes_for > 0 || exposure.votes_against > 0;
  const hasUsage = exposure.total_usage_count > 0;
  const hasProposal = exposure.proposals_submitted > 0;

  const activeTypes = [hasVotes, hasUsage, hasProposal].filter(Boolean).length;

  if (activeTypes === 0) return 'voting'; // Default
  if (activeTypes > 1) return 'mixed';
  if (hasProposal) return 'proposal';
  if (hasUsage) return 'usage';
  return 'voting';
}

/**
 * Helper to format metric value for display
 */
export function formatMetricValue(value: number, metricType: MetricType): string {
  switch (metricType) {
    case 'revenue':
      return `$${value.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
    case 'users':
      return value.toLocaleString('en-US');
    case 'transactions':
      return value.toLocaleString('en-US');
    case 'api_calls':
      return value.toLocaleString('en-US');
    default:
      return value.toString();
  }
}

/**
 * Helper to calculate metric trend
 */
export function calculateTrend(current: number, previous: number): MetricTrend {
  const change_amount = current - previous;
  const change_percentage = previous === 0 ? 100 : (change_amount / previous) * 100;

  let direction: 'up' | 'down' | 'stable' = 'stable';
  if (Math.abs(change_percentage) < 1) {
    direction = 'stable';
  } else if (change_amount > 0) {
    direction = 'up';
  } else {
    direction = 'down';
  }

  return {
    current_value: current,
    previous_value: previous,
    change_amount,
    change_percentage: Math.abs(change_percentage),
    direction,
    period: 'month',
  };
}

/**
 * Business status display labels
 */
export const BUSINESS_STATUS_LABELS: Record<BusinessStatus, string> = {
  planning: 'Planning',
  development: 'Development',
  live: 'Live',
  paused: 'Paused',
};

/**
 * Business category display labels
 */
export const BUSINESS_CATEGORY_LABELS: Record<BusinessCategory, string> = {
  Trading: 'Trading',
  SaaS: 'SaaS',
  Infrastructure: 'Infrastructure',
  Data: 'Data',
  Content: 'Content',
};

/**
 * Metric type display labels
 */
export const METRIC_TYPE_LABELS: Record<MetricType, string> = {
  revenue: 'Revenue',
  users: 'Users',
  transactions: 'Transactions',
  api_calls: 'API Calls',
};

/**
 * Activity level display labels
 */
export const ACTIVITY_LEVEL_LABELS: Record<ActivityLevel, string> = {
  high: 'High Activity',
  medium: 'Medium Activity',
  low: 'Low Activity',
};
