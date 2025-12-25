import type { SupabaseClient } from '@supabase/supabase-js';

export interface SybilCheckResult {
  isSuspicious: boolean;
  riskScore: number;
  flags: string[];
  reasons: string[];
}

export interface UserActivity {
  userId: string;
  email?: string;
  walletAddress?: string;
  ipAddress?: string;
  userAgent?: string;
  createdAt: Date;
  totalPoints: number;
  connectedSocials: number;
  activityCount: number;
}

export class AntiSybilDetector {
  private supabase: SupabaseClient;
  private readonly RISK_THRESHOLDS = {
    HIGH: 80,
    MEDIUM: 50,
    LOW: 30,
  };

  constructor(supabase: SupabaseClient) {
    this.supabase = supabase;
  }

  async checkUser(userId: string): Promise<SybilCheckResult> {
    const result: SybilCheckResult = {
      isSuspicious: false,
      riskScore: 0,
      flags: [],
      reasons: [],
    };

    const [walletCheck, ipCheck, ipClusterCheck, behaviorCheck, socialCheck, referralCheck] = await Promise.all([
      this.checkDuplicateWallets(userId),
      this.checkSuspiciousIP(userId),
      this.checkIPClustering(userId),
      this.checkSuspiciousBehavior(userId),
      this.checkSocialAccounts(userId),
      this.checkReferralChains(userId),
    ]);

    result.riskScore += walletCheck.riskScore || 0;
    result.riskScore += ipCheck.riskScore || 0;
    result.riskScore += ipClusterCheck.riskScore || 0;
    result.riskScore += behaviorCheck.riskScore || 0;
    result.riskScore += socialCheck.riskScore || 0;
    result.riskScore += referralCheck.riskScore || 0;

    result.flags.push(
      ...(walletCheck.flags || []),
      ...(ipCheck.flags || []),
      ...(ipClusterCheck.flags || []),
      ...(behaviorCheck.flags || []),
      ...(socialCheck.flags || []),
      ...(referralCheck.flags || [])
    );
    result.reasons.push(
      ...(walletCheck.reasons || []),
      ...(ipCheck.reasons || []),
      ...(ipClusterCheck.reasons || []),
      ...(behaviorCheck.reasons || []),
      ...(socialCheck.reasons || []),
      ...(referralCheck.reasons || [])
    );

    result.isSuspicious = result.riskScore >= this.RISK_THRESHOLDS.MEDIUM;

    return result;
  }

  private async checkDuplicateWallets(userId: string): Promise<Partial<SybilCheckResult>> {
    const result = { riskScore: 0, flags: [] as string[], reasons: [] as string[] };

    const { data: user } = await this.supabase
      .from('users')
      .select('wallet_address')
      .eq('id', userId)
      .maybeSingle();

    if (!user?.wallet_address) return result;

    const { data: duplicates, count } = await this.supabase
      .from('users')
      .select('id', { count: 'exact' })
      .eq('wallet_address', user.wallet_address)
      .neq('id', userId);

    if (count && count > 0) {
      result.riskScore += 40;
      result.flags.push('duplicate_wallet');
      result.reasons.push(`Wallet address shared with ${count} other account(s)`);
    }

    return result;
  }

  private async checkSuspiciousIP(userId: string): Promise<Partial<SybilCheckResult>> {
    const result = { riskScore: 0, flags: [] as string[], reasons: [] as string[] };

    const { data: recentActivities } = await this.supabase
      .from('daily_activities')
      .select('metadata')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(10);

    if (!recentActivities || recentActivities.length === 0) return result;

    const ipAddresses = new Set<string>();
    recentActivities.forEach((activity) => {
      const metadata = activity.metadata as Record<string, unknown>;
      if (metadata?.ipAddress) {
        ipAddresses.add(metadata.ipAddress as string);
      }
    });

    if (ipAddresses.size > 5) {
      result.riskScore += 20;
      result.flags.push('ip_hopping');
      result.reasons.push(`Used ${ipAddresses.size} different IP addresses recently`);
    }

    return result;
  }

  private async checkSuspiciousBehavior(userId: string): Promise<Partial<SybilCheckResult>> {
    const result = { riskScore: 0, flags: [] as string[], reasons: [] as string[] };

    const { data: user } = await this.supabase
      .from('users')
      .select('created_at')
      .eq('id', userId)
      .maybeSingle();

    if (!user) return result;

    const accountAge = Date.now() - new Date(user.created_at).getTime();
    const accountAgeHours = accountAge / (1000 * 60 * 60);

    const { data: leaderboard } = await this.supabase
      .from('airdrop_leaderboard')
      .select('score, total_logins')
      .eq('user_id', userId)
      .maybeSingle();

    if (leaderboard) {
      if (accountAgeHours < 24 && leaderboard.score > 500) {
        result.riskScore += 30;
        result.flags.push('rapid_point_gain');
        result.reasons.push('Earned over 500 points within first 24 hours');
      }

      if (leaderboard.total_logins > 100 && accountAgeHours < 168) {
        result.riskScore += 25;
        result.flags.push('excessive_logins');
        result.reasons.push('Unusual login frequency for new account');
      }

      const pointsPerHour = accountAgeHours > 0 ? leaderboard.score / accountAgeHours : 0;
      if (pointsPerHour > 50) {
        result.riskScore += 20;
        result.flags.push('unnatural_activity_rate');
        result.reasons.push(`Earning ${pointsPerHour.toFixed(1)} points per hour (unusually high)`);
      }
    }

    return result;
  }

