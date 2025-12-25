import { oauthConfig, OFFICIAL_ACCOUNTS } from '../config/oauth.js';

export interface OAuthTokenResponse {
  access_token: string;
  refresh_token?: string;
  expires_in?: number;
  token_type: string;
  scope?: string;
}

export interface TwitterUserInfo {
  id: string;
  username: string;
  name: string;
}

export interface DiscordUserInfo {
  id: string;
  username: string;
  discriminator: string;
  email?: string;
}

export interface GithubUserInfo {
  id: number;
  login: string;
  name?: string;
  email?: string;
}

export interface TelegramAuthData {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  photo_url?: string;
  auth_date: number;
  hash: string;
}

export class TwitterOAuthClient {
  private config = oauthConfig.getTwitterConfig();

  getAuthorizationUrl(state: string, codeChallenge: string): string {
    if (!this.config.enabled) {
      throw new Error('Twitter OAuth is not enabled');
    }

    const params = new URLSearchParams({
      response_type: 'code',
      client_id: this.config.clientId,
      redirect_uri: this.config.redirectUri,
      scope: this.config.scopes.join(' '),
      state,
      code_challenge: codeChallenge,
      code_challenge_method: 'plain',
    });

    return `${this.config.authorizationUrl}?${params.toString()}`;
  }

  async exchangeCodeForToken(code: string, codeVerifier: string): Promise<OAuthTokenResponse> {
    const response = await fetch(this.config.tokenUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        code,
        grant_type: 'authorization_code',
        client_id: this.config.clientId,
        redirect_uri: this.config.redirectUri,
        code_verifier: codeVerifier,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Failed to exchange Twitter code: ${error}`);
    }

    return response.json();
  }

  async getUserInfo(accessToken: string): Promise<TwitterUserInfo> {
    const response = await fetch('https://api.twitter.com/2/users/me', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Failed to fetch Twitter user info: ${error}`);
    }

    const data = await response.json();
    return data.data;
  }

  async verifyFollowing(accessToken: string, userId: string): Promise<boolean> {
    const officialUsername = OFFICIAL_ACCOUNTS.twitter.username;

    const response = await fetch(`https://api.twitter.com/2/users/${userId}/following`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      return false;
    }

    const data = await response.json();
    return data.data?.some((user: TwitterUserInfo) => user.username === officialUsername) || false;
  }
}

export class DiscordOAuthClient {
  private config = oauthConfig.getDiscordConfig();

  getAuthorizationUrl(state: string): string {
    if (!this.config.enabled) {
      throw new Error('Discord OAuth is not enabled');
    }

    const params = new URLSearchParams({
      client_id: this.config.clientId,
      redirect_uri: this.config.redirectUri,
      response_type: 'code',
      scope: this.config.scopes.join(' '),
      state,
    });

    return `${this.config.authorizationUrl}?${params.toString()}`;
  }

  async exchangeCodeForToken(code: string): Promise<OAuthTokenResponse> {
    const response = await fetch(this.config.tokenUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: this.config.clientId,
        client_secret: this.config.clientSecret,
        grant_type: 'authorization_code',
        code,
        redirect_uri: this.config.redirectUri,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Failed to exchange Discord code: ${error}`);
    }

    return response.json();
  }

  async getUserInfo(accessToken: string): Promise<DiscordUserInfo> {
    const response = await fetch('https://discord.com/api/users/@me', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Failed to fetch Discord user info: ${error}`);
    }

    return response.json();
  }

  async verifyServerMembership(accessToken: string): Promise<boolean> {
    const serverId = OFFICIAL_ACCOUNTS.discord.serverId;

    if (!serverId) {
      return false;
    }

    const response = await fetch('https://discord.com/api/users/@me/guilds', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      return false;
    }

    const guilds = await response.json();
    return guilds.some((guild: { id: string }) => guild.id === serverId);
  }
}

export class GithubOAuthClient {
  private config = oauthConfig.getGithubConfig();

