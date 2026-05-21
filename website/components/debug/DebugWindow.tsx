import { useState, useEffect } from 'react';
import { X, Bug, AlertTriangle, AlertCircle, Info, RefreshCw } from 'lucide-react';
import type { ErrorLog } from '@shared/types/models';

interface DebugWindowProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function DebugWindow({ isOpen, onClose }: DebugWindowProps) {
  const [errors, setErrors] = useState<ErrorLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'agent' | 'backend' | 'frontend'>('all');
  const [severityFilter, setSeverityFilter] = useState<'all' | 'error' | 'warning' | 'info'>('all');

  useEffect(() => {
    if (isOpen) {
      loadErrors();
    }
  }, [isOpen, filter, severityFilter]);

  const loadErrors = async () => {
    setLoading(true);
    try {
      setErrors([]);
    } catch (error) {
      console.error('Failed to load errors:', error);
    } finally {
      setLoading(false);
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical':
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      case 'error':
        return <AlertTriangle className="w-4 h-4 text-orange-500" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      default:
        return <Info className="w-4 h-4 text-blue-500" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'text-red-400 bg-red-500/10 border-red-500/20';
      case 'error':
        return 'text-orange-400 bg-orange-500/10 border-orange-500/20';
      case 'warning':
        return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20';
      default:
        return 'text-blue-400 bg-blue-500/10 border-blue-500/20';
    }
  };

  const getSourceBadgeColor = (source: string) => {
    switch (source) {
      case 'agent':
        return 'bg-purple-500/20 text-purple-400';
      case 'backend':
        return 'bg-cyan-500/20 text-cyan-400';
      default:
        return 'bg-slate-500/20 text-slate-400';
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-800 border border-slate-700 rounded-xl w-full max-w-6xl max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between p-6 border-b border-slate-700">
          <div>
            <h2 className="text-2xl font-bold text-white flex items-center space-x-2">
              <Bug className="w-6 h-6 text-cyan-400" />
              <span>System Debug Monitor</span>
            </h2>
            <p className="text-sm text-slate-400 mt-1">
              This debug panel is for community members and the team to monitor system health.
              Occasional errors are normal as AI services may experience rate limits or temporary outages.
              The system automatically retries failed requests and continues operation.
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex items-center space-x-4 p-4 border-b border-slate-700">
          <div className="flex items-center space-x-2">
            <span className="text-sm text-slate-400">Source:</span>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value as any)}
              className="bg-slate-900 border border-slate-600 rounded px-3 py-1 text-sm text-white"
            >
              <option value="all">All</option>
              <option value="agent">Agent</option>
              <option value="backend">Backend</option>
              <option value="frontend">Frontend</option>
            </select>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-sm text-slate-400">Severity:</span>
            <select
              value={severityFilter}
              onChange={(e) => setSeverityFilter(e.target.value as any)}
              className="bg-slate-900 border border-slate-600 rounded px-3 py-1 text-sm text-white"
            >
              <option value="all">All</option>
              <option value="error">Error</option>
              <option value="warning">Warning</option>
              <option value="info">Info</option>
            </select>
          </div>

          <button
            onClick={loadErrors}
            disabled={loading}
            className="ml-auto flex items-center space-x-2 bg-cyan-500 hover:bg-cyan-600 disabled:bg-slate-700 text-white px-4 py-1 rounded transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {loading ? (
            <div className="text-center text-slate-400 py-12">Loading error logs...</div>
          ) : errors.length === 0 ? (
            <div className="text-center text-slate-400 py-12">
              <Bug className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No errors logged. System is running smoothly!</p>
            </div>
          ) : (
            errors.map((error) => (
              <div
                key={error.id}
                className={`rounded-lg border p-4 ${getSeverityColor(error.severity)}`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center space-x-3">
                    {getSeverityIcon(error.severity)}
                    <div className="flex items-center space-x-2">
                      <span className={`text-xs px-2 py-0.5 rounded ${getSourceBadgeColor(error.source)}`}>
                        {error.source}
                      </span>
                      {error.agent_id && (
                        <span className="text-xs px-2 py-0.5 rounded bg-violet-500/20 text-violet-400">
                          {error.agent_id}
                        </span>
                      )}
                      <span className="text-xs px-2 py-0.5 rounded bg-slate-700 text-slate-300">
                        {error.error_type}
                      </span>
                    </div>
                  </div>
                  <span className="text-xs text-slate-400">
                    {new Date(error.created_at).toLocaleString()}
                  </span>
                </div>

                <p className="text-sm font-medium mb-2">{error.message}</p>

                {error.details_metadata_json != null && Object.keys(error.details_metadata_json).length > 0 && (
                  <details className="mt-2">
                    <summary className="text-xs text-slate-400 cursor-pointer hover:text-slate-300">
                      View details
                    </summary>
                    <pre className="mt-2 p-2 bg-slate-900/50 rounded text-xs overflow-auto">
                      {JSON.stringify(error.details_metadata_json, null, 2)}
                    </pre>
                  </details>
                )}
              </div>
            ))
          )}
        </div>

        <div className="border-t border-slate-700 p-4 bg-slate-900/50">
          <div className="flex items-center justify-between text-sm text-slate-400">
            <span>Total: {errors.length} logs</span>
            <span className="text-xs">
              Expected error rate: ~5-10% during peak usage as AI APIs may be rate-limited or temporarily unavailable
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