  private async checkSocialAccounts(userId: string): Promise<Partial<SybilCheckResult>> {
    const result = { riskScore: 0, flags: [] as string[], reasons: [] as string[] };

    const { data: leaderboard } = await this.supabase
      .from('airdrop_leaderboard')
      .select(
        'twitter_user_id, discord_user_id, telegram_user_id, github_user_id, twitter_connected, discord_connected, telegram_connected, github_connected'
      )
      .eq('user_id', userId)
      .maybeSingle();

    if (!leaderboard) return result;

    const connectedCount =
      (leaderboard.twitter_connected ? 1 : 0) +
      (leaderboard.discord_connected ? 1 : 0) +
      (leaderboard.telegram_connected ? 1 : 0) +
      (leaderboard.github_connected ? 1 : 0);

    if (connectedCount === 0) {
      result.riskScore += 15;
      result.flags.push('no_social_connections');
      result.reasons.push('No social media accounts connected');
    }

    for (const platform of ['twitter', 'discord', 'telegram', 'github'] as const) {
      const userIdField = `${platform}_user_id` as keyof typeof leaderboard;
      const platformUserId = leaderboard[userIdField];

      if (platformUserId) {
        const { count } = await this.supabase
          .from('airdrop_leaderboard')
          .select('id', { count: 'exact' })
          .eq(userIdField, platformUserId)
          .neq('user_id', userId);

        if (count && count > 0) {
          result.riskScore += 35;
          result.flags.push(`duplicate_${platform}`);
          result.reasons.push(`${platform} account linked to ${count} other user(s)`);
        }
      }
    }

    return result;
  }

  private async checkIPClustering(userId: string): Promise<Partial<SybilCheckResult>> {
    const result = { riskScore: 0, flags: [] as string[], reasons: [] as string[] };

    const { data: userActivities } = await this.supabase
      .from('daily_activities')
      .select('metadata')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(5);

    if (!userActivities || userActivities.length === 0) return result;

    const userIPs = new Set<string>();
    userActivities.forEach((activity) => {
      const metadata = activity.metadata as Record<string, unknown>;
      if (metadata?.ipAddress) {
        userIPs.add(metadata.ipAddress as string);
      }
    });

    for (const ip of userIPs) {
      const { data: sameIPUsers } = await this.supabase
        .from('daily_activities')
        .select('user_id')
        .contains('metadata', { ipAddress: ip })
        .neq('user_id', userId);

      if (sameIPUsers) {
        const uniqueUsers = new Set(sameIPUsers.map(a => a.user_id));

        if (uniqueUsers.size > 5) {
          result.riskScore += 50;
          result.flags.push('ip_clustering');
          result.reasons.push(`IP address ${ip.substring(0, 10)}... shared with ${uniqueUsers.size} other accounts`);
        } else if (uniqueUsers.size > 2) {
          result.riskScore += 25;
          result.flags.push('shared_ip');
          result.reasons.push(`IP address shared with ${uniqueUsers.size} other accounts`);
        }
      }
    }

    return result;
  }

