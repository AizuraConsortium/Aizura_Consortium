import type { SupabaseClient } from '@supabase/supabase-js';
import { DatabaseService } from '../../shared/services/DatabaseService.js';
import { PointCalculator, POINT_VALUES } from '../../shared/utils/pointCalculator.js';

export type ActivityType =
  | 'login'
  | 'view_debate'
  | 'read_article'
  | 'vote'
  | 'comment'
  | 'retweet'
  | 'quote_tweet'
  | 'discord_share'
  | 'reddit_post';

export interface DailyActivity {
  id: string;
  userId: string;
  activityType: ActivityType;
  activityDate: string;
  pointsEarned: number;
  metadata: Record<string, unknown>;
  createdAt: string;
}

export class EngagementService extends DatabaseService {
  constructor(supabase: SupabaseClient) {
    super('EngagementService', supabase);
  }

  async trackLogin(userId: string): Promise<{ success: boolean; pointsAwarded: number; streakBonus: number }> {
    const today = new Date().toISOString().split('T')[0];

    const { data: user } = await this.supabase
      .from('users')
      .select('last_login_date, login_streak, total_logins')
      .eq('id', userId)
      .maybeSingle();

    let newStreak = 1;
    let streakBonus = 0;

    if (user?.last_login_date) {
      const lastLogin = new Date(user.last_login_date);
      const todayDate = new Date(today);
      const daysSinceLastLogin = Math.floor((todayDate.getTime() - lastLogin.getTime()) / (1000 * 60 * 60 * 24));

      if (daysSinceLastLogin === 0) {
        return { success: true, pointsAwarded: 0, streakBonus: 0 };
      } else if (daysSinceLastLogin === 1) {
        newStreak = (user.login_streak || 0) + 1;
      } else {
        newStreak = 1;
      }
    }

    await this.supabase
      .from('users')
      .update({
        last_login_date: today,
        login_streak: newStreak,
        total_logins: (user?.total_logins || 0) + 1,
      })
      .eq('id', userId);

    const calc = PointCalculator.calculateEngagement('LOGIN');
    await this.recordActivity(userId, 'login', calc.totalPoints, { streak: newStreak });

    if ([7, 14, 30, 60].includes(newStreak)) {
      const streakCalc = PointCalculator.calculateStreakBonus(newStreak);
      streakBonus = streakCalc.totalPoints;

      await this.supabase.rpc('award_points', {
        p_user_id: userId,
        p_amount: streakBonus,
        p_reason: streakCalc.reason,
        p_reference_type: 'login_streak',
        p_metadata: { streakDays: newStreak },
      });
    }

    const { data: leaderboard } = await this.supabase
      .from('airdrop_leaderboard')
      .select('total_logins')
      .eq('user_id', userId)
      .maybeSingle();

    await this.supabase
      .from('airdrop_leaderboard')
      .update({
        total_logins: (leaderboard?.total_logins || 0) + 1,
      })
      .eq('user_id', userId);

    return { success: true, pointsAwarded: calc.totalPoints, streakBonus };
  }

  async trackDebateView(
    userId: string,
    topicId: string,
    durationSeconds: number
  ): Promise<{ success: boolean; pointsAwarded: number }> {
    if (durationSeconds < 120) {
      return { success: true, pointsAwarded: 0 };
    }

    const today = new Date().toISOString().split('T')[0];

    const { count } = await this.supabase
      .from('daily_activities')
      .select('id', { count: 'exact' })
      .eq('user_id', userId)
      .eq('activity_type', 'view_debate')
      .eq('activity_date', today);

    if (count && count >= POINT_VALUES.LIMITS.DEBATES_PER_DAY) {
      return { success: true, pointsAwarded: 0 };
    }

    const calc = PointCalculator.calculateEngagement('VIEW_DEBATE');
    await this.recordActivity(userId, 'view_debate', calc.totalPoints, {
      topicId,
      durationSeconds,
    });

    return { success: true, pointsAwarded: calc.totalPoints };
  }

  async trackArticleRead(
    userId: string,
    articleId: string
  ): Promise<{ success: boolean; pointsAwarded: number }> {
    const today = new Date().toISOString().split('T')[0];

    const { count } = await this.supabase
      .from('daily_activities')
      .select('id', { count: 'exact' })
      .eq('user_id', userId)
      .eq('activity_type', 'read_article')
      .eq('activity_date', today);

    if (count && count >= POINT_VALUES.LIMITS.ARTICLES_PER_DAY) {
      return { success: true, pointsAwarded: 0 };
    }

    const calc = PointCalculator.calculateEngagement('READ_ARTICLE');
    await this.recordActivity(userId, 'read_article', calc.totalPoints, { articleId });

    return { success: true, pointsAwarded: calc.totalPoints };
  }

  async trackVote(userId: string, proposalId: string): Promise<{ success: boolean; pointsAwarded: number }> {
    const calc = PointCalculator.calculateEngagement('VOTE');

    await this.supabase.rpc('award_points', {
      p_user_id: userId,
      p_amount: calc.totalPoints,
      p_reason: calc.reason,
      p_reference_id: proposalId,
      p_reference_type: 'governance',
      p_metadata: { proposalId, action: 'vote' },
    });

    const { data: leaderboard2 } = await this.supabase
      .from('airdrop_leaderboard')
      .select('total_votes')
      .eq('user_id', userId)
      .maybeSingle();

    await this.supabase
      .from('airdrop_leaderboard')
      .update({
        total_votes: (leaderboard2?.total_votes || 0) + 1,
      })
      .eq('user_id', userId);

    return { success: true, pointsAwarded: calc.totalPoints };
  }

