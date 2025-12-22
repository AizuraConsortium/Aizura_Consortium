import React, { createContext, useContext } from 'react';
import { User } from '@supabase/supabase-js';

export interface ProtectedRouteAuthContextValue {
  user: User | null;
  isLoading: boolean;
  isAdmin?: boolean;
}

const ProtectedRouteAuthContext = createContext<ProtectedRouteAuthContextValue | undefined>(undefined);

export interface ProtectedRouteAuthProviderProps {
  value: ProtectedRouteAuthContextValue;
  children: React.ReactNode;
}

export function ProtectedRouteAuthProvider({ value, children }: ProtectedRouteAuthProviderProps) {
  return (
    <ProtectedRouteAuthContext.Provider value={value}>
      {children}
    </ProtectedRouteAuthContext.Provider>
  );
}

export function useProtectedRouteAuth(): ProtectedRouteAuthContextValue {
  const context = useContext(ProtectedRouteAuthContext);
  if (context === undefined) {
    throw new Error('useProtectedRouteAuth must be used within a ProtectedRouteAuthProvider');
  }
  return context;
}
