import { useState, useEffect } from 'react';
import { Activity, AlertTriangle, XCircle, CheckCircle } from 'lucide-react';
import { apiClient } from '@shared/lib/apiClient';

interface SystemHealth {
  status: 'healthy' | 'degraded' | 'unhealthy';
  uptime: number;
  errors: {
    last24h: number;
    recent: Array<{
      severity: string;
      message: string;
      timestamp: string;
    }>;
  };
}

export interface SystemHealthBadgeProps {
  endpoint: string;
  pollingInterval?: number;
  onError?: (error: Error) => void;
}

export function SystemHealthBadge({
  endpoint,
  pollingInterval = 60000,
  onError
}: SystemHealthBadgeProps) {
  const [health, setHealth] = useState<SystemHealth | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchHealth();
    const interval = setInterval(fetchHealth, pollingInterval);
    return () => clearInterval(interval);
  }, [endpoint, pollingInterval]);

  const fetchHealth = async () => {
    try {
      const data = await apiClient.get(endpoint);
      setHealth(data);
      setError('');
    } catch (err: any) {
      setError(err.message);
      if (onError) {
        onError(err);
      }
    }
  };

  const getStatusConfig = () => {
    if (!health) {
      return {
        icon: Activity,
        color: 'bg-gray-100 text-gray-700 border-gray-200',
        label: 'Unknown',
        dotColor: 'bg-gray-400'
      };
    }

    switch (health.status) {
      case 'healthy':
        return {
          icon: CheckCircle,
          color: 'bg-green-100 text-green-800 border-green-200',
          label: 'Operational',
          dotColor: 'bg-green-500'
        };
      case 'degraded':
        return {
          icon: AlertTriangle,
          color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
          label: 'Degraded',
          dotColor: 'bg-yellow-500'
        };
      case 'unhealthy':
        return {
          icon: XCircle,
          color: 'bg-red-100 text-red-800 border-red-200',
          label: 'Issues Detected',
          dotColor: 'bg-red-500'
        };
      default:
        return {
          icon: Activity,
          color: 'bg-gray-100 text-gray-700 border-gray-200',
          label: 'Unknown',
          dotColor: 'bg-gray-400'
        };
    }
  };

  const config = getStatusConfig();
  const Icon = config.icon;

  if (error) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className="relative">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          aria-label={`System status: ${config.label}. Click to view details`}
          aria-expanded={isExpanded}
          className={`flex items-center space-x-2 px-4 py-2 rounded-lg border shadow-lg transition-all ${config.color} hover:shadow-xl`}
        >
          <div className="relative">
            <Icon className="h-4 w-4" aria-hidden="true" />
            <span className={`absolute -top-1 -right-1 h-2 w-2 rounded-full ${config.dotColor} animate-pulse`} aria-hidden="true"></span>
          </div>
          <span className="text-sm font-medium">{config.label}</span>
        </button>

        {isExpanded && health && (
          <div
            className="absolute bottom-full right-0 mb-2 w-80 bg-white rounded-lg shadow-2xl border border-gray-200 overflow-hidden"
            role="dialog"
            aria-label="System status details"
          >
            <div className="bg-gray-50 border-b border-gray-200 px-4 py-3">
              <h3 className="text-sm font-semibold text-gray-900">System Status</h3>
            </div>

            <div className="p-4 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Status</span>
                <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${config.color}`}>
                  {config.label}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Uptime</span>
                <span className="text-sm font-medium text-gray-900">{health.uptime.toFixed(1)}%</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Errors (24h)</span>
                <span className="text-sm font-medium text-gray-900">{health.errors.last24h}</span>
              </div>

              {health.errors.recent && health.errors.recent.length > 0 && (
                <div className="pt-3 border-t border-gray-200">
                  <h4 className="text-xs font-semibold text-gray-700 mb-2">Recent Events</h4>
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {health.errors.recent.slice(0, 5).map((err, idx) => (
                      <div key={idx} className="text-xs">
                        <div className="flex items-start space-x-2">
                          <span className={`inline-block px-1.5 py-0.5 rounded text-xs font-medium ${
                            err.severity === 'critical' ? 'bg-red-100 text-red-800' :
                            err.severity === 'error' ? 'bg-orange-100 text-orange-800' :
                            err.severity === 'warning' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-blue-100 text-blue-800'
                          }`}>
                            {err.severity}
                          </span>
                          <span className="text-gray-600 flex-1 line-clamp-2">{err.message}</span>
                        </div>
                        <span className="text-gray-400 ml-auto text-xs">
                          {new Date(err.timestamp).toLocaleTimeString()}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="bg-gray-50 border-t border-gray-200 px-4 py-2">
              <button
                onClick={() => setIsExpanded(false)}
                aria-label="Close system status details"
                className="text-xs text-gray-600 hover:text-gray-900 transition"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
