import { useState, useEffect, useRef } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@shared/lib';
import type { BaseAuthState, AuthHookCallbacks } from '@shared/types/auth';

export function useAuthBase(callbacks: AuthHookCallbacks = {}): BaseAuthState {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const callbacksRef = useRef(callbacks);

  useEffect(() => {
    callbacksRef.current = callbacks;
  }, [callbacks]);

  useEffect(() => {
    let mounted = true;

    const initializeAuth = async () => {
      try {
        const { data: { session: initialSession } } = await supabase.auth.getSession();

        if (!mounted) return;

        const initialUser = initialSession?.user ?? null;

        setUser(initialUser);
        setSession(initialSession);

        if (callbacksRef.current.onUserChange) {
          callbacksRef.current.onUserChange(initialUser);
        }
        if (callbacksRef.current.onSessionChange) {
          callbacksRef.current.onSessionChange(initialSession);
        }
        if (callbacksRef.current.onAuthStateChange) {
          callbacksRef.current.onAuthStateChange(initialUser, initialSession);
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    initializeAuth();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, newSession) => {
      if (!mounted) return;

      const newUser = newSession?.user ?? null;

      setUser(newUser);
      setSession(newSession);
      setIsLoading(false);

      if (callbacksRef.current.onUserChange) {
        callbacksRef.current.onUserChange(newUser);
      }
      if (callbacksRef.current.onSessionChange) {
        callbacksRef.current.onSessionChange(newSession);
      }
      if (callbacksRef.current.onAuthStateChange) {
        callbacksRef.current.onAuthStateChange(newUser, newSession);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  return {
    user,
    session,
    isLoading
  };
}
