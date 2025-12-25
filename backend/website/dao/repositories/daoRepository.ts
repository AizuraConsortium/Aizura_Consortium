import { BaseRepository, type OperationContext } from '../../../shared/services/supabase/repositories/BaseRepository.js';
import type {
  DAOStatisticsRow,
  TreasuryMetricsRow,
  GovernanceMetricsHistoryRow,
  TreasuryHistoryRow,
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
    return this.execute(async () => {
      const { data, error } = await this.client
        .from('dao_statistics')
        .select('*')
        .maybeSingle();

      if (error) throw error;
      return data;
    }, context || { operation: 'getDAOStatistics', table: 'dao_statistics' });
  }

  /**
   * Get treasury metrics from materialized view
   */
  async getTreasuryMetrics(context?: OperationContext): Promise<TreasuryMetricsRow | null> {
    return this.execute(async () => {
      const { data, error } = await this.client
        .from('treasury_metrics')
        .select('*')
        .maybeSingle();

      if (error) throw error;
      return data;
    }, context || { operation: 'getTreasuryMetrics', table: 'treasury_metrics' });
  }

  /**
   * Get governance history for a time period
   */
  async getGovernanceHistory(
    period: TimePeriod,
    context?: OperationContext
  ): Promise<GovernanceMetricsHistoryRow[]> {
    return this.execute(async () => {
      const daysMap: Record<TimePeriod, number> = {
        '7d': 7,
        '30d': 30,
        '90d': 90,
      };

      const days = daysMap[period];
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - days);

      const { data, error } = await this.client
        .from('governance_metrics_history')
        .select('*')
        .gte('recorded_at', cutoffDate.toISOString())
        .order('recorded_at', { ascending: true });

      if (error) throw error;
      return data || [];
    }, context || { operation: 'getGovernanceHistory', table: 'governance_metrics_history' });
  }

  /**
   * Get treasury history for a time period
   * Uses governance_metrics_history table for consistency
   */
  async getTreasuryHistory(
    period: TimePeriod,
    context?: OperationContext
  ): Promise<TreasuryHistoryRow[]> {
    return this.execute(async () => {
      const daysMap: Record<TimePeriod, number> = {
        '7d': 7,
        '30d': 30,
        '90d': 90,
      };

      const days = daysMap[period];
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - days);

      const { data, error } = await this.client
        .from('governance_metrics_history')
        .select('recorded_at, total_treasury_value, monthly_revenue, active_businesses')
        .gte('recorded_at', cutoffDate.toISOString())
        .order('recorded_at', { ascending: true });

      if (error) throw error;
      return data || [];
    }, context || { operation: 'getTreasuryHistory', table: 'governance_metrics_history' });
  }

  /**
   * Get all active businesses with metrics
   */
  async getActiveBusinesses(context?: OperationContext): Promise<BusinessMetricsRow[]> {
    return this.execute(async () => {
      const { data, error } = await this.client
        .from('u2e_businesses')
        .select('id, name, slug, description, status, is_active, is_foundation, category, monthly_revenue, total_revenue, launch_date, created_at, updated_at')
        .eq('status', 'active')
        .is('deleted_at', null)
        .order('total_revenue', { ascending: false });

      if (error) throw error;
      return data || [];
    }, context || { operation: 'getActiveBusinesses', table: 'u2e_businesses' });
  }

  /**
   * Get participation metrics
   */
  async getParticipationMetrics(context?: OperationContext): Promise<ParticipationMetrics> {
    return this.execute(async () => {
      // Get total eligible voters
      const { count: eligibleVoters, error: usersError } = await this.client
        .from('users')
        .select('id', { count: 'exact', head: true })
        .in('role', ['user', 'admin', 'moderator'])
        .is('deleted_at', null);

      if (usersError) throw usersError;

      // Get unique voters in last 30 days
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const { data: uniqueVotersData, error: uniqueError } = await this.client
        .from('votes')
        .select('voter_id')
        .gte('created_at', thirtyDaysAgo.toISOString());

      if (uniqueError) throw uniqueError;

      const uniqueVoterIds = new Set((uniqueVotersData || []).map((v: any) => v.voter_id));
      const uniqueVoters = uniqueVoterIds.size;

      // Get active voters in last 7 days
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

      const { data: activeVotersData, error: activeError } = await this.client
        .from('votes')
        .select('voter_id')
        .gte('created_at', sevenDaysAgo.toISOString());

      if (activeError) throw activeError;

      const activeVoterIds = new Set((activeVotersData || []).map((v: any) => v.voter_id));
      const activeVoters = activeVoterIds.size;

      // Calculate participation rate
      const rate = (eligibleVoters || 0) > 0 ? (uniqueVoters / (eligibleVoters || 1)) * 100 : 0;

      return {
        rate: Math.round(rate * 100) / 100,
        unique_voters: uniqueVoters,
        active_voters: activeVoters,
        eligible_voters: eligibleVoters || 0,
      };
    }, context || { operation: 'getParticipationMetrics' });
  }

  /**
   * Get recent proposal activity
   */
  async getRecentProposalActivity(
    limit: number = 10,
    context?: OperationContext
  ): Promise<ProposalActivity[]> {
    return this.execute(async () => {
      const { data: proposals, error: proposalsError } = await this.client
        .from('proposals')
        .select('id, title, status, created_at')
        .is('deleted_at', null)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (proposalsError) throw proposalsError;

      const proposalActivities: ProposalActivity[] = [];

      for (const proposal of proposals || []) {
        const { count: voteCount, error: voteError } = await this.client
          .from('votes')
          .select('id', { count: 'exact', head: true })
          .eq('proposal_id', proposal.id);

        if (voteError) throw voteError;

        const { data: lastVote } = await this.client
          .from('votes')
          .select('created_at')
          .eq('proposal_id', proposal.id)
          .order('created_at', { ascending: false })
          .limit(1)
          .maybeSingle();

        const lastActivity = lastVote?.created_at || proposal.created_at;

        proposalActivities.push({
          id: proposal.id,
          title: proposal.title,
          status: proposal.status,
          created_at: proposal.created_at,
          vote_count: voteCount || 0,
          last_activity: lastActivity,
        });
      }

      return proposalActivities;
    }, context || { operation: 'getRecentProposalActivity', table: 'proposals' });
  }

  /**
   * Refresh materialized views on demand
   */
  async refreshMaterializedViews(context?: OperationContext): Promise<void> {
    return this.execute(async () => {
      const { error } = await this.client.rpc('refresh_dao_materialized_views');
      if (error) throw error;
    }, context || { operation: 'refreshMaterializedViews' });
  }

  /**
   * Capture governance snapshot (manual trigger)
   */
  async captureGovernanceSnapshot(context?: OperationContext): Promise<void> {
    return this.execute(async () => {
      const { error } = await this.client.rpc('capture_governance_snapshot');
      if (error) throw error;
    }, context || { operation: 'captureGovernanceSnapshot' });
  }

  /**
   * Get latest historical snapshot
   */
  async getLatestSnapshot(context?: OperationContext): Promise<GovernanceMetricsHistoryRow | null> {
    return this.execute(async () => {
      const { data, error } = await this.client
        .from('governance_metrics_history')
        .select('*')
        .order('recorded_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) throw error;
      return data;
    }, context || { operation: 'getLatestSnapshot', table: 'governance_metrics_history' });
  }

  /**
   * Get historical growth data for treasury
   */
  async getTreasuryGrowth(context?: OperationContext): Promise<{
    monthly: number;
    quarterly: number;
    yearly: number;
  }> {
    return this.execute(async () => {
      const now = new Date();

      // Get snapshot from 30 days ago
      const thirtyDaysAgo = new Date(now);
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const { data: monthlySnapshot } = await this.client
        .from('governance_metrics_history')
        .select('total_treasury_value')
        .gte('recorded_at', thirtyDaysAgo.toISOString())
        .order('recorded_at', { ascending: true })
        .limit(1)
        .maybeSingle();

      // Get snapshot from 90 days ago
      const ninetyDaysAgo = new Date(now);
      ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);

      const { data: quarterlySnapshot } = await this.client
        .from('governance_metrics_history')
        .select('total_treasury_value')
        .gte('recorded_at', ninetyDaysAgo.toISOString())
        .order('recorded_at', { ascending: true })
        .limit(1)
        .maybeSingle();

      // Get snapshot from 365 days ago
      const oneYearAgo = new Date(now);
      oneYearAgo.setDate(oneYearAgo.getDate() - 365);

      const { data: yearlySnapshot } = await this.client
        .from('governance_metrics_history')
        .select('total_treasury_value')
        .gte('recorded_at', oneYearAgo.toISOString())
        .order('recorded_at', { ascending: true })
        .limit(1)
        .maybeSingle();

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
    }, context || { operation: 'getTreasuryGrowth' });
  }
}
