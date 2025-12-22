# Shared Components Catalog

This directory contains React components shared across the admin, client, and website applications. All components follow consistent design patterns, accept customization props, and are fully typed with TypeScript.

## Table of Contents

- [UI Components](#ui-components)
- [Utility Components](#utility-components)
- [Governance Components](#governance-components)
- [Skeleton Components](#skeleton-components)
- [Usage Guidelines](#usage-guidelines)

## UI Components

### Button

**Location:** `shared/components/ui/Button.tsx`

A versatile button component with multiple variants, sizes, and states.

**Props:**
- `variant?: 'primary' | 'secondary' | 'danger' | 'ghost'` - Visual style variant
- `size?: 'sm' | 'md' | 'lg'` - Button size
- `loading?: boolean` - Shows loading spinner
- `disabled?: boolean` - Disables button interaction
- `className?: string` - Additional CSS classes
- `children: React.ReactNode` - Button content
- `onClick?: () => void` - Click handler

**Usage:**
```typescript
import { Button } from '@shared/components';

<Button variant="primary" size="md" onClick={handleSubmit}>
  Submit
</Button>

<Button variant="danger" loading={isDeleting}>
  Delete
</Button>
```

**Variants:**
- `primary`: Blue background, white text (default action)
- `secondary`: Gray background, dark text (secondary action)
- `danger`: Red background, white text (destructive action)
- `ghost`: Transparent background, colored text (subtle action)

---

### Card

**Location:** `shared/components/ui/Card.tsx`

Container components for grouping related content with consistent styling.

**Components:**
- `Card` - Main container
- `CardHeader` - Optional header section
- `CardTitle` - Title within header

**Props (Card):**
- `padding?: 'none' | 'sm' | 'md' | 'lg'` - Internal padding
- `className?: string` - Additional CSS classes
- `children: React.ReactNode` - Card content

**Usage:**
```typescript
import { Card, CardHeader, CardTitle } from '@shared/components';

<Card padding="md">
  <CardHeader>
    <CardTitle>User Profile</CardTitle>
  </CardHeader>
  <div>Content goes here</div>
</Card>
```

---

### Input

**Location:** `shared/components/ui/Input.tsx`

Standard text input field with label and error support.

**Props:**
- `label: string` - Input label
- `error?: string` - Error message to display
- `className?: string` - Additional CSS classes
- All standard HTML input props

**Usage:**
```typescript
import { Input } from '@shared/components';

<Input
  label="Email"
  type="email"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
  error={emailError}
/>
```

---

### PasswordInput

**Location:** `shared/components/ui/PasswordInput.tsx`

Password input field with show/hide toggle functionality.

**Props:**
- `label: string` - Input label
- `error?: string` - Error message to display
- `className?: string` - Additional CSS classes
- All standard HTML input props

**Usage:**
```typescript
import { PasswordInput } from '@shared/components';

<PasswordInput
  label="Password"
  value={password}
  onChange={(e) => setPassword(e.target.value)}
  error={passwordError}
/>
```

**Features:**
- Eye icon toggle to show/hide password
- Accessible with proper ARIA labels
- Consistent styling with Input component

---

### FormField

**Location:** `shared/components/ui/FormField.tsx`

Generic form field wrapper with label, error handling, and help text.

**Props:**
- `label: string` - Field label
- `error?: string` - Error message
- `helpText?: string` - Help text below field
- `required?: boolean` - Shows required indicator
- `children: React.ReactNode` - Form input element

**Usage:**
```typescript
import { FormField } from '@shared/components';

<FormField label="Username" error={usernameError} required>
  <input value={username} onChange={handleChange} />
</FormField>
```

---

## Utility Components

### ErrorBoundary

**Location:** `shared/components/ErrorBoundary.tsx`

React error boundary that catches JavaScript errors in child components.

**Props:**
- `children: React.ReactNode` - Components to wrap
- `fallback?: React.ReactNode` - Custom error UI (optional)

**Usage:**
```typescript
import { ErrorBoundary } from '@shared/components';

<ErrorBoundary>
  <MyComponent />
</ErrorBoundary>
```

**Features:**
- Catches errors in child component tree
- Logs errors for debugging
- Shows user-friendly error message
- Prevents entire app crash

---

### ErrorAlert

**Location:** `shared/components/ErrorAlert.tsx`

Displays error messages in a styled alert box.

**Props:**
- `message: string` - Error message to display
- `onClose?: () => void` - Optional close handler
- `className?: string` - Additional CSS classes

**Usage:**
```typescript
import { ErrorAlert } from '@shared/components';

{error && <ErrorAlert message={error} onClose={() => setError('')} />}
```

**Features:**
- Red alert styling
- Optional dismiss button
- Alert icon included
- Accessible with proper ARIA roles

---

### LoadingSpinner

**Location:** `shared/components/LoadingSpinner.tsx`

Animated loading spinner for async operations.

**Props:**
- `size?: 'sm' | 'md' | 'lg'` - Spinner size
- `className?: string` - Additional CSS classes

**Usage:**
```typescript
import { LoadingSpinner } from '@shared/components';

{loading && <LoadingSpinner size="md" />}
```

**Features:**
- Smooth CSS animation
- Multiple sizes
- Centered by default
- Accessible with ARIA label

---

### ProtectedRoute

**Location:** `shared/components/ProtectedRoute.tsx`

Route wrapper that requires authentication and optional admin privileges.

**Props:**
- `children: React.ReactNode` - Protected content
- `requireAdmin?: boolean` - Requires admin role
- `redirectTo?: string` - Redirect path if unauthorized

**Usage:**
```typescript
import { ProtectedRoute } from '@shared/components';

<ProtectedRoute requireAdmin>
  <AdminDashboard />
</ProtectedRoute>
```

**Features:**
- Checks authentication status
- Shows loading state during auth check
- Redirects unauthorized users
- Supports admin-only routes

---

### SkipNavigation

**Location:** `shared/components/SkipNavigation.tsx`

Accessibility component for keyboard navigation skip links.

**Props:**
- `links: Array<{ href: string; label: string }>` - Skip links

**Usage:**
```typescript
import { SkipNavigation } from '@shared/components';

<SkipNavigation
  links={[
    { href: '#main-content', label: 'Skip to main content' },
    { href: '#navigation', label: 'Skip to navigation' }
  ]}
/>
```

**Features:**
- Hidden until focused
- Keyboard accessible
- WCAG 2.1 compliant
- Improves navigation efficiency

---

### SystemHealthBadge

**Location:** `shared/components/SystemHealthBadge.tsx`

Displays system health status indicator.

**Props:**
- `className?: string` - Additional CSS classes

**Usage:**
```typescript
import { SystemHealthBadge } from '@shared/components';

<SystemHealthBadge />
```

**Features:**
- Fetches health status from API
- Color-coded status (healthy/warning/critical)
- Auto-updates on interval
- Shows error state if fetch fails

---

### Toast / ToastProvider

**Location:** `shared/components/Toast.tsx` & `ToastProvider.tsx`

Toast notification system for temporary messages.

**Usage:**
```typescript
import { ToastProvider, useToast } from '@shared/components';

// Wrap app with provider
<ToastProvider>
  <App />
</ToastProvider>

// Use in components
const { showToast } = useToast();

showToast('Success!', 'success');
showToast('Error occurred', 'error');
showToast('Warning', 'warning');
showToast('Info message', 'info');
```

**Toast Types:**
- `success`: Green, for successful operations
- `error`: Red, for errors
- `warning`: Yellow, for warnings
- `info`: Blue, for informational messages

**Features:**
- Auto-dismiss after 5 seconds
- Multiple toasts stack vertically
- Animated entrance/exit
- Accessible with ARIA live regions

---

## Governance Components

### ProposalStatusBadge

**Location:** `shared/components/governance/ProposalStatusBadge.tsx`

Displays proposal status with color-coded badge.

**Props:**
- `status: ProposalStatus` - Proposal status
- `className?: string` - Additional CSS classes

**Usage:**
```typescript
import { ProposalStatusBadge } from '@shared/components';

<ProposalStatusBadge status="pending" />
<ProposalStatusBadge status="approved" />
<ProposalStatusBadge status="rejected" />
```

**Status Colors:**
- `pending`: Yellow
- `approved`: Green
- `rejected`: Red
- `active`: Blue

---

### ProposalVoteDisplay

**Location:** `shared/components/governance/ProposalVoteDisplay.tsx`

Displays proposal voting results with progress bars.

**Props:**
- `votesFor: number` - Number of yes votes
- `votesAgainst: number` - Number of no votes
- `totalVotes: number` - Total possible votes
- `className?: string` - Additional CSS classes

**Usage:**
```typescript
import { ProposalVoteDisplay } from '@shared/components';

<ProposalVoteDisplay
  votesFor={8}
  votesAgainst={2}
  totalVotes={10}
/>
```

**Features:**
- Visual progress bars
- Percentage display
- Color-coded (green for yes, red for no)
- Shows total vote count

---

## Skeleton Components

Skeleton components provide loading states that match the shape of the actual content.

### CardSkeleton

**Location:** `shared/components/skeletons/CardSkeleton.tsx`

Loading skeleton for card layouts.

**Props:**
- `count?: number` - Number of skeletons to show
- `hasHeader?: boolean` - Include header skeleton

**Usage:**
```typescript
import { CardSkeleton } from '@shared/components';

{loading ? <CardSkeleton count={3} hasHeader /> : <CardList />}
```

---

### ListSkeleton

**Location:** `shared/components/skeletons/ListSkeleton.tsx`

Loading skeleton for list items.

**Props:**
- `count?: number` - Number of list items

**Usage:**
```typescript
import { ListSkeleton } from '@shared/components';

{loading ? <ListSkeleton count={5} /> : <ItemList />}
```

---

### TableSkeleton

**Location:** `shared/components/skeletons/TableSkeleton.tsx`

Loading skeleton for tables.

**Props:**
- `rows?: number` - Number of rows
- `columns?: number` - Number of columns

**Usage:**
```typescript
import { TableSkeleton } from '@shared/components';

{loading ? <TableSkeleton rows={10} columns={5} /> : <DataTable />}
```

---

### MessageSkeleton

**Location:** `shared/components/skeletons/MessageSkeleton.tsx`

Loading skeleton for chat/message displays.

**Props:**
- `count?: number` - Number of messages

**Usage:**
```typescript
import { MessageSkeleton } from '@shared/components';

{loading ? <MessageSkeleton count={3} /> : <MessageList />}
```

---

### PlanSkeleton

**Location:** `shared/components/skeletons/PlanSkeleton.tsx`

Loading skeleton for plan/proposal details.

**Props:**
- None

**Usage:**
```typescript
import { PlanSkeleton } from '@shared/components';

{loading ? <PlanSkeleton /> : <PlanDetails />}
```

---

## Usage Guidelines

### When to Create a New Shared Component

Create a new shared component when:

1. **Multi-App Usage**: The component is needed in 2+ apps
2. **Design System**: It's part of the UI design system (buttons, inputs, etc.)
3. **Generic Utility**: It provides generic utility (error boundaries, loading states)
4. **Consistent Patterns**: It enforces consistent patterns across apps

### When NOT to Create a Shared Component

Keep components in app folders when:

1. **Single Use**: Only one app needs it
2. **Business Logic**: Contains app-specific business logic
3. **Heavy Customization**: Requires extensive per-app customization
4. **Experimental**: Not yet proven for reuse

### Component Checklist

Before adding a component to shared:

- [ ] Used by 2+ apps OR clearly reusable
- [ ] No app-specific imports
- [ ] No hardcoded app-specific values
- [ ] Props for all customization
- [ ] Full TypeScript types
- [ ] JSDoc documentation
- [ ] Accessibility features (ARIA labels, keyboard nav)
- [ ] Responsive design
- [ ] Dark mode support (if applicable)

### Import Best Practices

Always use the `@shared` alias:

```typescript
// ✅ GOOD
import { Button, Card } from '@shared/components';
import { ErrorAlert } from '@shared/components';

// ❌ BAD
import { Button } from '../../shared/components/ui/Button';
```

### Customization Patterns

Shared components should accept these common props:

```typescript
interface CommonProps {
  className?: string;      // Additional CSS classes
  style?: React.CSSProperties;  // Inline styles
  children?: React.ReactNode;   // Child content
  'aria-label'?: string;   // Accessibility label
}
```

### Theme Consistency

All components use the shared theme from `shared/styles/theme.ts`:

```typescript
import { theme } from '@shared/styles';

// Colors
theme.colors.primary
theme.colors.secondary
theme.colors.danger

// Spacing
theme.spacing.sm
theme.spacing.md
theme.spacing.lg
```

## Testing Shared Components

All shared components should have tests in `__tests__` folder:

```typescript
// shared/components/__tests__/Button.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from '../ui/Button';

describe('Button', () => {
  it('renders with children', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('calls onClick when clicked', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click</Button>);
    fireEvent.click(screen.getByText('Click'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
```

## Accessibility

All shared components must meet WCAG 2.1 AA standards:

- Keyboard navigable
- Screen reader compatible
- Sufficient color contrast
- ARIA labels where needed
- Focus indicators visible
- Semantic HTML elements

## See Also

- [Shared Architecture Guide](../README.md)
- [Hooks Catalog](../hooks/README.md)
- [Type Definitions](../types/README.md)
- [Theme Configuration](../styles/theme.ts)
