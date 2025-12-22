/**
 * URL Sync Middleware
 *
 * Optional Zustand middleware to sync store state to URL query parameters.
 * Useful for sharing filtered/paginated views via URL.
 *
 * Features:
 * - Sync state to URL query params
 * - Restore state from URL on load
 * - Configurable fields
 * - Custom serialization
 * - Browser history integration
 *
 * Usage:
 * ```typescript
 * import { syncToUrl } from '@shared/store/middleware/syncToUrl';
 *
 * const useStore = create(
 *   syncToUrl(
 *     (set) => ({ ... }),
 *     {
 *       fields: ['currentPage', 'filters', 'pageSize'],
 *       prefix: 'app'
 *     }
 *   )
 * );
 * ```
 */

import type { StateCreator, StoreMutatorIdentifier } from 'zustand';

export interface SyncToUrlConfig<T = any> {
  fields?: (keyof T)[];
  prefix?: string;
  serialize?: (key: string, value: any) => string | undefined;
  deserialize?: (key: string, value: string) => any;
  replaceState?: boolean;
}

type SyncToUrlMiddleware = <
  T,
  Mps extends [StoreMutatorIdentifier, unknown][] = [],
  Mcs extends [StoreMutatorIdentifier, unknown][] = []
>(
  f: StateCreator<T, Mps, Mcs>,
  config?: SyncToUrlConfig<T>
) => StateCreator<T, Mps, Mcs>;

type SyncToUrlImpl = <T>(
  f: StateCreator<T, [], []>,
  config?: SyncToUrlConfig<T>
) => StateCreator<T, [], []>;

/**
 * Default serializer: converts values to URL-safe strings
 */
function defaultSerialize(key: string, value: any): string | undefined {
  if (value === undefined || value === null) {
    return undefined;
  }

  if (typeof value === 'object') {
    try {
      return JSON.stringify(value);
    } catch {
      return undefined;
    }
  }

  return String(value);
}

/**
 * Default deserializer: converts URL strings back to values
 */
function defaultDeserialize(key: string, value: string): any {
  if (value.startsWith('{') || value.startsWith('[')) {
    try {
      return JSON.parse(value);
    } catch {
      return value;
    }
  }

  if (value === 'true') return true;
  if (value === 'false') return false;

  const num = Number(value);
  if (!isNaN(num)) return num;

  return value;
}

/**
 * Sync store state to URL query parameters
 *
 * @param f - Store creator function
 * @param config - Configuration options
 * @returns Enhanced store creator with URL sync
 */
const syncToUrlImpl: SyncToUrlImpl = (f, config = {}) => (set, get, store) => {
  const {
    fields = [],
    prefix = '',
    serialize = defaultSerialize,
    deserialize = defaultDeserialize,
    replaceState = false,
  } = config;

  const createKey = (key: string) => (prefix ? `${prefix}_${key}` : key);

  const syncToUrl = (state: any) => {
    if (typeof window === 'undefined') return;

    const url = new URL(window.location.href);
    const params = url.searchParams;

    fields.forEach((field) => {
      const key = createKey(String(field));
      const value = state[field];
      const serialized = serialize(String(field), value);

      if (serialized !== undefined) {
        params.set(key, serialized);
      } else {
        params.delete(key);
      }
    });

    const newUrl = `${url.pathname}${params.toString() ? '?' + params.toString() : ''}`;

    if (replaceState) {
      window.history.replaceState({}, '', newUrl);
    } else {
      window.history.pushState({}, '', newUrl);
    }
  };

  const restoreFromUrl = () => {
    if (typeof window === 'undefined') return {};

    const url = new URL(window.location.href);
    const params = url.searchParams;
    const restored: any = {};

    fields.forEach((field) => {
      const key = createKey(String(field));
      const value = params.get(key);

      if (value !== null) {
        restored[field] = deserialize(String(field), value);
      }
    });

    return restored;
  };

  const storeState = f(
    (partial, replace) => {
      set(partial, replace);
      const currentState = get();
      syncToUrl(currentState);
    },
    get,
    store
  );

  const restoredState = restoreFromUrl();

  return {
    ...storeState,
    ...restoredState,
  };
};

export const syncToUrl = syncToUrlImpl as SyncToUrlMiddleware;

/**
 * Manually sync current state to URL
 *
 * Useful for syncing after multiple state changes.
 *
 * @param state - Current store state
 * @param config - Sync configuration
 */
export function manualSyncToUrl<T>(state: T, config: SyncToUrlConfig<T>) {
  if (typeof window === 'undefined') return;

  const {
    fields = [],
    prefix = '',
    serialize = defaultSerialize,
    replaceState = false,
  } = config;

  const url = new URL(window.location.href);
  const params = url.searchParams;

  fields.forEach((field) => {
    const key = prefix ? `${prefix}_${String(field)}` : String(field);
    const value = state[field];
    const serialized = serialize(String(field), value);

    if (serialized !== undefined) {
      params.set(key, serialized);
    } else {
      params.delete(key);
    }
  });

  const newUrl = `${url.pathname}${params.toString() ? '?' + params.toString() : ''}`;

  if (replaceState) {
    window.history.replaceState({}, '', newUrl);
  } else {
    window.history.pushState({}, '', newUrl);
  }
}
