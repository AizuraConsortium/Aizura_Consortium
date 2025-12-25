/**
 * DAO Portal Type Definitions
 * Shared types for DAO statistics, treasury, and governance metrics
 */

export interface ProposalStats {
  queued: number;
  active: number;
  passed: number;
  rejected: number;
  total: number;
}

export interface GovernanceMetrics {
  activeVoters30d: number;
  totalVotersAllTime: number;
  totalVotes30d: number;
  avgVotesPerProposal: number;
  participationRate: number;
}

export interface TreasuryMetrics {
  totalValue: number;
  monthlyRevenue: number;
  revenueGrowth: number;
  activeBusinesses: number;
}

export interface DAOStats {
  proposals: ProposalStats;
  governance: GovernanceMetrics;
  treasury: TreasuryMetrics;
  lastUpdated: string;
}

export interface TreasurySummary {
  totalValue: number;
  monthlyRevenue: number;
  revenueGrowth: number;
  activeBusinesses: number;
}

export interface AllocationBreakdown {
  foundation: number;
  foundationPercentage: number;
  liveBusinesses: number;
  liveBusinessesPercentage: number;
}

export interface BusinessMetrics {
  total_revenue: number;
  monthly_revenue: number;
  revenue_growth_rate: number;
  active_users: number;
  total_transactions: number;
}

export interface BusinessBreakdown {
  id: string;
  name: string;
  slug: string;
  category: string | null;
  isFoundation: boolean;
  metrics: BusinessMetrics;
}

export interface TreasuryStats {
  summary: TreasurySummary;
  allocation: AllocationBreakdown;
  businesses: BusinessBreakdown[];
  lastUpdated: string;
}

export interface GovernanceHistoryPoint {
  snapshot_date: string;
  proposals_total: number;
  proposals_active: number;
  proposals_passed: number;
  proposals_rejected: number;
  active_voters_30d: number;
  total_votes_30d: number;
  participation_rate: number;
}

export interface TreasuryHistoryPoint {
  snapshot_date: string;
  total_treasury_value: number;
  total_monthly_revenue: number;
  total_active_businesses: number;
  revenue_growth_rate: number;
}

export interface HistoricalMetrics {
  governance: GovernanceHistoryPoint[];
  treasury: TreasuryHistoryPoint[];
  periodDays: number;
}

export interface GovernanceMetricsHistory {
  id: string;
  recordedAt: string;
  activeProposals: number;
  passedProposals: number;
  rejectedProposals: number;
  pendingProposals: number;
  totalProposals: number;
  uniqueVoters: number;
  activeVoters: number;
  participationRate: number;
  totalTreasuryValue: number;
  monthlyRevenue: number;
  activeBusinesses: number;
  createdAt: string;
}

export interface TreasuryMetricsHistory {
  recordedAt: string;
  totalTreasuryValue: number;
  monthlyRevenue: number;
  activeBusinesses: number;
  foundationValue: number;
  liveBusinessValue: number;
  revenueGrowthRate: number;
}

export interface ChartDataPoint {
  date: string;
  value: number;
  label?: string;
  metadata?: Record<string, any>;
}

export interface TrendData {
  current: number;
  previous: number;
  change: number;
  changePercentage: number;
  trend: 'up' | 'down' | 'stable';
  isPositive: boolean;
}
