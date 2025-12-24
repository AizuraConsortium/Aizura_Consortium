import { Shield } from 'lucide-react';
import { useAdminAuth } from '../contexts/AdminAuthContext';
import { LoginForm } from '@shared/components/auth/LoginForm';
import { LoginContainerWithLink } from '@shared/components/auth/LoginContainer';

export function AdminLogin() {
  const { signIn, isAdmin, user } = useAdminAuth();

  return (
    <LoginContainerWithLink
      variant="admin"
      linkText="← Back to main site"
      linkHref="/"
    >
      <LoginForm
        onSubmit={signIn}
        title="Admin Portal"
        subtitle="Sign in to access the admin dashboard"
        variant="admin"
        icon={
          <div className="bg-blue-100 p-3 rounded-full">
            <Shield className="h-8 w-8 text-blue-600" />
          </div>
        }
        footer={
          <p className="text-center text-sm text-gray-500">
            Admin access only. Unauthorized access is prohibited.
          </p>
        }
        user={user}
        isAuthenticated={isAdmin}
        emailPlaceholder="admin@example.com"
        passwordPlaceholder="Enter your password"
      />
    </LoginContainerWithLink>
  );
}
