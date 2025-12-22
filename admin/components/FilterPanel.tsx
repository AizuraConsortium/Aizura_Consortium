import { X } from 'lucide-react';
import type { ErrorSource, ErrorSeverity } from '@shared/types';

export interface ErrorFilters {
  source: ErrorSource | '';
  severity: ErrorSeverity | '';
  agentId: string;
  startDate: string;
  endDate: string;
}

interface FilterPanelProps {
  filters: ErrorFilters;
  onFilterChange: (filters: ErrorFilters) => void;
  onClear: () => void;
  hasActiveFilters: boolean;
}

export function FilterPanel({ filters, onFilterChange, onClear, hasActiveFilters }: FilterPanelProps) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Filter Errors</h3>
        {hasActiveFilters && (
          <button
            onClick={onClear}
            className="text-sm text-blue-600 hover:text-blue-700 flex items-center space-x-1"
          >
            <X className="h-4 w-4" />
            <span>Clear all</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Source</label>
          <select
            value={filters.source}
            onChange={(e) => onFilterChange({ ...filters, source: e.target.value as ErrorSource | '' })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All sources</option>
            <option value="frontend">Frontend</option>
            <option value="backend">Backend</option>
            <option value="agent">Agent</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Severity</label>
          <select
            value={filters.severity}
            onChange={(e) => onFilterChange({ ...filters, severity: e.target.value as ErrorSeverity | '' })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All severities</option>
            <option value="info">Info</option>
            <option value="warning">Warning</option>
            <option value="error">Error</option>
            <option value="critical">Critical</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Agent ID</label>
          <input
            type="text"
            value={filters.agentId}
            onChange={(e) => onFilterChange({ ...filters, agentId: e.target.value })}
            placeholder="e.g., claude"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
          <input
            type="date"
            value={filters.startDate}
            onChange={(e) => onFilterChange({ ...filters, startDate: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
          <input
            type="date"
            value={filters.endDate}
            onChange={(e) => onFilterChange({ ...filters, endDate: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>
    </div>
  );
}
