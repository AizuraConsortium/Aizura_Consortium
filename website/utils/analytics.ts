/**
 * Analytics utilities for tracking real user metrics post-launch
 * Pre-launch: Returns mock data with clear disclaimers
 * Post-launch: Connects to Supabase for real-time data
 */

import { supabase } from '../../shared/lib/supabase';

export interface MetricData {
  value: string | number;
  label: string;
  sublabel: string;
  isLive: boolean;
  lastUpdated: Date | null;
}

// Feature flag for launch status
const IS_POST_LAUNCH = false; // Set to true after mainnet launch

export async function getWaitlistCount(): Promise<MetricData> {
  if (!IS_POST_LAUNCH) {
    return {
      value: '12K+',
      label: 'Waitlist Signups',
      sublabel: 'Pre-launch registrations',
      isLive: false,
      lastUpdated: null
    };
  }

  // POST-LAUNCH: Query Supabase
  const { count } = await supabase
    .from('waitlist')
    .select('*', { count: 'exact', head: true });

  return {
    value: count?.toLocaleString() || '0',
    label: 'Waitlist Signups',
    sublabel: 'Verified registrations',
    isLive: true,
    lastUpdated: new Date()
  };
}

export async function getAirdropQualifiedCount(): Promise<MetricData> {
  if (!IS_POST_LAUNCH) {
    return {
      value: '5.2K+',
      label: 'Airdrop Qualified',
      sublabel: 'Based on pre-launch activity',
      isLive: false,
      lastUpdated: null
    };
  }

  // POST-LAUNCH: Query smart contract or Supabase tracking
  const { count } = await supabase
    .from('airdrop_participants')
    .select('*', { count: 'exact', head: true })
    .gte('points', 100); // Minimum qualification threshold

  return {
    value: count?.toLocaleString() || '0',
    label: 'Airdrop Qualified',
    sublabel: 'Active participants',
    isLive: true,
    lastUpdated: new Date()
  };
}

export async function getPortfolioRevenue(): Promise<MetricData> {
  if (!IS_POST_LAUNCH) {
    return {
      value: '$5M-$20M',
      label: 'Target Annual Revenue',
      sublabel: 'Year 2-3 Projection',
      isLive: false,
      lastUpdated: null
    };
  }

  // POST-LAUNCH: Real revenue tracking
  const { data } = await supabase
    .from('business_revenue')
    .select('amount')
    .gte('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString());

  const monthlyRevenue = data?.reduce((sum, row) => sum + row.amount, 0) || 0;
  const annualizedRevenue = monthlyRevenue * 12;

  return {
    value: `$${(annualizedRevenue / 1000000).toFixed(1)}M`,
    label: 'Annualized Revenue',
    sublabel: 'Based on last 30 days',
    isLive: true,
    lastUpdated: new Date()
  };
}

export async function getActiveBusinessCount(): Promise<MetricData> {
  if (!IS_POST_LAUNCH) {
    return {
      value: '4',
      label: 'Foundation Businesses',
      sublabel: 'In development',
      isLive: false,
      lastUpdated: null
    };
  }

  // POST-LAUNCH: Count active businesses
  const { count } = await supabase
    .from('businesses')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'active');

  return {
    value: count?.toString() || '0',
    label: 'Active Businesses',
    sublabel: 'Live in portfolio',
    isLive: true,
    lastUpdated: new Date()
  };
}

export async function getTotalUsers(): Promise<MetricData> {
  if (!IS_POST_LAUNCH) {
    return {
      value: '1.2K+',
      label: 'Beta Testers',
      sublabel: 'Early access users',
      isLive: false,
      lastUpdated: null
    };
  }

  // POST-LAUNCH: Count total registered users
  const { count } = await supabase
    .from('users')
    .select('*', { count: 'exact', head: true });

  return {
    value: count?.toLocaleString() || '0',
    label: 'Total Users',
    sublabel: 'Registered accounts',
    isLive: true,
    lastUpdated: new Date()
  };
}

export async function getGovernanceProposals(): Promise<MetricData> {
  if (!IS_POST_LAUNCH) {
    return {
      value: '0',
      label: 'DAO Proposals',
      sublabel: 'Mainnet launch required',
      isLive: false,
      lastUpdated: null
    };
  }

  // POST-LAUNCH: Count governance proposals
  const { count } = await supabase
    .from('proposals')
    .select('*', { count: 'exact', head: true });

  return {
    value: count?.toString() || '0',
    label: 'DAO Proposals',
    sublabel: 'Total submitted',
    isLive: true,
    lastUpdated: new Date()
  };
}

export async function getTreasuryValue(): Promise<MetricData> {
  if (!IS_POST_LAUNCH) {
    return {
      value: '$0',
      label: 'Treasury Value',
      sublabel: 'Post-launch metric',
      isLive: false,
      lastUpdated: null
    };
  }

  // POST-LAUNCH: Query treasury value from blockchain or tracking table
  const { data } = await supabase
    .from('treasury_snapshots')
    .select('total_value_usd')
    .order('created_at', { ascending: false })
    .limit(1)
    .single();

  return {
    value: `$${(data?.total_value_usd / 1000000).toFixed(1)}M`,
    label: 'Treasury Value',
    sublabel: 'Current holdings',
    isLive: true,
    lastUpdated: new Date()
  };
}

export async function getAverageUptime(): Promise<MetricData> {
  if (!IS_POST_LAUNCH) {
    return {
      value: '98%+',
      label: 'Target Uptime',
      sublabel: 'Infrastructure goal',
      isLive: false,
      lastUpdated: null
    };
  }

  // POST-LAUNCH: Query uptime metrics from monitoring service
  const { data } = await supabase
    .from('uptime_metrics')
    .select('uptime_percentage')
    .gte('created_at', new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString());

  const avgUptime = (data?.reduce((sum, row) => sum + row.uptime_percentage, 0) ?? 0) / (data?.length || 1);

  return {
    value: `${avgUptime.toFixed(2)}%`,
    label: 'Average Uptime',
    sublabel: 'Last 90 days',
    isLive: true,
    lastUpdated: new Date()
  };
}

export async function getTokenHolders(): Promise<MetricData> {
  if (!IS_POST_LAUNCH) {
    return {
      value: '0',
      label: 'Token Holders',
      sublabel: 'Pre-launch',
      isLive: false,
      lastUpdated: null
    };
  }

  // POST-LAUNCH: Query blockchain for unique token holders
  const { count } = await supabase
    .from('token_holders')
    .select('*', { count: 'exact', head: true })
    .gt('balance', 0);

  return {
    value: count?.toLocaleString() || '0',
    label: 'Token Holders',
    sublabel: 'Unique addresses',
    isLive: true,
    lastUpdated: new Date()
  };
}

export async function getBusinessSuccessRate(): Promise<MetricData> {
  if (!IS_POST_LAUNCH) {
    return {
      value: '60-70%',
      label: 'Target Success Rate',
      sublabel: 'Projected based on cost model',
      isLive: false,
      lastUpdated: null
    };
  }

  // POST-LAUNCH: Calculate actual success rate
  const { count: total } = await supabase
    .from('businesses')
    .select('*', { count: 'exact', head: true })
    .gte('created_at', new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString());

  const { count: successful } = await supabase
    .from('businesses')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'successful')
    .gte('created_at', new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString());

  const rate = total && successful ? (successful / total * 100).toFixed(0) : '0';

  return {
    value: `${rate}%`,
    label: 'Business Success Rate',
    sublabel: `${successful || 0} of ${total || 0} businesses`,
    isLive: true,
    lastUpdated: new Date()
  };
}
