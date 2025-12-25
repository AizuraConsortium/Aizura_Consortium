/**
 * DAO Portal Utility Functions
 * Helper functions for DAO data formatting, trend calculation, and chart data transformation
 */

import type {
  TrendData,
  ChartDataPoint,
  GovernanceHistoryPoint,
  TreasuryHistoryPoint,
  GovernanceMetricsHistory,
  TreasuryMetricsHistory,
} from '../types/dao.js';

const TREND_THRESHOLD = 0.5;

export function calculateTrend(current: number, previous: number): TrendData {
  if (previous === 0) {
    return {
      current,
      previous,
      change: current,
      changePercentage: current > 0 ? 100 : 0,
      trend: current > 0 ? 'up' : 'stable',
      isPositive: current > 0,
    };
  }

  const change = current - previous;
  const changePercentage = (change / previous) * 100;

  let trend: 'up' | 'down' | 'stable';
  if (Math.abs(changePercentage) < TREND_THRESHOLD) {
    trend = 'stable';
  } else if (changePercentage > 0) {
    trend = 'up';
  } else {
    trend = 'down';
  }

  return {
    current,
    previous,
    change,
    changePercentage,
    trend,
    isPositive: change >= 0,
  };
}

export function formatCurrency(value: number, decimals: number = 2): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
}

export function formatCompactNumber(value: number): string {
  const absValue = Math.abs(value);
  const sign = value < 0 ? '-' : '';

  if (absValue >= 1_000_000_000) {
    return `${sign}${(absValue / 1_000_000_000).toFixed(2)}B`;
  } else if (absValue >= 1_000_000) {
    return `${sign}${(absValue / 1_000_000).toFixed(2)}M`;
  } else if (absValue >= 1_000) {
    return `${sign}${(absValue / 1_000).toFixed(2)}K`;
  } else {
    return `${sign}${absValue.toFixed(0)}`;
  }
}

export function formatPercentage(value: number, decimals: number = 2): string {
  return `${value >= 0 ? '+' : ''}${value.toFixed(decimals)}%`;
}

export function governanceHistoryToChartData(
  history: GovernanceHistoryPoint[]
): {
  proposals: ChartDataPoint[];
  participation: ChartDataPoint[];
  voters: ChartDataPoint[];
} {
  return {
    proposals: history.map((point) => ({
      date: point.snapshot_date,
      value: point.proposals_total,
      label: 'Total Proposals',
      metadata: {
        active: point.proposals_active,
        passed: point.proposals_passed,
        rejected: point.proposals_rejected,
      },
    })),
    participation: history.map((point) => ({
      date: point.snapshot_date,
      value: point.participation_rate,
      label: 'Participation Rate',
      metadata: {
        activeVoters: point.active_voters_30d,
        totalVotes: point.total_votes_30d,
      },
    })),
    voters: history.map((point) => ({
      date: point.snapshot_date,
      value: point.active_voters_30d,
      label: 'Active Voters (30d)',
      metadata: {
        totalVotes: point.total_votes_30d,
        participationRate: point.participation_rate,
      },
    })),
  };
}

export function treasuryHistoryToChartData(
  history: TreasuryHistoryPoint[]
): {
  totalValue: ChartDataPoint[];
  monthlyRevenue: ChartDataPoint[];
  activeBusinesses: ChartDataPoint[];
} {
  return {
    totalValue: history.map((point) => ({
      date: point.snapshot_date,
      value: point.total_treasury_value,
      label: 'Total Treasury Value',
      metadata: {
        monthlyRevenue: point.total_monthly_revenue,
        activeBusinesses: point.total_active_businesses,
        growthRate: point.revenue_growth_rate,
      },
    })),
    monthlyRevenue: history.map((point) => ({
      date: point.snapshot_date,
      value: point.total_monthly_revenue,
      label: 'Monthly Revenue',
      metadata: {
        totalValue: point.total_treasury_value,
        activeBusinesses: point.total_active_businesses,
        growthRate: point.revenue_growth_rate,
      },
    })),
    activeBusinesses: history.map((point) => ({
      date: point.snapshot_date,
      value: point.total_active_businesses,
      label: 'Active Businesses',
      metadata: {
        totalValue: point.total_treasury_value,
        monthlyRevenue: point.total_monthly_revenue,
      },
    })),
  };
}

export function calculateParticipationTrend(
  history: GovernanceHistoryPoint[]
): TrendData | null {
  if (history.length < 2) {
    return null;
  }

  const latest = history[history.length - 1];
  const previous = history[history.length - 2];

  return calculateTrend(latest.participation_rate, previous.participation_rate);
}

