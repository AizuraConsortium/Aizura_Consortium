/**
 * Filtered Store Factory
 *
 * Creates store slices with filter management patterns.
 * Reduces boilerplate for stores that need filtering capabilities.
 *
 * Features:
 * - Generic filter state
 * - Merge filters functionality
 * - Reset filters
 * - Auto-reset pagination on filter change
 * - TypeScript type safety
 *
 * Usage:
 * ```typescript
 * interface MyFilter {
 *   status?: string;
 *   dateRange?: { start: Date; end: Date };
 * }
 *
 * const filterSlice = createFilteredStore<MyFilter>({
 *   defaultFilters: {},
 *   onFilterChange: (filters) => console.log('Filters changed:', filters)
 * });
 * ```
 */

import type { StateCreator } from 'zustand';

export interface FilteredStoreState<TFilter = Record<string, any>> {
  filters: TFilter;
  setFilters: (filters: Partial<TFilter>) => void;
  resetFilters: () => void;
}

export interface FilteredStoreConfig<TFilter = Record<string, any>> {
  defaultFilters?: TFilter;
  onFilterChange?: (filters: TFilter) => void;
  resetPagination?: boolean;
}

/**
 * Create a filtered store slice with standard filter management
 *
 * @param config - Configuration for the filtered store
 * @returns Store slice with filter management
 *
 * @example
 * ```typescript
 * interface ProposalFilter {
 *   status?: 'active' | 'archived';
 *   dateRange?: { start: Date; end: Date };
 * }
 *
 * const filterSlice = createFilteredStore<ProposalFilter>({
 *   defaultFilters: {},
 *   resetPagination: true,
 *   onFilterChange: (filters) => {
 *     // Refetch data with new filters
 *     fetchProposals(filters);
 *   }
 * });
 * ```
 */
export function createFilteredStore<TFilter extends Record<string, any> = Record<string, any>>(
  config: FilteredStoreConfig<TFilter> = {}
): StateCreator<FilteredStoreState<TFilter> & { currentPage?: number }> {
  const {
    defaultFilters = {} as TFilter,
    onFilterChange,
    resetPagination = true,
  } = config;

  return (set) => ({
    filters: defaultFilters,

    setFilters: (newFilters: Partial<TFilter>) =>
      set((state) => {
        const updatedFilters = { ...state.filters, ...newFilters };

        if (onFilterChange) {
          onFilterChange(updatedFilters);
        }

        return {
          filters: updatedFilters,
          ...(resetPagination && { currentPage: 1 }),
        };
      }),

    resetFilters: () =>
      set({
        filters: defaultFilters,
        ...(resetPagination && { currentPage: 1 }),
      }),
  });
}

/**
 * Create filter actions without state (for combining with existing state)
 *
 * Useful when you need to add filter functionality to an existing store
 * without using the full slice pattern.
 *
 * @param config - Configuration for filter actions
 * @returns Object with filter action functions
 */
export function createFilterActions<TFilter extends Record<string, any>>(
  config: FilteredStoreConfig<TFilter> = {}
) {
  const { onFilterChange, resetPagination = true } = config;

  return {
    setFilters: (set: any) => (newFilters: Partial<TFilter>) =>
      set((state: any) => {
        const updatedFilters = { ...state.filters, ...newFilters };

        if (onFilterChange) {
          onFilterChange(updatedFilters);
        }

        return {
          filters: updatedFilters,
          ...(resetPagination && { currentPage: 1 }),
        };
      }),

    resetFilters: (set: any, defaultFilters: TFilter) => () =>
      set({
        filters: defaultFilters,
        ...(resetPagination && { currentPage: 1 }),
      }),
  };
}

/**
 * Helper to check if filters are active (non-empty)
 *
 * @param filters - Filter object to check
 * @returns true if any filter is set
 */
export function hasActiveFilters<TFilter extends Record<string, any>>(
  filters: TFilter
): boolean {
  return Object.keys(filters).some((key) => {
    const value = filters[key];
    return value !== undefined && value !== null && value !== '';
  });
}

/**
 * Helper to count active filters
 *
 * @param filters - Filter object to count
 * @returns Number of active filters
 */
export function countActiveFilters<TFilter extends Record<string, any>>(
  filters: TFilter
): number {
  return Object.keys(filters).filter((key) => {
    const value = filters[key];
    return value !== undefined && value !== null && value !== '';
  }).length;
}
