import React, { createContext, useContext, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@shared/lib';
import { BaseAuthProvider, useBaseAuth } from '@shared/contexts/BaseAuthContext';
import { ProtectedRouteAuthProvider } from '@shared/contexts/AuthContext';
import { setUserContext, setSessionContext, logComponentError } from '../lib/logging/errorLogger';
import type { AuthResult, AuthHookCallbacks } from '@shared/types/auth';

interface ClientAuthContextType {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<AuthResult>;
  signUp: (email: string, password: string) => Promise<AuthResult>;
  signOut: () => Promise<void>;
}

const ClientAuthContext = createContext<ClientAuthContextType | undefined>(undefined);

function ClientAuthProviderInner({ children }: { children: React.ReactNode }) {
  const { user, session, isLoading, executeSignIn, executeSignOut } = useBaseAuth();

  useEffect(() => {
    setUserContext(user?.id || null);
    setSessionContext(session?.access_token || null);
  }, [user, session]);

  const signIn = async (email: string, password: string): Promise<AuthResult> => {
    return executeSignIn(email, password);
  };

  const signUp = async (email: string, password: string): Promise<AuthResult> => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password
      });

      if (error) {
        logComponentError(error, 'AuthContext', 'signUp', { email });
        return { success: false, error: error.message };
      }

      if (!data.user) {
        logComponentError(new Error('No user returned'), 'AuthContext', 'signUp', { email });
        return { success: false, error: 'Signup failed' };
      }

      return { success: true };
    } catch (error: any) {
      logComponentError(error, 'AuthContext', 'signUp', { email });
      return { success: false, error: error.message || 'An error occurred during sign up' };
    }
  };

  const signOut = async () => {
    await executeSignOut();
    setUserContext(null);
    setSessionContext(null);
  };

  return (
    <ClientAuthContext.Provider value={{ user, session, isLoading, signIn, signUp, signOut }}>
      <ProtectedRouteAuthProvider value={{ user, isLoading, isAdmin: false }}>
        {children}
      </ProtectedRouteAuthProvider>
    </ClientAuthContext.Provider>
  );
}

const authCallbacks: AuthHookCallbacks = {
  onSignInError: (error) => {
    logComponentError(error, 'AuthContext', 'signIn');
  },
  onSignOutError: (error) => {
    logComponentError(error, 'AuthContext', 'signOut');
  }
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  return (
    <BaseAuthProvider callbacks={authCallbacks}>
      <ClientAuthProviderInner>{children}</ClientAuthProviderInner>
    </BaseAuthProvider>
  );
}

export function useAuth() {
  const context = useContext(ClientAuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
