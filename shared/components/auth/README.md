# Auth Components Documentation

This directory contains authentication-related components used across the Aizura Consortium applications. These components provide consistent authentication UI and behavior while allowing customization for different application needs.

## Table of Contents

- [Components](#components)
- [Usage Examples](#usage-examples)
- [Security Considerations](#security-considerations)
- [Customization](#customization)
- [Best Practices](#best-practices)

## Components

### LoginContainer

**Location:** `shared/components/auth/LoginContainer.tsx`

A container component that provides the layout structure for authentication pages. Handles responsive design and provides consistent branding across all auth pages.

**Props:**
```typescript
interface LoginContainerProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  showLogo?: boolean;
  className?: string;
}
```

**Features:**
- Responsive layout (mobile, tablet, desktop)
- Optional logo display
- Customizable title and subtitle
- Consistent spacing and styling
- Accessible markup

**Usage:**
```typescript
import { LoginContainer } from '@shared/components/auth';

function LoginPage() {
  return (
    <LoginContainer
      title="Welcome Back"
      subtitle="Sign in to your account"
      showLogo
    >
      <LoginForm />
    </LoginContainer>
  );
}
```

**Styling:**
- Centers content vertically and horizontally
- Maximum width of 400px for form content
- White background with shadow on desktop
- Full viewport on mobile
- Responsive padding

---

### LoginForm

**Location:** `shared/components/auth/LoginForm.tsx`

A complete login form component with email/password inputs, validation, error handling, and submission logic.

**Props:**
```typescript
interface LoginFormProps {
  onSubmit: (email: string, password: string) => Promise<void>;
  onForgotPassword?: () => void;
  onSignUp?: () => void;
  submitButtonText?: string;
  showForgotPassword?: boolean;
  showSignUpLink?: boolean;
  loading?: boolean;
  error?: string | null;
  className?: string;
}
```

**Features:**
- Email and password inputs with validation
- Show/hide password toggle
- Remember me checkbox
- Forgot password link
- Sign up link
- Loading state during submission
- Error message display
- Accessible form markup
- Keyboard navigation support

**Usage:**
```typescript
import { LoginForm } from '@shared/components/auth';
import { useNavigate } from 'react-router-dom';

function LoginPage() {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (email: string, password: string) => {
    setError(null);
    setLoading(true);

    try {
      await authService.signIn(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <LoginContainer title="Sign In">
      <LoginForm
        onSubmit={handleSubmit}
        onForgotPassword={() => navigate('/forgot-password')}
        onSignUp={() => navigate('/signup')}
        loading={loading}
        error={error}
        showForgotPassword
        showSignUpLink
      />
    </LoginContainer>
  );
}
```

**Validation:**
- Email format validation
- Password minimum length (8 characters)
- Required field validation
- Real-time validation feedback

**Accessibility:**
- Proper label associations
- Error messages linked to inputs via `aria-describedby`
- Submit button disabled during loading
- Loading state announced to screen readers
- Focus management

---

## Usage Examples

### Example 1: Admin Login

```typescript
import { LoginContainer, LoginForm } from '@shared/components/auth';
import { useAdminAuth } from '@admin/hooks';

function AdminLogin() {
  const { signIn, loading, error } = useAdminAuth();

  return (
    <LoginContainer
      title="Admin Portal"
      subtitle="Sign in to access the admin dashboard"
      showLogo
    >
      <LoginForm
        onSubmit={signIn}
        loading={loading}
        error={error}
        submitButtonText="Sign In to Admin"
        showForgotPassword={false}
        showSignUpLink={false}
      />
    </LoginContainer>
  );
}
```

**Notes:**
- Admin login typically doesn't show forgot password
- No sign-up link (admins are created by other admins)
- Custom submit button text for clarity

---

### Example 2: Client Login with Remember Me

```typescript
import { LoginContainer, LoginForm } from '@shared/components/auth';
import { useLocalStorage } from '@shared/hooks';
import { useState } from 'react';

function ClientLogin() {
  const [rememberEmail, setRememberEmail] = useLocalStorage('remember-email', '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (email: string, password: string) => {
    setLoading(true);
    setError(null);

    try {
      await authService.signIn(email, password);

      if (rememberMe) {
        setRememberEmail(email);
      } else {
        setRememberEmail('');
      }

      navigate('/dashboard');
    } catch (err) {
      setError('Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <LoginContainer
      title="Client Portal"
      subtitle="Access your proposals and voting dashboard"
    >
      <LoginForm
        onSubmit={handleSubmit}
        loading={loading}
        error={error}
        defaultEmail={rememberEmail}
        showForgotPassword
        showSignUpLink
      />
    </LoginContainer>
  );
}
```

**Notes:**
- Uses `useLocalStorage` to remember email (not password!)
- Provides default email value from localStorage
- Full auth features for client users

---

### Example 3: Custom Styled Login

```typescript
import { LoginContainer, LoginForm } from '@shared/components/auth';

function CustomStyledLogin() {
  return (
    <LoginContainer
      className="bg-gradient-to-br from-blue-500 to-purple-600"
      title="Welcome"
      subtitle="Your governance platform"
    >
      <div className="bg-white rounded-lg shadow-xl p-8">
        <LoginForm
          onSubmit={handleSubmit}
          submitButtonText="Enter Platform"
          className="space-y-6"
        />

        <div className="mt-6 text-center text-sm text-gray-600">
          <p>By signing in, you agree to our Terms of Service</p>
        </div>
      </div>
    </LoginContainer>
  );
}
```

**Notes:**
- Custom background gradient on container
- Nested div for additional styling control
- Custom button text
- Additional legal text below form

---

### Example 4: Login with Social Providers

```typescript
import { LoginContainer, LoginForm } from '@shared/components/auth';
import { Button } from '@shared/components';

function LoginWithSocial() {
  const handleEmailLogin = async (email: string, password: string) => {
    await authService.signInWithEmail(email, password);
  };

  const handleGoogleLogin = async () => {
    await authService.signInWithGoogle();
  };

  const handleGitHubLogin = async () => {
    await authService.signInWithGitHub();
  };

  return (
    <LoginContainer title="Sign In">
      <div className="space-y-4">
        <Button
          onClick={handleGoogleLogin}
          variant="secondary"
          className="w-full"
        >
          Continue with Google
        </Button>

        <Button
          onClick={handleGitHubLogin}
          variant="secondary"
          className="w-full"
        >
          Continue with GitHub
        </Button>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">Or</span>
          </div>
        </div>

        <LoginForm
          onSubmit={handleEmailLogin}
          showSignUpLink
        />
      </div>
    </LoginContainer>
  );
}
```

**Notes:**
- Social login buttons above email/password form
- Visual separator between social and email login
- Consistent button widths
- Social providers use app-specific logic

---

## Security Considerations

### Password Handling

**DO:**
- Use `type="password"` for password inputs
- Provide show/hide password toggle
- Validate password strength on client
- Send passwords over HTTPS only
- Use Supabase or similar secure auth service

**DON'T:**
- Store passwords in localStorage or state
- Log passwords to console
- Send passwords in URL parameters
- Remember passwords (only remember email)
- Use custom password hashing (use Supabase)

### Error Messages

**DO:**
- Show generic error messages: "Invalid email or password"
- Rate limit login attempts on backend
- Log failed login attempts for security monitoring

**DON'T:**
- Reveal whether email exists: "Email not found"
- Show specific errors: "Wrong password"
- Expose system details in errors

### Session Management

**DO:**
- Use Supabase session management
- Implement session timeout
- Refresh tokens automatically
- Clear session on logout

**DON'T:**
- Store auth tokens in localStorage (Supabase handles this)
- Extend sessions indefinitely
- Share sessions across tabs unsafely

---

## Customization

### Styling Props

All auth components accept a `className` prop for custom styling:

```typescript
<LoginForm
  className="custom-form-class"
  onSubmit={handleSubmit}
/>
```

### Custom Submit Button

Override the submit button text:

```typescript
<LoginForm
  submitButtonText="Access Dashboard"
  onSubmit={handleSubmit}
/>
```

### Conditional Features

Show/hide features based on application needs:

```typescript
<LoginForm
  showForgotPassword={false}  // Hide for admin
  showSignUpLink={true}        // Show for public
  onSubmit={handleSubmit}
/>
```

### Custom Validation

Add custom validation logic:

```typescript
function LoginPage() {
  const [emailError, setEmailError] = useState('');

  const handleSubmit = async (email: string, password: string) => {
    if (!email.endsWith('@company.com')) {
      setEmailError('Must use company email');
      return;
    }

    await authService.signIn(email, password);
  };

  return (
    <LoginForm
      onSubmit={handleSubmit}
      error={emailError}
    />
  );
}
```

---

## Best Practices

### 1. Error Handling

Always handle errors gracefully:

```typescript
const handleSubmit = async (email: string, password: string) => {
  try {
    await authService.signIn(email, password);
  } catch (error) {
    if (error.message.includes('rate limit')) {
      setError('Too many attempts. Please try again later.');
    } else if (error.message.includes('network')) {
      setError('Network error. Please check your connection.');
    } else {
      setError('Invalid email or password.');
    }
  }
};
```

### 2. Loading States

Show loading state during authentication:

```typescript
<LoginForm
  onSubmit={handleSubmit}
  loading={isAuthenticating}
  // Button disabled, spinner shown
/>
```

### 3. Redirects

Redirect after successful authentication:

```typescript
const handleSubmit = async (email: string, password: string) => {
  await authService.signIn(email, password);
  const redirectTo = searchParams.get('redirect') || '/dashboard';
  navigate(redirectTo);
};
```

### 4. Remember Me

Only remember email, never password:

```typescript
const [rememberEmail, setRememberEmail] = useLocalStorage('email', '');

const handleSubmit = async (email: string, password: string) => {
  await authService.signIn(email, password);
  if (rememberMe) {
    setRememberEmail(email);  // Only email!
  }
};
```

### 5. Accessibility

Ensure proper focus management:

```typescript
useEffect(() => {
  if (error) {
    errorRef.current?.focus();
  }
}, [error]);
```

### 6. Rate Limiting

Implement client-side rate limiting:

```typescript
const [attempts, setAttempts] = useState(0);
const [lockoutUntil, setLockoutUntil] = useState<Date | null>(null);

const handleSubmit = async (email: string, password: string) => {
  if (lockoutUntil && new Date() < lockoutUntil) {
    setError('Too many attempts. Please wait.');
    return;
  }

  try {
    await authService.signIn(email, password);
    setAttempts(0);
  } catch (error) {
    setAttempts(prev => prev + 1);

    if (attempts >= 5) {
      setLockoutUntil(new Date(Date.now() + 5 * 60 * 1000)); // 5 min
      setError('Too many failed attempts. Locked for 5 minutes.');
    }
  }
};
```

---

## Testing

### Unit Tests

```typescript
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { LoginForm } from '@shared/components/auth';

describe('LoginForm', () => {
  it('submits with email and password', async () => {
    const onSubmit = jest.fn();
    render(<LoginForm onSubmit={onSubmit} />);

    fireEvent.change(screen.getByLabelText('Email'), {
      target: { value: 'test@example.com' }
    });
    fireEvent.change(screen.getByLabelText('Password'), {
      target: { value: 'password123' }
    });
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }));

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith('test@example.com', 'password123');
    });
  });

  it('shows error message', () => {
    render(<LoginForm onSubmit={jest.fn()} error="Invalid credentials" />);
    expect(screen.getByText('Invalid credentials')).toBeInTheDocument();
  });

  it('disables submit during loading', () => {
    render(<LoginForm onSubmit={jest.fn()} loading />);
    expect(screen.getByRole('button', { name: /sign in/i })).toBeDisabled();
  });
});
```

### Integration Tests

```typescript
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { LoginPage } from '@admin/pages';
import { authService } from '@admin/services';

jest.mock('@admin/services/authService');

describe('LoginPage', () => {
  it('authenticates and redirects on success', async () => {
    const mockSignIn = jest.fn().mockResolvedValue({ success: true });
    authService.signIn = mockSignIn;

    render(<LoginPage />);

    fireEvent.change(screen.getByLabelText('Email'), {
      target: { value: 'admin@example.com' }
    });
    fireEvent.change(screen.getByLabelText('Password'), {
      target: { value: 'adminpass' }
    });
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }));

    await waitFor(() => {
      expect(mockSignIn).toHaveBeenCalledWith('admin@example.com', 'adminpass');
      expect(window.location.pathname).toBe('/dashboard');
    });
  });
});
```

---

## See Also

- [Shared Components Catalog](../README.md)
- [Supabase Auth Documentation](https://supabase.com/docs/guides/auth)
- [WCAG 2.1 Authentication Guidelines](https://www.w3.org/WAI/WCAG21/Understanding/)
- [OWASP Authentication Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html)
