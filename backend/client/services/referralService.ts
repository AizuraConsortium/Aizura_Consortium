import type { SupabaseClient } from '@supabase/supabase-js';
import { DatabaseService } from '../../shared/services/DatabaseService.js';

export interface ReferralStats {
  totalReferrals: number;
  totalEarnings: number;
  pendingReferrals: number;
  milestoneBreakdown: {
    signup: number;
    twoSocials: number;
    points500: number;
    points2000: number;
  };
}

export interface ReferralDetails {
  userId: string;
  email?: string;
  joinedAt: string;
  currentPoints: number;
  connectedSocials: number;
  milestonesCompleted: string[];
  pointsEarned: number;
}

export class ReferralService extends DatabaseService {
  constructor(supabase: SupabaseClient) {
    super('ReferralService', supabase);
  }

  async generateReferralCode(userId: string): Promise<string> {
    const { data: existingUser } = await this.supabase
      .from('users')
      .select('referral_code')
      .eq('id', userId)
      .maybeSingle();

    if (existingUser?.referral_code) {
      return existingUser.referral_code;
    }

    const { data: newCode, error } = await this.supabase.rpc('generate_referral_code');

    if (error) throw error;

    const code = newCode as string;

    const { error: updateError } = await this.supabase
      .from('users')
      .update({ referral_code: code })
      .eq('id', userId);

    if (updateError) throw updateError;

    return code;
  }

  async validateReferralCode(code: string): Promise<{ valid: boolean; referrerId?: string }> {
    if (!code || !code.startsWith('AIZURA-')) {
      return { valid: false };
    }

    const { data, error } = await this.supabase
      .from('users')
      .select('id')
      .eq('referral_code', code)
      .maybeSingle();

    if (error || !data) {
      return { valid: false };
    }

    return { valid: true, referrerId: data.id };
  }

  async applyReferralCode(newUserId: string, code: string): Promise<{ success: boolean; referrerId?: string }> {
    const validation = await this.validateReferralCode(code);

    if (!validation.valid || !validation.referrerId) {
      throw new Error('Invalid referral code');
    }

    if (validation.referrerId === newUserId) {
      throw new Error('Cannot refer yourself');
    }

    const { data: existingUser } = await this.supabase
      .from('users')
      .select('referred_by')
      .eq('id', newUserId)
      .maybeSingle();

    if (existingUser?.referred_by) {
      throw new Error('User already has a referrer');
    }

    const { error: updateError } = await this.supabase
      .from('users')
      .update({ referred_by: code })
      .eq('id', newUserId);

    if (updateError) throw updateError;

    const { data: referrer } = await this.supabase
      .from('users')
      .select('referral_code')
      .eq('referral_code', code)
      .maybeSingle();

    if (referrer) {
      const { data: leaderboard } = await this.supabase
        .from('airdrop_leaderboard')
        .select('referral_count')
        .eq('user_id', validation.referrerId)
        .maybeSingle();

      await this.supabase
        .from('airdrop_leaderboard')
        .update({
          referral_count: (leaderboard?.referral_count || 0) + 1,
        })
        .eq('user_id', validation.referrerId);
    }

    return { success: true, referrerId: validation.referrerId };
  }

  async checkReferralMilestones(userId: string): Promise<void> {
    const { error } = await this.supabase.rpc('check_referral_milestones', {
      p_referee_id: userId,
    });

    if (error) throw error;
  }

