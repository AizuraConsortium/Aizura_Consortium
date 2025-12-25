/**
 * BusinessDetail Page
 *
 * Displays detailed information about a single business including metrics,
 * exposure, performance trends, and links.
 */

import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, ExternalLink, Github, Globe, FileText } from 'lucide-react';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { useBusinessDetail } from '@shared/hooks/usePortfolio';
import { useBusinessMetrics } from '@shared/hooks/useBusinessMetrics';
import { api } from '../lib/api';
import { BusinessMetricsGrid } from '../components/portfolio/MetricsGrid';
import { RevenueChart } from '../components/portfolio/RevenueChart';
import { BusinessExposureDetail } from '../components/portfolio/ExposureBreakdown';
import { StatusBadge, ProgressBadge } from '@shared/components/portfolio/StatusBadge';
import { ErrorAlert } from '@shared/components/ErrorAlert';
import { LoadingSpinner } from '@shared/components/LoadingSpinner';

export default function BusinessDetail() {
  const { slug } = useParams<{ slug: string }>();

  const { business, loading, error, refetch } = useBusinessDetail(api, {
    businessId: slug,
    userId: 'current-user',
    cache: { enabled: true, ttl: 180000 },
  });

  const { metrics: revenueMetrics, loading: metricsLoading } = useBusinessMetrics(api, {
    businessId: business?.id,
    metricType: 'revenue',
    skip: !business?.id,
  });

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-96">
          <LoadingSpinner size="lg" />
        </div>
      </DashboardLayout>
    );
  }

  if (error || !business) {
    return (
      <DashboardLayout>
        <div className="max-w-2xl mx-auto">
          <ErrorAlert
            message="Failed to load business details"
            details={error || 'Business not found'}
            onRetry={refetch}
          />
          <Link
            to="/dashboard/portfolio"
            className="inline-flex items-center gap-2 mt-4 text-cyan-400 hover:text-cyan-300"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Portfolio
          </Link>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <Link
            to="/dashboard/portfolio"
            className="inline-flex items-center gap-2 text-sm text-cyan-400 hover:text-cyan-300 mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Portfolio
          </Link>

          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              {business.logo_url ? (
                <img
                  src={business.logo_url}
                  alt={`${business.display_name} logo`}
                  className="w-16 h-16 rounded-xl object-cover"
                />
              ) : (
                <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-cyan-600 to-blue-600 flex items-center justify-center">
                  <span className="text-2xl font-bold text-white">
                    {business.display_name.charAt(0)}
                  </span>
                </div>
              )}
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">{business.display_name}</h1>
                <div className="flex items-center gap-2">
                  <StatusBadge status={business.status} showIcon />
                  {business.category && (
                    <span className="inline-flex items-center gap-1.5 font-medium rounded-full border bg-slate-700/50 text-slate-300 border-slate-600 text-sm px-2.5 py-1">
                      {business.category}
                    </span>
                  )}
                  {business.is_foundation && (
                    <span className="inline-flex items-center gap-1.5 font-medium rounded-full border bg-purple-500/10 text-purple-400 border-purple-500/30 text-sm px-2.5 py-1">
                      Foundation
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              {business.website_url && (
                <a
                  href={business.website_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-300 hover:text-white transition-colors"
                  aria-label="Visit website"
                >
                  <Globe className="w-5 h-5" />
                </a>
              )}
              {business.github_url && (
                <a
                  href={business.github_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-300 hover:text-white transition-colors"
                  aria-label="View on GitHub"
                >
                  <Github className="w-5 h-5" />
                </a>
              )}
              {business.docs_url && (
                <a
                  href={business.docs_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-300 hover:text-white transition-colors"
                  aria-label="View documentation"
                >
                  <FileText className="w-5 h-5" />
                </a>
              )}
            </div>
          </div>

          {business.description && (
            <p className="text-slate-300 mt-4 text-lg">{business.description}</p>
          )}
        </div>

        {business.status !== 'live' && (
          <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">Development Progress</h3>
              <ProgressBadge progress={business.development_progress} />
            </div>
            <div className="w-full bg-slate-700 rounded-full h-3">
              <div
                className="bg-gradient-to-r from-cyan-500 to-blue-500 h-3 rounded-full transition-all"
                style={{ width: `${business.development_progress}%` }}
              />
            </div>
            <p className="text-sm text-slate-400 mt-2">
              {business.status === 'planning'
                ? 'Currently in planning phase'
                : business.status === 'development'
                ? 'Actively under development'
                : 'Development paused'}
            </p>
          </div>
        )}

        <BusinessMetricsGrid business={business} />

        {business.current_metrics?.revenue && revenueMetrics && (
          <RevenueChart
            data={revenueMetrics}
            businessName={business.display_name}
            loading={metricsLoading}
            showPeriodSelector
          />
        )}

        {business.exposure && (
          <BusinessExposureDetail exposure={business.exposure} businessName={business.display_name} />
        )}

        {business.proposal_id && (
          <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Related Proposal</h3>
            <Link
              to={`/dashboard/governance/proposals/${business.proposal_id}`}
              className="inline-flex items-center gap-2 text-cyan-400 hover:text-cyan-300"
            >
              View Founding Proposal
              <ExternalLink className="w-4 h-4" />
            </Link>
          </div>
        )}

        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm font-semibold text-slate-400 mb-2">Integration Type</h3>
              <p className="text-white">{business.integration_type || 'Not specified'}</p>
            </div>
            {business.launch_date && (
              <div>
                <h3 className="text-sm font-semibold text-slate-400 mb-2">Launch Date</h3>
                <p className="text-white">{new Date(business.launch_date).toLocaleDateString()}</p>
              </div>
            )}
            <div>
              <h3 className="text-sm font-semibold text-slate-400 mb-2">Created</h3>
              <p className="text-white">{new Date(business.created_at).toLocaleDateString()}</p>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-slate-400 mb-2">Last Updated</h3>
              <p className="text-white">{new Date(business.updated_at).toLocaleDateString()}</p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
