import { supabase } from './supabase/client';
import { ErrorLogger } from './errorLogger';

interface PointValue {
  action_type: string;
  base_points: number;
  max_per_day: number | null;
  max_per_month: number | null;
  decay_rate: number;
  active: boolean;
}

interface PointsResult {
  success: boolean;
  points_awarded: number;
  reason?: string;
  capped?: boolean;
}

export class PointsCalculationEngine {
  private pointValuesCache: Map<string, PointValue> = new Map();
  private cacheExpiry: number = 0;
  private readonly CACHE_DURATION = 5 * 60 * 1000;
  private errorLogger = ErrorLogger.getInstance();

  async refreshPointValues(): Promise<void> {
    try {
      const { data, error } = await supabase
        .from('u2e_point_values')
        .select('*')
        .eq('active', true);

      if (error) throw error;

      this.pointValuesCache.clear();
      data?.forEach((pv: PointValue) => {
        this.pointValuesCache.set(pv.action_type, pv);
      });

      this.cacheExpiry = Date.now() + this.CACHE_DURATION;
    } catch (error) {
      await this.errorLogger.logBackendError(
        'POINTS_ENGINE_ERROR',
        'Failed to refresh point values',
        { stackTrace: error instanceof Error ? error.stack : undefined }
      );
      throw error;
    }
  }

  async getPointValue(actionType: string): Promise<PointValue | null> {
    if (Date.now() > this.cacheExpiry) {
      await this.refreshPointValues();
    }

    return this.pointValuesCache.get(actionType) || null;
  }

  async calculatePoints(
    userId: string,
    actionType: string,
    metadata: Record<string, unknown> = {}
  ): Promise<PointsResult> {
    try {
      const pointValue = await this.getPointValue(actionType);

      if (!pointValue) {
        return {
          success: false,
          points_awarded: 0,
          reason: 'Invalid action type',
        };
      }

      const now = new Date();
      const month = now.getMonth() + 1;
      const year = now.getFullYear();

      const dailyCheck = await this.checkDailyLimit(userId, actionType, pointValue);
      if (!dailyCheck.allowed) {
        return {
          success: false,
          points_awarded: 0,
          reason: dailyCheck.reason,
          capped: true,
        };
      }

      const monthlyCheck = await this.checkMonthlyLimit(userId, actionType, month, year, pointValue);
      if (!monthlyCheck.allowed) {
        return {
          success: false,
          points_awarded: 0,
          reason: monthlyCheck.reason,
          capped: true,
        };
      }

      const abuseCheck = await this.detectAbuse(userId, actionType);
      if (!abuseCheck.clean) {
        await this.flagUser(userId, 'rate_limit_exceeded', 'medium', abuseCheck.reason || 'Suspicious activity');
        return {
          success: false,
          points_awarded: 0,
          reason: 'Suspicious activity detected',
        };
      }

      let pointsToAward = pointValue.base_points;

      if (pointValue.decay_rate > 0) {
        pointsToAward = await this.applyDecay(userId, actionType, pointValue, month, year);
      }

      const { error } = await supabase.from('u2e_user_points').insert({
        user_id: userId,
        month,
        year,
        action_type: actionType,
        points_earned: pointsToAward,
        metadata,
      });

      if (error) throw error;

      return {
        success: true,
        points_awarded: pointsToAward,
      };
    } catch (error) {
      await this.errorLogger.logBackendError(
        'POINTS_CALCULATION_ERROR',
        'Failed to calculate points',
        {
          stackTrace: error instanceof Error ? error.stack : undefined,
          metadata: { userId, actionType }
        }
      );

      return {
        success: false,
        points_awarded: 0,
        reason: 'Internal error',
      };
    }
  }

  private async checkDailyLimit(
    userId: string,
    actionType: string,
    pointValue: PointValue
  ): Promise<{ allowed: boolean; reason?: string }> {
    if (!pointValue.max_per_day) {
      return { allowed: true };
    }

    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const { data, error } = await supabase
      .from('u2e_user_points')
      .select('points_earned')
      .eq('user_id', userId)
      .eq('action_type', actionType)
      .gte('created_at', startOfDay.toISOString());

    if (error) throw error;

    const totalToday = data?.reduce((sum, record) => sum + record.points_earned, 0) || 0;

    if (totalToday >= pointValue.max_per_day) {
      return {
        allowed: false,
        reason: `Daily limit reached for ${actionType}`,
      };
    }

    return { allowed: true };
  }

