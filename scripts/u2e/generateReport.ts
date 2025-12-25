/**
 * U2E Report Generator
 *
 * Generates comprehensive reports for U2E system analysis.
 *
 * Usage:
 *   tsx scripts/u2e/generateReport.ts --type=monthly --month=2024-12
 *   tsx scripts/u2e/generateReport.ts --type=user --user-id=user-123
 *   tsx scripts/u2e/generateReport.ts --type=business --business=AI_Traders
 */

import { getSupabaseClient } from '../../backend/shared/services/supabase/client';
import * as fs from 'fs';
import * as path from 'path';

const supabaseClient = getSupabaseClient();

interface MonthlyReport {
  period: string;
  totalUsers: number;
  activeUsers: number;
  totalEvents: number;
  totalRewards: number;
  topBusinesses: Array<{ business: string; rewards: number }>;
  topUsers: Array<{ user_id: string; rewards: number }>;
}

interface UserReport {
  userId: string;
  totalEarned: number;
  businessBreakdown: Array<{ business: string; rewards: number; usage: number }>;
  monthlyTrend: Array<{ month: string; rewards: number }>;
}

interface BusinessReport {
  businessName: string;
  totalUsers: number;
  totalEvents: number;
  totalRewards: number;
  actionBreakdown: Array<{ action: string; count: number; rewards: number }>;
}

export class ReportGenerator {
  async generateMonthlyReport(month: string): Promise<MonthlyReport> {
    console.log(`Generating monthly report for ${month}...`);

    const startDate = new Date(`${month}-01`);
    const endDate = new Date(startDate.getFullYear(), startDate.getMonth() + 1, 0);

    const { data: events } = await supabaseClient
      .from('u2e_usage_events')
      .select('user_id, business_id')
      .gte('created_at', startDate.toISOString())
      .lte('created_at', endDate.toISOString());

    const uniqueUsers = new Set(events?.map(e => e.user_id) || []);

    const { data: rewards } = await supabaseClient
      .from('u2e_usage_rewards')
      .select('user_id, business_id, rewards_earned, u2e_businesses(business_name)')
      .gte('period_start', startDate.toISOString())
      .lte('period_start', endDate.toISOString());

    const totalRewards = rewards?.reduce((sum, r) => sum + r.rewards_earned, 0) || 0;

    const businessMap = new Map<string, number>();
    rewards?.forEach(r => {
      const business = (r as any).u2e_businesses.business_name;
      businessMap.set(business, (businessMap.get(business) || 0) + r.rewards_earned);
    });

    const topBusinesses = Array.from(businessMap.entries())
      .map(([business, rewards]) => ({ business, rewards }))
      .sort((a, b) => b.rewards - a.rewards)
      .slice(0, 10);

    const userMap = new Map<string, number>();
    rewards?.forEach(r => {
      userMap.set(r.user_id, (userMap.get(r.user_id) || 0) + r.rewards_earned);
    });

    const topUsers = Array.from(userMap.entries())
      .map(([user_id, rewards]) => ({ user_id, rewards }))
      .sort((a, b) => b.rewards - a.rewards)
      .slice(0, 10);

    return {
      period: month,
      totalUsers: uniqueUsers.size,
      activeUsers: userMap.size,
      totalEvents: events?.length || 0,
      totalRewards,
      topBusinesses,
      topUsers,
    };
  }

  async generateUserReport(userId: string): Promise<UserReport> {
    console.log(`Generating user report for ${userId}...`);

    const { data: stats } = await supabaseClient
      .from('u2e_user_stats')
      .select('total_rewards_earned')
      .eq('user_id', userId)
      .maybeSingle();

    const { data: breakdown } = await supabaseClient
      .from('u2e_usage_rewards')
      .select('business_id, usage_count, rewards_earned, u2e_businesses(business_name)')
      .eq('user_id', userId);

    const businessBreakdown = breakdown?.map((r: any) => ({
      business: r.u2e_businesses.business_name,
      rewards: r.rewards_earned,
      usage: r.usage_count,
    })) || [];

    const { data: monthly } = await supabaseClient
      .from('u2e_usage_rewards')
      .select('period_start, rewards_earned')
      .eq('user_id', userId)
      .order('period_start', { ascending: true });

    const monthlyMap = new Map<string, number>();
    monthly?.forEach(r => {
      const month = r.period_start.substring(0, 7);
      monthlyMap.set(month, (monthlyMap.get(month) || 0) + r.rewards_earned);
    });

    const monthlyTrend = Array.from(monthlyMap.entries()).map(([month, rewards]) => ({
      month,
      rewards,
    }));

    return {
      userId,
      totalEarned: stats?.total_rewards_earned || 0,
      businessBreakdown,
      monthlyTrend,
    };
  }

