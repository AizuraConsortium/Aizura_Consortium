import { User, Session } from '@supabase/supabase-js';

export interface BaseAuthState {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
}

export interface AuthResult {
  success: boolean;
  error?: string;
}

export interface AuthError extends Error {
  code?: string;
  status?: number;
}

export interface BaseAuthContextType extends BaseAuthState {
  signIn: (email: string, password: string) => Promise<AuthResult>;
  signOut: () => Promise<void>;
}

export interface AuthHookCallbacks {
  onUserChange?: (user: User | null) => void;
  onSessionChange?: (session: Session | null) => void;
  onAuthStateChange?: (user: User | null, session: Session | null) => void;
  onSignInSuccess?: (user: User, session: Session) => Promise<void> | void;
  onSignInError?: (error: AuthError) => void;
  onSignOutSuccess?: () => Promise<void> | void;
  onSignOutError?: (error: AuthError) => void;
}

export interface AuthConfig {
  persistSession?: boolean;
  autoRefreshToken?: boolean;
  detectSessionInUrl?: boolean;
}
