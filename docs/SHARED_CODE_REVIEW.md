# Shared Code Review Guidelines

This guide helps reviewers evaluate pull requests that modify the `shared/` folder. Following these guidelines ensures the shared codebase remains clean, maintainable, and truly reusable.

## Table of Contents

- [Quick Checklist](#quick-checklist)
- [Review Process](#review-process)
- [Common Violations](#common-violations)
- [How to Suggest Improvements](#how-to-suggest-improvements)
- [Examples](#examples)

## Quick Checklist

When reviewing shared code changes, verify:

### Architecture Compliance

- [ ] **Multi-App Usage**: Code is used by 2+ apps OR is clearly reusable
- [ ] **No App Imports**: No imports from `admin/`, `client/`, `website/`, or `backend/`
- [ ] **No Hardcoded Values**: No app-specific hardcoded strings, URLs, or logic
- [ ] **Props for Customization**: All app-specific behavior is configurable via props
- [ ] **Import Paths**: Uses `@shared` alias, not relative imports

### Code Quality

- [ ] **TypeScript Types**: Full type definitions with no `any` types
- [ ] **JSDoc Comments**: Comprehensive documentation with examples
- [ ] **Prop Documentation**: Each prop documented with purpose and type
- [ ] **Error Handling**: Proper error handling for edge cases
- [ ] **Accessibility**: WCAG 2.1 AA compliance (ARIA labels, keyboard nav)

### Testing

- [ ] **Unit Tests**: Tests cover core functionality
- [ ] **Integration Tests**: Tested in target applications
- [ ] **Edge Cases**: Tests cover error states and edge cases
- [ ] **No Regressions**: Existing tests still pass

### Documentation

- [ ] **README Updated**: Component/hook documented in relevant README
- [ ] **Usage Examples**: Clear examples provided
- [ ] **Breaking Changes**: Breaking changes clearly documented
- [ ] **Migration Guide**: If breaking, migration guide provided

### Validation

- [ ] **Validation Script**: `npm run validate:shared` passes
- [ ] **Build Success**: `npm run build` succeeds
- [ ] **Type Check**: `npm run typecheck` passes
- [ ] **No Linting Errors**: ESLint passes without errors

## Review Process

### Step 1: Understand the Change

1. Read the PR description thoroughly
2. Understand which apps will use this code
3. Identify the problem being solved
4. Check if shared folder is the right place

**Ask yourself:**
- Is this truly reusable across apps?
- Could this be app-specific code instead?
- Does this violate the single responsibility principle?

### Step 2: Check Architecture Compliance

Review the code for architectural violations:

```bash
# Run validation script
npm run validate:shared

# Check for app-specific imports manually
grep -r "from.*admin\|client\|website\|backend" shared/
```

### Step 3: Review Code Quality

- Check TypeScript types are complete
- Verify JSDoc comments are comprehensive
- Look for hardcoded values that should be props
- Ensure accessibility standards are met

### Step 4: Test Locally

```bash
# Run tests
npm test shared/

# Run integration tests
npm run test:integration

# Build all apps
npm run build
```

### Step 5: Verify Documentation

- Check that README is updated
- Verify examples are clear and correct
- Ensure breaking changes are documented

## Common Violations

### 1. App-Specific Imports

**❌ VIOLATION:**
```typescript
// shared/components/AdminHeader.tsx
import { AdminService } from '@admin/services';

export function AdminHeader() {
  const data = AdminService.getData();
  return <header>{data}</header>;
}
```

**✅ CORRECT:**
```typescript
// shared/components/AppHeader.tsx
interface AppHeaderProps {
  data: string;
  appName: string;
}

export function AppHeader({ data, appName }: AppHeaderProps) {
  return <header>{appName}: {data}</header>;
}
```

**Feedback:**
> This component imports from the admin folder, which violates the shared code architecture. Shared code must not depend on app-specific code. Please refactor to accept app-specific data via props.

---

### 2. Hardcoded App-Specific Values

**❌ VIOLATION:**
```typescript
// shared/components/Navigation.tsx
export function Navigation() {
  return (
    <nav>
      <Link to="/admin/dashboard">Dashboard</Link>
    </nav>
  );
}
```

**✅ CORRECT:**
```typescript
// shared/components/Navigation.tsx
interface NavigationProps {
  links: Array<{ to: string; label: string }>;
}

export function Navigation({ links }: NavigationProps) {
  return (
    <nav>
      {links.map(link => (
        <Link key={link.to} to={link.to}>{link.label}</Link>
      ))}
    </nav>
  );
}
```

**Feedback:**
> This component has hardcoded URLs that are specific to the admin app. Please refactor to accept navigation links via props so it can be used by all apps.

---

### 3. Missing Multi-App Usage

**❌ VIOLATION:**
```typescript
// shared/components/ClientDashboard.tsx - Only used in client app
export function ClientDashboard() {
  return <div>Client Dashboard</div>;
}
```

**Feedback:**
> This component appears to be specific to the client app and is not used elsewhere. Please move this to `client/components/` instead of `shared/components/`. Shared code should be used by 2+ apps or be clearly reusable.

---

### 4. Incomplete TypeScript Types

**❌ VIOLATION:**
```typescript
export function useApi(endpoint: any) {
  const [data, setData] = useState<any>(null);
  return data;
}
```

**✅ CORRECT:**
```typescript
export function useApi<T>(endpoint: string): {
  data: T | null;
  loading: boolean;
  error: Error | null;
} {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  return { data, loading, error };
}
```

**Feedback:**
> This hook uses `any` types which defeats the purpose of TypeScript. Please add proper type definitions and make the hook generic if needed.

---

### 5. Missing JSDoc Documentation

**❌ VIOLATION:**
```typescript
export function Button({ variant, children, onClick }: ButtonProps) {
  return <button onClick={onClick}>{children}</button>;
}
```

**✅ CORRECT:**
```typescript
/**
 * Button component with multiple variants and sizes.
 *
 * @example
 * ```tsx
 * <Button variant="primary" onClick={handleClick}>
 *   Submit
 * </Button>
 * ```
 */
export function Button({ variant, children, onClick }: ButtonProps) {
  return <button onClick={onClick}>{children}</button>;
}
```

**Feedback:**
> This component is missing JSDoc documentation. Please add comprehensive comments including description, usage examples, and parameter documentation.

---

### 6. Poor Accessibility

**❌ VIOLATION:**
```typescript
export function Modal({ isOpen, onClose, children }) {
  if (!isOpen) return null;
  return (
    <div onClick={onClose}>
      {children}
    </div>
  );
}
```

**✅ CORRECT:**
```typescript
export function Modal({ isOpen, onClose, children }: ModalProps) {
  const modalRef = useFocusTrap(isOpen);
  useEscapeKey(onClose, isOpen);

  if (!isOpen) return null;

  return (
    <div
      ref={modalRef}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      {children}
    </div>
  );
}
```

**Feedback:**
> This modal component is missing accessibility features. Please add:
> - Focus trap to contain keyboard navigation
> - Escape key handler to close modal
> - Proper ARIA attributes (role, aria-modal, aria-labelledby)
> - Semantic HTML structure

---

## How to Suggest Improvements

### Use Constructive Language

**❌ BAD:**
> This code is wrong and shouldn't be in shared.

**✅ GOOD:**
> This component appears to be specific to the admin app. Consider moving it to `admin/components/` or refactoring it to accept app-specific data via props so it can be used across all apps.

### Provide Examples

Always provide a code example showing the correct approach:

> Instead of hardcoding the API endpoint, please accept it as a prop:
> ```typescript
> interface ComponentProps {
>   apiEndpoint: string;
> }
> ```

### Link to Documentation

Reference the relevant guidelines:

> This violates our shared code architecture. See [shared/README.md](../shared/README.md#rules-for-shared-code) for the rules on shared code.

### Suggest Alternatives

Offer solutions, not just problems:

> If this component is only used in the admin app, consider:
> 1. Moving it to `admin/components/`
> 2. OR refactoring it to accept admin-specific data via props
> 3. OR creating a generic wrapper component in shared that the admin app can configure

## Examples

### Example 1: Reviewing a New Shared Component

**PR:** "Add UserAvatar component to shared"

**Review:**

1. ✅ Check usage: Used in admin and client apps
2. ✅ Check imports: No app-specific imports
3. ✅ Check types: Full TypeScript types present
4. ❌ Missing JSDoc: No documentation
5. ❌ Missing tests: No test file
6. ✅ Props customizable: Accepts size, variant props

**Feedback:**
> Thanks for adding this useful component! A few items to address:
>
> 1. Please add JSDoc comments with usage examples
> 2. Please create a test file at `shared/components/__tests__/UserAvatar.test.tsx`
> 3. Consider adding an `alt` prop for accessibility
>
> Once these are addressed, this will be good to merge!

---

### Example 2: Reviewing a Breaking Change

**PR:** "Refactor Button component API"

**Review:**

1. ✅ Architectural compliance maintained
2. ✅ Types and documentation updated
3. ❌ No migration guide provided
4. ❌ Breaking changes not documented in PR

**Feedback:**
> This PR introduces breaking changes to the Button component API. Please:
>
> 1. Document all breaking changes in the PR description
> 2. Create a migration guide showing old vs new API
> 3. Update all usages in admin, client, and website apps
> 4. Consider deprecation warnings instead of immediate breaking changes
>
> Example migration guide:
> ```typescript
> // Old API
> <Button type="primary">Submit</Button>
>
> // New API
> <Button variant="primary">Submit</Button>
> ```

---

## Approval Criteria

Only approve shared code PRs when:

1. ✅ All checklist items are satisfied
2. ✅ Validation script passes
3. ✅ Tests pass and coverage is adequate
4. ✅ Documentation is comprehensive
5. ✅ No architectural violations
6. ✅ Code quality meets standards
7. ✅ Breaking changes are properly handled

## Questions to Ask

If unsure about a shared code change, ask:

- "Is this component used by multiple apps?"
- "Could this logic be app-specific instead?"
- "Are there any hardcoded values that should be props?"
- "Is this properly documented for other developers?"
- "Will this work in all target applications?"
- "Are there any accessibility concerns?"

## Resources

- [Shared Architecture Guide](../shared/README.md)
- [Components Catalog](../shared/components/README.md)
- [Hooks Catalog](../shared/hooks/README.md)
- [Developer Guide](../DEVELOPER_GUIDE.md)

## Getting Help

If you're unsure about a shared code review:

1. Check the shared architecture documentation
2. Run the validation script to catch obvious issues
3. Test the code locally in multiple apps
4. Ask in the team chat for guidance
5. Tag a senior developer for a second opinion

Remember: It's better to be strict about shared code quality than to accumulate technical debt!

## Recently Added Shared Utilities

### Validation System

**Location:** `/shared/utils/validation/`

The validation system provides layered validation:
- Base validators for primitives (email, URL, UUID, etc.)
- Field validators with structured error messages
- Business validators for domain logic (proposals, users, votes)
- Helper functions for composition and async validation

**Documentation:** See [VALIDATION_GUIDE.md](./VALIDATION_GUIDE.md)

**Usage:**
```typescript
import { validateProposal, PROPOSAL_VALIDATION_RULES } from '@shared/utils/validation';

const validation = validateProposal(title, summary);
if (!validation.isValid) {
  console.error(validation.errors);
}
```

### Error Handling

**Location:** `/shared/utils/errors/`

Custom error classes and handling utilities:
- `ApplicationError` base class with status codes
- Specific error types (`ValidationError`, `NotFoundError`, `AuthenticationError`, etc.)
- Error formatting and handling functions
- Safe execution wrappers with retry logic

**Usage:**
```typescript
import { ValidationError, formatError } from '@shared/utils/errors';

throw new ValidationError('Invalid input', { field: 'email' });

// Or format any error
const response = formatError(error);
```

### Pagination Component

**Location:** `/shared/components/ui/Pagination.tsx`

Reusable pagination component with:
- Customizable styling (size and style variants)
- Optional first/last buttons
- Optional page numbers display
- Full accessibility support (ARIA labels, keyboard navigation)

**Usage:**
```typescript
import { Pagination } from '@shared/components/ui/Pagination';

<Pagination
  offset={0}
  limit={20}
  total={100}
  onPageChange={(newOffset) => setOffset(newOffset)}
  size="md"
  variant="default"
/>
```

### API Logger

**Location:** `/shared/lib/apiLogger.ts`

Enhanced API call logging and monitoring:
- Configurable logging (can be disabled in production)
- Request/response body logging
- Performance metrics tracking
- Error tracking and filtering
- Statistics and analytics
- Import/export functionality

**Usage:**
```typescript
import { apiLogger } from '@shared/lib';

apiLogger.logRequest('GET', '/api/users');
const stats = apiLogger.getStats();
const errorLogs = apiLogger.getErrorLogs();
```

### Test Infrastructure

**Location:** `/tests/`

Centralized test utilities and factories:
- Global test configuration and setup
- Supabase test client and utilities
- Test data factories for all entities
- Consistent test patterns and helpers

**Documentation:** See [TESTING_GUIDE.md](./TESTING_GUIDE.md)

**Usage:**
```typescript
import { ProposalFactory, UserFactory } from '@tests/factories';

const proposal = ProposalFactory.build({ status: 'adopted' });
const users = UserFactory.buildMany(5);
```
