/**
 * DAO Portal Backend Type Definitions
 * Types used by DAO services, repositories, and controllers
 */

export interface DAOStatisticsRow {
  active_proposals: number;
  passed_proposals: number;
  rejected_proposals: number;
  pending_proposals: number;
  total_proposals: number;
  unique_voters_30d: number;
  active_voters_7d: number;
  last_updated: string;
}

export interface TreasuryMetricsRow {
  total_monthly_revenue: number;
  total_lifetime_revenue: number;
  active_businesses: number;
  foundation_count: number;
  live_business_count: number;
  foundation_value: number;
  live_business_value: number;
  last_updated: string;
}

export interface GovernanceMetricsHistoryRow {
  id: string;
  recorded_at: string;
  active_proposals: number;
  passed_proposals: number;
  rejected_proposals: number;
  pending_proposals: number;
  total_proposals: number;
  unique_voters: number;
  active_voters: number;
  participation_rate: number;
  total_treasury_value: number;
  monthly_revenue: number;
  active_businesses: number;
  created_at: string;
}

export interface BusinessMetricsRow {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  status: string;
  is_active: boolean;
  is_foundation: boolean;
  category: string | null;
  monthly_revenue: number;
  total_revenue: number;
  launch_date: string | null;
  created_at: string;
  updated_at: string;
}

export interface ParticipationMetrics {
  rate: number;
  unique_voters: number;
  active_voters: number;
  eligible_voters: number;
}

export interface ProposalActivity {
  id: string;
  title: string;
  status: string;
  created_at: string;
  vote_count: number;
  last_activity: string;
}

export interface TrendDataPoint {
  date: string;
  value: number;
}

export interface GrowthMetrics {
  monthlyGrowth: number;
  quarterlyGrowth: number;
  yearlyGrowth: number;
}

export interface DAOStatsResponse {
  proposals: {
    active: number;
    total: number;
    passed: number;
    rejected: number;
    pending: number;
  };
  governance: {
    participationRate: number;
    uniqueVoters: number;
    activeVoters: number;
    totalEligibleVoters: number;
  };
  lastUpdated: string;
}

export interface TreasurySnapshotResponse {
  totalValue: number;
  monthlyRevenue: number;
  businesses: BusinessBreakdownItem[];
  allocation: {
    foundation: number;
    foundationPercentage: number;
    liveBusinesses: number;
    liveBusinessesPercentage: number;
  };
  growth: GrowthMetrics;
  lastUpdated: string;
}

export interface BusinessBreakdownItem {
  id: string;
  name: string;
  slug: string;
  value: number;
  monthlyRevenue: number;
  category: string | null;
  status: string;
  percentage: number;
}

export interface TreasuryHistoryResponse {
  period: '7d' | '30d' | '90d';
  data: TreasuryHistoryPoint[];
}

export interface TreasuryHistoryPoint {
  date: string;
  totalValue: number;
  monthlyRevenue: number;
  activeBusinesses: number;
}

export interface TreasuryHistoryRow {
  recorded_at: string;
  total_treasury_value: number;
  monthly_revenue: number;
  active_businesses: number;
}

export interface GovernanceTrendsResponse {
  period: '7d' | '30d' | '90d';
  data: GovernanceTrendPoint[];
}

export interface GovernanceTrendPoint {
  date: string;
  activeProposals: number;
  participationRate: number;
  uniqueVoters: number;
  totalProposals: number;
}

export interface DAOActivityResponse {
  recentProposals: ProposalActivity[];
  recentVotes: number;
  activeUsers: number;
  lastUpdated: string;
}

export type TimePeriod = '7d' | '30d' | '90d';

export interface CacheConfig {
  key: string;
  ttl: number;
}

export interface DAOCacheKeys {
  DAO_STATS: string;
  TREASURY_METRICS: string;
  GOVERNANCE_HISTORY: string;
  TREASURY_HISTORY: string;
  RECENT_PROPOSALS: string;
  PARTICIPATION_METRICS: string;
}
