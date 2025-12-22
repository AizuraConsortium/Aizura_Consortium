# Shared Library Architecture

This document describes the architecture, design decisions, and best practices for the shared code library in the Aizura Consortium monorepo.

## Table of Contents

- [Overview](#overview)
- [Architecture Principles](#architecture-principles)
- [Directory Structure](#directory-structure)
- [Security Model](#security-model)
- [Type System](#type-system)
- [State Management](#state-management)
- [API Integration](#api-integration)
- [Testing Strategy](#testing-strategy)
- [Performance Considerations](#performance-considerations)
- [Migration Strategy](#migration-strategy)

## Overview

The shared library provides reusable components, hooks, utilities, and types used across multiple applications in the Aizura Consortium:

- **Admin Portal** - Administrative dashboard for system management
- **Client Portal** - User-facing governance interface
- **Public Website** - Public-facing information and real-time data
- **Backend Services** - Server-side business logic (separate from frontend shared code)

### Goals

1. **Code Reuse**: Eliminate duplication across applications
2. **Consistency**: Ensure uniform UX patterns and behavior
3. **Maintainability**: Single source of truth for shared logic
4. **Type Safety**: Full TypeScript coverage with strict typing
5. **Accessibility**: WCAG 2.1 AA compliance across all components
6. **Performance**: Optimized for production use

### Non-Goals

1. **Not a UI Framework**: We don't reinvent React or component libraries
2. **Not App-Specific**: No business logic specific to one application
3. **Not a Catch-All**: Only truly reusable code belongs here

## Architecture Principles

### 1. Separation of Concerns

Each layer has a clear responsibility:

```
┌─────────────────────────────────────┐
│         Applications                │
│  (admin, client, website)           │
├─────────────────────────────────────┤
│      Shared Components Layer        │
│  (UI, Layout, Forms)                │
├─────────────────────────────────────┤
│       Shared Hooks Layer            │
│  (State, Effects, Data Fetching)    │
├─────────────────────────────────────┤
│      Shared Utils Layer             │
│  (Validation, Formatting, Helpers)  │
├─────────────────────────────────────┤
│        Shared Types Layer           │
│  (Interfaces, Types, Schemas)       │
└─────────────────────────────────────┘
```

### 2. Dependency Flow

Dependencies must flow in one direction:

```
Applications → Shared Library
    ✓ Apps can import from shared
    ✗ Shared cannot import from apps

Components → Hooks → Utils → Types
    ✓ Higher layers can use lower layers
    ✗ Lower layers cannot use higher layers
```

### 3. Composition Over Inheritance

Components are composed, not extended:

```typescript
// ✓ GOOD - Composition
<BaseNavigation links={links} userSection={<AdminUserMenu />} />

// ✗ BAD - Inheritance
class AdminNavigation extends BaseNavigation { }
```

### 4. Configuration Over Code

Behavior is configured through props, not code modification:

```typescript
// ✓ GOOD - Configurable
<ProposalForm
  onSubmit={handleSubmit}
  showDraftSave={true}
  validationRules={customRules}
/>

// ✗ BAD - Requires modification
<ProposalForm />  // Hardcoded behavior
```

## Directory Structure

```
shared/
├── components/          # React components
│   ├── ui/             # Design system (Button, Input, Card)
│   ├── auth/           # Authentication (LoginForm, LoginContainer)
│   ├── layout/         # Layout & navigation
│   ├── governance/     # Domain components (ProposalCard, VoteDisplay)
│   ├── proposals/      # Proposal-specific components
│   ├── skeletons/      # Loading states
│   └── index.ts        # Barrel exports
│
├── hooks/              # Custom React hooks
│   ├── useDebounce.ts
│   ├── useLocalStorage.ts
│   ├── useDataFetch.ts
│   ├── usePolling.ts
│   ├── useSupabaseAuth.ts
│   └── index.ts
│
├── lib/                # Libraries and clients
│   ├── apiClient.ts    # API client wrapper
│   ├── apiLogger.ts    # API logging utility
│   ├── supabase.ts     # Supabase client
│   └── index.ts
│
├── store/              # State management utilities
│   ├── createFilteredStore.ts
│   ├── createPaginatedStore.ts
│   ├── middleware/
│   │   └── syncToUrl.ts
│   └── index.ts
│
├── types/              # TypeScript types
│   ├── api.ts          # API request/response types
│   ├── auth.ts         # Authentication types
│   ├── components.ts   # Component prop types
│   ├── database.types.ts  # Supabase generated types
│   ├── forms.ts        # Form types
│   ├── navigation.ts   # Navigation types
│   ├── query.ts        # Query/filter types
│   ├── validation.ts   # Validation types
│   └── index.ts
│
├── utils/              # Utility functions
│   ├── accessibility.ts
│   ├── debug.ts
│   ├── errorHandling.ts
│   ├── formatters.ts
│   ├── typeGuards.ts
│   ├── validators.ts
│   ├── errors/         # Error classes
│   │   ├── error-classes.ts
│   │   ├── error-handler.ts
│   │   └── index.ts
│   └── validation/     # Validation system
│       ├── base-validators.ts
│       ├── field-validators.ts
│       ├── business-validators.ts
│       ├── validation-helpers.ts
│       └── index.ts
│
├── validation/         # Top-level validation
│   ├── authValidation.ts
│   ├── proposalValidation.ts
│   └── index.ts
│
├── styles/             # Styling
│   ├── base.css        # Base styles
│   ├── theme.ts        # Theme configuration
│   ├── tailwind.preset.js
│   └── index.ts
│
└── index.ts            # Main barrel export
```

### File Naming Conventions

- **Components**: PascalCase (e.g., `Button.tsx`, `ProposalCard.tsx`)
- **Hooks**: camelCase with `use` prefix (e.g., `useDebounce.ts`)
- **Utils**: camelCase (e.g., `formatDate.ts`, `validators.ts`)
- **Types**: camelCase with `.types` suffix if generated (e.g., `database.types.ts`)
- **Tests**: Same as source with `.test.ts` suffix (e.g., `Button.test.tsx`)

## Security Model

### Frontend vs Backend Separation

**Critical Principle:** Frontend shared code is separate from backend repositories and services.

```
Frontend Shared Code (shared/)
├─ Safe for client-side use
├─ No secrets or credentials
├─ Uses Supabase client (anon key only)
└─ Row Level Security enforced by Supabase

Backend Code (backend/)
├─ Server-side only
├─ Uses Supabase service role key
├─ Can bypass RLS when necessary
└─ Contains business logic and validators
```

### Why Backend Repositories Are Separate

**Security Reasons:**

1. **Credential Exposure**: Backend code uses service role keys that would be exposed if bundled with frontend
2. **RLS Bypass**: Backend can bypass Row Level Security for admin operations
3. **Business Logic**: Complex validation and business rules shouldn't run client-side
4. **Attack Surface**: Frontend code is visible to users; backend code is not

**Example:**

```typescript
// ✓ GOOD - Frontend shared code
// shared/lib/supabase.ts
export const supabase = createClient(
  process.env.VITE_SUPABASE_URL!,
  process.env.VITE_SUPABASE_ANON_KEY!  // Safe public key
);

// ✓ GOOD - Backend code (separate)
// backend/shared/services/supabase/client.ts
export const supabaseAdmin = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!  // Secret key
);

// ✗ BAD - Never mix these!
// shared/lib/supabase.ts (WRONG!)
export const supabaseAdmin = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!  // Exposed to client!
);
```

### Supabase Row Level Security (RLS)

All data access is protected by RLS policies:

```sql
-- Users can only see their own data
CREATE POLICY "Users can view own data"
  ON users FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

-- Users can only vote once
CREATE POLICY "Users can insert own votes"
  ON votes FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = user_id
    AND NOT EXISTS (
      SELECT 1 FROM votes
      WHERE user_id = auth.uid()
      AND proposal_id = NEW.proposal_id
    )
  );
```

**Key Points:**

- RLS policies are defined in migrations (`supabase/migrations/`)
- Frontend code relies entirely on RLS for security
- Backend code can bypass RLS for admin operations using service role key
- Always test RLS policies thoroughly

### Authentication Security

**DO:**
- Use Supabase authentication (email/password, OAuth)
- Store session tokens in httpOnly cookies (Supabase handles this)
- Implement session timeout
- Use `useSupabaseAuth` hook for auth state
- Validate permissions on backend

**DON'T:**
- Store passwords in localStorage or state
- Roll your own authentication
- Store service role keys in frontend code
- Trust client-side permission checks alone

## Type System

### Type Hierarchy

```
Database Types (database.types.ts)
    ↓
API Types (api.ts)
    ↓
Component Types (components.ts)
    ↓
Form Types (forms.ts)
```

### Database Types

Generated from Supabase schema:

```bash
npm run generate:types
# Generates shared/types/database.types.ts
```

**Never modify these manually!** They are regenerated from the database schema.

### API Types

Define request/response shapes:

```typescript
// shared/types/api.ts
export interface ApiResponse<T> {
  data: T;
  error: string | null;
  status: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
}
```

### Type Guards

Use type guards for runtime type checking:

```typescript
// shared/utils/typeGuards.ts
export function isProposal(value: unknown): value is Proposal {
  return (
    typeof value === 'object' &&
    value !== null &&
    'id' in value &&
    'title' in value &&
    'summary' in value
  );
}
```

## State Management

### Zustand Stores

Apps use Zustand for state management with shared factory functions:

```typescript
import { create } from 'zustand';
import { createFilteredStore, createPaginatedStore } from '@shared/store';

const useProposalStore = create((set, get, store) => ({
  ...createFilteredStore({ defaultFilters: {} })(set, get, store),
  ...createPaginatedStore({ pageSize: 20 })(set, get, store),

  proposals: [],
  // ... app-specific state
}));
```

### Store Patterns

1. **Filtered Store**: For searchable/filterable data
2. **Paginated Store**: For paginated lists
3. **URL Sync**: Optional middleware to sync state to URL

See [Store Patterns Documentation](./store/README.md) for details.

## API Integration

### API Client

Centralized API client with consistent error handling:

```typescript
// shared/lib/apiClient.ts
export const apiClient = {
  get: async <T>(url: string): Promise<ApiResponse<T>> => {
    try {
      const response = await fetch(url);
      const data = await response.json();
      return { data, error: null, status: response.status };
    } catch (error) {
      return { data: null as T, error: error.message, status: 500 };
    }
  },
  // ... post, put, delete methods
};
```

### API Logging

Optional API logging for debugging:

```typescript
import { apiLogger } from '@shared/lib';

// Log API calls
apiLogger.logRequest('GET', '/api/proposals');
apiLogger.logResponse('GET', '/api/proposals', 200, data);

// Get statistics
const stats = apiLogger.getStats();
// { totalRequests: 42, errorRate: 0.05, avgResponseTime: 150 }
```

## Testing Strategy

### Unit Tests

Test individual components and functions:

```typescript
// shared/hooks/__tests__/useDebounce.test.ts
import { renderHook, act } from '@testing-library/react-hooks';
import { useDebounce } from '../useDebounce';

describe('useDebounce', () => {
  it('debounces value changes', async () => {
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

### Integration Tests

Test shared code in app contexts:

```typescript
// apps/client/__tests__/integration/proposals.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { ProposalForm } from '@shared/components/proposals';
import { api } from '@client/lib/api';

jest.mock('@client/lib/api');

describe('ProposalForm Integration', () => {
  it('creates proposal and redirects', async () => {
    const mockCreate = jest.fn().mockResolvedValue({ success: true });
    api.createProposal = mockCreate;

    render(<ProposalForm onSubmit={api.createProposal} />);

    fireEvent.change(screen.getByLabelText('Title'), {
      target: { value: 'Test Proposal' }
    });

    fireEvent.click(screen.getByRole('button', { name: /submit/i }));

    await waitFor(() => {
      expect(mockCreate).toHaveBeenCalled();
    });
  });
});
```

### Test Coverage Requirements

- **Components**: 80% coverage minimum
- **Hooks**: 90% coverage minimum
- **Utils**: 95% coverage minimum
- **Critical paths**: 100% coverage

## Performance Considerations

### Code Splitting

Apps use dynamic imports for routes:

```typescript
// app/main.tsx
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Proposals = lazy(() => import('./pages/Proposals'));
```

### Bundle Size

Monitor shared library impact:

```bash
npm run analyze
# Shows bundle size breakdown
```

**Guidelines:**
- Shared library should be <200KB gzipped
- Use tree-shaking friendly exports
- Avoid large dependencies in shared code

### Rendering Optimization

Use React optimization techniques:

```typescript
// Memoize expensive computations
const memoizedValue = useMemo(() => computeExpensive(data), [data]);

// Memoize callbacks
const memoizedCallback = useCallback(() => {
  doSomething(a, b);
}, [a, b]);

// Memoize components
const MemoizedComponent = memo(MyComponent);
```

## Migration Strategy

### Adding New Shared Code

1. **Identify Duplication**: Find code used in 2+ apps
2. **Generalize**: Remove app-specific logic
3. **Add to Shared**: Create in appropriate shared directory
4. **Add Tests**: Ensure test coverage
5. **Update Apps**: Replace duplicated code with shared import
6. **Document**: Add to relevant README

### Refactoring Existing Code

1. **Create in Shared**: Build generalized version
2. **Test in Isolation**: Ensure it works standalone
3. **Update One App**: Replace in first app
4. **Test Integration**: Verify app works correctly
5. **Update Other Apps**: Rollout to remaining apps
6. **Remove Old Code**: Delete duplicated code

### Breaking Changes

When making breaking changes:

1. **Document**: Clearly document the breaking change
2. **Migration Guide**: Provide before/after examples
3. **Deprecation**: If possible, deprecate old API first
4. **Update All Apps**: Must update all apps in same PR
5. **Test Thoroughly**: Ensure no regressions

## Best Practices

### DRY (Don't Repeat Yourself)

If you find yourself copying code between apps, consider moving it to shared.

### YAGNI (You Aren't Gonna Need It)

Don't add code to shared "just in case". Wait until it's actually needed by 2+ apps.

### KISS (Keep It Simple, Stupid)

Shared code should be simple and easy to understand. Complex abstractions create maintenance burden.

### Single Responsibility

Each component, hook, or utility should do one thing well.

### Dependency Injection

Pass dependencies through props rather than importing directly:

```typescript
// ✓ GOOD
interface Props {
  apiClient: ApiClient;
}

// ✗ BAD
import { apiClient } from '@shared/lib';
```

## See Also

- [Shared Code Review Guidelines](../docs/SHARED_CODE_REVIEW.md)
- [Testing Guide](../docs/TESTING_GUIDE.md)
- [Database Guide](../docs/DATABASE_GUIDE.md)
- [Repository Guide](../docs/REPOSITORY_GUIDE.md)
