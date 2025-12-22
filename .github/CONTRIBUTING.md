# Contributing to Aizura Consortium

Thank you for your interest in contributing to the Aizura Consortium! This document provides guidelines for contributing code, documentation, and other improvements to the project.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Shared Library Guidelines](#shared-library-guidelines)
- [Pull Request Process](#pull-request-process)
- [Coding Standards](#coding-standards)
- [Testing Requirements](#testing-requirements)
- [Documentation](#documentation)

## Code of Conduct

We are committed to providing a welcoming and inclusive environment for all contributors. Please be respectful, constructive, and collaborative in all interactions.

### Expected Behavior

- Be respectful and inclusive
- Welcome newcomers and help them get started
- Focus on constructive feedback
- Respect differing viewpoints and experiences
- Accept responsibility and apologize for mistakes

### Unacceptable Behavior

- Harassment, discrimination, or offensive comments
- Personal attacks or trolling
- Publishing others' private information
- Other unprofessional conduct

## Getting Started

### Prerequisites

- Node.js 18+ and npm 9+
- Git
- Code editor (VS Code recommended)
- Basic knowledge of React, TypeScript, and Supabase

### Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-org/aizura-consortium.git
   cd aizura-consortium
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   ```bash
   cp .env.example .env
   # Edit .env with your Supabase credentials
   ```

4. **Run the development server:**
   ```bash
   npm run dev        # Start website
   npm run dev:admin  # Start admin portal
   npm run dev:client # Start client portal
   ```

5. **Run tests:**
   ```bash
   npm test
   npm run test:coverage
   ```

### Project Structure

```
aizura-consortium/
├── admin/          # Admin portal
├── client/         # Client portal
├── website/        # Public website
├── backend/        # Backend services
├── shared/         # Shared library (SEE GUIDELINES BELOW)
├── tests/          # Test infrastructure
├── supabase/       # Database migrations
└── docs/           # Documentation
```

## Development Workflow

### 1. Create a Branch

Create a feature branch from `main`:

```bash
git checkout -b feature/your-feature-name
# or
git checkout -b fix/bug-description
```

**Branch Naming:**
- `feature/` - New features
- `fix/` - Bug fixes
- `refactor/` - Code refactoring
- `docs/` - Documentation changes
- `test/` - Test additions or fixes

### 2. Make Changes

- Write code following our [Coding Standards](#coding-standards)
- Add tests for new functionality
- Update documentation as needed
- Run linters and type checkers

### 3. Commit Changes

Write clear, descriptive commit messages:

```bash
git add .
git commit -m "feat: add proposal voting UI

- Add VoteButton component
- Implement vote submission logic
- Add loading and error states
- Update ProposalCard to show vote buttons"
```

**Commit Message Format:**
```
<type>: <subject>

<body>

<footer>
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting)
- `refactor`: Code refactoring
- `test`: Test additions or fixes
- `chore`: Build process or auxiliary tool changes

### 4. Push and Create PR

```bash
git push origin feature/your-feature-name
```

Then create a pull request on GitHub using our [PR template](.github/PULL_REQUEST_TEMPLATE.md).

## Shared Library Guidelines

**CRITICAL:** The `shared/` folder has strict requirements. All shared code must follow these guidelines.

### When to Add Code to Shared

Add code to `shared/` when:

- ✅ Used by 2+ applications (admin, client, website)
- ✅ Clearly reusable and generic
- ✅ Part of the core design system
- ✅ Universal utility (e.g., `useDebounce`, `formatDate`)

Keep code in app folders when:

- ❌ Only one app uses it
- ❌ Contains app-specific business logic
- ❌ Requires extensive customization per app
- ❌ Experimental or not yet proven for reuse

### Shared Code Requirements

Before adding code to `shared/`, ensure:

#### 1. No App-Specific Imports

```typescript
// ❌ BAD - Imports from specific app
import { AdminService } from '@admin/services';

// ✅ GOOD - No app-specific imports
import { apiClient } from '@shared/lib';
```

#### 2. No Hardcoded App-Specific Values

```typescript
// ❌ BAD - Hardcoded for specific app
const Header = () => <div>Admin Portal</div>;

// ✅ GOOD - Accept app name as prop
const Header = ({ appName }: { appName: string }) => (
  <div>{appName}</div>
);
```

#### 3. Props for Customization

```typescript
// ❌ BAD - No customization options
const Button = ({ children }) => (
  <button className="bg-blue-500">{children}</button>
);

// ✅ GOOD - Props for variants and customization
interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const Button = ({ variant = 'primary', ...props }: ButtonProps) => {
  // Generic implementation
};
```

#### 4. Full TypeScript Types

```typescript
// ❌ BAD - No types or using 'any'
export function useDebounce(value, delay) { }

// ✅ GOOD - Full TypeScript types
export function useDebounce<T>(value: T, delay: number): T { }
```

#### 5. JSDoc Documentation

```typescript
/**
 * Debounces a rapidly changing value.
 *
 * @param value - The value to debounce
 * @param delay - Delay in milliseconds
 * @returns The debounced value
 *
 * @example
 * ```typescript
 * const debouncedSearch = useDebounce(searchTerm, 300);
 * ```
 */
export function useDebounce<T>(value: T, delay: number): T {
  // Implementation
}
```

#### 6. Comprehensive Tests

```typescript
// shared/hooks/__tests__/useDebounce.test.ts
describe('useDebounce', () => {
  it('returns initial value immediately', () => {
    // Test implementation
  });

  it('updates value after delay', async () => {
    // Test implementation
  });

  it('cancels pending update on unmount', () => {
    // Test implementation
  });
});
```

### Shared Code Checklist

Before submitting a PR with shared code changes:

- [ ] Used by 2+ apps OR clearly reusable
- [ ] No imports from app folders (admin, client, website, backend)
- [ ] No hardcoded app-specific values
- [ ] Props allow customization for all use cases
- [ ] Full TypeScript types with no `any`
- [ ] JSDoc comments with examples
- [ ] Tests with 80%+ coverage
- [ ] README documentation updated
- [ ] `npm run validate:shared` passes
- [ ] Integration tests pass in all target apps
- [ ] No breaking changes OR migration guide provided

### Validation

Run the shared code validation script before submitting:

```bash
npm run validate:shared
```

This checks for:
- App-specific imports
- Missing types
- Insufficient test coverage
- Missing documentation

## Pull Request Process

### 1. Create Pull Request

Use our [PR template](.github/PULL_REQUEST_TEMPLATE.md) and provide:

- Clear description of changes
- Type of change (feature, fix, refactor, etc.)
- Related issues
- Testing performed
- Screenshots (if UI changes)
- Breaking changes (if any)

### 2. PR Requirements

Your PR must:

- [ ] Pass all CI checks (tests, linting, type checking)
- [ ] Have no merge conflicts
- [ ] Include tests for new functionality
- [ ] Update documentation as needed
- [ ] Follow our coding standards
- [ ] Have a clear, descriptive title
- [ ] Be reviewed and approved by at least one maintainer

### 3. Shared Code PRs

If your PR modifies the `shared/` folder, also complete:

- [ ] Shared code checklist (see above)
- [ ] List which apps use this code
- [ ] Justify why it belongs in shared
- [ ] Provide migration guide if breaking changes
- [ ] Test in all affected applications

### 4. Review Process

1. **Automated Checks**: CI runs tests, linting, and validation
2. **Peer Review**: At least one team member reviews code
3. **Maintainer Approval**: Maintainer approves for merge
4. **Merge**: PR is merged to `main`

### 5. After Merge

- Monitor for any issues
- Update related documentation
- Notify team of changes (especially breaking changes)

## Coding Standards

### TypeScript

- **Use strict mode**: No `any` types without justification
- **Explicit return types**: For public functions and methods
- **Interface over type**: Prefer `interface` for object shapes
- **Type guards**: Use type guards for runtime type checking

```typescript
// ✅ GOOD
export function formatDate(date: Date): string {
  return date.toISOString();
}

// ❌ BAD
export function formatDate(date: any) {
  return date.toISOString();
}
```

### React

- **Functional components**: Use function components with hooks
- **TypeScript props**: Always type component props
- **Hooks**: Follow Rules of Hooks
- **Memoization**: Use `useMemo` and `useCallback` judiciously

```typescript
// ✅ GOOD
interface ButtonProps {
  variant: 'primary' | 'secondary';
  onClick: () => void;
  children: React.ReactNode;
}

export function Button({ variant, onClick, children }: ButtonProps) {
  return (
    <button onClick={onClick} className={`btn-${variant}`}>
      {children}
    </button>
  );
}

// ❌ BAD
export function Button(props: any) {
  return <button {...props} />;
}
```

### Code Style

- **Prettier**: Code is formatted with Prettier (runs automatically)
- **ESLint**: Follow ESLint rules (runs in CI)
- **Naming**:
  - Components: PascalCase (`Button`, `ProposalCard`)
  - Functions: camelCase (`formatDate`, `validateEmail`)
  - Constants: UPPER_SNAKE_CASE (`MAX_PAGE_SIZE`, `API_URL`)
  - Interfaces: PascalCase (`UserProfile`, `ApiResponse`)

### File Organization

- **Single Responsibility**: One component/function per file (usually)
- **Index files**: Use `index.ts` for barrel exports
- **Test files**: Co-locate with source (`Button.tsx`, `Button.test.tsx`)
- **README files**: Add README for complex directories

## Testing Requirements

### Test Coverage

- **Components**: 80% coverage minimum
- **Hooks**: 90% coverage minimum
- **Utils**: 95% coverage minimum
- **Shared code**: 85% coverage minimum

### Types of Tests

1. **Unit Tests**: Test individual functions and components
2. **Integration Tests**: Test component interaction with APIs
3. **E2E Tests**: Test user workflows (future)

### Writing Tests

```typescript
// ✅ GOOD - Descriptive test names
describe('useDebounce', () => {
  it('returns initial value immediately', () => {
    // Test
  });

  it('updates value after specified delay', async () => {
    // Test
  });

  it('cancels pending update when value changes again', () => {
    // Test
  });
});

// ❌ BAD - Vague test names
describe('useDebounce', () => {
  it('works', () => {
    // Test
  });

  it('test 2', () => {
    // Test
  });
});
```

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run specific test file
npm test -- useDebounce.test.ts
```

## Documentation

### When to Update Documentation

Update documentation when you:

- Add new shared components, hooks, or utilities
- Change existing public APIs
- Add or modify features
- Fix significant bugs
- Make breaking changes

### Documentation Files

- **README files**: For components, hooks, and utilities
- **JSDoc comments**: For all public functions and types
- **Architecture docs**: For significant architectural changes
- **Migration guides**: For breaking changes

### Documentation Standards

- **Clear and concise**: Write for developers of all levels
- **Examples**: Provide code examples for all public APIs
- **Complete**: Document all props, parameters, and return values
- **Up to date**: Keep docs in sync with code

## Getting Help

If you need help:

1. **Check documentation**: Read relevant README and guide files
2. **Search issues**: Check if your question is already answered
3. **Ask in discussions**: Start a GitHub discussion
4. **Contact maintainers**: Tag maintainers in issues or discussions

## Recognition

We value all contributions! Contributors will be:

- Listed in our contributors page
- Thanked in release notes
- Invited to join our contributor community

## License

By contributing to Aizura Consortium, you agree that your contributions will be licensed under the project's MIT License.

---

Thank you for contributing to Aizura Consortium! Your contributions help make this project better for everyone.
