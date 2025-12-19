# Frontend Architecture Guide

## Overview

This document describes the frontend architecture after the consolidation effort that unified common code across three frontend applications (admin, client, website) into a shared library.

## Goals of the Consolidation

1. **Eliminate Code Duplication**: Remove duplicate implementations of Supabase clients, API clients, hooks, and utilities
2. **Single Source of Truth**: One canonical implementation for each piece of shared functionality
3. **Improved Maintainability**: Changes to shared code propagate to all apps automatically
4. **Consistent Patterns**: All apps follow the same architectural patterns
5. **Faster Development**: New apps can bootstrap quickly by leveraging shared components

## Architecture Overview

```
project/
├── admin/              # Admin Dashboard (Port 5173)
│   ├── components/     # Admin-specific components
│   ├── contexts/       # AdminAuthContext (extends base)
│   ├── hooks/          # Admin-specific hooks (none currently)
│   ├── lib/
│   │   ├── api.ts      # Extends base API client
│   │   └── apiConfig.ts # Admin endpoint URLs
│   ├── pages/          # Admin pages
│   ├── stores/         # Admin state management
│   └── types/          # Re-exports shared types
│
├── client/             # Client Portal (Port 5174)
│   ├── components/     # Client-specific components
│   ├── contexts/       # Client auth context
│   ├── lib/
│   │   ├── api.ts      # Extends base API client
│   │   └── apiConfig.ts # Client endpoint URLs
│   ├── pages/          # Client pages
│   ├── stores/         # Client state management
│   └── types/          # Re-exports shared types
│
├── website/            # Public Website (Port 5175)
│   ├── components/     # Website-specific components
│   ├── contexts/       # Website auth contexts
│   ├── lib/
│   │   ├── api.ts      # Extends base API client with custom methods
│   │   └── apiConfig.ts # Public endpoint URLs
│   ├── pages/          # Public pages
│   ├── stores/         # Website state management
│   └── types/          # Re-exports shared types + website-specific types
│
└── shared/             # Shared Library
    ├── components/     # Reusable UI components
    ├── contexts/       # Base authentication context
    ├── hooks/          # Reusable React hooks
    ├── lib/            # Core utilities (Supabase, API client)
    ├── types/          # Shared TypeScript types
    └── utils/          # Utility functions
```

## Shared Library Components

### 1. Core Library (`shared/lib/`)

**Supabase Client** (`shared/lib/supabase.ts`)
- Single Supabase client instance shared across all apps
- Prevents multiple client instances and connection issues
- Configured with environment variables at runtime

**Base API Client** (`shared/lib/apiClient.ts`)
- Core HTTP methods: `get`, `post`, `put`, `delete`
- Built-in error handling and user-friendly error messages
- Automatic retry logic for transient failures
- Consistent error logging across all apps
- Type-safe response handling

**API Client Factory** (`shared/lib/createApiClient.ts`)
- Factory function for creating app-specific API clients
- Extends base client with custom methods
- Each app maintains its own `apiConfig.ts` for endpoint URLs

### 2. Shared Hooks (`shared/hooks/`)

**useSupabaseAuth** - Supabase authentication
- Manages user session state
- Handles auth state changes
- Provides signOut method
- Returns: `{ user, session, loading, signOut }`

**useDataFetch** - Generic data fetching
- Handles loading states and errors
- Automatic refetch capability
- Dependency tracking
- Returns: `{ data, loading, error, refetch }`

**usePolling** - Real-time updates
- Configurable polling intervals
- Enable/disable polling dynamically
- Automatic cleanup on unmount
- Use with useDataFetch for auto-refreshing data

**useDebounce** - Debounce input values
- Delays value updates until user stops typing
- Configurable delay duration
- Reduces unnecessary API calls

**usePagination** - Pagination state
- Manages page, limit, offset state
- Navigation helpers (next, prev, goToPage)
- Total count tracking

**useLocalStorage** - LocalStorage with React state
- Syncs localStorage with React state
- Type-safe storage operations
- Automatic JSON serialization

