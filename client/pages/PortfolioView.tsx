import { useState } from 'react';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { AlertCircle } from 'lucide-react';
import { usePortfolio } from '@shared/hooks/usePortfolio';
import { api } from '../lib/api';
import { MetricsGrid } from '../components/portfolio/MetricsGrid';
import { BusinessCardList } from '../components/portfolio/BusinessCard';
import { ExposureBreakdown } from '../components/portfolio/ExposureBreakdown';
import { ErrorAlert } from '@shared/components/ErrorAlert';
import type { BusinessFilters } from '@shared/types/portfolio';

type GovernanceFilter = 'all' | 'foundation' | 'dao';

export default function PortfolioView() {
  const [filters, setFilters] = useState<BusinessFilters>({
    order: 'desc',
  });
  const [governanceFilter, setGovernanceFilter] = useState<GovernanceFilter>('all');

  const { portfolio, loading, error, refetch } = usePortfolio(api, {
    userId: 'current-user',
    cache: { enabled: true, ttl: 300000 },
  });

  const filteredBusinesses = portfolio?.businesses.filter(b => {
    if (governanceFilter === 'foundation') return b.is_foundation;
    if (governanceFilter === 'dao') return !b.is_foundation;
    return true;
  }) || [];

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Portfolio</h1>
          <p className="text-slate-400">Businesses you're exposed to through governance participation</p>
        </div>

        {error && (
          <ErrorAlert
            message="Failed to load portfolio data"
            details={error}
            onRetry={refetch}
          />
        )}

        <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-6">
          <div className="flex items-start gap-4">
            <AlertCircle className="w-6 h-6 text-yellow-400 flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-bold text-white mb-2">Important: You Don't Own Equity Directly</h3>
              <p className="text-sm text-slate-300">
                Your portfolio exposure is through governance rights and reward participation, not direct equity ownership.
                Value accrues through token buybacks, burns, and ecosystem distributions.
              </p>
            </div>
          </div>
        </div>

        <MetricsGrid portfolio={portfolio} loading={loading} />

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">Your Businesses</h2>
              <div className="flex gap-2">
                <FilterButton
                  active={governanceFilter === 'all'}
                  onClick={() => setGovernanceFilter('all')}
                  count={portfolio?.businesses.length || 0}
                >
                  All
                </FilterButton>
                <FilterButton
                  active={governanceFilter === 'foundation'}
                  onClick={() => setGovernanceFilter('foundation')}
                  count={portfolio?.businesses.filter(b => b.is_foundation).length || 0}
                >
                  Foundation
                </FilterButton>
                <FilterButton
                  active={governanceFilter === 'dao'}
                  onClick={() => setGovernanceFilter('dao')}
                  count={portfolio?.businesses.filter(b => !b.is_foundation).length || 0}
                >
                  DAO Approved
                </FilterButton>
              </div>
            </div>
            <BusinessCardList
              businesses={filteredBusinesses}
              showExposure
              emptyMessage={
                governanceFilter === 'foundation'
                  ? 'No foundation businesses found'
                  : governanceFilter === 'dao'
                  ? 'No DAO-approved businesses yet'
                  : loading ? 'Loading businesses...' : 'No businesses found'
              }
            />
          </div>

          <div className="lg:col-span-1">
            <ExposureBreakdown portfolio={portfolio} loading={loading} />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

function FilterButton({
  active,
  onClick,
  count,
  children
}: {
  active: boolean;
  onClick: () => void;
  count: number;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
        active
          ? 'bg-cyan-600 text-white'
          : 'bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 border border-slate-700'
      }`}
    >
      {children} ({count})
    </button>
  );
}
