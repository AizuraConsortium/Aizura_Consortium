import { useState, useCallback, useMemo } from 'react';

export type PaginationType = 'offset' | 'cursor';

export interface OffsetPaginationState {
  type: 'offset';
  offset: number;
  limit: number;
  total: number;
}

export interface CursorPaginationState {
  type: 'cursor';
  cursor: string | null;
  limit: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export type PaginationState = OffsetPaginationState | CursorPaginationState;

export interface UsePaginationConfig {
  initialLimit?: number;
  initialOffset?: number;
  type?: PaginationType;
  onPageChange?: (state: PaginationState) => void;
}

export interface UsePaginationReturn {
  state: PaginationState;
  currentPage: number;
  totalPages: number;
  canGoNext: boolean;
  canGoPrevious: boolean;
  goToPage: (page: number) => void;
  nextPage: () => void;
  previousPage: () => void;
  firstPage: () => void;
  lastPage: () => void;
  setLimit: (limit: number) => void;
  setTotal: (total: number) => void;
  setCursor: (cursor: string | null, hasNextPage: boolean, hasPreviousPage: boolean) => void;
  reset: () => void;
}

/**
 * usePagination Hook
 *
 * Reusable pagination logic supporting both offset and cursor-based pagination.
 *
 * @example
 * ```tsx
 * // Offset pagination
 * const pagination = usePagination({
 *   initialLimit: 20,
 *   type: 'offset',
 *   onPageChange: (state) => {
 *     if (state.type === 'offset') {
 *       fetchData(state.offset, state.limit);
 *     }
 *   },
 * });
 *
 * // Update total when data arrives
 * pagination.setTotal(response.total);
 *
 * // Cursor pagination
 * const pagination = usePagination({
 *   initialLimit: 20,
 *   type: 'cursor',
 *   onPageChange: (state) => {
 *     if (state.type === 'cursor') {
 *       fetchData(state.cursor, state.limit);
 *     }
 *   },
 * });
 *
 * // Update cursor when data arrives
 * pagination.setCursor(response.nextCursor, true, false);
 * ```
 *
 * @param config - Configuration object
 * @returns Pagination state and controls
 */
export function usePagination({
  initialLimit = 20,
  initialOffset = 0,
  type = 'offset',
  onPageChange,
}: UsePaginationConfig = {}): UsePaginationReturn {
  const [state, setState] = useState<PaginationState>(() => {
    if (type === 'cursor') {
      return {
        type: 'cursor',
        cursor: null,
        limit: initialLimit,
        hasNextPage: false,
        hasPreviousPage: false,
      };
    }

    return {
      type: 'offset',
      offset: initialOffset,
      limit: initialLimit,
      total: 0,
    };
  });

  const currentPage = useMemo(() => {
    if (state.type === 'offset') {
      return Math.floor(state.offset / state.limit) + 1;
    }
    return 1;
  }, [state]);

  const totalPages = useMemo(() => {
    if (state.type === 'offset') {
      return Math.ceil(state.total / state.limit) || 1;
    }
    return 1;
  }, [state]);

  const canGoNext = useMemo(() => {
    if (state.type === 'cursor') {
      return state.hasNextPage;
    }
    return state.offset + state.limit < state.total;
  }, [state]);

  const canGoPrevious = useMemo(() => {
    if (state.type === 'cursor') {
      return state.hasPreviousPage;
    }
    return state.offset > 0;
  }, [state]);

  const updateState = useCallback(
    (newState: PaginationState) => {
      setState(newState);
      onPageChange?.(newState);
    },
    [onPageChange]
  );

  const goToPage = useCallback(
    (page: number) => {
      if (state.type !== 'offset') return;

      const newOffset = (page - 1) * state.limit;
      const clampedOffset = Math.max(0, Math.min(newOffset, Math.max(0, state.total - 1)));

      updateState({
        ...state,
        offset: clampedOffset,
      });
    },
    [state, updateState]
  );

  const nextPage = useCallback(() => {
    if (state.type === 'offset' && canGoNext) {
      updateState({
        ...state,
        offset: state.offset + state.limit,
      });
    }
  }, [state, canGoNext, updateState]);

  const previousPage = useCallback(() => {
    if (state.type === 'offset' && canGoPrevious) {
      updateState({
        ...state,
        offset: Math.max(0, state.offset - state.limit),
      });
    }
  }, [state, canGoPrevious, updateState]);

  const firstPage = useCallback(() => {
    if (state.type === 'offset') {
      updateState({
        ...state,
        offset: 0,
      });
    }
  }, [state, updateState]);

  const lastPage = useCallback(() => {
    if (state.type === 'offset') {
      const lastOffset = Math.max(0, Math.floor((state.total - 1) / state.limit) * state.limit);
      updateState({
        ...state,
        offset: lastOffset,
      });
    }
  }, [state, updateState]);

  const setLimit = useCallback(
    (limit: number) => {
      if (state.type === 'offset') {
        const currentPage = Math.floor(state.offset / state.limit) + 1;
        const newOffset = (currentPage - 1) * limit;

        updateState({
          ...state,
          limit,
          offset: Math.min(newOffset, Math.max(0, state.total - 1)),
        });
      } else {
        updateState({
          ...state,
          limit,
        });
      }
    },
    [state, updateState]
  );

  const setTotal = useCallback(
    (total: number) => {
      if (state.type === 'offset') {
        updateState({
          ...state,
          total,
        });
      }
    },
    [state, updateState]
  );

  const setCursor = useCallback(
    (cursor: string | null, hasNextPage: boolean, hasPreviousPage: boolean) => {
      if (state.type === 'cursor') {
        updateState({
          ...state,
          cursor,
          hasNextPage,
          hasPreviousPage,
        });
      }
    },
    [state, updateState]
  );

  const reset = useCallback(() => {
    if (type === 'cursor') {
      updateState({
        type: 'cursor',
        cursor: null,
        limit: initialLimit,
        hasNextPage: false,
        hasPreviousPage: false,
      });
    } else {
      updateState({
        type: 'offset',
        offset: initialOffset,
        limit: initialLimit,
        total: 0,
      });
    }
  }, [type, initialLimit, initialOffset, updateState]);

  return {
    state,
    currentPage,
    totalPages,
    canGoNext,
    canGoPrevious,
    goToPage,
    nextPage,
    previousPage,
    firstPage,
    lastPage,
    setLimit,
    setTotal,
    setCursor,
    reset,
  };
}
