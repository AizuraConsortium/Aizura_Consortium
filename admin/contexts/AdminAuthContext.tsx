import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@shared/lib/supabase';
import { apiClient } from '@shared/lib/apiClient';
import { BaseAuthProvider, useBaseAuth } from '@shared/contexts/BaseAuthContext';
import { ProtectedRouteAuthProvider } from '@shared/contexts/AuthContext';
import type { AuthResult } from '@shared/types/auth';

interface AdminAuthContextType {
  user: User | null;
  session: Session | null;
  isAdmin: boolean;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<AuthResult>;
  signOut: () => Promise<void>;
  checkAdminRole: () => Promise<boolean>;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

function AdminAuthProviderInner({ children }: { children: React.ReactNode }) {
  const { user, session, isLoading: baseLoading, executeSignIn, executeSignOut } = useBaseAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const checkAdminRole = async (): Promise<boolean> => {
    try {
      if (!session?.user) {
        setIsAdmin(false);
        return false;
      }

      await apiClient.get('/admin/errors/admin?limit=1', session.access_token);
      setIsAdmin(true);
      return true;
    } catch (error: any) {
      if (error.status === 403 || error.status === 401) {
        setIsAdmin(false);
        return false;
      }
      console.error('Error checking admin role:', error);
      setIsAdmin(false);
      return false;
    }
  };

  useEffect(() => {
    if (baseLoading) {
      return;
    }

    const initAdminCheck = async () => {
      if (user) {
        await checkAdminRole();
      } else {
        setIsAdmin(false);
      }
      setIsLoading(false);
    };

    initAdminCheck();
  }, [user, baseLoading]);

  const signIn = async (email: string, password: string): Promise<AuthResult> => {
    const result = await executeSignIn(email, password);

    if (!result.success) {
      return result;
    }

    const isUserAdmin = await checkAdminRole();

    if (!isUserAdmin) {
      await supabase.auth.signOut();
      setIsAdmin(false);
      return { success: false, error: 'Access denied. Admin privileges required.' };
    }

    return { success: true };
  };

  const signOut = async () => {
    await executeSignOut();
    setIsAdmin(false);
  };

  return (
    <AdminAuthContext.Provider value={{ user, session, isAdmin, isLoading, signIn, signOut, checkAdminRole }}>
      <ProtectedRouteAuthProvider value={{ user, isLoading, isAdmin }}>
        {children}
      </ProtectedRouteAuthProvider>
    </AdminAuthContext.Provider>
  );
}

export function AdminAuthProvider({ children }: { children: React.ReactNode }) {
  return (
    <BaseAuthProvider>
      <AdminAuthProviderInner>{children}</AdminAuthProviderInner>
    </BaseAuthProvider>
  );
}

export function useAdminAuth() {
  const context = useContext(AdminAuthContext);
  if (context === undefined) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
}
