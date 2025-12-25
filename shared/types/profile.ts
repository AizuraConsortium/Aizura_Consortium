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

  total_points: number;
  rank: number | null;
  tier: string | null;
  referral_count: number;

  social_connections: {
    twitter: SocialConnection | null;
    discord: SocialConnection | null;
    github: SocialConnection | null;
    telegram: SocialConnection | null;
  };

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

export interface Achievement {
  id: string;
  type: 'tier' | 'achievement';
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlocked_at: string | null;
  progress?: number;
}

export interface ProfileStats {
  totalPoints: number;
  rank: number | null;
  percentile: number | null;
  tier: string | null;
  referralCount: number;
  activeStreak: number;
}