  async trackComment(userId: string, commentId: string): Promise<{ success: boolean; pointsAwarded: number }> {
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);

    const { count } = await this.supabase
      .from('daily_activities')
      .select('id', { count: 'exact' })
      .eq('user_id', userId)
      .eq('activity_type', 'comment')
      .gte('created_at', weekAgo.toISOString());

    if (count && count >= POINT_VALUES.LIMITS.COMMENTS_PER_WEEK) {
      return { success: true, pointsAwarded: 0 };
    }

    const calc = PointCalculator.calculateEngagement('COMMENT');
    await this.recordActivity(userId, 'comment', calc.totalPoints, { commentId });

    const { data: leaderboard3 } = await this.supabase
      .from('airdrop_leaderboard')
      .select('total_comments')
      .eq('user_id', userId)
      .maybeSingle();

    await this.supabase
      .from('airdrop_leaderboard')
      .update({
        total_comments: (leaderboard3?.total_comments || 0) + 1,
      })
      .eq('user_id', userId);

    return { success: true, pointsAwarded: calc.totalPoints };
  }

  async trackRetweet(userId: string, tweetUrl: string): Promise<{ success: boolean; pointsAwarded: number }> {
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);

    const { count } = await this.supabase
      .from('daily_activities')
      .select('id', { count: 'exact' })
      .eq('user_id', userId)
      .eq('activity_type', 'retweet')
      .gte('created_at', weekAgo.toISOString());

    if (count && count >= POINT_VALUES.LIMITS.RETWEETS_PER_WEEK) {
      return { success: true, pointsAwarded: 0 };
    }

    const calc = PointCalculator.calculateEngagement('VIEW_DEBATE');
    await this.recordActivity(userId, 'retweet', calc.totalPoints, { tweetUrl });

    return { success: true, pointsAwarded: calc.totalPoints };
  }

  async trackQuoteTweet(userId: string, tweetUrl: string): Promise<{ success: boolean; pointsAwarded: number }> {
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);

    const { count } = await this.supabase
      .from('daily_activities')
      .select('id', { count: 'exact' })
      .eq('user_id', userId)
      .eq('activity_type', 'quote_tweet')
      .gte('created_at', weekAgo.toISOString());

    if (count && count >= POINT_VALUES.LIMITS.QUOTE_TWEETS_PER_WEEK) {
      return { success: true, pointsAwarded: 0 };
    }

    const calc = PointCalculator.calculateEngagement('VIEW_DEBATE');
    await this.recordActivity(userId, 'quote_tweet', calc.totalPoints, { tweetUrl });

    return { success: true, pointsAwarded: calc.totalPoints };
  }

  async trackProposalSubmission(userId: string, proposalId: string): Promise<{ success: boolean; pointsAwarded: number }> {
    const calc = PointCalculator.calculateEngagement('PROPOSAL_SUBMIT');

    await this.supabase.rpc('award_points', {
      p_user_id: userId,
      p_amount: calc.totalPoints,
      p_reason: calc.reason,
      p_reference_id: proposalId,
      p_reference_type: 'governance',
      p_metadata: { proposalId, action: 'submit' },
    });

    return { success: true, pointsAwarded: calc.totalPoints };
  }

  async getUserActivitySummary(userId: string, days = 30): Promise<{
    totalActivities: number;
    pointsEarned: number;
    activitiesByType: Record<string, number>;
    dailyBreakdown: Array<{ date: string; activities: number; points: number }>;
  }> {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const { data } = await this.supabase
      .from('daily_activities')
      .select('*')
      .eq('user_id', userId)
      .gte('activity_date', startDate.toISOString().split('T')[0])
      .order('activity_date', { ascending: false });

    const activitiesByType: Record<string, number> = {};
    const dailyBreakdown: Map<string, { activities: number; points: number }> = new Map();

    let totalActivities = 0;
    let pointsEarned = 0;

    (data || []).forEach((activity) => {
      totalActivities++;
      pointsEarned += activity.points_earned;

      activitiesByType[activity.activity_type] = (activitiesByType[activity.activity_type] || 0) + 1;

      const dateKey = activity.activity_date;
      const existing = dailyBreakdown.get(dateKey) || { activities: 0, points: 0 };
      existing.activities++;
      existing.points += activity.points_earned;
      dailyBreakdown.set(dateKey, existing);
    });

    return {
      totalActivities,
      pointsEarned,
      activitiesByType,
      dailyBreakdown: Array.from(dailyBreakdown.entries())
        .map(([date, data]) => ({ date, ...data }))
        .sort((a, b) => b.date.localeCompare(a.date)),
    };
  }

  private async recordActivity(
    userId: string,
    activityType: ActivityType,
    pointsEarned: number,
    metadata: Record<string, unknown> = {}
  ): Promise<void> {
    const today = new Date().toISOString().split('T')[0];

    const { error } = await this.supabase.from('daily_activities').insert({
      user_id: userId,
      activity_type: activityType,
      activity_date: today,
      points_earned: pointsEarned,
      metadata,
    });

    if (error && error.code === '23505') {
      return;
    }

    if (error) throw error;

    await this.supabase.rpc('award_points', {
      p_user_id: userId,
      p_amount: pointsEarned,
      p_reason: `Daily activity: ${activityType}`,
      p_reference_type: 'daily_activity',
      p_metadata: { activityType, ...metadata },
    });
  }
}
