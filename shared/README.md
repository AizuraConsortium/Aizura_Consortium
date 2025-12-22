# Shared Code Architecture

This folder contains code that is shared across multiple applications in the Aizura Consortium monorepo. The shared folder promotes code reuse, consistency, and maintainability across the admin, client, and website applications.

## Purpose

The shared folder serves as a central repository for:
- **Components**: UI components used across multiple apps
- **Hooks**: Custom React hooks with reusable logic
- **Types**: TypeScript type definitions and interfaces
- **Utils**: Utility functions and helpers
- **Styles**: Theme configuration and shared CSS
- **Lib**: Shared libraries and API clients

## When to Add Code to Shared

### ✅ Add to Shared When:

1. **Multi-App Usage**: The code is used by 2 or more applications
2. **Universal Utility**: The code is universally useful (e.g., `useDebounce`, `formatDate`)
3. **Core Architecture**: The code is part of the core architecture (e.g., error boundaries, auth contexts)
4. **Design System**: The code is part of the UI design system (e.g., Button, Card)

### ❌ Keep in App Folder When:

1. **Single App Usage**: Only one app uses the code
2. **App-Specific Logic**: The code contains business logic specific to one app
3. **Experimental**: The code is experimental and not yet proven for reuse
4. **Highly Customized**: The code requires extensive customization per app

## Rules for Shared Code

All code in the shared folder MUST follow these rules:

### 1. No App-Specific Imports

```typescript
// ❌ BAD - Imports from specific app
import { AdminService } from '@admin/services';

// ✅ GOOD - No app-specific imports
import { apiClient } from '@shared/lib';
```

### 2. No Hardcoded App-Specific Values

```typescript
// ❌ BAD - Hardcoded for specific app
const DevBanner = () => <div>Admin Portal</div>;

// ✅ GOOD - Accept app name as prop
const DevBanner = ({ appName }: { appName: string }) => (
  <div>{appName}</div>
);
```

### 3. Props for Customization

```typescript
// ❌ BAD - No customization options
const Button = ({ children }) => (
  <button className="bg-blue-500">{children}</button>
);

// ✅ GOOD - Props for variants and customization
interface ButtonProps {
  variant?: 'primary' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}
```

### 4. TypeScript Types Required

```typescript
// ❌ BAD - No types
export function useDebounce(value, delay) { }

// ✅ GOOD - Full TypeScript types
export function useDebounce<T>(value: T, delay: number): T { }
```

### 5. Must Be Truly Reusable

```typescript
// ❌ BAD - Too specific to one use case
const ProposalFormButton = () => <button>Submit Proposal</button>;

// ✅ GOOD - Generic and reusable
const Button = ({ children, onClick, ...props }: ButtonProps) => (
  <button onClick={onClick} {...props}>{children}</button>
);
```

## Examples

### Good Shared Code

```typescript
// shared/components/ui/Button.tsx
export interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  children: React.ReactNode;
  onClick?: () => void;
}

export function Button({ variant = 'primary', size = 'md', ...props }: ButtonProps) {
  // Generic implementation
}
```

**Why it's good:**
- Generic and reusable
- Props for customization
- No app-specific logic
- TypeScript types included

### Bad Shared Code

```typescript
// shared/components/AdminDashboardHeader.tsx
export function AdminDashboardHeader() {
  return (
    <header>
      <h1>Admin Dashboard</h1>
      <AdminMenu />
    </header>
  );
}
```

**Why it's bad:**
- Specific to admin app only
- No customization options
- Should be in admin/components/

## Import Path Standards

All imports from shared MUST use the `@shared` alias:

```typescript
// ✅ GOOD - Using @shared alias
import { Button, Card } from '@shared/components';
import { useDebounce } from '@shared/hooks';
import { formatDate } from '@shared/utils';

// ❌ BAD - Relative imports
import { Button } from '../../shared/components/ui/Button';
import { useDebounce } from '../../../shared/hooks/useDebounce';
```

## Testing Shared Components

All shared components and hooks SHOULD have tests:

```typescript
// shared/components/__tests__/Button.test.tsx
describe('Button', () => {
  it('renders all variants correctly', () => {
    // Test implementation
  });

  it('handles click events', () => {
    // Test implementation
  });

  it('shows loading state', () => {
    // Test implementation
  });
});
```

**Benefits:**
- Prevents regressions
- Documents expected behavior
- Validates reusability
- Catches app-specific dependencies

## Folder Structure

```
shared/
├── components/        # Shared React components
│   ├── ui/           # UI design system components
│   ├── governance/   # Domain-specific components
│   └── skeletons/    # Loading state components
├── hooks/            # Custom React hooks
├── lib/              # Libraries and clients
├── types/            # TypeScript type definitions
├── utils/            # Utility functions
└── styles/           # Theme and styling
```

## Contribution Guidelines

### Before Adding to Shared:

1. **Ask**: Is this used by 2+ apps?
2. **Check**: Does it have any app-specific dependencies?
3. **Review**: Are all props and types properly documented?
4. **Test**: Does it have tests?
5. **Document**: Is it documented in the appropriate README?

### When Adding New Code:

1. Place in appropriate subfolder
2. Export from barrel file (index.ts)
3. Add TypeScript types
4. Add JSDoc documentation
5. Create tests
6. Update README catalog
7. Test in at least 2 apps

### When Moving Code to Shared:

1. Remove all app-specific imports
2. Replace hardcoded values with props
3. Add TypeScript types
4. Update imports in all apps
5. Test thoroughly in all apps
6. Update documentation

## Decision Flowchart

```
Is the code used by 2+ apps?
├─ Yes → Does it have app-specific imports or logic?
│        ├─ Yes → Refactor to remove app-specific code, then add to shared
│        └─ No → Add to shared ✅
└─ No → Is it universally useful (like useDebounce)?
         ├─ Yes → Add to shared ✅
         └─ No → Keep in app folder ❌
```

## Common Pitfalls

### 1. Premature Sharing
Don't add code to shared until it's actually needed by a second app.

### 2. Insufficient Abstraction
Shared code must be generic enough to work for all use cases.

### 3. Missing Documentation
Shared code without documentation creates confusion.

### 4. Breaking Changes
Changes to shared code affect multiple apps. Test thoroughly!

## See Also

- [Components README](./components/README.md) - Detailed component catalog
- [Hooks README](./hooks/README.md) - Detailed hook catalog
- [Types README](./types/README.md) - Type system documentation
- [DEVELOPER_GUIDE.md](../DEVELOPER_GUIDE.md) - Overall development guide