  private async checkReferralChains(userId: string): Promise<Partial<SybilCheckResult>> {
    const result = { riskScore: 0, flags: [] as string[], reasons: [] as string[] };

    const { data: leaderboard } = await this.supabase
      .from('airdrop_leaderboard')
      .select('referral_code, referred_by_code')
      .eq('user_id', userId)
      .maybeSingle();

    if (!leaderboard || !leaderboard.referral_code) return result;

    const visited = new Set<string>();
    const chain: string[] = [];
    let currentCode = leaderboard.referred_by_code;

    while (currentCode && !visited.has(currentCode) && chain.length < 10) {
      visited.add(currentCode);
      chain.push(currentCode);

      const { data: referrer } = await this.supabase
        .from('airdrop_leaderboard')
        .select('referral_code, referred_by_code, user_id')
        .eq('referral_code', currentCode)
        .maybeSingle();

      if (!referrer) break;

      if (referrer.referral_code === leaderboard.referral_code) {
        result.riskScore += 60;
        result.flags.push('circular_referral');
        result.reasons.push(`Circular referral chain detected (length: ${chain.length + 1})`);
        break;
      }

      currentCode = referrer.referred_by_code;
    }

    if (leaderboard.referral_code) {
      const { data: referrals } = await this.supabase
        .from('airdrop_leaderboard')
        .select('user_id, score, created_at')
        .eq('referred_by_code', leaderboard.referral_code)
        .gte('score', 100);

      if (referrals && referrals.length > 0) {
        const referralTimes = referrals.map(r => new Date(r.created_at).getTime());
        const avgTimeDiff = referralTimes.length > 1
          ? referralTimes.reduce((sum, time, i, arr) => i > 0 ? sum + (time - arr[i-1]) : sum, 0) / (referralTimes.length - 1)
          : 0;

        if (referrals.length >= 5 && avgTimeDiff < 3600000) {
          result.riskScore += 35;
          result.flags.push('suspicious_referral_pattern');
          result.reasons.push(`${referrals.length} referrals joined within short time periods (avg ${Math.round(avgTimeDiff / 60000)} minutes apart)`);
        }

        const scores = referrals.map(r => r.score);
        const avgScore = scores.reduce((a, b) => a + b, 0) / scores.length;
        const scoreVariance = scores.reduce((sum, score) => sum + Math.pow(score - avgScore, 2), 0) / scores.length;
        const scoreStdDev = Math.sqrt(scoreVariance);

        if (referrals.length >= 3 && scoreStdDev < avgScore * 0.1) {
          result.riskScore += 25;
          result.flags.push('identical_referral_behavior');
          result.reasons.push(`Referrals have suspiciously similar scores (${Math.round(avgScore)} ± ${Math.round(scoreStdDev)})`);
        }
      }
    }

    return result;
  }

  async flagUser(userId: string, reason: string, adminId?: string): Promise<void> {
    await this.supabase
      .from('airdrop_leaderboard')
      .update({
        flagged: true,
        flag_reason: reason,
        flagged_at: new Date().toISOString(),
      })
      .eq('user_id', userId);

    const { data: adminUser } = adminId
      ? await this.supabase.from('users').select('auth_user_id').eq('id', adminId).maybeSingle()
      : { data: null };

    await this.supabase.from('point_transactions').insert({
      user_id: userId,
      amount: 0,
      reason: `Account flagged: ${reason}`,
      reference_type: 'manual_adjustment',
      created_by: adminUser?.auth_user_id || null,
      metadata: { action: 'flag', reason },
    });
  }

  async banUser(userId: string, reason: string, adminId?: string): Promise<void> {
    await this.supabase
      .from('airdrop_leaderboard')
      .update({
        banned: true,
        banned_reason: reason,
        banned_at: new Date().toISOString(),
        flagged: true,
        flag_reason: reason,
      })
      .eq('user_id', userId);

    const { data: adminUser } = adminId
      ? await this.supabase.from('users').select('auth_user_id').eq('id', adminId).maybeSingle()
      : { data: null };

    await this.supabase.from('point_transactions').insert({
      user_id: userId,
      amount: 0,
      reason: `Account banned: ${reason}`,
      reference_type: 'penalty',
      created_by: adminUser?.auth_user_id || null,
      metadata: { action: 'ban', reason },
    });
  }

  async unflagUser(userId: string, adminId?: string): Promise<void> {
    await this.supabase
      .from('airdrop_leaderboard')
      .update({
        flagged: false,
        flag_reason: null,
        flagged_at: null,
      })
      .eq('user_id', userId);

    const { data: adminUser } = adminId
      ? await this.supabase.from('users').select('auth_user_id').eq('id', adminId).maybeSingle()
      : { data: null };

    await this.supabase.from('point_transactions').insert({
      user_id: userId,
      amount: 0,
      reason: 'Account unflagged by admin',
      reference_type: 'manual_adjustment',
      created_by: adminUser?.auth_user_id || null,
      metadata: { action: 'unflag' },
    });
  }

  async runBulkScan(limit = 100): Promise<{ scanned: number; flagged: string[] }> {
    const { data: users } = await this.supabase
      .from('airdrop_leaderboard')
      .select('user_id, score')
      .eq('flagged', false)
      .eq('banned', false)
      .order('score', { ascending: false })
      .limit(limit);

    if (!users) return { scanned: 0, flagged: [] };

    const flaggedUsers: string[] = [];

    for (const user of users) {
      const result = await this.checkUser(user.user_id);
      if (result.riskScore >= this.RISK_THRESHOLDS.HIGH) {
        await this.flagUser(user.user_id, result.reasons.join('; '));
        flaggedUsers.push(user.user_id);
      }
    }

    return {
      scanned: users.length,
      flagged: flaggedUsers,
    };
  }
}
