import { TOKENOMICS } from '../../../shared/constants/tokenomics';
import { supabase } from './supabase/client';

interface GuardrailStatus {
  name: string;
  limit: number;
  current: number;
  used: number;
  remaining: number;
  percentage: number;
  breached: boolean;
}

interface TreasuryHealth {
  healthy: boolean;
  guardrails: GuardrailStatus[];
  warnings: string[];
  errors: string[];
}

export class TreasuryGuardrailService {
  private readonly GUARDRAILS = TOKENOMICS.TREASURY_GUARDRAILS;

  async checkWeeklySpendCap(): Promise<GuardrailStatus> {
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

    const spent = await this.mockGetWeeklySpend(weekAgo);

    const limit = this.GUARDRAILS.WEEKLY_SPEND_CAP;
    const remaining = Math.max(0, limit - spent);
    const percentage = (spent / limit) * 100;

    return {
      name: 'Weekly Spend Cap',
      limit,
      current: spent,
      used: spent,
      remaining,
      percentage,
      breached: spent > limit,
    };
  }

  async checkBuybackFrequency(): Promise<GuardrailStatus> {
    const lastBuyback = await this.mockGetLastBuybackTime();
    const minHours = this.GUARDRAILS.BUYBACK_MIN_FREQUENCY_HOURS;

    const hoursSinceLastBuyback = lastBuyback
      ? (Date.now() - lastBuyback.getTime()) / (1000 * 60 * 60)
      : minHours + 1;

    return {
      name: 'Buyback Frequency',
      limit: minHours,
      current: hoursSinceLastBuyback,
      used: hoursSinceLastBuyback,
      remaining: Math.max(0, minHours - hoursSinceLastBuyback),
      percentage: (hoursSinceLastBuyback / minHours) * 100,
      breached: hoursSinceLastBuyback < minHours,
    };
  }

  async checkLPWithdrawalLimit(): Promise<GuardrailStatus> {
    const monthAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

    const totalLP = await this.mockGetTotalLP();
    const withdrawnThisMonth = await this.mockGetLPWithdrawn(monthAgo);

    const maxWithdrawal = totalLP * (this.GUARDRAILS.LP_WITHDRAWAL_MAX_PERCENTAGE / 100);
    const remaining = Math.max(0, maxWithdrawal - withdrawnThisMonth);
    const percentage = (withdrawnThisMonth / maxWithdrawal) * 100;

    return {
      name: 'LP Withdrawal Limit',
      limit: maxWithdrawal,
      current: withdrawnThisMonth,
      used: withdrawnThisMonth,
      remaining,
      percentage,
      breached: withdrawnThisMonth > maxWithdrawal,
    };
  }

  async checkAllowlistCompliance(): Promise<GuardrailStatus> {
    const transactions = await this.mockGetRecentTransactions();
    const allowlisted = await this.mockCountAllowlisted(transactions);

    const total = transactions.length;
    const percentage = total > 0 ? (allowlisted / total) * 100 : 100;

    return {
      name: 'Allowlist Compliance',
      limit: total,
      current: allowlisted,
      used: allowlisted,
      remaining: total - allowlisted,
      percentage,
      breached: allowlisted < total,
    };
  }

  async getTreasuryHealth(): Promise<TreasuryHealth> {
    const guardrails = await Promise.all([
      this.checkWeeklySpendCap(),
      this.checkBuybackFrequency(),
      this.checkLPWithdrawalLimit(),
      this.checkAllowlistCompliance(),
    ]);

    const warnings: string[] = [];
    const errors: string[] = [];

    guardrails.forEach(g => {
      if (g.breached) {
        errors.push(`${g.name} breached: ${g.current.toFixed(2)} / ${g.limit.toFixed(2)}`);
      } else if (g.percentage > 80) {
        warnings.push(`${g.name} approaching limit: ${g.percentage.toFixed(1)}% used`);
      }
    });

    return {
      healthy: errors.length === 0,
      guardrails,
      warnings,
      errors,
    };
  }

  private async mockGetWeeklySpend(since: Date): Promise<number> {
    return 45_000;
  }

  private async mockGetLastBuybackTime(): Promise<Date | null> {
    return new Date(Date.now() - 30 * 60 * 60 * 1000);
  }

  private async mockGetTotalLP(): Promise<number> {
    return TOKENOMICS.ALLOCATION.LIQUIDITY.amount;
  }

  private async mockGetLPWithdrawn(since: Date): Promise<number> {
    return 200_000;
  }

  private async mockGetRecentTransactions(): Promise<unknown[]> {
    return new Array(10).fill(null);
  }

  private async mockCountAllowlisted(transactions: unknown[]): Promise<number> {
    return transactions.length;
  }
}

export const treasuryGuardrails = new TreasuryGuardrailService();
