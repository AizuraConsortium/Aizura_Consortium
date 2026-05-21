import { useHistoricalMetrics } from '../hooks/useHistoricalMetrics';
import { LoadingSpinner } from '@shared/components/LoadingSpinner';
import { ErrorAlert } from '@shared/components/ErrorAlert';
import { TrendingUp } from 'lucide-react';

export default function Analytics() {
  const { metrics, loading, error } = useHistoricalMetrics(30);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return <ErrorAlert message="Failed to load analytics data" details={error} />;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Analytics</h1>
        <p className="text-slate-400">
          Historical trends and performance metrics
        </p>
      </div>

      <div className="bg-slate-900 rounded-lg p-12 border border-slate-800 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-800 mb-4">
          <TrendingUp className="w-8 h-8 text-slate-400" />
        </div>
        <h3 className="text-xl font-semibold text-white mb-2">Analytics Dashboard</h3>
        <p className="text-slate-400 max-w-md mx-auto mb-4">
          This section will display historical charts and trends for governance participation,
          treasury growth, and business performance.
        </p>
        {metrics && (
          <div className="text-sm text-slate-500">
            Data available for {metrics.periodDays} days
          </div>
        )}
      </div>
    </div>
  );
}