### 3. Shared Contexts (`shared/contexts/`)

**BaseAuthContext** - Base authentication pattern
- Provides common auth state structure
- Apps extend this for app-specific needs (e.g., role checking)
- Ensures consistent authentication patterns

### 4. Shared Components (`shared/components/`)

**ErrorBoundary** - Error catching wrapper
- Catches React rendering errors
- Displays fallback UI
- Logs errors to backend

**LoadingSpinner** - Loading state indicator
- Consistent loading animation
- Accessible with ARIA labels

**Toast** - Notification system
- Success, error, warning, info variants
- Auto-dismiss with configurable duration
- Accessible announcements

**SystemHealthBadge** - System status indicator
- Real-time health monitoring
- Color-coded status (healthy, degraded, unhealthy)
- Appears on all pages

**Skeletons** - Loading placeholders
- CardSkeleton, ListSkeleton, TableSkeleton
- Improve perceived performance
- Reduce layout shift

**UI Components** (`shared/components/ui/`)
- Button, Card, Input
- Consistent styling and behavior
- Accessible by default

### 5. Shared Types (`shared/types/`)

**database.types.ts** - Supabase generated types
- Generated from database schema
- Re-exported by each app
- Ensures type safety across stack

**api.ts** - API request/response types
- Common API interfaces
- Error response structures
- Pagination types

**forms.ts** - Form validation types
- Input validation schemas
- Form state management types

**validation.ts** - Validation schemas
- Zod schemas for data validation
- Reusable validators

### 6. Shared Utils (`shared/utils/`)

**formatters.ts** - Data formatting
- Date formatting (formatDate, formatRelativeTime)
- Number formatting (formatCurrency, formatNumber)
- Text formatting (truncate, capitalize)

**validators.ts** - Input validation
- Email, URL, phone validation
- Custom validation functions
- Error message generation

**errorHandling.ts** - Error utilities
- Error normalization
- User-friendly error messages
- Error logging helpers

**accessibility.ts** - A11y helpers
- Keyboard navigation utilities (handleKeyboardClick)
- ARIA attribute helpers
- Focus trap management

**debug.ts** - Debug utilities
- Conditional logging
- Performance measurement
- Development-only helpers

## App-Specific Code

### What Should Remain App-Specific

Each app maintains its own:

1. **API Configuration** (`lib/apiConfig.ts`)
   - Endpoint URLs specific to the app
   - Example: Admin has `/admin/*` endpoints, Client has `/client/*`

2. **Page Components** (`pages/`)
   - All page-level components
   - Routing logic
   - Page-specific business logic

3. **App-Specific Components** (`components/`)
   - Components used only by this app
   - Complex page sections
   - App-specific layouts

4. **Authentication Context Extensions**
   - Admin: Adds role checking and session management
   - Client: Adds client-specific auth logic
   - Website: Public + optional auth

5. **State Management** (`stores/`)
   - App-specific Zustand stores
   - Feature-specific state
   - UI state (modals, filters, etc.)

6. **App-Specific Types** (`types/`)
   - Re-exports shared types
   - Adds app-specific type extensions

## API Client Pattern

Each app extends the base API client with app-specific methods:

**Base Client** (`shared/lib/apiClient.ts`):
```typescript
export const apiClient = {
  get: async (endpoint: string, token?: string) => { /* ... */ },
  post: async (endpoint: string, data: any, token?: string) => { /* ... */ },
  delete: async (endpoint: string, token?: string) => { /* ... */ },
  logError: async (error: ErrorLogRequest) => { /* ... */ }
};
```

**Admin API** (`admin/lib/api.ts`):
```typescript
import { apiClient } from '../../shared/lib/apiClient';
import { API_ENDPOINTS } from './apiConfig';

export const api = {
  ...apiClient,
  // Admin-specific methods
  getSystemHealth: async () => apiClient.get(API_ENDPOINTS.SYSTEM_HEALTH),
  getErrors: async (params, token) => apiClient.get(`${API_ENDPOINTS.ERRORS}?${params}`, token),
};
```

