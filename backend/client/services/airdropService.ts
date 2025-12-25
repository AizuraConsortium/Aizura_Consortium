import type { SupabaseClient } from '@supabase/supabase-js';
import { DatabaseService } from '../../shared/services/DatabaseService.js';
import { PointCalculator } from '../../shared/utils/pointCalculator.js';

export interface LeaderboardEntry {
  rank: number;
  userId: string;
  walletAddress: string;
  score: number;
  referralCount: number;
  socialConnections: {
    twitter: boolean;
    discord: boolean;
    telegram: boolean;
    github: boolean;
  };
  totalContentApproved: number;
  lastActivity: string;
  createdAt: string;
}

export interface UserStats {
  userId: string;
  totalPoints: number;
  rank: number | null;
  percentile: number | null;
  breakdown: {
    socialConnections: number;
    socialFollowing: number;
    contentSubmissions: number;
    referrals: number;
    dailyActivities: number;
    streakBonuses: number;
    governance: number;
    other: number;
  };
  referrals: {
    totalReferrals: number;
    totalEarnings: number;
  };
  engagement: {
    totalLogins: number;
    currentStreak: number;
    totalVotes: number;
    totalComments: number;
  };
  socialConnections: {
    twitter: boolean;
    discord: boolean;
    telegram: boolean;
    github: boolean;
  };
}

export interface AirdropEstimate {
  userPoints: number;
  totalPoints: number;
  sharePercentage: number;
  estimatedTokens: number;
  rank: number | null;
}

export class AirdropService extends DatabaseService {
  constructor(supabase: SupabaseClient) {
    super('AirdropService', supabase);
  }

  async getLeaderboard(
    limit = 100,
    offset = 0,
    includeWalletAddress = false
  ): Promise<{ entries: LeaderboardEntry[]; total: number }> {
    const { data, error, count } = await this.supabase
      .from('airdrop_leaderboard')
      .select('*', { count: 'exact' })
      .eq('banned', false)
      .order('score', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) throw error;

    const entries: LeaderboardEntry[] = (data || []).map((entry, index) => ({
      rank: offset + index + 1,
      userId: entry.user_id,
      walletAddress: includeWalletAddress ? entry.wallet_address : this.maskWalletAddress(entry.wallet_address),
      score: entry.score,
      referralCount: entry.referral_count,
      socialConnections: {
        twitter: entry.twitter_connected,
        discord: entry.discord_connected,
        telegram: entry.telegram_connected,
        github: entry.github_connected,
      },
      totalContentApproved: entry.total_content_approved,
      lastActivity: entry.last_activity,
      createdAt: entry.created_at,
    }));

    return { entries, total: count || 0 };
  }

  async getUserStats(userId: string): Promise<UserStats> {
    const [leaderboardData, pointsBreakdown, referralStats, userRank] = await Promise.all([
      this.supabase
        .from('airdrop_leaderboard')
        .select(
          'score, referral_count, total_logins, total_votes, total_comments, total_content_approved, twitter_connected, discord_connected, telegram_connected, github_connected'
        )
        .eq('user_id', userId)
        .maybeSingle(),
      this.getPointsBreakdown(userId),
      this.getReferralStats(userId),
      this.getUserRank(userId),
    ]);

    const { data: user } = await this.supabase
      .from('users')
      .select('login_streak')
      .eq('id', userId)
      .maybeSingle();

    const totalUsers = await this.getTotalUsers();
    const percentile = userRank && totalUsers > 0 ? ((totalUsers - userRank + 1) / totalUsers) * 100 : null;

    return {
      userId,
      totalPoints: leaderboardData.data?.score || 0,
      rank: userRank,
      percentile,
      breakdown: pointsBreakdown,
      referrals: {
        totalReferrals: referralStats.totalReferrals,
        totalEarnings: referralStats.totalEarnings,
      },
      engagement: {
        totalLogins: leaderboardData.data?.total_logins || 0,
        currentStreak: user?.login_streak || 0,
        totalVotes: leaderboardData.data?.total_votes || 0,
        totalComments: leaderboardData.data?.total_comments || 0,
      },
      socialConnections: {
        twitter: leaderboardData.data?.twitter_connected || false,
        discord: leaderboardData.data?.discord_connected || false,
        telegram: leaderboardData.data?.telegram_connected || false,
        github: leaderboardData.data?.github_connected || false,
      },
    };
  }

  async getPointsBreakdown(userId: string): Promise<{
    socialConnections: number;
    socialFollowing: number;
    contentSubmissions: number;
    referrals: number;
    dailyActivities: number;
    streakBonuses: number;
    governance: number;
    other: number;
  }> {
    const { data } = await this.supabase
      .from('point_transactions')
      .select('reference_type, amount')
      .eq('user_id', userId);

    const breakdown = {
      socialConnections: 0,
      socialFollowing: 0,
      contentSubmissions: 0,
      referrals: 0,
      dailyActivities: 0,
      streakBonuses: 0,
      governance: 0,
      other: 0,
    };

    (data || []).forEach((transaction) => {
      const amount = transaction.amount;
      switch (transaction.reference_type) {
        case 'social_connection':
        case 'oauth_connection':
          breakdown.socialConnections += amount;
          break;
        case 'social_follow':
          breakdown.socialFollowing += amount;
          break;
        case 'content_submission':
          breakdown.contentSubmissions += amount;
          break;
        case 'referral':
          breakdown.referrals += amount;
          break;
        case 'daily_activity':
          breakdown.dailyActivities += amount;
          break;
        case 'login_streak':
        case 'streak_bonus':
          breakdown.streakBonuses += amount;
          break;
        case 'governance':
        case 'governance_vote':
        case 'governance_comment':
          breakdown.governance += amount;
          break;
        default:
          breakdown.other += amount;
      }
    });

    return breakdown;
  }

