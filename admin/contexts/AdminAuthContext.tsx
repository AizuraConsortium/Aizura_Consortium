import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase, apiClient } from '@shared/lib';
import { useSupabaseAuth } from '@shared/hooks';
import { User } from '@supabase/supabase-js';
import { ProtectedRouteAuthProvider } from '@shared/contexts/AuthContext';

interface AdminAuthContextType {
  user: User | null;
  session: any;
  isAdmin: boolean;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signOut: () => Promise<void>;
  checkAdminRole: () => Promise<boolean>;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

export function AdminAuthProvider({ children }: { children: React.ReactNode }) {
  const { user, session, loading: authLoading, signOut: baseSignOut } = useSupabaseAuth();
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
    if (authLoading) {
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
  }, [user, authLoading]);

  const signIn = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        return { success: false, error: error.message };
      }

      if (!data.user) {
        return { success: false, error: 'Login failed' };
      }

      const isUserAdmin = await checkAdminRole();

      if (!isUserAdmin) {
        await supabase.auth.signOut();
        setIsAdmin(false);
        return { success: false, error: 'Access denied. Admin privileges required.' };
      }

      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message || 'An error occurred during sign in' };
    }
  };

  const signOut = async () => {
    try {
      await baseSignOut();
      setIsAdmin(false);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <AdminAuthContext.Provider value={{ user, session, isAdmin, isLoading, signIn, signOut, checkAdminRole }}>
      <ProtectedRouteAuthProvider value={{ user, isLoading, isAdmin }}>
        {children}
      </ProtectedRouteAuthProvider>
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const context = useContext(AdminAuthContext);
  if (context === undefined) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
}