  private async checkMonthlyLimit(
    userId: string,
    actionType: string,
    month: number,
    year: number,
    pointValue: PointValue
  ): Promise<{ allowed: boolean; reason?: string }> {
    if (!pointValue.max_per_month) {
      return { allowed: true };
    }

    const { data, error } = await supabase
      .from('u2e_user_points')
      .select('points_earned')
      .eq('user_id', userId)
      .eq('action_type', actionType)
      .eq('month', month)
      .eq('year', year);

    if (error) throw error;

    const totalThisMonth = data?.reduce((sum, record) => sum + record.points_earned, 0) || 0;

    if (totalThisMonth >= pointValue.max_per_month) {
      return {
        allowed: false,
        reason: `Monthly limit reached for ${actionType}`,
      };
    }

    return { allowed: true };
  }

  private async detectAbuse(
    userId: string,
    actionType: string
  ): Promise<{ clean: boolean; reason?: string }> {
    const lastHour = new Date(Date.now() - 60 * 60 * 1000);

    const { data, error } = await supabase
      .from('u2e_user_points')
      .select('id')
      .eq('user_id', userId)
      .eq('action_type', actionType)
      .gte('created_at', lastHour.toISOString());

    if (error) throw error;

    const actionsLastHour = data?.length || 0;

    if (actionsLastHour > 100) {
      return {
        clean: false,
        reason: `Unusual activity: ${actionsLastHour} actions in last hour`,
      };
    }

    return { clean: true };
  }

  private async applyDecay(
    userId: string,
    actionType: string,
    pointValue: PointValue,
    month: number,
    year: number
  ): Promise<number> {
    const { data } = await supabase
      .from('u2e_user_points')
      .select('id')
      .eq('user_id', userId)
      .eq('action_type', actionType)
      .eq('month', month)
      .eq('year', year);

    const actionCount = data?.length || 0;
    const decayMultiplier = Math.pow(1 - pointValue.decay_rate, actionCount);

    return Math.max(
      Math.round(pointValue.base_points * decayMultiplier),
      Math.round(pointValue.base_points * 0.1)
    );
  }

  private async flagUser(
    userId: string,
    flagType: string,
    severity: string,
    description: string
  ): Promise<void> {
    try {
      await supabase.from('u2e_abuse_flags').insert({
        user_id: userId,
        flag_type: flagType,
        severity,
        description,
      });
    } catch (error) {
      await this.errorLogger.logBackendError(
        'FLAG_USER_ERROR',
        'Failed to flag user',
        {
          stackTrace: error instanceof Error ? error.stack : undefined,
          metadata: { userId, flagType }
        }
      );
    }
  }

  async getUserMonthlyPoints(userId: string, month: number, year: number): Promise<{
    total_points: number;
    actions_count: number;
    breakdown: Record<string, number>;
  }> {
    const { data: summary } = await supabase
      .from('u2e_user_monthly_summary')
      .select('*')
      .eq('user_id', userId)
      .eq('month', month)
      .eq('year', year)
      .single();

    const { data: points } = await supabase
      .from('u2e_user_points')
      .select('action_type, points_earned')
      .eq('user_id', userId)
      .eq('month', month)
      .eq('year', year);

    const breakdown: Record<string, number> = {};
    points?.forEach(p => {
      breakdown[p.action_type] = (breakdown[p.action_type] || 0) + p.points_earned;
    });

    return {
      total_points: summary?.total_points || 0,
      actions_count: summary?.actions_count || 0,
      breakdown,
    };
  }

  async calculateMonthlyDistribution(month: number, year: number): Promise<{
    total_points: number;
    total_participants: number;
    aaic_pool: number;
    distributions: Array<{
      user_id: string;
      points: number;
      share: number;
      aaic: number;
    }>;
  }> {
    const { data, error } = await supabase.rpc('calculate_u2e_monthly_distribution', {
      p_month: month,
      p_year: year,
    });

    if (error) throw error;

    const totalPoints = data?.reduce((sum: number, d: { total_points: number }) => sum + d.total_points, 0) || 0;
    const aaicPool = 458333;

    return {
      total_points: totalPoints,
      total_participants: data?.length || 0,
      aaic_pool: aaicPool,
      distributions: data?.map((d: { user_id: string; total_points: number; pool_share: number; aaic_amount: number }) => ({
        user_id: d.user_id,
        points: d.total_points,
        share: d.pool_share,
        aaic: d.aaic_amount,
      })) || [],
    };
  }
}

export const pointsEngine = new PointsCalculationEngine();
