import { BaseRepository, type OperationContext } from '../../../shared/services/supabase/repositories/BaseRepository.js';
import type {
  DAOStatisticsRow,
  TreasuryMetricsRow,
  GovernanceMetricsHistoryRow,
  BusinessMetricsRow,
  ParticipationMetrics,
  ProposalActivity,
  TimePeriod,
} from '../types/daoTypes.js';

/**
 * DAO Repository
 * Handles all database operations for DAO portal
 */
export class DAORepository extends BaseRepository {
  /**
   * Get current DAO statistics from materialized view
   */
  async getDAOStatistics(context?: OperationContext): Promise<DAOStatisticsRow | null> {
    const result = await this.queryBuilder<DAOStatisticsRow>('dao_statistics', context)
      .select('*')
      .single();

    return result || null;
  }

  /**
   * Get treasury metrics from materialized view
   */
  async getTreasuryMetrics(context?: OperationContext): Promise<TreasuryMetricsRow | null> {
    const result = await this.queryBuilder<TreasuryMetricsRow>('treasury_metrics', context)
      .select('*')
      .single();

    return result || null;
  }

  /**
   * Get governance history for a time period
   */
  async getGovernanceHistory(
    period: TimePeriod,
    context?: OperationContext
  ): Promise<GovernanceMetricsHistoryRow[]> {
    const daysMap: Record<TimePeriod, number> = {
      '7d': 7,
      '30d': 30,
      '90d': 90,
    };

    const days = daysMap[period];
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);

    const results = await this.queryBuilder<GovernanceMetricsHistoryRow>(
      'governance_metrics_history',
      context
    )
      .select('*')
      .gte('recorded_at', cutoffDate.toISOString())
      .order('recorded_at', { ascending: true })
      .execute();

