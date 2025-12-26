/**
 * P2U (Pay-to-Use / Use-to-Earn) Controller
 *
 * Handles public-facing P2U data endpoints for the website
 */

import { Request, Response } from 'express';
import { websiteSupabase as supabase } from '../config/supabaseWebsiteClient';

/**
 * Get P2U statistics for display on website
 * GET /api/website/p2u/stats
 */
export async function getP2UStats(req: Request, res: Response) {
  try {
    // Get total rewards distributed
    const { data: rewardsData, error: rewardsError } = await supabase
      .from('u2e_usage_rewards')
      .select('reward_amount')
      .not('reward_amount', 'is', null);

    if (rewardsError) throw rewardsError;

    const totalRewardsDistributed = rewardsData?.reduce(
      (sum: number, record: any) => sum + (record.reward_amount || 0),
      0
    ) || 0;

    // Get active businesses count
    const { count: activeBusinesses, error: businessError } = await supabase
      .from('u2e_businesses')
      .select('*', { count: 'exact', head: true })
      .eq('is_active', true)
      .is('deleted_at', null);

    if (businessError) throw businessError;

    // Get active users count (users who earned rewards)
    const { data: usersData, error: usersError } = await supabase
      .from('u2e_usage_rewards')
      .select('user_id')
      .not('user_id', 'is', null);

    if (usersError) throw usersError;

    const uniqueUsers = new Set(usersData?.map((r: any) => r.user_id) || []);
    const activeUsers = uniqueUsers.size;

    // Calculate average monthly earnings (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const { data: recentRewards, error: recentError } = await supabase
      .from('u2e_usage_rewards')
      .select('reward_amount, user_id')
      .gte('created_at', thirtyDaysAgo.toISOString())
      .not('reward_amount', 'is', null);

    if (recentError) throw recentError;

    const recentTotal = recentRewards?.reduce(
      (sum: number, record: any) => sum + (record.reward_amount || 0),
      0
    ) || 0;
    const recentUniqueUsers = new Set(recentRewards?.map((r: any) => r.user_id) || []).size;
    const avgMonthlyEarnings = recentUniqueUsers > 0 ? recentTotal / recentUniqueUsers : 0;

    // Get total usage events
    const { count: totalUsageEvents, error: eventsError } = await supabase
      .from('u2e_usage_events')
      .select('*', { count: 'exact', head: true });

    if (eventsError) throw eventsError;

    res.json({
      total_rewards_distributed: Math.round(totalRewardsDistributed * 100) / 100,
      active_businesses: activeBusinesses || 0,
      active_users: activeUsers,
      avg_monthly_earnings: Math.round(avgMonthlyEarnings * 100) / 100,
      total_usage_events: totalUsageEvents || 0,
      last_updated: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error fetching P2U stats:', error);
    res.status(500).json({ error: 'Failed to fetch P2U statistics' });
  }
}

/**
 * Get current reward rates for all active businesses
 * GET /api/website/p2u/rates
 */
export async function getRewardRates(req: Request, res: Response) {
  try {
    const { data: rates, error } = await supabase
      .from('u2e_reward_rates')
      .select(`
        id,
        business_id,
        action_type,
        rate,
        unit,
        is_active,
        effective_from,
        effective_to,
        u2e_businesses!inner (
          id,
          name,
          display_name,
          category,
          is_active
        )
      `)
      .eq('is_active', true)
      .is('effective_to', null)
      .eq('u2e_businesses.is_active', true)
      .order('rate', { ascending: false });

    if (error) throw error;

    const formattedRates = rates?.map((rate: any) => ({
      id: rate.id,
      business_id: rate.business_id,
      business_name: rate.u2e_businesses.name,
      display_name: rate.u2e_businesses.display_name,
      category: rate.u2e_businesses.category,
      action_type: rate.action_type,
      rate: rate.rate,
      unit: rate.unit,
      effective_from: rate.effective_from
    })) || [];

    res.json({
      rates: formattedRates,
      last_updated: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error fetching reward rates:', error);
    res.status(500).json({ error: 'Failed to fetch reward rates' });
  }
}

/**
 * Get historical rate changes for transparency
 * GET /api/website/p2u/history?business_id=uuid (optional)
 */
export async function getRateHistory(req: Request, res: Response) {
  try {
    const { business_id } = req.query;

    let query = supabase
      .from('u2e_reward_rates')
      .select(`
        id,
        business_id,
        action_type,
        rate,
        unit,
        is_active,
        effective_from,
        effective_to,
        u2e_businesses (
          id,
          name,
          display_name
        )
      `)
      .order('effective_from', { ascending: false })
      .limit(50);

    if (business_id) {
      query = query.eq('business_id', business_id);
    }

    const { data: history, error } = await query;

    if (error) throw error;

    const formattedHistory = history?.map((record: any) => ({
      id: record.id,
      business_id: record.business_id,
      business_name: record.u2e_businesses?.display_name || 'Unknown',
      action_type: record.action_type,
      rate: record.rate,
      unit: record.unit,
      is_active: record.is_active,
      effective_from: record.effective_from,
      effective_to: record.effective_to
    })) || [];

    res.json({
      history: formattedHistory,
      last_updated: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error fetching rate history:', error);
    res.status(500).json({ error: 'Failed to fetch rate history' });
  }
}

/**
 * Get anonymized real user earning examples
 * GET /api/website/p2u/examples
 */
export async function getEarningExamples(req: Request, res: Response) {
  try {
    // Get aggregated earning examples from last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const { data: examples, error } = await supabase
      .from('u2e_usage_rewards')
      .select(`
        user_id,
        business_id,
        reward_amount,
        created_at,
        u2e_businesses (
          display_name,
          category
        )
      `)
      .gte('created_at', thirtyDaysAgo.toISOString())
      .not('reward_amount', 'is', null)
      .order('reward_amount', { ascending: false })
      .limit(100);

    if (error) throw error;

    // Aggregate by user and business
    const userBusinessMap = new Map<string, Map<string, { total: number; count: number; business: string; category: string }>>();

    examples?.forEach((example: any) => {
      if (!userBusinessMap.has(example.user_id)) {
        userBusinessMap.set(example.user_id, new Map());
      }

      const userMap = userBusinessMap.get(example.user_id)!;
      const businessKey = example.business_id;

      if (!userMap.has(businessKey)) {
        userMap.set(businessKey, {
          total: 0,
          count: 0,
          business: example.u2e_businesses?.display_name || 'Unknown',
          category: example.u2e_businesses?.category || 'general'
        });
      }

      const businessData = userMap.get(businessKey)!;
      businessData.total += example.reward_amount;
      businessData.count += 1;
    });

    // Create anonymized examples
    const anonymizedExamples = [];
    let userIndex = 1;

    for (const [userId, businessMap] of userBusinessMap) {
      for (const [businessId, data] of businessMap) {
        if (data.count >= 5) { // Only show examples with 5+ transactions
          anonymizedExamples.push({
            user_label: `User #${String(userIndex).padStart(4, '0')}`,
            business: data.business,
            category: data.category,
            total_earned: Math.round(data.total * 100) / 100,
            usage_count: data.count,
            avg_per_usage: Math.round((data.total / data.count) * 100) / 100
          });
        }
      }
      userIndex++;
    }

    // Sort by total earned and take top 20
    const topExamples = anonymizedExamples
      .sort((a, b) => b.total_earned - a.total_earned)
      .slice(0, 20);

    res.json({
      examples: topExamples,
      last_updated: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error fetching earning examples:', error);
    res.status(500).json({ error: 'Failed to fetch earning examples' });
  }
}
