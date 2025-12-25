import type { SupabaseClient } from '@supabase/supabase-js';
import { DatabaseService } from '../../shared/services/DatabaseService.js';

export interface PointTransaction {
  id: string;
  userId: string;
  amount: number;
  reason: string;
  referenceId: string | null;
  referenceType: string | null;
  createdBy: string | null;
  metadata: Record<string, unknown>;
  createdAt: string;
}

export interface PointHistoryFilters {
  referenceType?: string;
  startDate?: string;
  endDate?: string;
  minAmount?: number;
  maxAmount?: number;
}

export class PointsService extends DatabaseService {
  constructor(supabase: SupabaseClient) {
    super('PointsService', supabase);
  }

  async awardPoints(
    userId: string,
    amount: number,
    reason: string,
    referenceId?: string,
    referenceType?: string,
    metadata?: Record<string, unknown>
  ): Promise<{ success: boolean; newTotal: number }> {
    if (amount <= 0) {
      throw new Error('Award amount must be positive');
    }

    const { error } = await this.supabase.rpc('award_points', {
      p_user_id: userId,
      p_amount: amount,
      p_reason: reason,
      p_reference_id: referenceId || null,
      p_reference_type: referenceType || null,
      p_created_by: null,
      p_metadata: metadata || {},
    });

    if (error) throw error;

    const { data: leaderboard } = await this.supabase
      .from('airdrop_leaderboard')
      .select('score')
      .eq('user_id', userId)
      .maybeSingle();

    return {
      success: true,
      newTotal: leaderboard?.score || amount,
    };
  }

  async deductPoints(
    userId: string,
    amount: number,
    reason: string,
    adminId?: string,
    metadata?: Record<string, unknown>
  ): Promise<{ success: boolean; newTotal: number }> {
    if (amount <= 0) {
      throw new Error('Deduction amount must be positive');
    }

    const { data: adminUser } = adminId
      ? await this.supabase.from('users').select('auth_user_id').eq('id', adminId).maybeSingle()
      : { data: null };

    const { error } = await this.supabase.rpc('award_points', {
      p_user_id: userId,
      p_amount: -amount,
      p_reason: reason,
      p_reference_id: null,
      p_reference_type: 'penalty',
      p_created_by: adminUser?.auth_user_id || null,
      p_metadata: metadata || {},
    });

    if (error) throw error;

    const { data: leaderboard } = await this.supabase
      .from('airdrop_leaderboard')
      .select('score')
      .eq('user_id', userId)
      .maybeSingle();

    return {
      success: true,
      newTotal: leaderboard?.score || 0,
    };
  }

  async logTransaction(
    userId: string,
    amount: number,
    reason: string,
    referenceId?: string,
    referenceType?: string,
    createdBy?: string,
    metadata?: Record<string, unknown>
  ): Promise<string> {
    const { data: adminUser } = createdBy
      ? await this.supabase.from('users').select('auth_user_id').eq('id', createdBy).maybeSingle()
      : { data: null };

    const { data, error } = await this.supabase
      .from('point_transactions')
      .insert({
        user_id: userId,
        amount,
        reason,
        reference_id: referenceId || null,
        reference_type: referenceType || null,
        created_by: adminUser?.auth_user_id || null,
        metadata: metadata || {},
      })
      .select('id')
      .single();

    if (error) throw error;
    return data.id;
  }

  async recalculateUserTotal(userId: string): Promise<number> {
    const { data, error } = await this.supabase.rpc('recalculate_user_points', {
      p_user_id: userId,
    });

    if (error) throw error;
    return data as number;
  }

  async getPointHistory(
    userId: string,
    filters?: PointHistoryFilters,
    limit = 50,
    offset = 0
  ): Promise<{ transactions: PointTransaction[]; total: number }> {
    let query = this.supabase
      .from('point_transactions')
      .select('*', { count: 'exact' })
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (filters?.referenceType) {
      query = query.eq('reference_type', filters.referenceType);
    }

    if (filters?.startDate) {
      query = query.gte('created_at', filters.startDate);
    }

    if (filters?.endDate) {
      query = query.lte('created_at', filters.endDate);
    }

    if (filters?.minAmount !== undefined) {
      query = query.gte('amount', filters.minAmount);
    }

    if (filters?.maxAmount !== undefined) {
      query = query.lte('amount', filters.maxAmount);
    }

    query = query.range(offset, offset + limit - 1);

    const { data, error, count } = await query;

    if (error) throw error;

    return {
      transactions: (data || []).map((row) => ({
        id: row.id,
        userId: row.user_id,
        amount: row.amount,
        reason: row.reason,
        referenceId: row.reference_id,
        referenceType: row.reference_type,
        createdBy: row.created_by,
        metadata: (row.metadata as Record<string, unknown>) || {},
        createdAt: row.created_at,
      })),
      total: count || 0,
    };
  }

  async getUserTotal(userId: string): Promise<number> {
    const { data, error } = await this.supabase
      .from('airdrop_leaderboard')
      .select('score')
      .eq('user_id', userId)
      .maybeSingle();

    if (error) throw error;
    return data?.score || 0;
  }

  async getPointBreakdown(userId: string): Promise<Record<string, number>> {
    const { data, error } = await this.supabase
      .from('point_transactions')
      .select('reference_type, amount')
      .eq('user_id', userId);

    if (error) throw error;

    const breakdown: Record<string, number> = {};

    (data || []).forEach((transaction) => {
      const type = transaction.reference_type || 'other';
      breakdown[type] = (breakdown[type] || 0) + transaction.amount;
    });

    return breakdown;
  }

  async manualAdjustment(
    userId: string,
    amount: number,
    reason: string,
    adminId: string,
    metadata?: Record<string, unknown>
  ): Promise<{ success: boolean; newTotal: number }> {
    const { data: adminUser } = await this.supabase
      .from('users')
      .select('auth_user_id, role')
      .eq('id', adminId)
      .maybeSingle();

    if (!adminUser || adminUser.role !== 'admin') {
      throw new Error('Unauthorized: Admin access required');
    }

    if (amount === 0) {
      throw new Error('Adjustment amount cannot be zero');
    }

    const { error } = await this.supabase.rpc('award_points', {
      p_user_id: userId,
      p_amount: amount,
      p_reason: `Manual adjustment by admin: ${reason}`,
      p_reference_id: null,
      p_reference_type: 'manual_adjustment',
      p_created_by: adminUser.auth_user_id,
      p_metadata: { ...metadata, adminId, adjustmentReason: reason },
    });

    if (error) throw error;

    const { data: leaderboard } = await this.supabase
      .from('airdrop_leaderboard')
      .select('score')
      .eq('user_id', userId)
      .maybeSingle();

    return {
      success: true,
      newTotal: leaderboard?.score || 0,
    };
  }

  async getRecentTransactions(limit = 100): Promise<PointTransaction[]> {
    const { data, error } = await this.supabase
      .from('point_transactions')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;

    return (data || []).map((row) => ({
      id: row.id,
      userId: row.user_id,
      amount: row.amount,
      reason: row.reason,
      referenceId: row.reference_id,
      referenceType: row.reference_type,
      createdBy: row.created_by,
      metadata: (row.metadata as Record<string, unknown>) || {},
      createdAt: row.created_at,
    }));
  }

  async getTotalPointsDistributed(): Promise<number> {
    const { data, error } = await this.supabase.from('airdrop_leaderboard').select('score');

    if (error) throw error;

    return (data || []).reduce((sum, row) => sum + (row.score || 0), 0);
  }
}
