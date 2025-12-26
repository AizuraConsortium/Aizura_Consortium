import { useState, useEffect } from 'react';
import { RefreshCw, TrendingUp, Loader2, AlertCircle } from 'lucide-react';

interface RewardRate {
  id: string;
  business_id: string;
  business_name: string;
  display_name: string;
  category: string;
  action_type: string;
  rate: number;
  unit: string;
  effective_from: string;
}

interface LiveRatesData {
  rates: RewardRate[];
  last_updated: string;
}

export function LiveRatesTable() {
  const [data, setData] = useState<LiveRatesData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'business' | 'rate'>('rate');

  useEffect(() => {
    loadRates();

    // Auto-refresh every 60 seconds
    const interval = setInterval(loadRates, 60000);
    return () => clearInterval(interval);
  }, []);

  async function loadRates() {
    try {
      const response = await fetch('/api/website/p2u/rates');
      if (!response.ok) throw new Error('Failed to fetch rates');

      const result = await response.json();
      setData(result);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load rates');
    } finally {
      setLoading(false);
    }
  }

  const sortedRates = data?.rates.sort((a, b) => {
    if (sortBy === 'business') {
      return a.display_name.localeCompare(b.display_name);
    }
    return b.rate - a.rate;
  }) || [];

  if (loading) {
    return (
      <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-8">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 text-cyan-400 animate-spin" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-8">
        <div className="flex flex-col items-center justify-center h-64 text-center">
          <AlertCircle className="w-12 h-12 text-red-400 mb-4" />
          <p className="text-slate-300 mb-4">{error}</p>
          <button
            onClick={loadRates}
            className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white font-medium rounded-lg transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-white mb-2">Live Reward Rates</h3>
          <p className="text-sm text-slate-400">
            Current rates for all active businesses
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex gap-2">
            <button
              onClick={() => setSortBy('rate')}
              className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
                sortBy === 'rate'
                  ? 'bg-cyan-600 text-white'
                  : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
              }`}
            >
              By Rate
            </button>
            <button
              onClick={() => setSortBy('business')}
              className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
                sortBy === 'business'
                  ? 'bg-cyan-600 text-white'
                  : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
              }`}
            >
              By Business
            </button>
          </div>
          <button
            onClick={loadRates}
            className="p-2 text-slate-400 hover:text-cyan-400 transition-colors"
            title="Refresh"
          >
            <RefreshCw className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-700">
              <th className="text-left py-3 px-4 text-sm font-semibold text-slate-400">
                Business
              </th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-slate-400">
                Action Type
              </th>
              <th className="text-right py-3 px-4 text-sm font-semibold text-slate-400">
                Rate
              </th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-slate-400">
                Unit
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedRates.map((rate) => (
              <tr key={rate.id} className="border-b border-slate-800 hover:bg-slate-700/30 transition-colors">
                <td className="py-4 px-4">
                  <div>
                    <div className="font-medium text-white">{rate.display_name}</div>
                    <div className="text-xs text-slate-500">{rate.category}</div>
                  </div>
                </td>
                <td className="py-4 px-4">
                  <span className="text-slate-300 capitalize">
                    {rate.action_type.replace(/_/g, ' ')}
                  </span>
                </td>
                <td className="py-4 px-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <TrendingUp className="w-4 h-4 text-green-400" />
                    <span className="text-xl font-bold text-green-400">
                      {rate.rate}
                    </span>
                  </div>
                </td>
                <td className="py-4 px-4">
                  <span className="text-slate-400">{rate.unit}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden space-y-3">
        {sortedRates.map((rate) => (
          <div key={rate.id} className="bg-slate-900/50 border border-slate-700 rounded-lg p-4">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h4 className="font-semibold text-white mb-1">{rate.display_name}</h4>
                <p className="text-xs text-slate-500">{rate.category}</p>
              </div>
              <div className="text-right">
                <div className="text-xl font-bold text-green-400">{rate.rate}</div>
                <div className="text-xs text-slate-400">{rate.unit}</div>
              </div>
            </div>
            <div className="text-sm text-slate-300 capitalize">
              {rate.action_type.replace(/_/g, ' ')}
            </div>
          </div>
        ))}
      </div>

      {data && (
        <div className="mt-4 text-xs text-slate-500 text-center">
          Last updated: {new Date(data.last_updated).toLocaleString()}
        </div>
      )}
    </div>
  );
}
