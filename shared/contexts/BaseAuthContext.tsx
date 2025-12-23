import React, { createContext, useContext, useCallback } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@shared/lib/supabase';
import { useAuthBase } from '@shared/hooks/useAuthBase';
import type {
  BaseAuthContextType,
  AuthResult,
  AuthError,
  AuthHookCallbacks
} from '@shared/types/auth';

export interface BaseAuthProviderProps {
  children: React.ReactNode;
  callbacks?: AuthHookCallbacks;
  onSignIn?: (email: string, password: string, user: User, session: Session) => Promise<AuthResult | void>;
  onSignOut?: () => Promise<void>;
}

export interface BaseAuthContextValue extends BaseAuthContextType {
  executeSignIn: (email: string, password: string) => Promise<AuthResult>;
  executeSignOut: () => Promise<void>;
}

const BaseAuthContext = createContext<BaseAuthContextValue | undefined>(undefined);

export function BaseAuthProvider({ children, callbacks, onSignIn, onSignOut }: BaseAuthProviderProps) {
  const { user, session, isLoading } = useAuthBase(callbacks);

  const executeSignIn = useCallback(async (email: string, password: string): Promise<AuthResult> => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        const authError: AuthError = new Error(error.message) as AuthError;
        authError.code = error.status?.toString();
        authError.status = error.status;

        if (callbacks?.onSignInError) {
          callbacks.onSignInError(authError);
        }

        return { success: false, error: error.message };
      }

      if (!data.user || !data.session) {
        const authError: AuthError = new Error('No user or session returned') as AuthError;

        if (callbacks?.onSignInError) {
          callbacks.onSignInError(authError);
        }

        return { success: false, error: 'Login failed' };
      }

      if (onSignIn) {
        const result = await onSignIn(email, password, data.user, data.session);
        if (result && !result.success) {
          return result;
        }
      }

      if (callbacks?.onSignInSuccess) {
        await callbacks.onSignInSuccess(data.user, data.session);
      }

      return { success: true };
    } catch (error: any) {
      const authError: AuthError = error instanceof Error ? error as AuthError : new Error(error.message || 'An error occurred during sign in') as AuthError;

      if (callbacks?.onSignInError) {
        callbacks.onSignInError(authError);
      }

      return { success: false, error: authError.message };
    }
  }, [callbacks, onSignIn]);

  const executeSignOut = useCallback(async () => {
    try {
      await supabase.auth.signOut();

      if (onSignOut) {
        await onSignOut();
      }

      if (callbacks?.onSignOutSuccess) {
        await callbacks.onSignOutSuccess();
      }
    } catch (error) {
      const authError: AuthError = error instanceof Error ? error as AuthError : new Error('Error signing out') as AuthError;

      if (callbacks?.onSignOutError) {
        callbacks.onSignOutError(authError);
      }

      console.error('Error signing out:', authError);
    }
  }, [callbacks, onSignOut]);

  const signIn = useCallback(async (email: string, password: string): Promise<AuthResult> => {
    return executeSignIn(email, password);
  }, [executeSignIn]);

  const signOut = useCallback(async () => {
    await executeSignOut();
  }, [executeSignOut]);

  const value: BaseAuthContextValue = {
    user,
    session,
    isLoading,
    signIn,
    signOut,
    executeSignIn,
    executeSignOut
  };

  return (
    <BaseAuthContext.Provider value={value}>
      {children}
    </BaseAuthContext.Provider>
  );
}

export function useBaseAuth(): BaseAuthContextValue {
  const context = useContext(BaseAuthContext);
  if (context === undefined) {
    throw new Error('useBaseAuth must be used within a BaseAuthProvider');
  }
  return context;
}
