import type { SupabaseClient } from '@supabase/supabase-js';
import { DatabaseService } from '../../shared/services/DatabaseService.js';
import { PointCalculator } from '../../shared/utils/pointCalculator.js';

export type SocialPlatform = 'twitter' | 'discord' | 'telegram' | 'github';

export interface SocialConnection {
  platform: SocialPlatform;
  connected: boolean;
  userId?: string;
  username?: string;
  verifiedAt?: string;
  following?: boolean;
}

export interface OAuthState {
  userId: string;
  platform: SocialPlatform;
  returnUrl?: string;
  timestamp: number;
}

export class SocialAuthService extends DatabaseService {
  private readonly OFFICIAL_ACCOUNTS = {
    twitter: process.env.OFFICIAL_TWITTER_ID || 'AizuraAI',
    discord: process.env.OFFICIAL_DISCORD_SERVER_ID || '',
    telegram: process.env.OFFICIAL_TELEGRAM_CHANNEL || '',
  };

  constructor(supabase: SupabaseClient) {
    super('SocialAuthService', supabase);
  }

  async initiateTwitterAuth(userId: string, returnUrl?: string): Promise<string> {
    const state = this.encodeState({ userId, platform: 'twitter', returnUrl, timestamp: Date.now() });

    const twitterClientId = process.env.TWITTER_CLIENT_ID;
    const redirectUri = `${process.env.API_BASE_URL}/api/client/oauth/twitter/callback`;

    if (!twitterClientId) {
      throw new Error('Twitter OAuth not configured');
    }

    const params = new URLSearchParams({
      response_type: 'code',
      client_id: twitterClientId,
      redirect_uri: redirectUri,
      scope: 'tweet.read users.read follows.read',
      state,
      code_challenge: 'challenge',
      code_challenge_method: 'plain',
    });

    return `https://twitter.com/i/oauth2/authorize?${params.toString()}`;
  }

  async handleTwitterCallback(
    code: string,
    state: string
  ): Promise<{ success: boolean; userId: string; pointsAwarded: number }> {
    const decodedState = this.decodeState(state);

    const tokenResponse = await this.exchangeTwitterCode(code);
    const userInfo = await this.fetchTwitterUserInfo(tokenResponse.access_token);

    const { data: existing } = await this.supabase
      .from('airdrop_leaderboard')
      .select('user_id')
      .eq('twitter_user_id', userInfo.id)
      .neq('user_id', decodedState.userId)
      .maybeSingle();

    if (existing) {
      throw new Error('This Twitter account is already linked to another user');
    }

    const isFollowing = await this.verifyTwitterFollowing(tokenResponse.access_token, userInfo.id);

    let pointsAwarded = 0;

    const { data: leaderboard } = await this.supabase
      .from('airdrop_leaderboard')
      .select('twitter_connected')
      .eq('user_id', decodedState.userId)
      .maybeSingle();

    const isNewConnection = !leaderboard?.twitter_connected;

    await this.supabase
      .from('airdrop_leaderboard')
      .upsert({
        user_id: decodedState.userId,
        twitter_user_id: userInfo.id,
        twitter_username: userInfo.username,
        twitter_oauth_token: tokenResponse.access_token,
        twitter_verified_at: new Date().toISOString(),
        twitter_connected: true,
        twitter_following_official: isFollowing,
      })
      .eq('user_id', decodedState.userId);

    if (isNewConnection) {
      const connectionCalc = PointCalculator.calculateSocialConnection('TWITTER');
      await this.supabase.rpc('award_points', {
        p_user_id: decodedState.userId,
        p_amount: connectionCalc.totalPoints,
        p_reason: connectionCalc.reason,
        p_reference_type: 'social_connection',
        p_metadata: { platform: 'twitter', userId: userInfo.id, username: userInfo.username },
      });
      pointsAwarded += connectionCalc.totalPoints;
    }

    if (isFollowing && isNewConnection) {
      const followCalc = PointCalculator.calculateSocialFollow('TWITTER');
      await this.supabase.rpc('award_points', {
        p_user_id: decodedState.userId,
        p_amount: followCalc.totalPoints,
        p_reason: followCalc.reason,
        p_reference_type: 'social_follow',
        p_metadata: { platform: 'twitter' },
      });
      pointsAwarded += followCalc.totalPoints;
    }

    return { success: true, userId: decodedState.userId, pointsAwarded };
  }

