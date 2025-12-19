# Shared Hooks

This directory contains reusable React hooks shared across all three frontend applications.

## Available Hooks

### useApi

Standardized API call management with loading states, error handling, and automatic state updates.

**Type Signature:**
```typescript
function useApi<T = any>(
  apiFunction: (...args: any[]) => Promise<T>,
  options?: {
    onSuccess?: (data: T) => void;
    onError?: (error: Error) => void;
  }
): {
  data: T | null;
  loading: boolean;
  error: string | null;
  execute: (...args: any[]) => Promise<T | null>;
  reset: () => void;
}
```

**Usage:**
```tsx
import { useApi } from '../../shared/hooks';
import { fetchProposals } from '../lib/api';

function ProposalsList() {
  const { data, loading, error, execute } = useApi(fetchProposals, {
    onSuccess: (data) => console.log('Loaded:', data),
    onError: (error) => console.error('Failed:', error),
  });

  useEffect(() => {
    execute();
  }, []);

  if (loading) return <LoadingSpinner />;
  if (error) return <div>Error: {error}</div>;
  if (!data) return null;

  return <div>{/* Render data */}</div>;
}
```

**Features:**
- Automatic loading state management
- Error handling with user-friendly messages
- Success/error callbacks
- Manual reset capability
- Type-safe with TypeScript generics

### useDebounce

Debounces a value to prevent excessive updates or API calls.

**Type Signature:**
```typescript
function useDebounce<T>(value: T, delay?: number): T
```

**Usage:**
```tsx
import { useDebounce } from '../../shared/hooks';

function SearchInput() {
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearch = useDebounce(searchTerm, 500);

  useEffect(() => {
    if (debouncedSearch) {
      performSearch(debouncedSearch);
    }
  }, [debouncedSearch]);

  return (
    <input
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      placeholder="Search..."
    />
  );
}
```

**Parameters:**
- `value`: T - Value to debounce
- `delay?`: number - Debounce delay in milliseconds (default: 500)

**Best Use Cases:**
- Search inputs
- Filter controls
- Window resize handlers
- Scroll event handlers

### useLocalStorage

Persistent state management with localStorage synchronization.

**Type Signature:**
```typescript
function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((val: T) => T)) => void, () => void]
```

**Usage:**
```tsx
import { useLocalStorage } from '../../shared/hooks';

function ThemeSelector() {
  const [theme, setTheme, removeTheme] = useLocalStorage('theme', 'light');

  return (
    <div>
      <p>Current theme: {theme}</p>
      <button onClick={() => setTheme('dark')}>Dark Mode</button>
      <button onClick={() => setTheme('light')}>Light Mode</button>
      <button onClick={removeTheme}>Reset</button>
    </div>
  );
}
```

**Returns:**
- `[0]`: T - Current value
- `[1]`: (value: T | ((val: T) => T)) => void - Setter function
- `[2]`: () => void - Remove function

**Features:**
- Automatic serialization/deserialization
- SSR-safe (checks for window)
- Supports functional updates
- Error handling for storage quota
- Syncs across component instances

### usePagination

Complete pagination logic and state management.

**Type Signature:**
```typescript
function usePagination(options: {
  totalItems: number;
  itemsPerPage?: number;
  initialPage?: number;
}): {
  currentPage: number;
  totalPages: number;
  pageSize: number;
  setPage: (page: number) => void;
  nextPage: () => void;
  prevPage: () => void;
  canGoNext: boolean;
  canGoPrev: boolean;
  startIndex: number;
  endIndex: number;
}
```

**Usage:**
```tsx
import { usePagination } from '../../shared/hooks';

function PaginatedList({ items }) {
  const {
    currentPage,
    totalPages,
    setPage,
    nextPage,
    prevPage,
    canGoNext,
    canGoPrev,
    startIndex,
    endIndex,
  } = usePagination({
    totalItems: items.length,
    itemsPerPage: 10,
    initialPage: 1,
  });

  const currentItems = items.slice(startIndex, endIndex);

  return (
    <div>
      <ul>
        {currentItems.map(item => <li key={item.id}>{item.name}</li>)}
      </ul>

      <div>
        <button onClick={prevPage} disabled={!canGoPrev}>
          Previous
        </button>
        <span>Page {currentPage} of {totalPages}</span>
        <button onClick={nextPage} disabled={!canGoNext}>
          Next
        </button>
      </div>
    </div>
  );
}
```

**Options:**
- `totalItems`: number - Total number of items (required)
- `itemsPerPage?`: number - Items per page (default: 10)
- `initialPage?`: number - Starting page (default: 1)

**Returns:**
- `currentPage`: Current page number
- `totalPages`: Total number of pages
- `pageSize`: Items per page
- `setPage`: Jump to specific page
- `nextPage`: Go to next page
- `prevPage`: Go to previous page
- `canGoNext`: Can navigate forward
- `canGoPrev`: Can navigate backward
- `startIndex`: Start index for slicing
- `endIndex`: End index for slicing

## Combining Hooks

Hooks can be combined for powerful functionality:

```tsx
import { useApi, useDebounce, usePagination } from '../../shared/hooks';

function AdvancedList() {
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 500);

  const { data, loading, execute } = useApi(fetchItems);

  const {
    currentPage,
    setPage,
    startIndex,
    endIndex,
  } = usePagination({
    totalItems: data?.length || 0,
    itemsPerPage: 20,
  });

  useEffect(() => {
    execute({ search: debouncedSearch });
  }, [debouncedSearch]);

  // Implementation...
}
```

## Best Practices

1. **Always specify types for useApi:**
   ```tsx
   const { data, loading } = useApi<Proposal[]>(fetchProposals);
   ```

2. **Use appropriate debounce delays:**
   - Search: 300-500ms
   - Filters: 500-750ms
   - Resize/scroll: 100-200ms

3. **LocalStorage keys should be descriptive:**
   ```tsx
   useLocalStorage('user-preferences', defaultPrefs);
   useLocalStorage('app-theme', 'light');
   ```

4. **Handle pagination edge cases:**
   ```tsx
   if (totalPages === 0) return <EmptyState />;
   ```

5. **Combine with Zustand for global state:**
   ```tsx
   // Local state for UI
   const [search, setSearch] = useState('');

   // Global state for data
   const filters = useStore(state => state.filters);
   ```