export function calculateTreasuryTrend(
  history: TreasuryHistoryPoint[]
): TrendData | null {
  if (history.length < 2) {
    return null;
  }

  const latest = history[history.length - 1];
  const previous = history[history.length - 2];

  return calculateTrend(latest.total_treasury_value, previous.total_treasury_value);
}

export function calculateProposalSuccessRate(
  passed: number,
  rejected: number
): number {
  const total = passed + rejected;
  if (total === 0) {
    return 0;
  }
  return (passed / total) * 100;
}

export function calculateAverageGrowthRate(history: TreasuryHistoryPoint[]): number {
  if (history.length < 2) {
    return 0;
  }

  let totalGrowthRate = 0;
  let validPairs = 0;

  for (let i = 1; i < history.length; i++) {
    const current = history[i].total_treasury_value;
    const previous = history[i - 1].total_treasury_value;

    if (previous > 0) {
      const growthRate = ((current - previous) / previous) * 100;
      totalGrowthRate += growthRate;
      validPairs++;
    }
  }

  return validPairs > 0 ? totalGrowthRate / validPairs : 0;
}

export function calculateVolatility(history: TreasuryHistoryPoint[]): number {
  if (history.length < 2) {
    return 0;
  }

  const growthRates: number[] = [];
  for (let i = 1; i < history.length; i++) {
    const current = history[i].total_treasury_value;
    const previous = history[i - 1].total_treasury_value;

    if (previous > 0) {
      const growthRate = ((current - previous) / previous) * 100;
      growthRates.push(growthRate);
    }
  }

  if (growthRates.length === 0) {
    return 0;
  }

  const mean = growthRates.reduce((sum, rate) => sum + rate, 0) / growthRates.length;
  const variance = growthRates.reduce((sum, rate) => sum + Math.pow(rate - mean, 2), 0) / growthRates.length;

  return Math.sqrt(variance);
}

export function getHealthStatus(participationRate: number): {
  status: 'excellent' | 'good' | 'fair' | 'poor';
  color: string;
  description: string;
} {
  if (participationRate >= 70) {
    return {
      status: 'excellent',
      color: 'green',
      description: 'Excellent participation rate. The DAO is highly engaged.',
    };
  } else if (participationRate >= 50) {
    return {
      status: 'good',
      color: 'blue',
      description: 'Good participation rate. The DAO shows strong engagement.',
    };
  } else if (participationRate >= 30) {
    return {
      status: 'fair',
      color: 'yellow',
      description: 'Fair participation rate. Consider initiatives to boost engagement.',
    };
  } else {
    return {
      status: 'poor',
      color: 'red',
      description: 'Low participation rate. Action needed to improve engagement.',
    };
  }
}

export function getTrendIcon(trend: 'up' | 'down' | 'stable'): string {
  switch (trend) {
    case 'up':
      return '↑';
    case 'down':
      return '↓';
    case 'stable':
      return '→';
  }
}

export function getTrendColor(
  trend: 'up' | 'down' | 'stable',
  isPositive: boolean
): string {
  if (trend === 'stable') {
    return 'gray';
  }
  return isPositive ? 'green' : 'red';
}

export function summarizeMetrics(history: GovernanceHistoryPoint[]): {
  totalProposals: number;
  averageParticipation: number;
  peakParticipation: number;
  lowestParticipation: number;
  mostActiveDay: string;
} {
  if (history.length === 0) {
    return {
      totalProposals: 0,
      averageParticipation: 0,
      peakParticipation: 0,
      lowestParticipation: 0,
      mostActiveDay: '',
    };
  }

  const totalProposals = history[history.length - 1].proposals_total;
  const participationRates = history.map((h) => h.participation_rate);
  const averageParticipation = participationRates.reduce((sum, rate) => sum + rate, 0) / participationRates.length;
  const peakParticipation = Math.max(...participationRates);
  const lowestParticipation = Math.min(...participationRates);

  const mostActiveIndex = history.reduce(
    (maxIdx, point, idx, arr) =>
      point.active_voters_30d > arr[maxIdx].active_voters_30d ? idx : maxIdx,
    0
  );
  const mostActiveDay = history[mostActiveIndex].snapshot_date;

  return {
    totalProposals,
    averageParticipation,
    peakParticipation,
    lowestParticipation,
    mostActiveDay,
  };
}
