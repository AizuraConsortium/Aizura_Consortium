import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAdminAuth } from '../contexts/AdminAuthContext';
import { api } from '../lib/api';
import { ErrorAlert } from '@shared/components';
import {
  Shield,
  LogOut,
  AlertTriangle,
  Activity,
  TrendingUp,
  CheckCircle,
  XCircle,
  Info
} from 'lucide-react';

interface SystemHealth {
  status: 'healthy' | 'degraded' | 'unhealthy';
  uptime: number;
  errors: {
    last24h: number;
    bySeverity: {
      info: number;
      warning: number;
      error: number;
      critical: number;
    };
  };
  database: {
    connected: boolean;
  };
}

export function AdminDashboard() {
  const { user, session, signOut } = useAdminAuth();
  const navigate = useNavigate();
  const [systemHealth, setSystemHealth] = useState<SystemHealth | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchSystemHealth();
    const interval = setInterval(fetchSystemHealth, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchSystemHealth = async () => {
    try {
      const data = await api.get('/admin/system/health', session?.access_token);
      setSystemHealth(data);
      setError('');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/admin/login', { replace: true });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'degraded':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'unhealthy':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy':
        return <CheckCircle className="h-5 w-5" />;
      case 'degraded':
        return <AlertTriangle className="h-5 w-5" />;
      case 'unhealthy':
        return <XCircle className="h-5 w-5" />;
      default:
        return <Info className="h-5 w-5" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Shield className="h-8 w-8 text-blue-600" />
              <div>
                <h1 className="text-xl font-bold text-gray-900">Admin Portal</h1>
                <p className="text-sm text-gray-500">{user?.email}</p>
              </div>
            </div>

            <button
              onClick={handleSignOut}
              className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition"
            >
              <LogOut className="h-4 w-4" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">System Overview</h2>
          <p className="text-gray-600">Monitor system health and error logs</p>
        </div>

        {error && <ErrorAlert message={error} className="mb-6" />}

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg border border-gray-200 p-6 animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                <div className="h-8 bg-gray-200 rounded w-3/4"></div>
              </div>
            ))}
          </div>
        ) : systemHealth ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className={`rounded-lg border p-6 ${getStatusColor(systemHealth.status)}`}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">System Status</span>
                  {getStatusIcon(systemHealth.status)}
                </div>
                <div className="text-2xl font-bold capitalize">{systemHealth.status}</div>
              </div>

              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-600">Uptime</span>
                  <Activity className="h-5 w-5 text-blue-600" />
                </div>
                <div className="text-2xl font-bold text-gray-900">{systemHealth.uptime.toFixed(1)}%</div>
              </div>

              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-600">Errors (24h)</span>
                  <AlertTriangle className="h-5 w-5 text-orange-600" />
                </div>
                <div className="text-2xl font-bold text-gray-900">{systemHealth.errors.last24h}</div>
              </div>

              <div className={`rounded-lg border p-6 ${
                systemHealth.database.connected
                  ? 'bg-green-100 text-green-800 border-green-200'
                  : 'bg-red-100 text-red-800 border-red-200'
              }`}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Database</span>
                  {systemHealth.database.connected ? (
                    <CheckCircle className="h-5 w-5" />
                  ) : (
                    <XCircle className="h-5 w-5" />
                  )}
                </div>
                <div className="text-2xl font-bold">
                  {systemHealth.database.connected ? 'Connected' : 'Disconnected'}
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-6 mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Error Breakdown</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <div className="flex items-center space-x-2 mb-1">
                    <Info className="h-4 w-4 text-blue-600" />
                    <span className="text-sm font-medium text-blue-900">Info</span>
                  </div>
                  <div className="text-2xl font-bold text-blue-900">
                    {systemHealth.errors.bySeverity.info}
                  </div>
                </div>

                <div className="p-4 bg-yellow-50 rounded-lg">
                  <div className="flex items-center space-x-2 mb-1">
                    <AlertTriangle className="h-4 w-4 text-yellow-600" />
                    <span className="text-sm font-medium text-yellow-900">Warning</span>
                  </div>
                  <div className="text-2xl font-bold text-yellow-900">
                    {systemHealth.errors.bySeverity.warning}
                  </div>
                </div>

                <div className="p-4 bg-orange-50 rounded-lg">
                  <div className="flex items-center space-x-2 mb-1">
                    <AlertCircle className="h-4 w-4 text-orange-600" />
                    <span className="text-sm font-medium text-orange-900">Error</span>
                  </div>
                  <div className="text-2xl font-bold text-orange-900">
                    {systemHealth.errors.bySeverity.error}
                  </div>
                </div>

                <div className="p-4 bg-red-50 rounded-lg">
                  <div className="flex items-center space-x-2 mb-1">
                    <XCircle className="h-4 w-4 text-red-600" />
                    <span className="text-sm font-medium text-red-900">Critical</span>
                  </div>
                  <div className="text-2xl font-bold text-red-900">
                    {systemHealth.errors.bySeverity.critical}
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : null}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link
            to="/admin/errors"
            className="bg-white rounded-lg border border-gray-200 p-6 hover:border-blue-300 hover:shadow-md transition group"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="bg-blue-100 p-3 rounded-lg group-hover:bg-blue-200 transition">
                <AlertTriangle className="h-6 w-6 text-blue-600" />
              </div>
              <TrendingUp className="h-5 w-5 text-gray-400 group-hover:text-blue-600 transition" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Error Monitor</h3>
            <p className="text-gray-600 text-sm">
              View, filter, and manage all system errors. Track error trends and investigate issues.
            </p>
          </Link>

          <Link
            to="/admin/rate-limits"
            className="bg-white rounded-lg border border-gray-200 p-6 hover:border-blue-300 hover:shadow-md transition group"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="bg-green-100 p-3 rounded-lg group-hover:bg-green-200 transition">
                <Activity className="h-6 w-6 text-green-600" />
              </div>
              <TrendingUp className="h-5 w-5 text-gray-400 group-hover:text-green-600 transition" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Rate Limit Monitor</h3>
            <p className="text-gray-600 text-sm">
              Monitor API rate limits in real-time. Track usage, blocked requests, and system health.
            </p>
          </Link>
        </div>
      </div>
    </div>
  );
}
