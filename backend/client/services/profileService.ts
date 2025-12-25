import type { SupabaseClient } from '@supabase/supabase-js';
import { DatabaseService } from '../../shared/services/DatabaseService.js';
import { AirdropService } from './airdropService.js';

export interface UserProfile {
  id: string;
  email: string;
  display_name: string | null;
  bio: string | null;
  avatar_url: string | null;
  wallet_address: string | null;
  referral_code: string | null;
  created_at: string;
  updated_at: string;

  // From airdrop_leaderboard
  total_points: number;
  rank: number | null;
  tier: string | null;
  referral_count: number;

  // Social connections
  social_connections: {
    twitter: SocialConnection | null;
    discord: SocialConnection | null;
    github: SocialConnection | null;
    telegram: SocialConnection | null;
  };

  // Activity metrics
  activity: {
    total_logins: number;
    login_streak: number;
    total_votes: number;
    total_comments: number;
    total_content_submitted: number;
    total_content_approved: number;
    last_activity: string | null;
  };
}

export interface SocialConnection {
  connected: boolean;
  username: string | null;
  user_id: string | null;
  verified: boolean;
  verified_at: string | null;
}

export interface UpdateProfileData {
  display_name?: string;
  bio?: string;
  avatar_url?: string;
}

export class ProfileService extends DatabaseService {
  private airdropService: AirdropService;

  constructor(supabase: SupabaseClient) {
    super('ProfileService', supabase);
    this.airdropService = new AirdropService(supabase);
  }

  async getUserProfile(userId: string): Promise<UserProfile> {
    // Get user basic data
    const { data: userData, error: userError } = await this.supabase
      .from('users')
      .select('id, email, display_name, bio, avatar_url, wallet_address, referral_code, created_at, updated_at, login_streak, total_logins, last_login_date')
      .eq('id', userId)
      .maybeSingle();

    if (userError) throw userError;
    if (!userData) throw new Error('User not found');

    // Get airdrop leaderboard data
    const { data: leaderboardData } = await this.supabase
      .from('airdrop_leaderboard')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();

    // Get user rank
    const rank = await this.airdropService.getUserRank(userId);

    // Build social connections
    const socialConnections = {
      twitter: leaderboardData?.twitter_connected
        ? {
            connected: true,
            username: leaderboardData.twitter_username || null,
            user_id: leaderboardData.twitter_user_id || null,
            verified: !!leaderboardData.twitter_verified_at,
            verified_at: leaderboardData.twitter_verified_at || null,
          }
        : null,
      discord: leaderboardData?.discord_connected
        ? {
            connected: true,
            username: leaderboardData.discord_username || null,
            user_id: leaderboardData.discord_user_id || null,
            verified: !!leaderboardData.discord_verified_at,
            verified_at: leaderboardData.discord_verified_at || null,
          }
        : null,
      github: leaderboardData?.github_connected
        ? {
            connected: true,
            username: leaderboardData.github_username || null,
            user_id: leaderboardData.github_user_id || null,
            verified: !!leaderboardData.github_verified_at,
            verified_at: leaderboardData.github_verified_at || null,
          }
        : null,
      telegram: leaderboardData?.telegram_connected
        ? {
            connected: true,
            username: leaderboardData.telegram_username || null,
            user_id: leaderboardData.telegram_user_id || null,
            verified: !!leaderboardData.telegram_verified_at,
            verified_at: leaderboardData.telegram_verified_at || null,
          }
        : null,
    };

    // Build activity metrics
    const activity = {
      total_logins: leaderboardData?.total_logins || 0,
      login_streak: userData.login_streak || 0,
      total_votes: leaderboardData?.total_votes || 0,
      total_comments: leaderboardData?.total_comments || 0,
      total_content_submitted: leaderboardData?.total_content_submitted || 0,
      total_content_approved: leaderboardData?.total_content_approved || 0,
      last_activity: leaderboardData?.last_activity || null,
    };

    return {
      id: userData.id,
      email: userData.email,
      display_name: userData.display_name,
      bio: userData.bio,
      avatar_url: userData.avatar_url,
      wallet_address: userData.wallet_address,
      referral_code: userData.referral_code,
      created_at: userData.created_at,
      updated_at: userData.updated_at,
      total_points: leaderboardData?.score || 0,
      rank,
      tier: leaderboardData?.tier || null,
      referral_count: leaderboardData?.referral_count || 0,
      social_connections: socialConnections,
      activity,
    };
  }

  async updateProfile(userId: string, updates: UpdateProfileData): Promise<UserProfile> {
    // Validate updates
    if (updates.display_name !== undefined) {
      if (updates.display_name && updates.display_name.length > 100) {
        throw new Error('Display name must be 100 characters or less');
      }
    }

    if (updates.bio !== undefined) {
      if (updates.bio && updates.bio.length > 500) {
        throw new Error('Bio must be 500 characters or less');
      }
    }

    if (updates.avatar_url !== undefined) {
      if (updates.avatar_url && updates.avatar_url.length > 1000) {
        throw new Error('Avatar URL must be 1000 characters or less');
      }
      // Basic URL validation
      if (updates.avatar_url && !this.isValidUrl(updates.avatar_url)) {
        throw new Error('Avatar URL must be a valid URL');
      }
    }

    // Update users table
    const { error: updateError } = await this.supabase
      .from('users')
      .update({
        display_name: updates.display_name,
        bio: updates.bio,
        avatar_url: updates.avatar_url,
        updated_at: new Date().toISOString(),
      })
      .eq('id', userId);

    if (updateError) throw updateError;

    // Return updated profile
    return this.getUserProfile(userId);
  }

  private isValidUrl(url: string): boolean {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }
}
