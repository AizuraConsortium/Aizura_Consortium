import { Request, Response } from 'express';
import { BaseController } from '../../shared/controllers/BaseController.js';
import { getSupabaseClient } from '../../shared/services/supabase/client.js';
import { ProfileService, type UpdateProfileData } from '../services/profileService.js';

export class ProfileController extends BaseController {
  private profileService: ProfileService;

  constructor() {
    super('ProfileController');
    const supabase = getSupabaseClient();
    this.profileService = new ProfileService(supabase);
  }

  async getProfile(req: Request, res: Response): Promise<void> {
    try {
      const userId = this.getUserId(req);
      const profile = await this.profileService.getUserProfile(userId);
      this.ok(res, profile);
    } catch (error) {
      this.handleError(error, req, res);
    }
  }

  async updateProfile(req: Request, res: Response): Promise<void> {
    try {
      const userId = this.getUserId(req);
      const updates: UpdateProfileData = {
        display_name: req.body.display_name,
        bio: req.body.bio,
        avatar_url: req.body.avatar_url,
      };

      // Remove undefined fields
      Object.keys(updates).forEach(key => {
        if (updates[key as keyof UpdateProfileData] === undefined) {
          delete updates[key as keyof UpdateProfileData];
        }
      });

      // Validate at least one field is being updated
      if (Object.keys(updates).length === 0) {
        return this.badRequest(res, 'No fields to update');
      }

      const profile = await this.profileService.updateProfile(userId, updates);
      this.ok(res, profile);
    } catch (error) {
      this.handleError(error, req, res);
    }
  }
}
