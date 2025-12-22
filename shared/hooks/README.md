# Shared Hooks Catalog

This directory contains custom React hooks shared across the admin, client, and website applications. All hooks follow React best practices, are fully typed with TypeScript, and handle cleanup properly.

## Table of Contents

- [Available Hooks](#available-hooks)
- [Usage Guidelines](#usage-guidelines)
- [Performance Considerations](#performance-considerations)
- [When to Create New Hooks](#when-to-create-new-hooks)

## Available Hooks

### useDebounce

**Location:** `shared/hooks/useDebounce.ts`

Debounces a rapidly changing value to reduce re-renders and API calls.

**Signature:**
```typescript
function useDebounce<T>(value: T, delay: number): T
```

**Parameters:**
- `value: T` - The value to debounce
- `delay: number` - Delay in milliseconds

**Returns:**
- `T` - The debounced value

**Usage:**
```typescript
import { useDebounce } from '@shared/hooks';

function SearchComponent() {
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  useEffect(() => {
    if (debouncedSearchTerm) {
      // API call only happens 500ms after user stops typing
      searchAPI(debouncedSearchTerm);
    }
  }, [debouncedSearchTerm]);

  return (
    <input
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
    />
  );
}
```

**When to Use:**
- Search inputs to reduce API calls
- Form validation to avoid validating on every keystroke
- Resize handlers to avoid excessive re-renders
- Scroll handlers for performance

**Performance:**
- Reduces re-renders significantly
- Prevents excessive API calls
- Minimal memory overhead
- Automatic cleanup on unmount

---

### useLocalStorage

**Location:** `shared/hooks/useLocalStorage.ts`

Syncs state with browser localStorage with JSON serialization.

**Signature:**
```typescript
function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((val: T) => T)) => void]
```

**Parameters:**
- `key: string` - localStorage key
- `initialValue: T` - Default value if key doesn't exist

**Returns:**
- `[value, setValue]` - State tuple like useState

**Usage:**
```typescript
import { useLocalStorage } from '@shared/hooks';

function ThemeSelector() {
  const [theme, setTheme] = useLocalStorage('theme', 'light');

  return (
    <button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
      Current theme: {theme}
    </button>
  );
}
```

**When to Use:**
- User preferences (theme, language)
- Form draft saving
- Recently viewed items
- Non-sensitive user settings

**When NOT to Use:**
- Sensitive data (use secure storage)
- Large data (localStorage has 5-10MB limit)
- Data that needs server sync
- Session-specific data (use sessionStorage)

**Features:**
- JSON serialization/deserialization
- Error handling for quota exceeded
- Sync across tabs/windows
- Type-safe with TypeScript

---

### useSupabaseAuth

**Location:** `shared/hooks/useSupabaseAuth.ts`

Manages Supabase authentication state with automatic session handling.

**Signature:**
```typescript
function useSupabaseAuth(): {
  session: Session | null;
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}
```

**Returns:**
- `session`: Current Supabase session or null
- `user`: Current user object or null
- `loading`: Authentication state loading
- `signIn`: Sign in with email/password
- `signUp`: Sign up with email/password
- `signOut`: Sign out current user

**Usage:**
```typescript
import { useSupabaseAuth } from '@shared/hooks';

function AuthComponent() {
  const { user, loading, signIn, signOut } = useSupabaseAuth();

  if (loading) return <LoadingSpinner />;

  if (!user) {
    return (
      <button onClick={() => signIn(email, password)}>
        Sign In
      </button>
    );
  }

  return (
    <div>
      Welcome, {user.email}
      <button onClick={signOut}>Sign Out</button>
    </div>
  );
}
```

**When to Use:**
- Authentication state management
- Protected routes
- User profile displays
- Permission checks

**Features:**
- Automatic session refresh
- Auth state change listeners
- Error handling
- Session persistence

---

### useEscapeKey

**Location:** `shared/hooks/useEscapeKey.ts`

Triggers callback when Escape key is pressed.

**Signature:**
```typescript
function useEscapeKey(callback: () => void, enabled?: boolean): void
```

**Parameters:**
- `callback: () => void` - Function to call on Escape press
- `enabled?: boolean` - Whether the listener is active (default: true)

**Usage:**
```typescript
import { useEscapeKey } from '@shared/hooks';

function Modal({ onClose }) {
  useEscapeKey(onClose);

  return (
    <div className="modal">
      <p>Press Escape to close</p>
    </div>
  );
}
```

**When to Use:**
- Modal close handlers
- Dropdown close handlers
- Cancel operations
- Exit fullscreen mode

**Features:**
- Automatic cleanup
- Can be disabled when not needed
- No memory leaks
- Works with nested modals

**Accessibility:**
- Essential for keyboard navigation
- WCAG 2.1 requirement for modals
- Provides consistent escape mechanism

---

### useFocusTrap

**Location:** `shared/hooks/useFocusTrap.ts`

Traps keyboard focus within a container for modal accessibility.

**Signature:**
```typescript
function useFocusTrap(enabled?: boolean): React.RefObject<HTMLElement>
```

**Parameters:**
- `enabled?: boolean` - Whether focus trap is active (default: true)

**Returns:**
- `React.RefObject<HTMLElement>` - Ref to attach to container

**Usage:**
```typescript
import { useFocusTrap } from '@shared/hooks';

function Modal({ isOpen, onClose }) {
  const modalRef = useFocusTrap(isOpen);

  if (!isOpen) return null;

  return (
    <div ref={modalRef} className="modal">
      <button onClick={onClose}>Close</button>
      <input placeholder="Name" />
      <button>Submit</button>
    </div>
  );
}
```

**When to Use:**
- Modal dialogs
- Dropdown menus
- Popup panels
- Any overlay that should contain focus

**Features:**
- Cycles focus through focusable elements
- Returns focus to trigger element on close
- Handles Tab and Shift+Tab
- Automatically finds focusable elements

**Accessibility:**
- WCAG 2.1 AA requirement for modals
- Prevents focus from leaving modal
- Essential for screen reader users
- Improves keyboard navigation

---

### useDataFetch

**Location:** `shared/hooks/useDataFetch.ts`

Fetches data with automatic retry logic, caching, and error handling.

**Signature:**
```typescript
function useDataFetch<T>(
  fetcher: () => Promise<T>,
  dependencies?: React.DependencyList,
  options?: UseDataFetchOptions<T>
): UseDataFetchResult<T>
```

**Parameters:**
- `fetcher: () => Promise<T>` - Async function that fetches data
- `dependencies?: React.DependencyList` - Dependencies that trigger refetch (default: [])
- `options?: UseDataFetchOptions<T>` - Configuration options

**Options:**
- `initialData?: T` - Initial data value
- `skip?: boolean` - Skip fetching (default: false)
- `onError?: (error: Error) => void` - Error callback
- `onSuccess?: (data: T) => void` - Success callback
- `retry?: RetryConfig` - Retry configuration
  - `maxAttempts?: number` - Max retry attempts (default: 3)
  - `baseDelay?: number` - Base delay in ms (default: 1000)
  - `maxDelay?: number` - Max delay in ms (default: 10000)
- `cache?: CacheConfig` - Cache configuration
  - `enabled?: boolean` - Enable caching (default: false)
  - `ttl?: number` - Time to live in ms (default: 60000)

**Returns:**
- `data: T | null` - Fetched data or null
- `loading: boolean` - Loading state
- `error: string | null` - Error message or null
- `refetch: () => Promise<void>` - Manual refetch function
- `isRetrying: boolean` - Whether currently retrying
- `attemptCount: number` - Current attempt number

**Usage:**
```typescript
import { useDataFetch } from '@shared/hooks';

function UserProfile({ userId }) {
  const { data, loading, error, refetch } = useDataFetch(
    () => api.getUser(userId),
    [userId],
    {
      retry: { maxAttempts: 3, baseDelay: 1000 },
      cache: { enabled: true, ttl: 60000 },
      onError: (err) => console.error('Failed to fetch user:', err)
    }
  );

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorAlert message={error} onRetry={refetch} />;
  if (!data) return null;

  return <div>{data.name}</div>;
}
```

**When to Use:**
- API data fetching with retry logic
- Caching expensive API calls
- Dashboard data loading
- Real-time data monitoring

**Features:**
- Exponential backoff retry
- Automatic request cancellation on unmount
- Optional response caching
- Granular loading and retry states
- Type-safe with TypeScript generics
- Handles race conditions

**Best Practices:**
```typescript
// ✅ GOOD - Enable cache for frequently accessed data
const { data } = useDataFetch(
  () => api.getSettings(),
  [],
  { cache: { enabled: true, ttl: 300000 } }
);

// ✅ GOOD - Skip fetching conditionally
const { data } = useDataFetch(
  () => api.getUserData(userId),
  [userId],
  { skip: !userId }
);

// ❌ BAD - Too many retries
const { data } = useDataFetch(
  () => api.getData(),
  [],
  { retry: { maxAttempts: 100 } } // Excessive
);
```

**Performance:**
- Caching reduces API calls significantly
- Abort controllers prevent memory leaks
- Exponential backoff prevents server overload

---

### usePolling

**Location:** `shared/hooks/usePolling.ts`

Polls a function at regular intervals with smart pause/resume controls.

**Signature:**
```typescript
function usePolling(
  callback: () => void | Promise<void>,
  interval: number,
  options?: UsePollingOptions
): UsePollingControls
```

**Parameters:**
- `callback: () => void | Promise<void>` - Function to poll
- `interval: number` - Polling interval in milliseconds
- `options?: UsePollingOptions` - Configuration options

**Options:**
- `enabled?: boolean` - Enable polling (default: true)
- `immediate?: boolean` - Run immediately on mount (default: true)
- `pauseWhenHidden?: boolean` - Pause when tab hidden (default: true)
- `pauseWhenOffline?: boolean` - Pause when offline (default: true)
- `adaptivePolling?: boolean` - Slow down on errors (default: true)
- `maxErrorDelay?: number` - Max delay on errors in ms (default: 30000)
- `errorMultiplier?: number` - Error delay multiplier (default: 2)

**Returns:**
- `pause: () => void` - Pause polling
- `resume: () => void` - Resume polling
- `isPaused: boolean` - Whether currently paused
- `errorCount: number` - Number of consecutive errors

**Usage:**
```typescript
import { usePolling } from '@shared/hooks';

function RealTimeMonitor() {
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [data, setData] = useState(null);

  const { pause, resume, isPaused, errorCount } = usePolling(
    async () => {
      const result = await api.getLatestData();
      setData(result);
    },
    5000,
    {
      enabled: autoRefresh,
      pauseWhenHidden: true,
      pauseWhenOffline: true,
      adaptivePolling: true
    }
  );

  return (
    <div>
      <button onClick={isPaused ? resume : pause}>
        {isPaused ? 'Resume' : 'Pause'} Auto-refresh
      </button>
      {errorCount > 0 && <p>Connection issues: {errorCount} errors</p>}
      <DataDisplay data={data} />
    </div>
  );
}
```

**When to Use:**
- Real-time dashboards
- Status monitoring
- Live data updates
- Periodic health checks

**Features:**
- Automatically pauses when browser tab hidden
- Pauses when network goes offline
- Adaptive polling (slows down on errors)
- Manual pause/resume controls
- Error counting and tracking
- Automatic cleanup on unmount

**Best Practices:**
```typescript
// ✅ GOOD - Use visibility API for better performance
const controls = usePolling(
  fetchData,
  10000,
  { pauseWhenHidden: true }
);

// ✅ GOOD - Handle network changes
const controls = usePolling(
  fetchData,
  5000,
  { pauseWhenOffline: true }
);

// ✅ GOOD - Use adaptive polling for unreliable APIs
const controls = usePolling(
  fetchData,
  3000,
  {
    adaptivePolling: true,
    maxErrorDelay: 60000
  }
);

// ❌ BAD - Polling too frequently
const controls = usePolling(
  fetchData,
  100 // Too fast, can overload server
);

// ❌ BAD - Not using visibility API
const controls = usePolling(
  fetchData,
  1000,
  { pauseWhenHidden: false } // Wastes resources
);
```

**Performance:**
- Visibility API saves significant resources
- Adaptive polling prevents server overload
- Offline detection prevents failed requests
- Automatic cleanup prevents memory leaks

**Recommended Intervals:**
- Critical data: 1000-3000ms
- Dashboard data: 5000-10000ms
- Status updates: 10000-30000ms
- Low-priority updates: 30000-60000ms

---

## Usage Guidelines

### When to Create a New Hook

Create a new shared hook when:

1. **Multi-App Usage**: The logic is needed in 2+ apps
2. **Reusable Logic**: Encapsulates reusable stateful logic
3. **Side Effect Management**: Manages side effects (subscriptions, timers)
4. **Performance Optimization**: Provides performance benefits (memoization, debouncing)

### When NOT to Create a Shared Hook

Keep hooks in app folders when:

1. **Single Use**: Only one app needs it
2. **App-Specific**: Contains app-specific business logic
3. **Too Specific**: Too narrowly focused on one use case
4. **Experimental**: Not yet proven for reuse

### Hook Checklist

Before adding a hook to shared:

- [ ] Used by 2+ apps OR clearly reusable
- [ ] No app-specific imports or logic
- [ ] Full TypeScript types
- [ ] JSDoc documentation
- [ ] Proper cleanup (useEffect return functions)
- [ ] Handles edge cases (unmounting, rapid updates)
- [ ] Memory leak prevention
- [ ] Tests covering core functionality

### Import Best Practices

Always use the `@shared` alias:

```typescript
// ✅ GOOD
import { useDebounce, useLocalStorage } from '@shared/hooks';

// ❌ BAD
import { useDebounce } from '../../shared/hooks/useDebounce';
```

---

## Performance Considerations

### useDebounce

**Performance Impact:**
- **Low overhead**: Single timeout per instance
- **Memory**: Minimal (one value stored)
- **Re-renders**: Significantly reduces re-renders

**Best Practices:**
```typescript
// ✅ GOOD - Appropriate delay
const debouncedSearch = useDebounce(searchTerm, 300);

// ❌ BAD - Delay too short, defeats purpose
const debouncedSearch = useDebounce(searchTerm, 10);

// ❌ BAD - Delay too long, poor UX
const debouncedSearch = useDebounce(searchTerm, 5000);
```

**Recommended Delays:**
- Search inputs: 300-500ms
- Form validation: 500-1000ms
- Resize handlers: 150-300ms
- Scroll handlers: 100-200ms

---

### useLocalStorage

**Performance Impact:**
- **Read**: Synchronous, blocks render
- **Write**: Synchronous, can impact performance
- **Memory**: Limited by localStorage quota (5-10MB)

**Best Practices:**
```typescript
// ✅ GOOD - Small, simple data
const [theme, setTheme] = useLocalStorage('theme', 'light');

// ❌ BAD - Large objects
const [hugeData, setHugeData] = useLocalStorage('data', megabyteObject);

// ✅ GOOD - Use for preferences
const [preferences, setPreferences] = useLocalStorage('prefs', {
  theme: 'light',
  language: 'en'
});
```

**Limitations:**
- Synchronous API (blocks main thread)
- 5-10MB storage limit
- String values only (JSON serialized)
- Not secure (don't store sensitive data)

---

### useSupabaseAuth

**Performance Impact:**
- **Initial load**: One-time auth check
- **Memory**: Maintains auth state listener
- **Network**: Minimal (only on auth changes)

**Best Practices:**
```typescript
// ✅ GOOD - Use at app root level
function App() {
  const { user, loading } = useSupabaseAuth();
  // Provide to child components via context
}

// ❌ BAD - Using in multiple places
function Component1() {
  const { user } = useSupabaseAuth(); // Creates duplicate listener
}
function Component2() {
  const { user } = useSupabaseAuth(); // Creates duplicate listener
}
```

**Recommendations:**
- Use once at app root
- Provide auth state via context
- Avoid multiple instances

---

### useFocusTrap

**Performance Impact:**
- **Low overhead**: Event listeners only when active
- **Memory**: Minimal
- **DOM queries**: Runs once per activation

**Best Practices:**
```typescript
// ✅ GOOD - Only active when modal is open
const modalRef = useFocusTrap(isModalOpen);

// ❌ BAD - Always active (unnecessary)
const modalRef = useFocusTrap(true);
if (!isModalOpen) return null;
```

---

## Common Patterns

### Combining Hooks

```typescript
function SearchWithDebounce() {
  // Combine useDebounce with useState
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 300);

  // Combine useDebounce with useLocalStorage
  const [savedSearch, setSavedSearch] = useLocalStorage('search', '');
  const debouncedSavedSearch = useDebounce(savedSearch, 500);

  return { search, debouncedSearch, savedSearch };
}
```

### Conditional Hook Usage

```typescript
// ✅ GOOD - Hook always called, condition inside
function Component({ shouldTrap }) {
  const ref = useFocusTrap(shouldTrap);
  return <div ref={ref}>Content</div>;
}

// ❌ BAD - Conditional hook call (violates Rules of Hooks)
function Component({ shouldTrap }) {
  if (shouldTrap) {
    const ref = useFocusTrap();
  }
}
```

---

## Testing Hooks

All shared hooks should have tests:

```typescript
// shared/hooks/__tests__/useDebounce.test.ts
import { renderHook, act } from '@testing-library/react-hooks';
import { useDebounce } from '../useDebounce';

describe('useDebounce', () => {
  it('returns initial value immediately', () => {
    const { result } = renderHook(() => useDebounce('hello', 500));
    expect(result.current).toBe('hello');
  });

  it('updates value after delay', async () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebounce(value, 500),
      { initialProps: { value: 'initial' } }
    );

    rerender({ value: 'updated' });

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 500));
    });

    expect(result.current).toBe('updated');
  });
});
```

---

## See Also

- [Shared Architecture Guide](../README.md)
- [Components Catalog](../components/README.md)
- [Type Definitions](../types/README.md)
- [React Hooks Documentation](https://react.dev/reference/react)
