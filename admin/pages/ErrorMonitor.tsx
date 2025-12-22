import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAdminAuth } from '../contexts/AdminAuthContext';
import { api } from '../lib/api';
import {
  Shield,
  LogOut,
  AlertTriangle,
  RefreshCw,
  Filter,
  AlertCircle
} from 'lucide-react';
import { ErrorDetailsModal } from '../components/ErrorDetailsModal';
import { FilterPanel, ErrorFilters } from '../components/FilterPanel';
import { PaginationControls } from '../components/PaginationControls';
import { ErrorTable } from '../components/ErrorTable';
import { TableSkeleton } from '@shared/components/skeletons';
import { supabase } from '@shared/lib';
import type { ErrorLog } from '@shared/types';

export function ErrorMonitor() {
  const { user, signOut } = useAdminAuth();
  const [errors, setErrors] = useState<ErrorLog[]>([]);
  const [selectedError, setSelectedError] = useState<ErrorLog | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const [filters, setFilters] = useState<ErrorFilters>({
    source: '',
    severity: '',
    agentId: '',
    startDate: '',
    endDate: ''
  });
  const [showFilters, setShowFilters] = useState(false);

  const [pagination, setPagination] = useState({
    limit: 50,
    offset: 0,
    total: 0
  });

  useEffect(() => {
    fetchErrors();
  }, [filters, pagination.offset, pagination.limit]);

  const fetchErrors = async () => {
    try {
      setIsLoading(true);
      const { data: { session } } = await supabase.auth.getSession();

      if (!session) {
        setError('Not authenticated');
        return;
      }

      const queryParams = new URLSearchParams({
        limit: pagination.limit.toString(),
        offset: pagination.offset.toString()
      });

      if (filters.source) queryParams.append('source', filters.source);
      if (filters.severity) queryParams.append('severity', filters.severity);
      if (filters.agentId) queryParams.append('agentId', filters.agentId);
      if (filters.startDate) queryParams.append('startDate', new Date(filters.startDate).toISOString());
      if (filters.endDate) queryParams.append('endDate', new Date(filters.endDate).toISOString());

      const data = await api.getAdminErrors(queryParams.toString(), session.access_token);
      setErrors(data.errors || []);
      setPagination(prev => ({ ...prev, total: data.total || 0 }));
      setError('');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteError = async (id: string) => {
    if (!confirm('Are you sure you want to delete this error log?')) {
      return;
    }

    try {
      const { data: { session } } = await supabase.auth.getSession();

      if (!session) {
        setError('Not authenticated');
        return;
      }

      await api.deleteError(id, session.access_token);

      fetchErrors();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const clearFilters = () => {
    setFilters({
      source: '',
      severity: '',
      agentId: '',
      startDate: '',
      endDate: ''
    });
  };

  const hasActiveFilters = Object.values(filters).some(v => v !== '');

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Shield className="h-8 w-8 text-blue-600" />
              <div>
                <h1 className="text-xl font-bold text-gray-900">Error Monitor</h1>
                <p className="text-sm text-gray-500">{user?.email}</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <Link
                to="/"
                className="text-gray-700 hover:bg-gray-100 px-4 py-2 rounded-lg transition"
              >
                Dashboard
              </Link>
              <button
                onClick={signOut}
                className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition"
              >
                <LogOut className="h-4 w-4" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">System Errors</h2>
            <p className="text-gray-600">
              Showing {pagination.offset + 1}-{Math.min(pagination.offset + pagination.limit, pagination.total)} of {pagination.total} errors
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg border transition ${
                showFilters || hasActiveFilters
                  ? 'bg-blue-50 border-blue-300 text-blue-700'
                  : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Filter className="h-4 w-4" />
              <span>Filters</span>
              {hasActiveFilters && (
                <span className="bg-blue-600 text-white text-xs rounded-full px-2 py-0.5">
                  Active
                </span>
              )}
            </button>

            <button
              onClick={fetchErrors}
              disabled={isLoading}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition disabled:opacity-50"
            >
              <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>
          </div>
        </div>

        {showFilters && (
          <FilterPanel
            filters={filters}
            onFilterChange={setFilters}
            onClear={clearFilters}
            hasActiveFilters={hasActiveFilters}
          />
        )}

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start">
            <AlertCircle className="h-5 w-5 text-red-600 mr-2 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-800">{error}</p>
          </div>
        )}

        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          {isLoading ? (
            <TableSkeleton rows={10} />
          ) : errors.length === 0 ? (
            <div className="p-8 text-center">
              <AlertTriangle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No errors found</p>
            </div>
          ) : (
            <>
              <ErrorTable
                errors={errors}
                onErrorClick={setSelectedError}
                onDelete={handleDeleteError}
              />
              <PaginationControls
                pagination={pagination}
                onPageChange={(offset) => setPagination(prev => ({ ...prev, offset }))}
              />
            </>
          )}
        </div>
      </div>

      {selectedError && (
        <ErrorDetailsModal
          error={selectedError}
          onClose={() => setSelectedError(null)}
        />
      )}
    </div>
  );
}
