import type { ErrorSource, ErrorSeverity } from '@shared/types/models';
import { FilterPanel as SharedFilterPanel, FilterFieldConfig } from '@shared/components/ui/FilterPanel';

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

const filterFields: FilterFieldConfig[] = [
  {
    name: 'source',
    label: 'Source',
    type: 'select',
    options: [
      { label: 'All sources', value: '' },
      { label: 'Frontend', value: 'frontend' },
      { label: 'Backend', value: 'backend' },
      { label: 'Agent', value: 'agent' },
    ],
  },
  {
    name: 'severity',
    label: 'Severity',
    type: 'select',
    options: [
      { label: 'All severities', value: '' },
      { label: 'Info', value: 'info' },
      { label: 'Warning', value: 'warning' },
      { label: 'Error', value: 'error' },
      { label: 'Critical', value: 'critical' },
    ],
  },
  {
    name: 'agentId',
    label: 'Agent ID',
    type: 'text',
    placeholder: 'e.g., claude',
  },
  {
    name: 'startDate',
    label: 'Start Date',
    type: 'date',
  },
  {
    name: 'endDate',
    label: 'End Date',
    type: 'date',
  },
];

export function FilterPanel({ filters, onFilterChange, onClear, hasActiveFilters }: FilterPanelProps) {
  return (
    <SharedFilterPanel
      title="Filter Errors"
      filters={filters}
      fields={filterFields}
      onFilterChange={onFilterChange}
      onClear={onClear}
      hasActiveFilters={hasActiveFilters}
      columns={5}
      className="mb-6"
    />
  );
}
