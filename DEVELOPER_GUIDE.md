# Developer Guide

Complete guide for developers working on the Aizura Consortium codebase, covering components, hooks, styling, accessibility, and testing.

## Table of Contents

**Part 1: Shared Components**
1. [Component Library](#component-library)
2. [Core Components](#core-components)
3. [UI Components](#ui-components)
4. [Skeleton Components](#skeleton-components)
5. [Component Best Practices](#component-best-practices)

**Part 2: Custom Hooks**
6. [Available Hooks](#available-hooks)
7. [useApi](#useapi)
8. [useDebounce](#usedebounce)
9. [useLocalStorage](#uselocalstorage)
10. [usePagination](#usepagination)
11. [Combining Hooks](#combining-hooks)
12. [Hook Best Practices](#hook-best-practices)

**Part 3: Styling**
13. [Theme Configuration](#theme-configuration)
14. [Theme Classes](#theme-classes)
15. [Colors and Spacing](#colors-and-spacing)
16. [Tailwind Configuration](#tailwind-configuration)
17. [Styling Best Practices](#styling-best-practices)

**Part 4: Accessibility**
18. [Color System & Contrast](#color-system--contrast)
19. [Semantic HTML & ARIA](#semantic-html--aria)
20. [Keyboard Navigation](#keyboard-navigation)
21. [Screen Reader Support](#screen-reader-support)
22. [Mobile Accessibility](#mobile-accessibility)
23. [Testing Accessibility](#testing-accessibility)

**Part 5: Testing**
24. [Test Structure](#test-structure)
25. [Test Configuration](#test-configuration)
26. [Running Tests](#running-tests)
27. [Writing Tests](#writing-tests)
28. [Test Data & Fixtures](#test-data--fixtures)

---

# Part 1: Shared Components

## Component Library

This directory contains reusable React components shared across all three frontend applications (Admin Portal, Client Portal, and Public Website).

**Location:** `shared/components/`

**Purpose:**
- Eliminate code duplication
- Ensure consistent UI across applications
- Provide accessible, tested components
- Speed up development with reusable building blocks

---

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

**Best Practices:**
- Wrap entire app for global error catching
- Wrap critical feature sections
- Wrap third-party integrations
- Always provide meaningful fallback UI
- Log errors for debugging

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

**When to Use:**
- Full-page loading states
- Modal/drawer loading
- Button loading states
- Inline content loading

### SystemHealthBadge

System health monitoring widget with expandable details.

**Usage:**
```tsx
import { SystemHealthBadge } from '../../shared/components';

<SystemHealthBadge />
```

**Features:**
- Automatically fetches health data from `/api/system/health`
- Updates every 60 seconds
- Color-coded status (green/yellow/red/gray)
- Expandable details panel
- Shows uptime and recent errors

**Placement:**
- Typically in footer or corner of layout
- Visible on all public pages
- Provides transparency to users

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

**Duration Guidelines:**
- Success: 5 seconds
- Info: 5 seconds
- Warning: 6 seconds
- Error: 7 seconds
- Custom: Configurable

**Best Practices:**
- Keep titles short (1-3 words)
- Messages should be actionable
- Don't overuse - only for important feedback
- Use appropriate severity

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

**Features:**
- Only visible in development and staging
- Color-coded by environment
- Shows current tenant
- Helps identify which app you're using

---

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

**Variants:**
- **primary**: Main call-to-action (cyan background)
- **secondary**: Secondary actions (gray background)
- **danger**: Destructive actions (red background)
- **ghost**: Minimal style (transparent background)

**Accessibility:**
- Keyboard accessible (Enter/Space)
- Focus visible
- Disabled state indicated
- Loading state announced to screen readers

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

**Use Cases:**
- Dashboard widgets
- Content containers
- List items
- Form sections

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

**Features:**
- Built-in label association
- Error state styling
- Helper text support
- Accessible by default (proper ARIA labels)

---

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

**Use Case:**
- Loading data tables
- Admin dashboards
- Report views

### CardSkeleton

**Usage:**
```tsx
import { CardSkeleton } from '../../shared/components';

<CardSkeleton count={3} hasImage />
```

**Props:**
- `count?`: number (default: 1)
- `hasImage?`: boolean (default: false)

**Use Case:**
- Loading card grids
- Content lists
- Dashboard widgets

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

**Use Case:**
- Loading message lists
- User lists
- Navigation items

---

## Component Best Practices

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

---

# Part 2: Custom Hooks

## Available Hooks

This directory contains reusable React hooks shared across all three frontend applications.

**Location:** `shared/hooks/`

**Available Hooks:**
- useApi - API call management
- useDebounce - Debounce values
- useLocalStorage - Persistent state
- usePagination - Pagination logic
- usePolling - Real-time updates
- useDataFetch - Generic data fetching
- useSupabaseAuth - Supabase authentication

---

## useApi

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

**Best Practices:**
- Always specify types: `useApi<Proposal[]>(fetchProposals)`
- Handle all three states: loading, error, success
- Use callbacks for side effects (logging, analytics)
- Call `execute()` in useEffect for automatic loading

---

## useDebounce

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

**Delay Guidelines:**
- Search: 300-500ms
- Filters: 500-750ms
- Resize/scroll: 100-200ms

---

## useLocalStorage

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

**Best Practices:**
- Use descriptive keys: `'user-preferences'`, `'app-theme'`
- Handle storage quota errors
- Don't store sensitive data
- Consider data size (5-10MB limit)

---

## usePagination

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

**Best Practices:**
- Handle edge cases: `if (totalPages === 0) return <EmptyState />;`
- Show current page range: "Showing 1-10 of 100"
- Disable buttons appropriately
- Consider URL sync for bookmarkable pages

---

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

---

## Hook Best Practices

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

---

# Part 3: Styling

## Theme Configuration

Centralized theme and styling configuration for all applications in the Aizura Consortium monorepo.

**Location:** `shared/styles/`

**Files:**
- **theme.ts**: Color constants, theme classes, spacing, animations, and the `cn()` utility
- **tailwind.preset.js**: Shared Tailwind configuration preset
- **base.css**: Global styles and CSS variables
- **index.ts**: Main exports

---

## Theme Classes

### Import Theme Classes

```typescript
import { themeClasses, cn, spacing, colors } from '@shared/styles';

// Use predefined button styles
<button className={themeClasses.button.primary}>
  Click me
</button>

// Combine with custom classes using cn()
<div className={cn(themeClasses.card.default, "my-custom-class")}>
  Card content
</div>

// Use spacing constants
<div className={spacing.page}>
  Page content
</div>
```

### Available Theme Classes

#### Buttons
- `themeClasses.button.primary` - Primary action button
- `themeClasses.button.secondary` - Secondary button
- `themeClasses.button.outline` - Outlined button
- `themeClasses.button.ghost` - Ghost button (no background)
- `themeClasses.button.danger` - Destructive action button
- `themeClasses.button.sizes.{sm|md|lg}` - Size variants

#### Cards
- `themeClasses.card.default` - Standard card
- `themeClasses.card.interactive` - Clickable card with hover effect
- `themeClasses.card.elevated` - Card with stronger shadow

#### Inputs
- `themeClasses.input.base` - Base input styles
- `themeClasses.input.error` - Error state styles

#### Badges
- `themeClasses.badge.{primary|success|warning|error|neutral}` - Colored badges

#### Text
- `themeClasses.text.heading.{h1|h2|h3|h4}` - Heading styles
- `themeClasses.text.body.{default|small|muted}` - Body text styles

---

## Colors and Spacing

### Colors

Access color constants directly:

```typescript
import { colors } from '@shared/styles';

const primaryColor = colors.primary[600]; // '#2563eb'
```

### Spacing

Pre-defined spacing utilities:

```typescript
import { spacing } from '@shared/styles';

// spacing.page: 'px-4 sm:px-6 lg:px-8'
// spacing.section: 'py-8 sm:py-12 lg:py-16'
// spacing.card: 'p-4 sm:p-6'
// spacing.container: 'max-w-7xl mx-auto'
```

### cn() Utility

The `cn()` function is a utility for conditionally combining class names:

```typescript
import { cn } from '@shared/styles';

<div className={cn(
  'base-class',
  isActive && 'active-class',
  isFocused ? 'focused' : 'unfocused'
)}>
  Content
</div>
```

---

## Tailwind Configuration

All apps should extend the shared preset:

```javascript
import sharedPreset from '../shared/styles/tailwind.preset.js';

export default {
  presets: [sharedPreset],
  content: [
    "./index.html",
    "./**/*.{js,ts,jsx,tsx}",
    "../shared/**/*.{js,ts,jsx,tsx}",
  ],
  // App-specific overrides
};
```

**Benefits:**
1. **Consistency**: All apps use the same color palette and design tokens
2. **Maintainability**: Update styles in one place
3. **Type Safety**: TypeScript autocomplete for theme classes
4. **Flexibility**: Can override with custom classes when needed
5. **Performance**: Shared configuration reduces bundle duplication

---

## Styling Best Practices

1. **Prefer theme classes over inline Tailwind**: Use `themeClasses` when possible
2. **Use cn() for conditional classes**: Cleaner than string concatenation
3. **Don't override core colors**: Extend the theme instead
4. **Document custom additions**: Add comments for app-specific extensions

---

# Part 4: Accessibility

## Color System & Contrast

Our design uses a carefully selected color palette that meets WCAG AA standards for contrast.

### Color Palette

#### Background Colors
- `slate-900` (#0f172a) - Primary background
- `slate-800` (#1e293b) - Secondary background / Cards
- `slate-700` (#334155) - Tertiary elements

#### Text Colors
- `white` (#ffffff) - Primary text - **Contrast: 16.07:1 on slate-900** ✓
- `slate-300` (#cbd5e1) - Secondary text - **Contrast: 11.63:1 on slate-900** ✓
- `slate-400` (#94a3b8) - Tertiary text - **Contrast: 7.42:1 on slate-900** ✓

#### Accent Colors
- `cyan-400` (#22d3ee) - Primary accent - **Contrast: 8.52:1 on slate-900** ✓
- `cyan-500` (#06b6d4) - Interactive elements - **Contrast: 6.91:1 on slate-900** ✓
- `blue-500` (#3b82f6) - Secondary accent - **Contrast: 5.89:1 on slate-900** ✓

#### Status Colors
- `green-400` (#4ade80) - Success states - **Contrast: 10.21:1 on slate-900** ✓
- `yellow-400` (#facc15) - Warning states - **Contrast: 13.45:1 on slate-900** ✓
- `red-400` (#f87171) - Error states - **Contrast: 6.82:1 on slate-900** ✓

### WCAG Compliance

All text/background combinations meet **WCAG AA standards** (minimum 4.5:1 for normal text, 3:1 for large text and UI elements).

Most combinations also meet **WCAG AAA standards** (7:1 for normal text, 4.5:1 for large text).

---

## Semantic HTML & ARIA

### Semantic HTML

We use semantic HTML5 elements throughout the application:

- `<nav>` - Navigation menus
- `<main>` - Primary content area (with `id="main-content"`)
- `<button>` - All interactive elements that trigger actions
- `<a>` - Links to other pages/resources
- `<article>` - Self-contained content
- `<section>` - Thematic groupings

### ARIA Attributes

#### Navigation
- `role="navigation"` on nav elements
- `aria-label` for all navigation buttons
- `aria-current="page"` for active navigation links
- `aria-expanded` for mobile menu toggle
- `aria-controls` linking menu button to menu content

#### Dynamic Content
- `role="log"` with `aria-live="polite"` for live message updates
- `role="status"` for loading states
- `role="alert"` for error messages
- `aria-busy` during loading operations

#### Interactive Elements
- `aria-label` for icon-only buttons
- `aria-hidden="true"` for decorative icons
- `aria-expanded` for expandable sections
- `aria-modal="true"` for modal dialogs

#### Forms
- Proper `<label>` associations for all inputs
- `aria-describedby` for helper text
- `aria-invalid` for validation errors

---

## Keyboard Navigation

All interactive elements are keyboard accessible.

### Focus Management
- Visible focus indicators on all interactive elements
- Logical tab order throughout the application
- Focus trap in modal dialogs
- Return focus to trigger element when closing modals

### Keyboard Shortcuts
- `Tab` - Navigate forward through interactive elements
- `Shift + Tab` - Navigate backward
- `Enter` / `Space` - Activate buttons
- `Escape` - Close modals and menus

### Skip Navigation
A "Skip to main content" link is provided at the top of each page (visible on keyboard focus) to allow keyboard users to bypass navigation.

---

## Screen Reader Support

### Tested With
- NVDA (Windows)
- JAWS (Windows)
- VoiceOver (macOS/iOS)
- TalkBack (Android)

### Features
- Meaningful page titles
- Proper heading hierarchy (h1 → h2 → h3)
- Alternative text for images
- Clear link text (no "click here")
- Form labels and instructions
- Error message announcements
- Live region updates for dynamic content

---

## Mobile Accessibility

### Touch Targets
All interactive elements meet the minimum size requirements:
- Touch targets are at least 44x44px
- Sufficient spacing between interactive elements

### Responsive Design
- Mobile-first responsive design
- Hamburger menu on small screens
- Readable text sizes at all viewport sizes
- No horizontal scrolling

### Viewport Configuration
```html
<meta name="viewport" content="width=device-width, initial-scale=1.0">
```

---

## Testing Accessibility

### Automated Testing Tools
1. **Lighthouse** (Chrome DevTools) - Run accessibility audit
2. **axe DevTools** - Browser extension for automated checks
3. **Pa11y** - Command-line accessibility testing

### Manual Testing Checklist
- [ ] Test with keyboard only (no mouse)
- [ ] Verify all images have alt text
- [ ] Check color contrast ratios
- [ ] Test with screen reader
- [ ] Verify focus indicators are visible
- [ ] Test on mobile devices (various sizes)
- [ ] Verify form validation messages
- [ ] Check heading hierarchy
- [ ] Test with zoom at 200%
- [ ] Verify no horizontal scrolling

### Browser Compatibility
- Chrome/Edge (Latest)
- Firefox (Latest)
- Safari (Latest)
- Mobile browsers (iOS Safari, Android Chrome)

### Known Limitations

1. **Real-time Updates**: While live regions are implemented for message updates, some screen readers may not announce all updates if they occur too rapidly.

2. **Complex Visualizations**: Agent status badges and importance scales are primarily visual. Screen reader users receive text alternatives but may miss some visual nuances.

3. **Third-party Content**: User-generated proposal content may not always follow accessibility best practices.

### Future Improvements

- [ ] Add more comprehensive keyboard shortcuts
- [ ] Implement dark/light mode toggle with user preference
- [ ] Add font size adjustment controls
- [ ] Improve screen reader announcements for phase transitions
- [ ] Add reduced motion preferences
- [ ] Implement high contrast mode

### Resources

- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)
- [MDN Accessibility](https://developer.mozilla.org/en-US/docs/Web/Accessibility)
- [A11y Project Checklist](https://www.a11yproject.com/checklist/)

### Contact

If you encounter any accessibility issues, please report them in our issue tracker with the `accessibility` label.

---

# Part 5: Testing

## Test Structure

This directory contains all tests for the Aizura Consortium project.

```
tests/
├── unit/                 # Unit tests for individual components
│   ├── services/        # Service layer tests
│   ├── orchestrator/    # Orchestrator logic tests
│   └── utils/           # Utility function tests
├── integration/         # Integration tests
│   ├── api/             # API endpoint tests
│   └── webhooks/        # Webhook integration tests
├── fixtures/            # Test data and mocks
│   ├── mocks/           # Mock implementations
│   └── data/            # Sample test data
└── setup/               # Test setup and configuration
```

---

## Test Configuration

### Required Dependencies

Add these dev dependencies to your `package.json`:

```json
{
  "devDependencies": {
    "@jest/globals": "^29.7.0",
    "@types/jest": "^29.5.0",
    "jest": "^29.7.0",
    "ts-jest": "^29.1.0"
  }
}
```

### Installation

Run the following command to install test dependencies:

```bash
npm install --save-dev @jest/globals @types/jest jest ts-jest
```

### Jest Configuration

Create a `jest.config.js` file in the project root:

```javascript
export default {
  preset: 'ts-jest/presets/default-esm',
  testEnvironment: 'node',
  extensionsToTreatAsEsm: ['.ts'],
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1',
  },
  transform: {
    '^.+\\.tsx?$': [
      'ts-jest',
      {
        useESM: true,
      },
    ],
  },
  testMatch: [
    '**/tests/**/*.test.ts'
  ],
  collectCoverageFrom: [
    'backend/src/**/*.ts',
    'shared/**/*.ts',
    '!**/*.d.ts',
    '!**/node_modules/**'
  ],
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'html'],
  setupFilesAfterEnv: ['<rootDir>/tests/setup/testConfig.ts']
};
```

### Package.json Scripts

Add the following scripts to your `package.json`:

```json
{
  "scripts": {
    "test": "jest",
    "test:unit": "jest tests/unit",
    "test:integration": "jest tests/integration",
    "test:coverage": "jest --coverage",
    "test:watch": "jest --watch",
    "test:verbose": "jest --verbose"
  }
}
```

---

## Running Tests

```bash
# Run all tests
npm test

# Run unit tests only
npm run test:unit

# Run integration tests only
npm run test:integration

# Run with coverage
npm run test:coverage

# Run in watch mode (for development)
npm run test:watch

# Run with verbose output
npm run test:verbose
```

---

## Writing Tests

### Naming Convention
- Test files should end with `.test.ts`
- Use descriptive names: `serviceName.test.ts`
- Test suites should describe the component: `describe('SupabaseService', ...)`
- Test cases should describe behavior: `it('should return duplicate when proposal already queued', ...)`

### Best Practices

1. **Arrange-Act-Assert pattern**
   ```typescript
   it('should format date correctly', () => {
     // Arrange
     const date = new Date('2024-12-18T10:00:00Z');

     // Act
     const result = formatDate(date);

     // Assert
     expect(result).toBe('Dec 18, 2024');
   });
   ```

2. **One assertion per test (when practical)**
   - Keep tests focused and clear
   - Makes debugging easier
   - Clear test names

3. **Clean up resources in afterEach/afterAll**
   ```typescript
   afterEach(() => {
     jest.clearAllMocks();
   });

   afterAll(async () => {
     await closeDatabase();
   });
   ```

4. **Use meaningful test data**
   - Use fixtures for complex data
   - Keep test data realistic
   - Document test data purpose

5. **Mock external dependencies in unit tests**
   ```typescript
   jest.mock('../services/supabase');
   ```

6. **Test both success and error paths**
   ```typescript
   describe('fetchProposals', () => {
     it('should return proposals on success', async () => {
       // ...
     });

     it('should throw error on failure', async () => {
       // ...
     });
   });
   ```

7. **Test edge cases and boundary conditions**
   - Empty arrays
   - Null/undefined values
   - Max/min values
   - Invalid inputs

### Example Test Structure

```typescript
import { describe, it, expect, beforeEach, afterEach } from '@jest/globals';
import { formatDate } from '../formatters';

describe('formatters', () => {
  describe('formatDate', () => {
    it('should format date correctly', () => {
      const date = new Date('2024-12-18T10:00:00Z');
      expect(formatDate(date)).toBe('Dec 18, 2024');
    });

    it('should handle invalid date', () => {
      expect(() => formatDate(null)).toThrow();
    });
  });
});
```

---

## Test Data & Fixtures

Test fixtures are located in `tests/fixtures/data/` and include:
- Sample proposals
- Mock agent messages
- Test database states
- Common test scenarios

**Usage:**
```typescript
import { mockProposal } from '../../fixtures/data/proposals';

it('should process proposal', () => {
  const result = processProposal(mockProposal);
  expect(result).toBeDefined();
});
```

---

## Test Categories

### Unit Tests
- Test individual functions and methods in isolation
- Use mocks for external dependencies
- Fast execution
- High coverage of edge cases

**Example:**
```typescript
describe('sanitizeHtml', () => {
  it('should remove script tags', () => {
    const input = '<p>Hello</p><script>alert("xss")</script>';
    const result = sanitizeHtml(input);
    expect(result).not.toContain('<script>');
  });
});
```

### Integration Tests
- Test multiple components working together
- May use test database or mock services
- Test real API endpoints and workflows
- Slower but more comprehensive

**Example:**
```typescript
describe('POST /api/proposals', () => {
  it('should create new proposal', async () => {
    const response = await request(app)
      .post('/api/proposals')
      .send({ title: 'Test', summary: 'Test summary' });

    expect(response.status).toBe(201);
    expect(response.body.proposal).toBeDefined();
  });
});
```

---

## CI/CD Integration

Add to your CI/CD pipeline:

```yaml
- name: Run Tests
  run: npm test

- name: Generate Coverage Report
  run: npm run test:coverage

- name: Upload Coverage
  uses: codecov/codecov-action@v3
  with:
    files: ./coverage/lcov.info
```

---

## Coverage Goals

- **Overall**: >80% coverage
- **Critical paths**: >90% coverage
- **Utilities**: >95% coverage
- **UI components**: >70% coverage

**Check coverage:**
```bash
npm run test:coverage
```

**Coverage report location:**
- HTML: `coverage/index.html`
- LCOV: `coverage/lcov.info`
- Text: Printed to console

---

## Common Testing Patterns

### Testing API Endpoints

```typescript
import request from 'supertest';
import app from '../src/index';

describe('GET /api/proposals', () => {
  it('should return list of proposals', async () => {
    const response = await request(app)
      .get('/api/proposals')
      .expect(200);

    expect(response.body.proposals).toBeInstanceOf(Array);
  });
});
```

### Testing with Mocks

```typescript
jest.mock('../services/supabase', () => ({
  supabase: {
    from: jest.fn().mockReturnValue({
      select: jest.fn().mockResolvedValue({
        data: mockData,
        error: null
      })
    })
  }
}));
```

### Testing Async Functions

```typescript
it('should handle async operation', async () => {
  const result = await asyncFunction();
  expect(result).toBeDefined();
});

// or

it('should reject on error', async () => {
  await expect(asyncFunction()).rejects.toThrow();
});
```

### Testing Error Handling

```typescript
it('should handle error gracefully', async () => {
  mockFunction.mockRejectedValue(new Error('Test error'));

  await expect(functionUnderTest()).rejects.toThrow('Test error');
});
```

---

## Debugging Tests

### Run Single Test
```bash
npm test -- -t "test name pattern"
```

### Run Single File
```bash
npm test tests/unit/services/rateLimiter.test.ts
```

### Watch Mode
```bash
npm run test:watch
```

### Verbose Output
```bash
npm run test:verbose
```

### Debug in VS Code

Add to `.vscode/launch.json`:
```json
{
  "type": "node",
  "request": "launch",
  "name": "Jest Debug",
  "program": "${workspaceFolder}/node_modules/.bin/jest",
  "args": ["--runInBand", "--no-cache"],
  "console": "integratedTerminal"
}
```

---

## Best Practices Summary

1. **Write tests first** (TDD) when possible
2. **Keep tests simple and focused**
3. **Use descriptive test names**
4. **Test behavior, not implementation**
5. **Mock external dependencies in unit tests**
6. **Clean up after tests**
7. **Maintain test data fixtures**
8. **Run tests before committing**
9. **Review coverage reports**
10. **Update tests when code changes**

---

**Document Version:** 1.0
**Last Updated:** 2025-12-19
**Owner:** Development Team
