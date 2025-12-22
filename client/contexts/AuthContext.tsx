import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@shared/lib';
import { User, Session } from '@supabase/supabase-js';
import { setUserContext, setSessionContext, logComponentError } from '../lib/logging/errorLogger';
import { ProtectedRouteAuthProvider } from '@shared/contexts/AuthContext';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signUp: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setUserContext(user?.id || null);
    setSessionContext(session?.access_token || null);
  }, [user, session]);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setSession(session);
      setIsLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setSession(session);
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        logComponentError(error, 'AuthContext', 'signIn', { email });
        return { success: false, error: error.message };
      }

      if (!data.user) {
        logComponentError(new Error('No user returned'), 'AuthContext', 'signIn', { email });
        return { success: false, error: 'Login failed' };
      }

      return { success: true };
    } catch (error: any) {
      logComponentError(error, 'AuthContext', 'signIn', { email });
      return { success: false, error: error.message || 'An error occurred during sign in' };
    }
  };

  const signUp = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
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
    try {
      await supabase.auth.signOut();
      setUser(null);
      setUserContext(null);
      setSessionContext(null);
    } catch (error) {
      logComponentError(error, 'AuthContext', 'signOut');
    }
  };

  return (
    <AuthContext.Provider value={{ user, session, isLoading, signIn, signUp, signOut }}>
      <ProtectedRouteAuthProvider value={{ user, isLoading, isAdmin: false }}>
        {children}
      </ProtectedRouteAuthProvider>
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
