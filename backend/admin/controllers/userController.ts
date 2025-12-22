import { Request, Response } from 'express';
import { UserService } from '../services/userService.js';

export class UserController {
  private userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  async getUsers(req: Request, res: Response) {
    try {
      const filters = {
        role: req.query.role as 'admin' | 'client' | undefined,
        email: req.query.email as string | undefined,
        limit: parseInt(req.query.limit as string) || 50,
        offset: parseInt(req.query.offset as string) || 0,
      };

      const result = await this.userService.getUsers(filters);
      res.json(result);
    } catch (error) {
      console.error('Error fetching users:', error);
      res.status(500).json({ error: 'Failed to fetch users' });
    }
  }

  async getUserStats(req: Request, res: Response) {
    try {
      const stats = await this.userService.getUserStats();
      res.json(stats);
    } catch (error) {
      console.error('Error fetching user stats:', error);
      res.status(500).json({ error: 'Failed to fetch user statistics' });
    }
  }

  async createUser(req: Request, res: Response) {
    try {
      const { auth_user_id, email, role } = req.body;

      if (!auth_user_id || !email || !role) {
        return res.status(400).json({
          error: 'Missing required fields: auth_user_id, email, role',
        });
      }

      if (role !== 'admin' && role !== 'client') {
        return res.status(400).json({
          error: 'Role must be either "admin" or "client"',
        });
      }

      const result = await this.userService.createUser({ auth_user_id, email, role });

      if (!result.success) {
        return res.status(400).json({ error: result.error });
      }

      if (req.logAdminAction) {
        await req.logAdminAction({
          actionType: 'user_create',
          resourceType: 'user',
          resourceId: result.user?.id,
          actionDetails: {
            email,
            role,
          },
          success: true,
        });
      }

      res.status(201).json({ success: true, user: result.user });
    } catch (error) {
      console.error('Error creating user:', error);

      if (req.logAdminAction) {
        await req.logAdminAction({
          actionType: 'user_create',
          resourceType: 'user',
          actionDetails: req.body,
          success: false,
          errorMessage: error instanceof Error ? error.message : 'Unknown error',
        });
      }

      res.status(500).json({ error: 'Failed to create user' });
    }
  }

  async updateUserRole(req: Request, res: Response) {
    try {
      const { userId } = req.params;
      const { role } = req.body;

      if (!role) {
        return res.status(400).json({ error: 'Missing required field: role' });
      }

      if (role !== 'admin' && role !== 'client') {
        return res.status(400).json({
          error: 'Role must be either "admin" or "client"',
        });
      }

      const result = await this.userService.updateUserRole(userId, role);

      if (!result.success) {
        return res.status(400).json({ error: result.error });
      }

      if (req.logAdminAction) {
        await req.logAdminAction({
          actionType: 'user_role_update',
          resourceType: 'user',
          resourceId: userId,
          actionDetails: {
            newRole: role,
          },
          success: true,
        });
      }

      res.json({ success: true });
    } catch (error) {
      console.error('Error updating user role:', error);

      if (req.logAdminAction) {
        await req.logAdminAction({
          actionType: 'user_role_update',
          resourceType: 'user',
          resourceId: req.params.userId,
          actionDetails: { role: req.body.role },
          success: false,
          errorMessage: error instanceof Error ? error.message : 'Unknown error',
        });
      }

      res.status(500).json({ error: 'Failed to update user role' });
    }
  }

  async deleteUser(req: Request, res: Response) {
    try {
      const { userId } = req.params;

      const result = await this.userService.deleteUser(userId);

      if (!result.success) {
        return res.status(400).json({ error: result.error });
      }

      if (req.logAdminAction) {
        await req.logAdminAction({
          actionType: 'user_delete',
          resourceType: 'user',
          resourceId: userId,
          success: true,
        });
      }

      res.json({ success: true });
    } catch (error) {
      console.error('Error deleting user:', error);

      if (req.logAdminAction) {
        await req.logAdminAction({
          actionType: 'user_delete',
          resourceType: 'user',
          resourceId: req.params.userId,
          success: false,
          errorMessage: error instanceof Error ? error.message : 'Unknown error',
        });
      }

      res.status(500).json({ error: 'Failed to delete user' });
    }
  }
}
