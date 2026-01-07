import { useState, useEffect } from 'react';
import { AlertCircle } from 'lucide-react';
import type { MetricData } from '../../utils/analytics';

interface LiveMetricCardProps {
  fetchFunction: () => Promise<MetricData>;
  refreshInterval?: number;
}

export function LiveMetricCard({ fetchFunction, refreshInterval = 60000 }: LiveMetricCardProps) {
  const [data, setData] = useState<MetricData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        setError(null);
        const result = await fetchFunction();
        setData(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load metric');
      } finally {
        setLoading(false);
      }
    }

    load();
    const interval = setInterval(load, refreshInterval);
    return () => clearInterval(interval);
  }, [fetchFunction, refreshInterval]);

  if (loading || !data) {
    return (
      <div className="animate-pulse bg-slate-800/50 border border-slate-700 rounded-xl h-32"></div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-6">
        <div className="flex items-center gap-2 text-red-400">
          <AlertCircle className="w-5 h-5" />
          <span className="text-sm">Failed to load metric</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 relative hover:border-cyan-500/50 transition-colors">
      {data.isLive && (
        <div className="absolute top-3 right-3 flex items-center gap-1">
          <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
          <span className="text-xs text-slate-400">Live</span>
        </div>
      )}

      {!data.isLive && (
        <div className="absolute top-3 right-3 flex items-center gap-1">
          <AlertCircle className="w-3 h-3 text-yellow-400" />
          <span className="text-xs text-slate-400">Pre-Launch</span>
        </div>
      )}

      <div className="text-3xl font-bold text-white mb-2">{data.value}</div>
      <div className="text-sm font-medium text-slate-300 mb-1">{data.label}</div>
      <div className="text-xs text-slate-500">{data.sublabel}</div>

      {data.lastUpdated && (
        <div className="text-xs text-slate-600 mt-2">
          Updated {data.lastUpdated.toLocaleTimeString()}
        </div>
      )}
    </div>
  );
}