**Website API** (`website/lib/api.ts`):
```typescript
import { createApiClient } from '../../shared/lib/createApiClient';
import { API_ENDPOINTS } from './apiConfig';

export const api = createApiClient({
  // Custom methods for website
  getProposals: async () => { /* custom logic */ },
  createProposal: async (data) => { /* custom logic */ },
  getMessages: async (topicId, params) => { /* custom logic */ },
  getPlan: async (topicId) => { /* custom logic */ },
});
```

## Authentication Pattern

**Base Hook** (`shared/hooks/useSupabaseAuth.ts`):
```typescript
export function useSupabaseAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  // Auth state management

  return { user, session, loading, signOut };
}
```

**Admin Context** (`admin/contexts/AdminAuthContext.tsx`):
```typescript
export function AdminAuthProvider({ children }) {
  const { user, session, loading: authLoading, signOut: baseSignOut } = useSupabaseAuth();
  const [isAdmin, setIsAdmin] = useState(false);

  const checkAdminRole = async () => {
    // Admin role verification
  };

  return (
    <AdminAuthContext.Provider value={{ user, session, isAdmin, signIn, signOut }}>
      {children}
    </AdminAuthContext.Provider>
  );
}
```

## Development Guidelines

### When to Add Code to Shared Library

Add code to `shared/` when:

1. **Used by 2+ apps** - If multiple apps need the same functionality
2. **Generic and reusable** - Not app-specific business logic
3. **Stable interface** - API unlikely to change frequently
4. **Well-tested** - Code is production-ready
5. **Properly typed** - Full TypeScript support

Examples:
- ✅ Supabase client (all apps use it)
- ✅ Data fetching hook (common pattern)
- ✅ Date formatter (generic utility)
- ❌ Admin dashboard component (admin-only)
- ❌ Proposal voting logic (website-only)

### When to Keep Code App-Specific

Keep code app-specific when:

1. **Single app uses it** - No other app needs this functionality
2. **Highly customized** - Specific to one app's requirements
3. **Frequently changing** - Experimental or unstable
4. **Business logic** - App-specific workflows
5. **Page components** - UI specific to one app

### Adding New Shared Code

To add new shared functionality:

1. **Create the file** in appropriate `shared/` directory
2. **Add to barrel export** in `shared/*/index.ts`
3. **Document the API** with JSDoc comments
4. **Update this guide** with usage examples
5. **Test across all apps** to ensure compatibility

Example:

```typescript
// shared/hooks/useWindowSize.ts
import { useState, useEffect } from 'react';

/**
 * Hook that tracks window dimensions
 * @returns {Object} Window width and height
 */
export function useWindowSize() {
  const [size, setSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const handleResize = () => {
      setSize({ width: window.innerWidth, height: window.innerHeight });
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return size;
}

// shared/hooks/index.ts
export { useWindowSize } from './useWindowSize';
```

### Migrating Code to Shared Library

When moving code from app-specific to shared:

1. **Identify duplicates** - Find code repeated across apps
2. **Generalize the interface** - Remove app-specific assumptions
3. **Move to shared/** - Place in appropriate directory
4. **Update imports** - Change all apps to import from shared
5. **Test thoroughly** - Ensure all apps still work correctly
6. **Remove old files** - Delete app-specific duplicates

## Import Patterns

### Recommended Import Paths

```typescript
// Shared library imports
import { supabase } from '../../shared/lib/supabase';
import { useDataFetch, usePolling } from '../../shared/hooks';
import { formatDate, validateEmail } from '../../shared/utils';
import { ErrorBoundary, LoadingSpinner } from '../../shared/components';

// App-specific imports
import { api } from '../lib/api';
import { useAdminAuth } from '../contexts/AdminAuthContext';
import { ErrorDetailsModal } from '../components/ErrorDetailsModal';
```

### Path Aliases (Optional)

For cleaner imports, configure path aliases in `tsconfig.json`:

```json
{
  "compilerOptions": {
    "paths": {
      "@shared/*": ["../shared/*"],
      "@admin/*": ["./admin/*"],
      "@client/*": ["./client/*"],
      "@website/*": ["./website/*"]
    }
  }
}
```

Then import as:
```typescript
import { supabase } from '@shared/lib/supabase';
import { useAdminAuth } from '@admin/contexts/AdminAuthContext';
```

## File Organization Best Practices

### 1. Keep Files Focused

Each file should have a single, clear purpose:

```typescript
// ✅ Good - Single responsibility
// shared/hooks/useDataFetch.ts
export function useDataFetch<T>(...) { /* data fetching logic */ }