  async verifyTwitterFollow(userId: string): Promise<boolean> {
    const { data: leaderboard } = await this.supabase
      .from('airdrop_leaderboard')
      .select('twitter_oauth_token, twitter_user_id, twitter_following_official')
      .eq('user_id', userId)
      .maybeSingle();

    if (!leaderboard?.twitter_oauth_token || !leaderboard?.twitter_user_id) {
      throw new Error('Twitter not connected');
    }

    const isFollowing = await this.verifyTwitterFollowing(
      leaderboard.twitter_oauth_token,
      leaderboard.twitter_user_id
    );

    if (isFollowing !== leaderboard.twitter_following_official) {
      await this.supabase
        .from('airdrop_leaderboard')
        .update({ twitter_following_official: isFollowing })
        .eq('user_id', userId);

      if (isFollowing && !leaderboard.twitter_following_official) {
        const followCalc = PointCalculator.calculateSocialFollow('TWITTER');
        await this.supabase.rpc('award_points', {
          p_user_id: userId,
          p_amount: followCalc.totalPoints,
          p_reason: followCalc.reason,
          p_reference_type: 'social_follow',
          p_metadata: { platform: 'twitter' },
        });
      }
    }

    return isFollowing;
  }

  async disconnectTwitter(userId: string): Promise<void> {
    await this.supabase
      .from('airdrop_leaderboard')
      .update({
        twitter_connected: false,
        twitter_oauth_token: null,
        twitter_following_official: false,
      })
      .eq('user_id', userId);
  }

  async initiateDiscordAuth(userId: string, returnUrl?: string): Promise<string> {
    const state = this.encodeState({ userId, platform: 'discord', returnUrl, timestamp: Date.now() });

    const discordClientId = process.env.DISCORD_CLIENT_ID;
    const redirectUri = `${process.env.API_BASE_URL}/api/client/oauth/discord/callback`;

    if (!discordClientId) {
      throw new Error('Discord OAuth not configured');
    }

    const params = new URLSearchParams({
      client_id: discordClientId,
      redirect_uri: redirectUri,
      response_type: 'code',
      scope: 'identify guilds',
      state,
    });

    return `https://discord.com/api/oauth2/authorize?${params.toString()}`;
  }

  async handleDiscordCallback(
    code: string,
    state: string
  ): Promise<{ success: boolean; userId: string; pointsAwarded: number }> {
    const decodedState = this.decodeState(state);

    const tokenResponse = await this.exchangeDiscordCode(code);
    const userInfo = await this.fetchDiscordUserInfo(tokenResponse.access_token);

    const { data: existing } = await this.supabase
      .from('airdrop_leaderboard')
      .select('user_id')
      .eq('discord_user_id', userInfo.id)
      .neq('user_id', decodedState.userId)
      .maybeSingle();

    if (existing) {
      throw new Error('This Discord account is already linked to another user');
    }

    const isMember = await this.verifyDiscordMembership(tokenResponse.access_token);

    let pointsAwarded = 0;

    const { data: leaderboard } = await this.supabase
      .from('airdrop_leaderboard')
      .select('discord_connected')
      .eq('user_id', decodedState.userId)
      .maybeSingle();

    const isNewConnection = !leaderboard?.discord_connected;

    await this.supabase
      .from('airdrop_leaderboard')
      .upsert({
        user_id: decodedState.userId,
        discord_user_id: userInfo.id,
        discord_username: userInfo.username,
        discord_oauth_token: tokenResponse.access_token,
        discord_verified_at: new Date().toISOString(),
        discord_connected: true,
        discord_member_official: isMember,
      })
      .eq('user_id', decodedState.userId);

    if (isNewConnection) {
      const connectionCalc = PointCalculator.calculateSocialConnection('DISCORD');
      await this.supabase.rpc('award_points', {
        p_user_id: decodedState.userId,
        p_amount: connectionCalc.totalPoints,
        p_reason: connectionCalc.reason,
        p_reference_type: 'social_connection',
        p_metadata: { platform: 'discord', userId: userInfo.id, username: userInfo.username },
      });
      pointsAwarded += connectionCalc.totalPoints;
    }

    if (isMember && isNewConnection) {
      const followCalc = PointCalculator.calculateSocialFollow('DISCORD');
      await this.supabase.rpc('award_points', {
        p_user_id: decodedState.userId,
        p_amount: followCalc.totalPoints,
        p_reason: followCalc.reason,
        p_reference_type: 'social_follow',
        p_metadata: { platform: 'discord' },
      });
      pointsAwarded += followCalc.totalPoints;
    }

    return { success: true, userId: decodedState.userId, pointsAwarded };
  }