    return results;
  }

  /**
   * Get treasury history for a time period
   * Uses governance_metrics_history table for consistency
   */
  async getTreasuryHistory(
    period: TimePeriod,
    context?: OperationContext
  ): Promise<GovernanceMetricsHistoryRow[]> {
    const daysMap: Record<TimePeriod, number> = {
      '7d': 7,
      '30d': 30,
      '90d': 90,
    };

    const days = daysMap[period];
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);

    const results = await this.queryBuilder<GovernanceMetricsHistoryRow>(
      'governance_metrics_history',
      context
    )
      .select('recorded_at, total_treasury_value, monthly_revenue, active_businesses')
      .gte('recorded_at', cutoffDate.toISOString())
      .order('recorded_at', { ascending: true })
      .execute();

    return results;
  }

  /**
   * Get all active businesses with metrics
   */
  async getActiveBusinesses(context?: OperationContext): Promise<BusinessMetricsRow[]> {
    const results = await this.queryBuilder<BusinessMetricsRow>('u2e_businesses', context)
      .select('id, name, slug, description, status, is_active, is_foundation, category, monthly_revenue, total_revenue, launch_date, created_at, updated_at')
      .eq('status', 'active')
      .is('deleted_at', null)
      .order('total_revenue', { ascending: false })
      .execute();

    return results;
  }

  /**
   * Get participation metrics
   */
  async getParticipationMetrics(context?: OperationContext): Promise<ParticipationMetrics> {
    // Get total eligible voters
    const usersResult = await this.queryBuilder<{ count: number }>('users', context)
      .select('id', { count: 'exact', head: true })
      .in('role', ['user', 'admin', 'moderator'])
      .is('deleted_at', null)
      .execute();

    const eligibleVoters = usersResult.length;

    // Get unique voters in last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const uniqueVotersResult = await this.supabase
      .from('votes')
      .select('voter_id', { count: 'exact' })
      .gte('created_at', thirtyDaysAgo.toISOString());

    const uniqueVotersData = uniqueVotersResult.data || [];
    const uniqueVoterIds = new Set(uniqueVotersData.map((v: any) => v.voter_id));
    const uniqueVoters = uniqueVoterIds.size;

    // Get active voters in last 7 days
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const activeVotersResult = await this.supabase
      .from('votes')
      .select('voter_id', { count: 'exact' })
      .gte('created_at', sevenDaysAgo.toISOString());

    const activeVotersData = activeVotersResult.data || [];
    const activeVoterIds = new Set(activeVotersData.map((v: any) => v.voter_id));
    const activeVoters = activeVoterIds.size;

    // Calculate participation rate
    const rate = eligibleVoters > 0 ? (uniqueVoters / eligibleVoters) * 100 : 0;

    return {
      rate: Math.round(rate * 100) / 100,
      unique_voters: uniqueVoters,
      active_voters: activeVoters,
      eligible_voters: eligibleVoters,
    };
  }

  /**
   * Get recent proposal activity
   */
  async getRecentProposalActivity(
    limit: number = 10,
    context?: OperationContext
  ): Promise<ProposalActivity[]> {
    const proposals = await this.queryBuilder<any>('proposals', context)
      .select('id, title, status, created_at')
      .is('deleted_at', null)
      .order('created_at', { ascending: false })
      .limit(limit)
      .execute();

    // Get vote counts for each proposal
    const proposalActivities: ProposalActivity[] = [];

    for (const proposal of proposals) {
      const votesResult = await this.supabase
        .from('votes')
        .select('id', { count: 'exact', head: true })
        .eq('proposal_id', proposal.id);

      const voteCount = votesResult.count || 0;

      // Get last vote timestamp
      const lastVoteResult = await this.supabase
        .from('votes')
        .select('created_at')
        .eq('proposal_id', proposal.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      const lastActivity = lastVoteResult.data?.created_at || proposal.created_at;

      proposalActivities.push({
        id: proposal.id,
        title: proposal.title,
        status: proposal.status,
        created_at: proposal.created_at,
        vote_count: voteCount,
        last_activity: lastActivity,
      });
    }

    return proposalActivities;
  }

  /**
   * Refresh materialized views on demand
   */
  async refreshMaterializedViews(context?: OperationContext): Promise<void> {
    await this.supabase.rpc('refresh_dao_materialized_views');
  }

  /**
   * Capture governance snapshot (manual trigger)
   */
  async captureGovernanceSnapshot(context?: OperationContext): Promise<void> {
    await this.supabase.rpc('capture_governance_snapshot');
  }

  /**
   * Get latest historical snapshot
   */
  async getLatestSnapshot(context?: OperationContext): Promise<GovernanceMetricsHistoryRow | null> {
    const result = await this.queryBuilder<GovernanceMetricsHistoryRow>(
      'governance_metrics_history',
      context
    )
      .select('*')
      .order('recorded_at', { ascending: false })
      .limit(1)
      .single();

    return result || null;
  }

  /**
   * Get historical growth data for treasury
   */
  async getTreasuryGrowth(context?: OperationContext): Promise<{
    monthly: number;
    quarterly: number;
    yearly: number;
  }> {
    const now = new Date();

    // Get snapshot from 30 days ago
    const thirtyDaysAgo = new Date(now);
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const monthlySnapshot = await this.queryBuilder<GovernanceMetricsHistoryRow>(
      'governance_metrics_history',
      context
    )
      .select('total_treasury_value')
      .gte('recorded_at', thirtyDaysAgo.toISOString())
      .order('recorded_at', { ascending: true })
      .limit(1)
      .single();

    // Get snapshot from 90 days ago
    const ninetyDaysAgo = new Date(now);
    ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);

    const quarterlySnapshot = await this.queryBuilder<GovernanceMetricsHistoryRow>(
      'governance_metrics_history',
      context
    )
      .select('total_treasury_value')
      .gte('recorded_at', ninetyDaysAgo.toISOString())
      .order('recorded_at', { ascending: true })
      .limit(1)
      .single();

    // Get snapshot from 365 days ago
    const oneYearAgo = new Date(now);
    oneYearAgo.setDate(oneYearAgo.getDate() - 365);

    const yearlySnapshot = await this.queryBuilder<GovernanceMetricsHistoryRow>(
      'governance_metrics_history',
      context
    )
      .select('total_treasury_value')
      .gte('recorded_at', oneYearAgo.toISOString())
      .order('recorded_at', { ascending: true })
      .limit(1)
      .single();

    // Get current value
    const currentMetrics = await this.getTreasuryMetrics(context);
    const currentValue = currentMetrics?.total_lifetime_revenue || 0;

    // Calculate growth percentages
    const calculateGrowth = (oldValue: number | undefined, currentValue: number): number => {
      if (!oldValue || oldValue === 0) return 0;
      return ((currentValue - oldValue) / oldValue) * 100;
    };

    return {
      monthly: calculateGrowth(monthlySnapshot?.total_treasury_value, currentValue),
      quarterly: calculateGrowth(quarterlySnapshot?.total_treasury_value, currentValue),
      yearly: calculateGrowth(yearlySnapshot?.total_treasury_value, currentValue),
    };
  }
}
