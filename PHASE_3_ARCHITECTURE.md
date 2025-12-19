# Phase 3 Architecture: State Management & Polish

This document describes the state management architecture and developer experience improvements implemented in Phase 3.

## Table of Contents

1. [State Management](#state-management)
2. [Error Handling](#error-handling)
3. [Toast Notifications](#toast-notifications)
4. [Loading States](#loading-states)
5. [Development Tooling](#development-tooling)
6. [Shared Infrastructure](#shared-infrastructure)

## State Management

### Zustand Store Architecture

We use Zustand for state management across all three applications. Each app has its own store with persistence.

#### Admin Store (`/admin/stores/adminStore.ts`)

**State Slices:**
- **AuthState**: User authentication and session
- **ErrorMonitoringState**: Error log filters and pagination
- **RateLimitState**: Rate limit monitoring settings
- **SystemHealthState**: System health status

**Key Features:**
- Persisted: `user`, `isAuthenticated`, `timeRange`
- Non-persisted: `filters`, `selectedErrors`, `currentPage`

**Usage:**
```tsx
import { useAdminStore } from '../stores/adminStore';

function ErrorMonitor() {
  const { filters, setFilters, resetFilters } = useAdminStore();
  const user = useAdminStore(state => state.user);
}
```

#### Client Store (`/client/stores/clientStore.ts`)

**State Slices:**
- **AuthState**: User authentication
- **ProposalState**: Proposal filters and pagination
- **DraftState**: In-progress proposal drafts

**Key Features:**
- Persisted: `user`, `isAuthenticated`, `draft`
- Auto-saves draft on update with timestamp
- Clears draft on logout

**Usage:**
```tsx
import { useClientStore } from '../stores/clientStore';

function ProposalEditor() {
  const { draft, updateDraft } = useClientStore();

  const handleChange = (field, value) => {
    updateDraft({ [field]: value });
  };
}
```

#### Website Store (`/website/stores/websiteStore.ts`)

**State Slices:**
- **TopicState**: Current and ended topics
- **MessageState**: Message filters and selection
- **VotingState**: User votes and voting history
- **UIState**: Sidebar, debug mode

**Key Features:**
- Persisted: `userVotes`, `votingHistory`, `sidebarOpen`
- Topic management with history
- Vote tracking with timestamps

**Usage:**
```tsx
import { useWebsiteStore } from '../stores/websiteStore';

function VotingPanel() {
  const { userVotes, castVote } = useWebsiteStore();

  const handleVote = (topicId, vote) => {
    castVote(topicId, vote);
  };
}
```

### State Management Best Practices

1. **Use selectors for performance:**
   ```tsx
   const user = useStore(state => state.user);
   ```

2. **Keep UI state local when possible:**
   ```tsx
   const [isOpen, setIsOpen] = useState(false);
   ```

3. **Use Zustand for:**
   - Authentication state
   - Filters and pagination
   - Cross-component data
   - Persisted preferences

4. **Use local state for:**
   - Form inputs (before submit)
   - Modal/dropdown open states
   - Hover/focus states
   - Temporary UI states

## Error Handling

### Error Handling Utilities

Located in `/shared/utils/errorHandling.ts`

**handleApiError(error: unknown): UserFriendlyMessage**

Converts technical errors into user-friendly messages:

```tsx
import { handleApiError } from '../../shared/utils';

try {
  await apiCall();
} catch (error) {
  const friendly = handleApiError(error);
  showError(friendly.title, friendly.message);
}
```

**Error Classifications:**
- Network errors (Failed to fetch)
- Authentication errors (401, 403)
- Not found errors (404)
- Rate limit errors (429)
- Server errors (500+)

**logError(error: Error, context: string): void**

Structured error logging with context:

```tsx
import { logError } from '../../shared/utils';

try {
  // risky operation
} catch (error) {
  logError(error as Error, 'ProposalSubmission');
}
```

Logs include:
- Context identifier
- Error message and stack
- Timestamp
- User agent
- Current URL

### Error Handling Patterns

**API Calls:**
```tsx
import { useApi } from '../../shared/hooks';
import { useToast } from '../../shared/components';
import { handleApiError, logError } from '../../shared/utils';

function MyComponent() {
  const { showError } = useToast();

  const { data, loading, error, execute } = useApi(apiFunction, {
    onError: (err) => {
      const friendly = handleApiError(err);
      showError(friendly.title, friendly.message);
      logError(err, 'MyComponent');
    }
  });
}
```

**Form Submission:**
```tsx
const handleSubmit = async (data) => {
  try {
    await submitProposal(data);
    showSuccess('Success', 'Proposal submitted');
  } catch (error) {
    const friendly = handleApiError(error);
    showError(friendly.title, friendly.message);
    logError(error as Error, 'ProposalForm');
  }
};
```

## Toast Notifications

### ToastProvider Setup

Wrap each app with ToastProvider:

```tsx
import { ToastProvider } from '../../shared/components';

function App() {
  return (
    <ErrorBoundary>
      <ToastProvider maxToasts={5}>
        <Router>
          <Routes />
        </Router>
      </ToastProvider>
    </ErrorBoundary>
  );
}
```

### Toast Methods

```tsx
import { useToast } from '../../shared/components';

const {
  showSuccess,
  showError,
  showWarning,
  showInfo
} = useToast();

showSuccess('Saved', 'Changes saved successfully');
showError('Failed', 'Unable to save changes');
showWarning('Warning', 'This action cannot be undone');
showInfo('Info', 'New version available');
```

### Toast Duration

- Success: 5 seconds
- Info: 5 seconds
- Warning: 6 seconds
- Error: 7 seconds
- Custom: Configurable

### Toast Best Practices

1. **Keep titles short:** 1-3 words
2. **Messages should be actionable:** Tell users what to do next
3. **Don't overuse:** Only for important feedback
4. **Use appropriate severity:**
   - Success: Completed actions
   - Error: Failed operations
   - Warning: Potential issues
   - Info: General updates

## Loading States

### Skeleton Components

Replace generic loading text with skeleton components:

**Before:**
```tsx
{loading ? <p>Loading...</p> : <Table data={data} />}
```

**After:**
```tsx
import { TableSkeleton } from '../../shared/components';

{loading ? <TableSkeleton rows={5} columns={4} /> : <Table data={data} />}
```

### Available Skeletons

**TableSkeleton:**
```tsx
<TableSkeleton rows={10} columns={5} />
```

**CardSkeleton:**
```tsx
<CardSkeleton count={3} hasImage />
```

**ListSkeleton:**
```tsx
<ListSkeleton items={8} hasAvatar hasActions />
```

### LoadingSpinner

For full-page or inline loading:

```tsx
import { LoadingSpinner } from '../../shared/components';

<LoadingSpinner size="lg" fullScreen text="Loading data..." />
```

## Development Tooling

### Debug Utilities

Located in `/shared/utils/debug.ts`

**Basic Logging:**
```tsx
import { debug } from '../../shared/utils';

debug.log('API', 'Fetching proposals', { filters });
debug.info('Auth', 'User logged in', user);
debug.warn('Cache', 'Cache miss for key', key);
debug.error('Upload', 'Upload failed', error);
```

**Grouped Logging:**
```tsx
debug.group('Processing', 'Data transformation', () => {
  debug.log('Processing', 'Step 1 complete');
  debug.log('Processing', 'Step 2 complete');
});
```

**Performance Timing:**
```tsx
debug.time('API', 'Fetch proposals');
await fetchProposals();
debug.timeEnd('API', 'Fetch proposals');
```

**Configuration:**
```tsx
import { enableDebug, setDebugLevel } from '../../shared/utils';

enableDebug(['API', 'Auth']);
setDebugLevel('warn');
```

### DevBanner

Shows environment and tenant information:

```tsx
import { DevBanner } from '../../shared/components';

function App() {
  const env = import.meta.env.MODE as 'development' | 'staging' | 'production';

  return (
    <>
      <DevBanner environment={env} tenant="admin" />
      <Routes />
    </>
  );
}
```

Only visible in development and staging.

## Shared Infrastructure

### Component Hierarchy

```
shared/
├── components/
│   ├── ui/           # Base UI components
│   ├── skeletons/    # Loading skeletons
│   ├── ErrorBoundary
│   ├── LoadingSpinner
│   ├── Toast system
│   └── DevBanner
├── hooks/
│   ├── useApi
│   ├── useDebounce
│   ├── useLocalStorage
│   └── usePagination
├── types/
│   ├── Domain types
│   ├── API types
│   └── Form types
└── utils/
    ├── formatters
    ├── validators
    ├── errorHandling
    └── debug
```

### Import Strategy

Always import from barrel exports:

```tsx
import {
  Button,
  Card,
  LoadingSpinner,
  useToast
} from '../../shared/components';

import {
  useApi,
  useDebounce
} from '../../shared/hooks';

import {
  formatDate,
  handleApiError,
  debug
} from '../../shared/utils';

import type {
  Proposal,
  ApiResponse
} from '../../shared/types';
```

### Adding New Shared Code

1. Create the component/hook/utility
2. Add to appropriate barrel export (index.ts)
3. Update relevant README
4. Test in all three apps
5. Update this architecture doc

## Performance Considerations

1. **Use selectors in Zustand:**
   ```tsx
   const user = useStore(state => state.user);
   ```

2. **Memoize expensive computations:**
   ```tsx
   const filtered = useMemo(() =>
     items.filter(item => matches(item, filters)),
     [items, filters]
   );
   ```

3. **Debounce user inputs:**
   ```tsx
   const debouncedSearch = useDebounce(search, 500);
   ```

4. **Use skeleton loaders:**
   - Better perceived performance
   - Prevents layout shift
   - Professional appearance

## Testing Strategy

### Unit Tests
- Test store actions and selectors
- Test error handling functions
- Test utility functions

### Integration Tests
- Test component + store interactions
- Test API error scenarios
- Test toast notifications

### E2E Tests
- Test complete user flows
- Test error recovery
- Test persistence

## Migration Guide

### Converting to Zustand

**Before:**
```tsx
const [user, setUser] = useState(null);
const [filters, setFilters] = useState({});
```

**After:**
```tsx
const { user, filters, setFilters } = useAdminStore();
```

### Converting to useApi

**Before:**
```tsx
const [data, setData] = useState(null);
const [loading, setLoading] = useState(false);
const [error, setError] = useState(null);

useEffect(() => {
  setLoading(true);
  fetchData()
    .then(setData)
    .catch(setError)
    .finally(() => setLoading(false));
}, []);
```

**After:**
```tsx
const { data, loading, error, execute } = useApi(fetchData);

useEffect(() => {
  execute();
}, []);
```

## Conclusion

Phase 3 establishes a robust foundation for state management and developer experience. The combination of Zustand stores, comprehensive error handling, toast notifications, skeleton loaders, and debug utilities provides a production-ready infrastructure that scales across all three applications.