// ❌ Bad - Multiple unrelated hooks
// shared/hooks/utils.ts
export function useDataFetch<T>(...) { }
export function usePolling(...) { }
export function useDebounce(...) { }
```

### 2. Use Barrel Exports

Create `index.ts` files for clean exports:

```typescript
// shared/hooks/index.ts
export { useDataFetch } from './useDataFetch';
export { usePolling } from './usePolling';
export { useDebounce } from './useDebounce';
export { useSupabaseAuth } from './useSupabaseAuth';
```

### 3. Co-locate Related Code

Keep related files close together:

```
shared/components/skeletons/
├── index.tsx          # Barrel export
├── CardSkeleton.tsx   # Card loading skeleton
├── ListSkeleton.tsx   # List loading skeleton
└── TableSkeleton.tsx  # Table loading skeleton
```

### 4. Consistent Naming

- **Components**: PascalCase (e.g., `ErrorBoundary.tsx`)
- **Hooks**: camelCase with "use" prefix (e.g., `useDataFetch.ts`)
- **Utils**: camelCase (e.g., `formatters.ts`)
- **Types**: PascalCase for interfaces/types (e.g., `ApiResponse`)
- **Files**: Match the primary export name

## Testing Strategy

### Unit Testing Shared Code

Shared code should have comprehensive tests since it's used by multiple apps:

```typescript
// shared/utils/__tests__/formatters.test.ts
import { formatDate, formatRelativeTime } from '../formatters';

describe('formatDate', () => {
  it('formats dates correctly', () => {
    const date = new Date('2024-12-18T10:00:00Z');
    expect(formatDate(date)).toBe('Dec 18, 2024');
  });
});
```

### Integration Testing

Test that apps correctly use shared code:

```typescript
// admin/__tests__/AdminAuthContext.test.tsx
import { renderHook } from '@testing-library/react-hooks';
import { useAdminAuth } from '../contexts/AdminAuthContext';

test('admin auth extends base auth', async () => {
  const { result } = renderHook(() => useAdminAuth());
  expect(result.current).toHaveProperty('user');
  expect(result.current).toHaveProperty('isAdmin');
});
```

## Performance Considerations

### 1. Code Splitting

Each app bundles independently, so shared code doesn't increase bundle size unnecessarily:

- Admin app only bundles admin pages + shared code it uses
- Client app only bundles client pages + shared code it uses
- Website app only bundles website pages + shared code it uses

### 2. Tree Shaking

Use ES modules and named exports for better tree shaking:

```typescript
// ✅ Good - Tree-shakeable
export function formatDate(date: Date) { }
export function formatNumber(num: number) { }

// ❌ Bad - Entire object bundled
export default {
  formatDate: (date: Date) => { },
  formatNumber: (num: number) => { }
};
```

### 3. Lazy Loading

Lazy load heavy components:

```typescript
// App.tsx
const ErrorMonitor = lazy(() => import('./pages/ErrorMonitor'));

