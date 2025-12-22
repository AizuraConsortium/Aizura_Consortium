import {
  getUsersWithFilters,
  getUserByAuthId,
  getUserByEmail,
  createUser,
  updateUserRole,
  deleteUserById,
  getUserStats,
  type UserFilters,
  type PaginatedUsers,
} from '../../shared/services/supabase/repositories/users.js';
import { query } from '../../shared/services/supabase/queryBuilder.js';
import type { Database } from '../../../shared/types/database.types.js';

type User = Database['public']['Tables']['users']['Row'];

export class UserService {
  async getUsers(filters: UserFilters): Promise<PaginatedUsers> {
    return getUsersWithFilters(filters);
  }

  async getUserByAuthId(authUserId: string): Promise<User | null> {
    return getUserByAuthId(authUserId);
  }

  async getUserByEmail(email: string): Promise<User | null> {
    return getUserByEmail(email);
  }

  async createUser(userData: {
    auth_user_id: string;
    email: string;
    role: 'admin' | 'client';
  }): Promise<{ success: boolean; user?: User; error?: string }> {
    try {
      const existingUser = await getUserByEmail(userData.email);
      if (existingUser) {
        return {
          success: false,
          error: 'User with this email already exists',
        };
      }

      const user = await createUser(userData);
      return {
        success: true,
        user,
      };
    } catch (error) {
      console.error('Error creating user:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  async updateUserRole(
    authUserId: string,
    role: 'admin' | 'client'
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const user = await getUserByAuthId(authUserId);
      if (!user) {
        return {
          success: false,
          error: 'User not found',
        };
      }

      if (user.role === 'admin' && role === 'client') {
        const stats = await getUserStats();
        if (stats.byRole.admin <= 1) {
          return {
            success: false,
            error: 'Cannot remove the last admin user',
          };
        }
      }

      await updateUserRole(authUserId, role);
      return { success: true };
    } catch (error) {
      console.error('Error updating user role:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  async deleteUser(
    userId: string
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const { data: user, error } = await query('users')
        .select('role')
        .eq('id', userId)
        .single();

      if (error || !user) {
        return {
          success: false,
          error: 'User not found',
        };
      }

      if (user.role === 'admin') {
        const stats = await getUserStats();
        if (stats.byRole.admin <= 1) {
          return {
            success: false,
            error: 'Cannot delete the last admin user',
          };
        }
      }

      await deleteUserById(userId);
      return { success: true };
    } catch (error) {
      console.error('Error deleting user:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  async getUserStats() {
    return getUserStats();
  }
}
