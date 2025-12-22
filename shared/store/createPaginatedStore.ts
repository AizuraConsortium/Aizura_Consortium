/**
 * Paginated Store Factory
 *
 * Creates store slices with pagination management patterns.
 * Reduces boilerplate for stores that need pagination capabilities.
 *
 * Features:
 * - Current page state
 * - Page size state
 * - Navigation helpers (next, prev, go to page)
 * - Total items tracking
 * - Computed properties (total pages, has next/prev)
 * - TypeScript type safety
 *
 * Usage:
 * ```typescript
 * const paginationSlice = createPaginatedStore({
 *   initialPage: 1,
 *   pageSize: 20,
 *   onPageChange: (page) => fetchData(page)
 * });
 * ```
 */

import type { StateCreator } from 'zustand';

export interface PaginatedStoreState {
  currentPage: number;
  pageSize: number;
  totalItems: number;
  setCurrentPage: (page: number) => void;
  setPageSize: (size: number) => void;
  setTotalItems: (total: number) => void;
  nextPage: () => void;
  prevPage: () => void;
  goToPage: (page: number) => void;
  resetPagination: () => void;
}

export interface PaginatedStoreConfig {
  initialPage?: number;
  pageSize?: number;
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (size: number) => void;
}

/**
 * Create a paginated store slice with standard pagination management
 *
 * @param config - Configuration for the paginated store
 * @returns Store slice with pagination management
 *
 * @example
 * ```typescript
 * const paginationSlice = createPaginatedStore({
 *   initialPage: 1,
 *   pageSize: 20,
 *   onPageChange: (page) => {
 *     // Fetch data for new page
 *     fetchProposals({ page, pageSize: 20 });
 *   }
 * });
 * ```
 */
export function createPaginatedStore(
  config: PaginatedStoreConfig = {}
): StateCreator<PaginatedStoreState> {
  const {
    initialPage = 1,
    pageSize: defaultPageSize = 20,
    onPageChange,
    onPageSizeChange,
  } = config;

  return (set, get) => ({
    currentPage: initialPage,
    pageSize: defaultPageSize,
    totalItems: 0,

    setCurrentPage: (page: number) => {
      if (page < 1) return;

      set({ currentPage: page });

      if (onPageChange) {
        onPageChange(page);
      }
    },

    setPageSize: (size: number) => {
      if (size < 1) return;

      set({
        pageSize: size,
        currentPage: 1,
      });

      if (onPageSizeChange) {
        onPageSizeChange(size);
      }
    },

    setTotalItems: (total: number) => set({ totalItems: total }),

    nextPage: () => {
      const state = get();
      const totalPages = Math.ceil(state.totalItems / state.pageSize);
      const nextPage = state.currentPage + 1;

      if (nextPage <= totalPages) {
        state.setCurrentPage(nextPage);
      }
    },

    prevPage: () => {
      const state = get();
      const prevPage = state.currentPage - 1;

      if (prevPage >= 1) {
        state.setCurrentPage(prevPage);
      }
    },

    goToPage: (page: number) => {
      const state = get();
      const totalPages = Math.ceil(state.totalItems / state.pageSize);

      if (page >= 1 && page <= totalPages) {
        state.setCurrentPage(page);
      }
    },

    resetPagination: () =>
      set({
        currentPage: initialPage,
        totalItems: 0,
      }),
  });
}

/**
 * Compute pagination metadata
 *
 * Helper function to calculate pagination properties.
 * Useful for displaying pagination UI.
 *
 * @param currentPage - Current page number
 * @param pageSize - Items per page
 * @param totalItems - Total number of items
 * @returns Pagination metadata
 */
export interface PaginationMetadata {
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  startIndex: number;
  endIndex: number;
  isFirstPage: boolean;
  isLastPage: boolean;
}

export function computePaginationMetadata(
  currentPage: number,
  pageSize: number,
  totalItems: number
): PaginationMetadata {
  const totalPages = Math.ceil(totalItems / pageSize) || 1;
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, totalItems);

  return {
    totalPages,
    hasNextPage: currentPage < totalPages,
    hasPrevPage: currentPage > 1,
    startIndex,
    endIndex,
    isFirstPage: currentPage === 1,
    isLastPage: currentPage === totalPages,
  };
}

/**
 * Helper to calculate page numbers for pagination UI
 *
 * @param currentPage - Current page number
 * @param totalPages - Total number of pages
 * @param maxVisible - Maximum number of page buttons to show
 * @returns Array of page numbers to display
 */
export function calculatePageNumbers(
  currentPage: number,
  totalPages: number,
  maxVisible: number = 5
): (number | 'ellipsis')[] {
  if (totalPages <= maxVisible) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const pages: (number | 'ellipsis')[] = [];
  const halfVisible = Math.floor(maxVisible / 2);

  pages.push(1);

  let start = Math.max(2, currentPage - halfVisible);
  let end = Math.min(totalPages - 1, currentPage + halfVisible);

  if (currentPage - halfVisible <= 2) {
    end = maxVisible - 1;
  }

  if (currentPage + halfVisible >= totalPages - 1) {
    start = totalPages - maxVisible + 2;
  }

  if (start > 2) {
    pages.push('ellipsis');
  }

  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  if (end < totalPages - 1) {
    pages.push('ellipsis');
  }

  if (totalPages > 1) {
    pages.push(totalPages);
  }

  return pages;
}
