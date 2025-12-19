# Shared Components

This directory contains reusable React components shared across all three frontend applications (Admin Portal, Client Portal, and Public Website).

## Core Components

### ErrorBoundary

React error boundary component for catching and handling errors gracefully.

**Usage:**
```tsx
import { ErrorBoundary } from '../../shared/components';

<ErrorBoundary
  fallback={<CustomErrorUI />}
  onError={(error, errorInfo) => logError(error, 'ComponentName')}
>
  <YourComponent />
</ErrorBoundary>
```

**Props:**
- `children`: ReactNode - Components to wrap
- `fallback?`: ReactNode - Custom error UI (optional)
- `onError?`: (error: Error, errorInfo: any) => void - Error callback

### LoadingSpinner

Flexible loading spinner component with multiple sizes and layouts.

**Usage:**
```tsx
import { LoadingSpinner } from '../../shared/components';

<LoadingSpinner size="md" text="Loading data..." />
<LoadingSpinner size="lg" fullScreen />
```

**Props:**
- `size?`: 'sm' | 'md' | 'lg' - Spinner size (default: 'md')
- `text?`: string - Loading message
- `fullScreen?`: boolean - Full-screen overlay (default: false)

### SystemHealthBadge

System health monitoring widget with expandable details.

**Usage:**
```tsx
import { SystemHealthBadge } from '../../shared/components';

<SystemHealthBadge />
```

Automatically fetches health data from `/api/system/health` every 60 seconds.

### ToastProvider & useToast

Toast notification system for user feedback.

**Setup:**
```tsx
import { ToastProvider } from '../../shared/components';

function App() {
  return (
    <ToastProvider maxToasts={5}>
      <YourApp />
    </ToastProvider>
  );
}
```

**Usage:**
```tsx
import { useToast } from '../../shared/components';

function MyComponent() {
  const { showSuccess, showError, showWarning, showInfo } = useToast();

  const handleSuccess = () => {
    showSuccess('Success!', 'Operation completed successfully.');
  };

  const handleError = () => {
    showError('Error', 'Something went wrong.');
  };
}
```

**Methods:**
- `showSuccess(title, message?)` - Success toast (5s duration)
- `showError(title, message?)` - Error toast (7s duration)
- `showWarning(title, message?)` - Warning toast (6s duration)
- `showInfo(title, message?)` - Info toast (5s duration)
- `showToast(type, title, message?, duration?)` - Custom toast

### DevBanner

Development environment indicator banner.

**Usage:**
```tsx
import { DevBanner } from '../../shared/components';

<DevBanner
  environment="development"
  tenant="admin"
/>
```

**Props:**
- `environment`: 'development' | 'staging' | 'production'
- `tenant`: 'admin' | 'client' | 'website'

## UI Components

### Button

Versatile button component with multiple variants and sizes.

**Usage:**
```tsx
import { Button } from '../../shared/components';

<Button variant="primary" size="md" onClick={handleClick}>
  Click Me
</Button>

<Button variant="danger" size="sm" loading>
  Processing...
</Button>
```

**Props:**
- `variant?`: 'primary' | 'secondary' | 'danger' | 'ghost' (default: 'primary')
- `size?`: 'sm' | 'md' | 'lg' (default: 'md')
- `loading?`: boolean - Shows spinner (default: false)
- Extends all standard button HTML attributes

### Card

Card layout component with optional header and title.

**Usage:**
```tsx
import { Card, CardHeader, CardTitle } from '../../shared/components';

<Card padding="md">
  <CardHeader>
    <CardTitle>Card Title</CardTitle>
  </CardHeader>
  <p>Card content goes here...</p>
</Card>
```

**Card Props:**
- `children`: ReactNode
- `className?`: string
- `padding?`: 'none' | 'sm' | 'md' | 'lg' (default: 'md')

### Input

Form input component with label, error, and helper text support.

**Usage:**
```tsx
import { Input } from '../../shared/components';

<Input
  label="Email"
  type="email"
  placeholder="Enter your email"
  required
  error={errors.email}
  helperText="We'll never share your email."
/>
```

**Props:**
- `label?`: string - Input label
- `error?`: string - Error message
- `helperText?`: string - Helper text below input
- Extends all standard input HTML attributes

## Skeleton Components

Loading skeleton components for better UX during data fetching.

### TableSkeleton

**Usage:**
```tsx
import { TableSkeleton } from '../../shared/components';

<TableSkeleton rows={5} columns={4} />
```

**Props:**
- `rows?`: number (default: 5)
- `columns?`: number (default: 4)

### CardSkeleton

**Usage:**
```tsx
import { CardSkeleton } from '../../shared/components';

<CardSkeleton count={3} hasImage />
```

**Props:**
- `count?`: number (default: 1)
- `hasImage?`: boolean (default: false)

### ListSkeleton

**Usage:**
```tsx
import { ListSkeleton } from '../../shared/components';

<ListSkeleton items={5} hasAvatar hasActions />
```

**Props:**
- `items?`: number (default: 5)
- `hasAvatar?`: boolean (default: false)
- `hasActions?`: boolean (default: false)

## Best Practices

1. **Import from the barrel export:**
   ```tsx
   import { Button, Card, LoadingSpinner } from '../../shared/components';
   ```

2. **Use ErrorBoundary at strategic points:**
   - Wrap entire app
   - Wrap critical feature sections
   - Wrap third-party integrations

3. **Always wrap apps with ToastProvider:**
   ```tsx
   <ErrorBoundary>
     <ToastProvider>
       <App />
     </ToastProvider>
   </ErrorBoundary>
   ```

4. **Use skeletons instead of generic loading text:**
   ```tsx
   {loading ? <TableSkeleton /> : <DataTable data={data} />}
   ```

5. **Consistent error handling:**
   ```tsx
   import { useToast, handleApiError } from '../../shared/components';

   try {
     await apiCall();
   } catch (error) {
     const friendlyError = handleApiError(error);
     showError(friendlyError.title, friendlyError.message);
   }
   ```
