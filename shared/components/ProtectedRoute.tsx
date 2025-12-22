import { Navigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { useProtectedRouteAuth } from '../contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
  redirectTo?: string;
  loadingMessage?: string;
}

export function ProtectedRoute({
  children,
  requireAdmin = false,
  redirectTo = '/login',
  loadingMessage = 'Verifying credentials...',
}: ProtectedRouteProps) {
  const { user, isLoading, isAdmin } = useProtectedRouteAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">{loadingMessage}</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to={redirectTo} replace />;
  }

  if (requireAdmin && !isAdmin) {
    return <Navigate to={redirectTo} replace />;
  }

  return <>{children}</>;
}