  async getReferralStats(userId: string): Promise<ReferralStats> {
    const { data: user } = await this.supabase
      .from('users')
      .select('referral_code')
      .eq('id', userId)
      .maybeSingle();

    if (!user?.referral_code) {
      return {
        totalReferrals: 0,
        totalEarnings: 0,
        pendingReferrals: 0,
        milestoneBreakdown: {
          signup: 0,
          twoSocials: 0,
          points500: 0,
          points2000: 0,
        },
      };
    }

    const { count: totalReferrals } = await this.supabase
      .from('users')
      .select('id', { count: 'exact' })
      .eq('referred_by', user.referral_code);

    const { data: rewards } = await this.supabase
      .from('referral_rewards')
      .select('milestone, points_awarded')
      .eq('referrer_id', userId);

    const milestoneBreakdown = {
      signup: 0,
      twoSocials: 0,
      points500: 0,
      points2000: 0,
    };

    let totalEarnings = 0;

    (rewards || []).forEach((reward) => {
      totalEarnings += reward.points_awarded;
      if (reward.milestone === '2_socials') milestoneBreakdown.twoSocials++;
      if (reward.milestone === '500_points') milestoneBreakdown.points500++;
      if (reward.milestone === '2000_points') milestoneBreakdown.points2000++;
    });

    milestoneBreakdown.signup = totalReferrals || 0;

    const pendingReferrals = (totalReferrals || 0) - (rewards || []).length;

    return {
      totalReferrals: totalReferrals || 0,
      totalEarnings,
      pendingReferrals: Math.max(0, pendingReferrals),
      milestoneBreakdown,
    };
  }

  async getReferrals(userId: string): Promise<ReferralDetails[]> {
    const { data: user } = await this.supabase
      .from('users')
      .select('referral_code')
      .eq('id', userId)
      .maybeSingle();

    if (!user?.referral_code) {
      return [];
    }

    const { data: referredUsers } = await this.supabase
      .from('users')
      .select('id, email, created_at')
      .eq('referred_by', user.referral_code)
      .order('created_at', { ascending: false });

    if (!referredUsers || referredUsers.length === 0) {
      return [];
    }

    const referralDetails: ReferralDetails[] = [];

    for (const referredUser of referredUsers) {
      const [leaderboardData, rewardsData] = await Promise.all([
        this.supabase
          .from('airdrop_leaderboard')
          .select(
            'score, twitter_connected, discord_connected, telegram_connected, github_connected'
          )
          .eq('user_id', referredUser.id)
          .maybeSingle(),
        this.supabase
          .from('referral_rewards')
          .select('milestone, points_awarded')
          .eq('referrer_id', userId)
          .eq('referee_id', referredUser.id),
      ]);

      const connectedSocials =
        (leaderboardData.data?.twitter_connected ? 1 : 0) +
        (leaderboardData.data?.discord_connected ? 1 : 0) +
        (leaderboardData.data?.telegram_connected ? 1 : 0) +
        (leaderboardData.data?.github_connected ? 1 : 0);

      const milestonesCompleted = (rewardsData.data || []).map((r) => r.milestone);
      const pointsEarned = (rewardsData.data || []).reduce((sum, r) => sum + r.points_awarded, 0);

      referralDetails.push({
        userId: referredUser.id,
        email: referredUser.email,
        joinedAt: referredUser.created_at,
        currentPoints: leaderboardData.data?.score || 0,
        connectedSocials,
        milestonesCompleted,
        pointsEarned,
      });
    }

    return referralDetails;
  }

  async getTopReferrers(limit = 10): Promise<Array<{ userId: string; referralCount: number; totalEarnings: number }>> {
    const { data } = await this.supabase
      .from('airdrop_leaderboard')
      .select('user_id, referral_count')
      .order('referral_count', { ascending: false })
      .limit(limit);

    if (!data) return [];

    const topReferrers = await Promise.all(
      data.map(async (entry) => {
        const { data: rewards } = await this.supabase
          .from('referral_rewards')
          .select('points_awarded')
          .eq('referrer_id', entry.user_id);

        const totalEarnings = (rewards || []).reduce((sum, r) => sum + r.points_awarded, 0);

        return {
          userId: entry.user_id,
          referralCount: entry.referral_count,
          totalEarnings,
        };
      })
    );

    return topReferrers.sort((a, b) => b.referralCount - a.referralCount);
  }
}
