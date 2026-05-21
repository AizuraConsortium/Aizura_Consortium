import { useTreasuryStats } from '../hooks/useTreasuryStats';
import { LoadingSpinner } from '@shared/components/LoadingSpinner';
import { ErrorAlert } from '@shared/components/ErrorAlert';
import { DollarSign, TrendingUp, Building2 } from 'lucide-react';

export default function Treasury() {
  const { treasury, loading, error } = useTreasuryStats();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return <ErrorAlert message="Failed to load treasury data" details={error} />;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Treasury</h1>
        <p className="text-slate-400">
          Transparent view of ecosystem treasury and business performance
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-900 rounded-lg p-6 border border-slate-800">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-green-500/10 rounded-lg">
              <DollarSign className="w-6 h-6 text-green-400" />
            </div>
            <div>
              <p className="text-sm text-slate-400">Total Value</p>
              <p className="text-2xl font-bold text-white">
                ${treasury?.summary.totalValue.toLocaleString()}
              </p>
            </div>
          </div>
          <p className="text-sm text-green-400">
            +{treasury?.summary.revenueGrowth.toFixed(1)}% growth
          </p>
        </div>

        <div className="bg-slate-900 rounded-lg p-6 border border-slate-800">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-blue-500/10 rounded-lg">
              <TrendingUp className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <p className="text-sm text-slate-400">Monthly Revenue</p>
              <p className="text-2xl font-bold text-white">
                ${treasury?.summary.monthlyRevenue.toLocaleString()}
              </p>
            </div>
          </div>
          <p className="text-sm text-slate-400">Recurring revenue</p>
        </div>

        <div className="bg-slate-900 rounded-lg p-6 border border-slate-800">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-purple-500/10 rounded-lg">
              <Building2 className="w-6 h-6 text-purple-400" />
            </div>
            <div>
              <p className="text-sm text-slate-400">Active Businesses</p>
              <p className="text-2xl font-bold text-white">
                {treasury?.summary.activeBusinesses}
              </p>
            </div>
          </div>
          <p className="text-sm text-slate-400">Generating revenue</p>
        </div>
      </div>

      <div className="bg-slate-900 rounded-lg p-6 border border-slate-800">
        <h2 className="text-xl font-semibold text-white mb-6">Business Breakdown</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-800">
                <th className="text-left py-3 px-4 text-sm font-semibold text-slate-400">
                  Business
                </th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-slate-400">
                  Category
                </th>
                <th className="text-right py-3 px-4 text-sm font-semibold text-slate-400">
                  Monthly Revenue
                </th>
                <th className="text-right py-3 px-4 text-sm font-semibold text-slate-400">
                  Total Revenue
                </th>
              </tr>
            </thead>
            <tbody>
              {treasury?.businesses.map((business) => (
                <tr key={business.id} className="border-b border-slate-800 hover:bg-slate-800/50">
                  <td className="py-4 px-4">
                    <div>
                      <p className="text-white font-medium">{business.name}</p>
                      {business.isFoundation && (
                        <span className="text-xs text-blue-400">Foundation</span>
                      )}
                    </div>
                  </td>
                  <td className="py-4 px-4 text-slate-400">
                    {business.category || 'Uncategorized'}
                  </td>
                  <td className="py-4 px-4 text-right text-white">
                    ${business.metrics.monthly_revenue.toLocaleString()}
                  </td>
                  <td className="py-4 px-4 text-right text-white">
                    ${business.metrics.total_revenue.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