  getAuthorizationUrl(state: string): string {
    if (!this.config.enabled) {
      throw new Error('GitHub OAuth is not enabled');
    }

    const params = new URLSearchParams({
      client_id: this.config.clientId,
      redirect_uri: this.config.redirectUri,
      scope: this.config.scopes.join(' '),
      state,
    });

    return `${this.config.authorizationUrl}?${params.toString()}`;
  }

  async exchangeCodeForToken(code: string): Promise<OAuthTokenResponse> {
    const response = await fetch(this.config.tokenUrl, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        client_id: this.config.clientId,
        client_secret: this.config.clientSecret,
        code,
        redirect_uri: this.config.redirectUri,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Failed to exchange GitHub code: ${error}`);
    }

    return response.json();
  }

  async getUserInfo(accessToken: string): Promise<GithubUserInfo> {
    const response = await fetch('https://api.github.com/user', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: 'application/vnd.github.v3+json',
      },
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Failed to fetch GitHub user info: ${error}`);
    }

    return response.json();
  }

  async verifyOrganizationMembership(accessToken: string, username: string): Promise<boolean> {
    const orgName = OFFICIAL_ACCOUNTS.github.orgName;

    if (!orgName) {
      return false;
    }

    const response = await fetch(`https://api.github.com/orgs/${orgName}/members/${username}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: 'application/vnd.github.v3+json',
      },
    });

    return response.status === 204;
  }
}

export class TelegramBotClient {
  private config = oauthConfig.getTelegramConfig();

  getBotAuthUrl(): string {
    if (!this.config.enabled) {
      throw new Error('Telegram Bot is not enabled');
    }

    const botUsername = this.config.botUsername;
    return `https://t.me/${botUsername}`;
  }

  getLoginWidgetUrl(returnUrl: string): string {
    if (!this.config.enabled) {
      throw new Error('Telegram Bot is not enabled');
    }

    const botUsername = this.config.botUsername;
    const params = new URLSearchParams({
      bot_id: this.config.botToken.split(':')[0],
      origin: returnUrl,
      request_access: 'write',
    });

    return `https://oauth.telegram.org/auth?${params.toString()}`;
  }

  verifyAuthData(authData: TelegramAuthData): boolean {
    const crypto = require('crypto');
    const { hash, ...data } = authData;

    const checkString = Object.keys(data)
      .sort()
      .map((key) => `${key}=${data[key as keyof typeof data]}`)
      .join('\n');

    const secretKey = crypto.createHash('sha256').update(this.config.botToken).digest();
    const hmac = crypto.createHmac('sha256', secretKey).update(checkString).digest('hex');

    const authAge = Date.now() / 1000 - authData.auth_date;
    const maxAuthAge = 86400;

    return hmac === hash && authAge < maxAuthAge;
  }

  async verifyChannelMembership(userId: number): Promise<boolean> {
    const channelId = OFFICIAL_ACCOUNTS.telegram.channelId;

    if (!channelId || !this.config.enabled) {
      return false;
    }

    try {
      const response = await fetch(
        `https://api.telegram.org/bot${this.config.botToken}/getChatMember`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            chat_id: channelId,
            user_id: userId,
          }),
        }
      );

      if (!response.ok) {
        return false;
      }

      const data = await response.json();
      return data.ok && ['member', 'administrator', 'creator'].includes(data.result?.status);
    } catch {
      return false;
    }
  }
}

export class OAuthClientFactory {
  static createTwitterClient(): TwitterOAuthClient {
    return new TwitterOAuthClient();
  }

  static createDiscordClient(): DiscordOAuthClient {
    return new DiscordOAuthClient();
  }

  static createGithubClient(): GithubOAuthClient {
    return new GithubOAuthClient();
  }

  static createTelegramClient(): TelegramBotClient {
    return new TelegramBotClient();
  }

  static getAllClients() {
    return {
      twitter: this.createTwitterClient(),
      discord: this.createDiscordClient(),
      github: this.createGithubClient(),
      telegram: this.createTelegramClient(),
    };
  }
}

export const twitterClient = new TwitterOAuthClient();
export const discordClient = new DiscordOAuthClient();
export const githubClient = new GithubOAuthClient();
export const telegramClient = new TelegramBotClient();
