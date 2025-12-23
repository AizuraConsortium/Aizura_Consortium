import { ReactNode } from 'react';
import { X } from 'lucide-react';
import { cn } from '@shared/styles/theme';

export type FilterFieldType = 'text' | 'select' | 'date' | 'number' | 'datetime-local';

export interface FilterFieldOption {
  label: string;
  value: string | number;
}

export interface FilterFieldConfig {
  name: string;
  label: string;
  type: FilterFieldType;
  placeholder?: string;
  options?: FilterFieldOption[];
  min?: string | number;
  max?: string | number;
  step?: string | number;
}

export interface FilterPanelProps<T extends Record<string, any>> {
  title?: string;
  filters: T;
  fields: FilterFieldConfig[];
  onFilterChange: (filters: T) => void;
  onClear: () => void;
  hasActiveFilters: boolean;
  className?: string;
  columns?: 1 | 2 | 3 | 4 | 5 | 6;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'compact';
  showClearButton?: boolean;
  clearButtonText?: string;
  customActions?: ReactNode;
}

/**
 * FilterPanel Component
 *
 * Generic filter panel with dynamic field generation based on configuration.
 * Supports text, select, date, number, and datetime-local input types.
 *
 * @example
 * ```tsx
 * interface MyFilters {
 *   source: string;
 *   severity: string;
 *   startDate: string;
 * }
 *
 * const fields: FilterFieldConfig[] = [
 *   {
 *     name: 'source',
 *     label: 'Source',
 *     type: 'select',
 *     options: [
 *       { label: 'All sources', value: '' },
 *       { label: 'Frontend', value: 'frontend' },
 *       { label: 'Backend', value: 'backend' },
 *     ],
 *   },
 *   {
 *     name: 'startDate',
 *     label: 'Start Date',
 *     type: 'date',
 *   },
 * ];
 *
 * <FilterPanel
 *   filters={filters}
 *   fields={fields}
 *   onFilterChange={setFilters}
 *   onClear={clearFilters}
 *   hasActiveFilters={hasActiveFilters}
 *   columns={3}
 * />
 * ```
 */
export function FilterPanel<T extends Record<string, any>>({
  title = 'Filters',
  filters,
  fields,
  onFilterChange,
  onClear,
  hasActiveFilters,
  className,
  columns = 3,
  size = 'md',
  variant = 'default',
  showClearButton = true,
  clearButtonText = 'Clear all',
  customActions,
}: FilterPanelProps<T>) {
  const handleFieldChange = (name: string, value: any) => {
    onFilterChange({ ...filters, [name]: value });
  };

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-3 py-2 text-sm',
    lg: 'px-4 py-2.5 text-base',
  };

  const inputClass = cn(
    'w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors',
    sizeClasses[size]
  );

  const columnClasses = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
    5: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-5',
    6: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-6',
  };

  const containerClass = cn(
    'bg-white rounded-lg border border-gray-200',
    variant === 'default' ? 'p-6' : 'p-4',
    className
  );

  const renderField = (field: FilterFieldConfig) => {
    const value = filters[field.name] ?? '';

    switch (field.type) {
      case 'select':
        return (
          <select
            value={value}
            onChange={(e) => handleFieldChange(field.name, e.target.value)}
            className={inputClass}
          >
            {field.options?.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );

      case 'date':
      case 'datetime-local':
        return (
          <input
            type={field.type}
            value={value}
            onChange={(e) => handleFieldChange(field.name, e.target.value)}
            min={field.min as string}
            max={field.max as string}
            className={inputClass}
          />
        );

      case 'number':
        return (
          <input
            type="number"
            value={value}
            onChange={(e) => handleFieldChange(field.name, e.target.value)}
            placeholder={field.placeholder}
            min={field.min}
            max={field.max}
            step={field.step}
            className={inputClass}
          />
        );

      case 'text':
      default:
        return (
          <input
            type="text"
            value={value}
            onChange={(e) => handleFieldChange(field.name, e.target.value)}
            placeholder={field.placeholder}
            className={inputClass}
          />
        );
    }
  };

  return (
    <div className={containerClass}>
      <div className="flex items-center justify-between mb-4">
        <h3 className={cn('font-semibold text-gray-900', size === 'lg' ? 'text-lg' : 'text-base')}>
          {title}
        </h3>
        <div className="flex items-center gap-2">
          {customActions}
          {showClearButton && hasActiveFilters && (
            <button
              onClick={onClear}
              className={cn(
                'flex items-center space-x-1 text-blue-600 hover:text-blue-700 transition',
                size === 'sm' ? 'text-xs' : 'text-sm'
              )}
            >
              <X className="h-4 w-4" />
              <span>{clearButtonText}</span>
            </button>
          )}
        </div>
      </div>

      <div className={cn('grid gap-4', columnClasses[columns])}>
        {fields.map((field) => (
          <div key={field.name}>
            <label
              className={cn(
                'block font-medium text-gray-700 mb-2',
                size === 'sm' ? 'text-xs' : 'text-sm'
              )}
            >
              {field.label}
            </label>
            {renderField(field)}
          </div>
        ))}
      </div>
    </div>
  );
}