function App() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <ErrorMonitor />
    </Suspense>
  );
}
```

## Migration Checklist

When consolidating code or refactoring:

- [ ] Identify duplicate code across apps
- [ ] Create shared version with generic interface
- [ ] Add to appropriate `shared/` directory
- [ ] Update barrel exports (`index.ts`)
- [ ] Update imports in all apps
- [ ] Test each app individually
- [ ] Run TypeScript compilation (`npm run typecheck`)
- [ ] Run build process (`npm run build`)
- [ ] Delete old duplicate files
- [ ] Update documentation

## Common Patterns

### Pattern 1: Data Fetching with Auto-Refresh

```typescript
import { useDataFetch } from '../../shared/hooks/useDataFetch';
import { usePolling } from '../../shared/hooks/usePolling';
import { api } from '../lib/api';

function Dashboard() {
  const { data, loading, error, refetch } = useDataFetch(
    async () => api.getSystemHealth(),
    []
  );

  usePolling(refetch, 30000); // Refresh every 30s

  if (loading) return <LoadingSpinner />;
  if (error) return <div>Error: {error}</div>;

  return <div>{/* Render data */}</div>;
}
```

### Pattern 2: Protected Routes with Auth

```typescript
import { useAdminAuth } from '../contexts/AdminAuthContext';
import { Navigate } from 'react-router-dom';

function ProtectedRoute({ children }) {
  const { user, isAdmin, isLoading } = useAdminAuth();

  if (isLoading) return <LoadingSpinner />;
  if (!user || !isAdmin) return <Navigate to="/admin/login" />;

  return children;
}
```

### Pattern 3: Error Handling with Logging

```typescript
import { apiClient } from '../../shared/lib/apiClient';

async function handleAction() {
  try {
    await api.performAction();
  } catch (error) {
    // Automatically logged by apiClient
    // Just show user-friendly message
    setError('Action failed. Please try again.');
  }
}
```

## Troubleshooting

### Issue: Import Errors

**Problem**: Cannot find module '../../shared/lib/supabase'

**Solution**: Check that:
1. File exists at specified path
2. Path is correct relative to importing file
3. TypeScript configuration includes shared directory
4. Barrel export includes the module

### Issue: Type Errors

**Problem**: Type 'Database' does not have property 'proposals'

**Solution**:
1. Generate types from Supabase schema
2. Copy types to `shared/types/database.types.ts`
3. Restart TypeScript server
4. For temporary fix, use local interface

### Issue: Multiple Supabase Instances

**Problem**: Multiple Supabase clients causing connection issues

**Solution**: Always import from `shared/lib/supabase.ts`, never create new instances:
```typescript
// ✅ Correct
import { supabase } from '../../shared/lib/supabase';

// ❌ Wrong
import { createClient } from '@supabase/supabase-js';
const supabase = createClient(url, key);
```

## Future Improvements

### Short Term

1. **Path Aliases**: Configure TypeScript path aliases for cleaner imports
2. **Component Library**: Build out more shared UI components (Modal, Dropdown, etc.)
3. **Form Utilities**: Add form validation and state management hooks
4. **Testing Setup**: Add Jest/Vitest for shared code tests

### Long Term

1. **Shared Storybook**: Visual component library for shared components
2. **E2E Tests**: Playwright tests covering all apps
3. **Performance Monitoring**: Shared analytics and error tracking
4. **Design System**: Comprehensive design tokens and theming

## State Management

### Zustand Store Architecture

We use Zustand for state management across all three applications. Each app has its own store with persistence.

#### Admin Store (`admin/stores/adminStore.ts`)

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

#### Client Store (`client/stores/clientStore.ts`)

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

#### Website Store (`website/stores/websiteStore.ts`)

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

Located in `shared/utils/errorHandling.ts`

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

Located in `shared/utils/debug.ts`

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

## Resources

- [React Hooks Documentation](https://react.dev/reference/react)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)
- [Supabase Documentation](https://supabase.com/docs)
- [Vite Configuration](https://vitejs.dev/config/)
- [Zustand Documentation](https://docs.pmnd.rs/zustand/getting-started/introduction)

## Questions?

For questions about the frontend architecture, please:

1. Check this documentation first
2. Review the code in `shared/` directory
3. Ask in team chat or open a GitHub issue
4. Update this documentation with your learnings

---

**Last Updated**: 2024-12-19
**Maintained By**: Development Team
