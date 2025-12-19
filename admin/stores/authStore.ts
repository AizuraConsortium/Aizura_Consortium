import type { Database } from '../types/database.types';

type User = Database['public']['Tables']['users']['Row'];

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
}

let authState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
};

const listeners: Set<() => void> = new Set();

export const authStore = {
  getState: () => authState,

  setUser: (user: User | null, token: string | null) => {
    authState = {
      user,
      token,
      isAuthenticated: !!user && !!token,
    };
    listeners.forEach((listener) => listener());
  },

  logout: () => {
    authState = {
      user: null,
      token: null,
      isAuthenticated: false,
    };
    listeners.forEach((listener) => listener());
  },

  subscribe: (listener: () => void) => {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },
};

export const useAuthStore = () => {
  const [state, setState] = React.useState(authStore.getState());

  React.useEffect(() => {
    return authStore.subscribe(() => {
      setState(authStore.getState());
    });
  }, []);

  return state;
};

import React from 'react';
