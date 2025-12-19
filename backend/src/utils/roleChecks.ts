import { createClient } from '@supabase/supabase-js';
import { handleSupabaseQuery } from './supabaseErrorHandler.js';

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

export async function getUserRole(userId: string): Promise<string | null> {
  try {
    const { data, error } = await supabaseAdmin
      .from('users')
      .select('role')
      .eq('auth_user_id', userId)
      .maybeSingle();

    if (error) {
      console.error('Error fetching user role', {
        userId,
        error: error.message,
        timestamp: new Date().toISOString()
      });
      return null;
    }

    return data?.role || null;
  } catch (error: any) {
    console.error('Exception in getUserRole', {
      userId,
      error: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString()
    });
    return null;
  }
}

export async function isAdmin(userId: string): Promise<boolean> {
  const role = await getUserRole(userId);
  return role === 'admin';
}

export async function isClient(userId: string): Promise<boolean> {
  const role = await getUserRole(userId);
  return role === 'client';
}

export async function createUser(
  authUserId: string,
  email: string,
  role: 'admin' | 'client'
): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabaseAdmin
      .from('users')
      .insert({
        auth_user_id: authUserId,
        email,
        role
      });

    if (error) {
      console.error('Error creating user', {
        authUserId,
        email,
        role,
        error: error.message,
        timestamp: new Date().toISOString()
      });
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error: any) {
    console.error('Exception in createUser', {
      authUserId,
      email,
      role,
      error: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString()
    });
    return { success: false, error: error.message };
  }
}

export async function updateUserRole(
  userId: string,
  role: 'admin' | 'client'
): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabaseAdmin
      .from('users')
      .update({ role })
      .eq('auth_user_id', userId);

    if (error) {
      console.error('Error updating user role', {
        userId,
        role,
        error: error.message,
        timestamp: new Date().toISOString()
      });
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error: any) {
    console.error('Exception in updateUserRole', {
      userId,
      role,
      error: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString()
    });
    return { success: false, error: error.message };
  }
}