  async getUserRank(userId: string): Promise<number | null> {
    const { data: userLeaderboard } = await this.supabase
      .from('airdrop_leaderboard')
      .select('score')
      .eq('user_id', userId)
      .maybeSingle();

    if (!userLeaderboard) return null;

    const { count } = await this.supabase
      .from('airdrop_leaderboard')
      .select('id', { count: 'exact' })
      .eq('banned', false)
      .gt('score', userLeaderboard.score);

    return (count || 0) + 1;
  }

  async getTotalPointsDistributed(): Promise<number> {
    const { data } = await this.supabase
      .from('airdrop_leaderboard')
      .select('score')
      .eq('banned', false);

    return (data || []).reduce((sum, entry) => sum + entry.score, 0);
  }

  async getTotalUsers(): Promise<number> {
    const { count } = await this.supabase
      .from('airdrop_leaderboard')
      .select('id', { count: 'exact' })
      .eq('banned', false);

    return count || 0;
  }

  async getAirdropEstimate(userId: string, totalSupply: number): Promise<AirdropEstimate> {
    const [userLeaderboard, totalPoints, userRank] = await Promise.all([
      this.supabase.from('airdrop_leaderboard').select('score').eq('user_id', userId).maybeSingle(),
      this.getTotalPointsDistributed(),
      this.getUserRank(userId),
    ]);

    const userPoints = userLeaderboard.data?.score || 0;
    const sharePercentage = PointCalculator.calculateAirdropPercentage(userPoints, totalPoints);
    const estimatedTokens = PointCalculator.calculateAirdropShare(userPoints, totalPoints, totalSupply);

    return {
      userPoints,
      totalPoints,
      sharePercentage,
      estimatedTokens,
      rank: userRank,
    };
  }

  async getLeaderboardStats(): Promise<{
    totalUsers: number;
    totalPoints: number;
    averagePoints: number;
    medianPoints: number;
    topUser: { userId: string; points: number } | null;
  }> {
    const { data } = await this.supabase
      .from('airdrop_leaderboard')
      .select('user_id, score')
      .eq('banned', false)
      .order('score', { ascending: false });

    if (!data || data.length === 0) {
      return {
        totalUsers: 0,
        totalPoints: 0,
        averagePoints: 0,
        medianPoints: 0,
        topUser: null,
      };
    }

    const totalPoints = data.reduce((sum, entry) => sum + entry.score, 0);
    const averagePoints = totalPoints / data.length;

    const sortedScores = [...data].sort((a, b) => a.score - b.score);
    const medianIndex = Math.floor(sortedScores.length / 2);
    const medianPoints =
      sortedScores.length % 2 === 0
        ? (sortedScores[medianIndex - 1].score + sortedScores[medianIndex].score) / 2
        : sortedScores[medianIndex].score;

    return {
      totalUsers: data.length,
      totalPoints,
      averagePoints,
      medianPoints,
      topUser: {
        userId: data[0].user_id,
        points: data[0].score,
      },
    };
  }

  async updateWalletAddress(userId: string, walletAddress: string): Promise<{ success: boolean }> {
    const { data: existing } = await this.supabase
      .from('users')
      .select('id')
      .eq('wallet_address', walletAddress)
      .neq('id', userId)
      .maybeSingle();

    if (existing) {
      throw new Error('This wallet address is already linked to another account');
    }

    const { error: userError } = await this.supabase
      .from('users')
      .update({ wallet_address: walletAddress })
      .eq('id', userId);

    if (userError) throw userError;

    const { error: leaderboardError } = await this.supabase
      .from('airdrop_leaderboard')
      .update({ wallet_address: walletAddress })
      .eq('user_id', userId);

    if (leaderboardError) throw leaderboardError;

    return { success: true };
  }

  async searchLeaderboard(
    query: string,
    limit = 10
  ): Promise<LeaderboardEntry[]> {
    const { data } = await this.supabase
      .from('airdrop_leaderboard')
      .select('*')
      .eq('banned', false)
      .or(`wallet_address.ilike.%${query}%`)
      .order('score', { ascending: false })
      .limit(limit);

    if (!data) return [];

    return data.map((entry, index) => ({
      rank: index + 1,
      userId: entry.user_id,
      walletAddress: this.maskWalletAddress(entry.wallet_address),
      score: entry.score,
      referralCount: entry.referral_count,
      socialConnections: {
        twitter: entry.twitter_connected,
        discord: entry.discord_connected,
        telegram: entry.telegram_connected,
        github: entry.github_connected,
      },
      totalContentApproved: entry.total_content_approved,
      lastActivity: entry.last_activity,
      createdAt: entry.created_at,
    }));
  }

  private async getReferralStats(userId: string): Promise<{ totalReferrals: number; totalEarnings: number }> {
    const { data: user } = await this.supabase
      .from('users')
      .select('referral_code')
      .eq('id', userId)
      .maybeSingle();

    if (!user?.referral_code) {
      return { totalReferrals: 0, totalEarnings: 0 };
    }

    const { count: totalReferrals } = await this.supabase
      .from('users')
      .select('id', { count: 'exact' })
      .eq('referred_by', user.referral_code);

    const { data: rewards } = await this.supabase
      .from('referral_rewards')
      .select('points_awarded')
      .eq('referrer_id', userId);

    const totalEarnings = (rewards || []).reduce((sum, r) => sum + r.points_awarded, 0);

    return { totalReferrals: totalReferrals || 0, totalEarnings };
  }

  private maskWalletAddress(address: string): string {
    if (!address || address.length < 10) return address;
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  }
}