  async disconnectDiscord(userId: string): Promise<void> {
    await this.supabase
      .from('airdrop_leaderboard')
      .update({
        discord_connected: false,
        discord_oauth_token: null,
        discord_member_official: false,
      })
      .eq('user_id', userId);
  }

  async getSocialConnections(userId: string): Promise<SocialConnection[]> {
    const { data } = await this.supabase
      .from('airdrop_leaderboard')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();

    if (!data) {
      return [
        { platform: 'twitter', connected: false },
        { platform: 'discord', connected: false },
        { platform: 'telegram', connected: false },
        { platform: 'github', connected: false },
      ];
    }

    return [
      {
        platform: 'twitter',
        connected: data.twitter_connected,
        userId: data.twitter_user_id,
        username: data.twitter_username,
        verifiedAt: data.twitter_verified_at,
        following: data.twitter_following_official,
      },
      {
        platform: 'discord',
        connected: data.discord_connected,
        userId: data.discord_user_id,
        username: data.discord_username,
        verifiedAt: data.discord_verified_at,
        following: data.discord_member_official,
      },
      {
        platform: 'telegram',
        connected: data.telegram_connected,
        userId: data.telegram_user_id,
        username: data.telegram_username,
        verifiedAt: data.telegram_verified_at,
        following: data.telegram_member_official,
      },
      {
        platform: 'github',
        connected: data.github_connected,
        userId: data.github_user_id,
        username: data.github_username,
        verifiedAt: data.github_verified_at,
      },
    ];
  }

  async reVerifyAllConnections(userId: string): Promise<{ verified: number; disconnected: number }> {
    const connections = await this.getSocialConnections(userId);
    let verified = 0;
    let disconnected = 0;

    for (const connection of connections) {
      if (!connection.connected) continue;

      try {
        if (connection.platform === 'twitter') {
          await this.verifyTwitterFollow(userId);
          verified++;
        }
      } catch {
        disconnected++;
      }
    }

    return { verified, disconnected };
  }

  private encodeState(state: OAuthState): string {
    return Buffer.from(JSON.stringify(state)).toString('base64');
  }

  private decodeState(encodedState: string): OAuthState {
    return JSON.parse(Buffer.from(encodedState, 'base64').toString());
  }

  private async exchangeTwitterCode(code: string): Promise<{ access_token: string }> {
    const response = await fetch('https://api.twitter.com/2/oauth2/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        code,
        grant_type: 'authorization_code',
        client_id: process.env.TWITTER_CLIENT_ID!,
        redirect_uri: `${process.env.API_BASE_URL}/api/client/oauth/twitter/callback`,
        code_verifier: 'challenge',
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to exchange Twitter code');
    }

    return response.json();
  }

  private async fetchTwitterUserInfo(accessToken: string): Promise<{ id: string; username: string }> {
    const response = await fetch('https://api.twitter.com/2/users/me', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch Twitter user info');
    }

    const data = await response.json();
    return data.data;
  }

  private async verifyTwitterFollowing(accessToken: string, userId: string): Promise<boolean> {
    const response = await fetch(`https://api.twitter.com/2/users/${userId}/following`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      return false;
    }

    const data = await response.json();
    return data.data?.some((user: { username: string }) => user.username === this.OFFICIAL_ACCOUNTS.twitter);
  }

  private async exchangeDiscordCode(code: string): Promise<{ access_token: string }> {
    const response = await fetch('https://discord.com/api/oauth2/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: process.env.DISCORD_CLIENT_ID!,
        client_secret: process.env.DISCORD_CLIENT_SECRET!,
        grant_type: 'authorization_code',
        code,
        redirect_uri: `${process.env.API_BASE_URL}/api/client/oauth/discord/callback`,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to exchange Discord code');
    }

    return response.json();
  }

  private async fetchDiscordUserInfo(accessToken: string): Promise<{ id: string; username: string }> {
    const response = await fetch('https://discord.com/api/users/@me', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch Discord user info');
    }

    return response.json();
  }

  private async verifyDiscordMembership(accessToken: string): Promise<boolean> {
    if (!this.OFFICIAL_ACCOUNTS.discord) return false;

    const response = await fetch('https://discord.com/api/users/@me/guilds', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      return false;
    }

    const guilds = await response.json();
    return guilds.some((guild: { id: string }) => guild.id === this.OFFICIAL_ACCOUNTS.discord);
  }
}
