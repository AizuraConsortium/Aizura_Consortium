import { BaseService } from '../../shared/services/BaseService.js';
import { getSupabaseClient } from '../../shared/services/supabase/client.js';
import type {
  DAOStats,
  TreasuryStats,
  HistoricalMetrics
} from '../../../shared/types/dao.js';

export class DAOService extends BaseService {
  constructor() {
    super('DAOService');
  }

  /**
   * Get current DAO statistics from materialized view
   */
  async getDAOStats(): Promise<DAOStats> {
    const supabase = getSupabaseClient();

    // Fetch from dao_statistics materialized view
    const { data: statsData, error: statsError } = await supabase
      .from('dao_statistics')
      .select('*')
      .single();

    if (statsError) {
      await this.logError('GET_DAO_STATS', 'Failed to fetch DAO statistics', statsError);
      throw statsError;
    }

    // Fetch from treasury_metrics materialized view
    const { data: treasData, error: treasError } = await supabase
      .from('treasury_metrics')
      .select('*')
      .single();

    if (treasError) {
      await this.logError('GET_TREASURY_METRICS', 'Failed to fetch treasury metrics', treasError);
      throw treasError;
    }

    // Calculate participation rate
    const totalEligible = statsData.unique_voters_30d + 100;
    const participationRate = totalEligible > 0
      ? (statsData.unique_voters_30d / totalEligible) * 100
      : 0;

    // Calculate average votes per proposal
    const avgVotesPerProposal = statsData.total_proposals > 0
      ? statsData.unique_voters_30d / statsData.total_proposals
      : 0;

    return {
      proposals: {
        queued: statsData.pending_proposals || 0,
        active: statsData.active_proposals || 0,
        passed: statsData.passed_proposals || 0,
        rejected: statsData.rejected_proposals || 0,
        total: statsData.total_proposals || 0,
      },
      governance: {
        activeVoters30d: statsData.unique_voters_30d || 0,
        totalVotersAllTime: statsData.unique_voters_30d || 0,
        totalVotes30d: statsData.active_voters_7d || 0,
        avgVotesPerProposal: parseFloat(avgVotesPerProposal.toFixed(2)),
        participationRate: parseFloat(participationRate.toFixed(2)),
      },
      treasury: {
        totalValue: parseFloat(treasData.total_lifetime_revenue) || 0,
        monthlyRevenue: parseFloat(treasData.total_monthly_revenue) || 0,
        revenueGrowth: 0,
        activeBusinesses: treasData.active_businesses || 0,
      },
      lastUpdated: statsData.last_updated,
    };
  }

  /**
   * Get detailed treasury breakdown
   */
  async getTreasuryStats(): Promise<TreasuryStats> {
    const supabase = getSupabaseClient();

    // Get summary from materialized view
    const { data: summary, error: summaryError } = await supabase
      .from('treasury_metrics')
      .select('*')
      .single();

    if (summaryError) {
      await this.logError('GET_TREASURY_SUMMARY', 'Failed to fetch treasury summary', summaryError);
      throw summaryError;
    }

    // Get per-business breakdown
    const { data: businesses, error: businessError } = await supabase
      .from('u2e_businesses')
      .select(`
        id,
        name,
        slug,
        category,
        is_foundation,
        status,
        monthly_revenue,
        total_revenue
      `)
      .is('deleted_at', null)
      .eq('status', 'active')
      .order('name');

    if (businessError) {
      await this.logError('GET_BUSINESSES', 'Failed to fetch businesses', businessError);
      throw businessError;
    }

    const foundationPercentage = summary.total_lifetime_revenue > 0
      ? (summary.foundation_value / summary.total_lifetime_revenue) * 100
      : 0;

    const liveBusinessPercentage = 100 - foundationPercentage;

    return {
      summary: {
        totalValue: parseFloat(summary.total_lifetime_revenue) || 0,
        monthlyRevenue: parseFloat(summary.total_monthly_revenue) || 0,
        revenueGrowth: 0,
        activeBusinesses: summary.active_businesses || 0,
      },
      allocation: {
        foundation: parseFloat(summary.foundation_value) || 0,
        foundationPercentage: parseFloat(foundationPercentage.toFixed(2)),
        liveBusinesses: parseFloat(summary.live_business_value) || 0,
        liveBusinessesPercentage: parseFloat(liveBusinessPercentage.toFixed(2)),
      },
      businesses: businesses.map(b => ({
        id: b.id,
        name: b.name,
        slug: b.slug,
        category: b.category,
        isFoundation: b.is_foundation,
        metrics: {
          total_revenue: parseFloat(b.total_revenue) || 0,
          monthly_revenue: parseFloat(b.monthly_revenue) || 0,
          revenue_growth_rate: 0,
          active_users: 0,
          total_transactions: 0,
        },
      })),
      lastUpdated: summary.last_updated,
    };
  }

  /**
   * Get historical metrics for charts
   */
  async getHistoricalMetrics(days: number = 30): Promise<HistoricalMetrics> {
    const supabase = getSupabaseClient();

    // Validate days parameter
    if (days < 1 || days > 365) {
      throw new Error('Days must be between 1 and 365');
    }

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    // Fetch governance history
    const { data: govHistory, error: govError } = await supabase
      .from('governance_metrics_history')
      .select('*')
      .gte('recorded_at', startDate.toISOString())
      .order('recorded_at', { ascending: true });

    if (govError) {
      await this.logError('GET_GOVERNANCE_HISTORY', 'Failed to fetch governance history', govError);
      throw govError;
    }

    // Transform governance history to expected format
    const governanceData = (govHistory || []).map(record => ({
      snapshot_date: record.recorded_at,
      proposals_total: record.total_proposals,
      proposals_active: record.active_proposals,
      proposals_passed: record.passed_proposals,
      proposals_rejected: record.rejected_proposals,
      active_voters_30d: record.unique_voters,
      total_votes_30d: record.active_voters,
      participation_rate: parseFloat(record.participation_rate) || 0,
    }));

    // Transform treasury history to expected format
    const treasuryData = (govHistory || []).map(record => ({
      snapshot_date: record.recorded_at,
      total_treasury_value: parseFloat(record.total_treasury_value) || 0,
      total_monthly_revenue: parseFloat(record.monthly_revenue) || 0,
      total_active_businesses: record.active_businesses,
      revenue_growth_rate: 0,
    }));

    return {
      governance: governanceData,
      treasury: treasuryData,
      periodDays: days,
    };
  }
}
