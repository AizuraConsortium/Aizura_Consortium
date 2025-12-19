import { Navigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { useAdminAuth as useAdminAuthAdmin } from '../../admin/contexts/AdminAuthContext';
import { useAuth as useAuthClient } from '../../client/contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
  redirectTo?: string;
  loadingMessage?: string;
  authContextType: 'admin' | 'client';
}

export function ProtectedRoute({
  children,
  requireAdmin = false,
  redirectTo,
  loadingMessage,
  authContextType,
}: ProtectedRouteProps) {
  let user: any = null;
  let isLoading = false;
  let isAdmin = false;
  let defaultRedirect = '/login';

  if (authContextType === 'admin') {
    const auth = useAdminAuthAdmin();
    user = auth.user;
    isLoading = auth.isLoading;
    isAdmin = auth.isAdmin;
    defaultRedirect = '/login';
  } else if (authContextType === 'client') {
    const auth = useAuthClient();
    user = auth.user;
    isLoading = auth.isLoading;
    defaultRedirect = '/login';
  }

  const redirect = redirectTo || defaultRedirect;
  const message = loadingMessage || 'Verifying credentials...';

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">{message}</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to={redirect} replace />;
  }

  if (requireAdmin && !isAdmin) {
    return <Navigate to={redirect} replace />;
  }

  return <>{children}</>;
}
