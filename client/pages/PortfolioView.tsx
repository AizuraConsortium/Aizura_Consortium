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

export default function PortfolioView() {
  const [filters, setFilters] = useState<BusinessFilters>({
    sort: 'created_at',
    order: 'desc',
  });

  const { portfolio, loading, error, refetch } = usePortfolio(api, {
    userId: 'current-user',
    cache: { enabled: true, ttl: 300000 },
  });

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
            <h2 className="text-xl font-bold text-white mb-4">Your Businesses</h2>
            <BusinessCardList
              businesses={portfolio?.businesses || []}
              showExposure
              emptyMessage={loading ? 'Loading businesses...' : 'No businesses found'}
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
