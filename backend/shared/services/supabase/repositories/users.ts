import { create, getMany, getOne, updateWhere, deleteById, query } from '../queryBuilder.js';
import type { Database } from '../../../../../shared/types/database.types.js';

type User = Database['public']['Tables']['users']['Row'];
type UserInsert = Database['public']['Tables']['users']['Insert'];
type UserUpdate = Database['public']['Tables']['users']['Update'];

export interface UserFilters {
  role?: 'admin' | 'client';
  email?: string;
  limit?: number;
  offset?: number;
}

export interface PaginatedUsers {
  users: User[];
  total: number;
  limit: number;
  offset: number;
}

export async function getUsersWithFilters(filters: UserFilters): Promise<PaginatedUsers> {
  let queryBuilder = query('users')
    .select('*', { count: 'exact' })
    .order('created_at', { ascending: false });

  if (filters.role) {
    queryBuilder = queryBuilder.eq('role', filters.role);
  }

  if (filters.email) {
    queryBuilder = queryBuilder.ilike('email', `%${filters.email}%`);
  }

  const limit = filters.limit || 50;
  const offset = filters.offset || 0;

  queryBuilder = queryBuilder.range(offset, offset + limit - 1);

  const { data, error, count } = await queryBuilder;

  if (error) throw error;

  return {
    users: data || [],
    total: count || 0,
    limit,
    offset,
  };
}

export async function getUserByAuthId(authUserId: string): Promise<User | null> {
  return getOne<User>('users', { auth_user_id: authUserId });
}

export async function getUserByEmail(email: string): Promise<User | null> {
  return getOne<User>('users', { email });
}

export async function createUser(userData: {
  auth_user_id: string;
  email: string;
  role: 'admin' | 'client';
}): Promise<User> {
  const insertData: UserInsert = {
    auth_user_id: userData.auth_user_id,
    email: userData.email,
    role: userData.role,
  };

  return create<User>('users', insertData);
}

export async function updateUserRole(
  authUserId: string,
  role: 'admin' | 'client'
): Promise<void> {
  const updateData: Partial<User> = {
    role,
    updated_at: new Date().toISOString(),
  };

  return updateWhere<User>('users', { auth_user_id: authUserId }, updateData);
}

export async function deleteUserById(userId: string): Promise<void> {
  return deleteById('users', userId);
}

export async function getUserStats(): Promise<{
  total: number;
  byRole: {
    admin: number;
    client: number;
  };
}> {
  const { data, error } = await query('users')
    .select('role');

  if (error) throw error;

  const stats = {
    total: data?.length || 0,
    byRole: {
      admin: 0,
      client: 0,
    },
  };

  data?.forEach((user: { role: string }) => {
    if (user.role === 'admin') stats.byRole.admin++;
    if (user.role === 'client') stats.byRole.client++;
  });

  return stats;
}