  async generateBusinessReport(businessName: string): Promise<BusinessReport> {
    console.log(`Generating business report for ${businessName}...`);

    const { data: business } = await supabaseClient
      .from('u2e_businesses')
      .select('id')
      .eq('business_name', businessName)
      .maybeSingle();

    if (!business) {
      throw new Error(`Business ${businessName} not found`);
    }

    const { data: events } = await supabaseClient
      .from('u2e_usage_events')
      .select('user_id, action_type')
      .eq('business_id', business.id);

    const uniqueUsers = new Set(events?.map(e => e.user_id) || []);

    const { data: rewards } = await supabaseClient
      .from('u2e_usage_rewards')
      .select('action_type, usage_count, rewards_earned')
      .eq('business_id', business.id);

    const actionMap = new Map<string, { count: number; rewards: number }>();
    rewards?.forEach(r => {
      const existing = actionMap.get(r.action_type) || { count: 0, rewards: 0 };
      actionMap.set(r.action_type, {
        count: existing.count + r.usage_count,
        rewards: existing.rewards + r.rewards_earned,
      });
    });

    const actionBreakdown = Array.from(actionMap.entries()).map(([action, data]) => ({
      action,
      ...data,
    }));

    const totalRewards = rewards?.reduce((sum, r) => sum + r.rewards_earned, 0) || 0;

    return {
      businessName,
      totalUsers: uniqueUsers.size,
      totalEvents: events?.length || 0,
      totalRewards,
      actionBreakdown,
    };
  }

  async saveReport(report: any, filename: string) {
    const reportsDir = path.join(process.cwd(), 'reports', 'u2e');

    if (!fs.existsSync(reportsDir)) {
      fs.mkdirSync(reportsDir, { recursive: true });
    }

    const filepath = path.join(reportsDir, filename);
    fs.writeFileSync(filepath, JSON.stringify(report, null, 2));
    console.log(`Report saved to: ${filepath}`);
  }
}

if (require.main === module) {
  const args = process.argv.slice(2);
  let reportType = 'monthly';
  let param = '';

  args.forEach(arg => {
    if (arg.startsWith('--type=')) {
      reportType = arg.split('=')[1];
    } else if (arg.startsWith('--month=')) {
      param = arg.split('=')[1];
    } else if (arg.startsWith('--user-id=')) {
      param = arg.split('=')[1];
    } else if (arg.startsWith('--business=')) {
      param = arg.split('=')[1];
    }
  });

  const generator = new ReportGenerator();

  (async () => {
    try {
      let report: any;
      let filename: string;

      switch (reportType) {
        case 'monthly':
          report = await generator.generateMonthlyReport(param || new Date().toISOString().substring(0, 7));
          filename = `monthly-${param || 'latest'}.json`;
          break;
        case 'user':
          report = await generator.generateUserReport(param);
          filename = `user-${param}.json`;
          break;
        case 'business':
          report = await generator.generateBusinessReport(param);
          filename = `business-${param}.json`;
          break;
        default:
          throw new Error(`Unknown report type: ${reportType}`);
      }

      console.log('\nReport:', JSON.stringify(report, null, 2));
      await generator.saveReport(report, filename);
      console.log('\n✅ Report generated successfully');
      process.exit(0);
    } catch (error) {
      console.error('\n❌ Report generation failed:', error);
      process.exit(1);
    }
  })();
}
