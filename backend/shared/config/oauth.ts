export interface OAuthConfig {
  clientId: string;
  clientSecret: string;
  redirectUri: string;
  authorizationUrl: string;
  tokenUrl: string;
  scopes: string[];
  enabled: boolean;
}

export interface OAuthProviderConfig {
  twitter: OAuthConfig;
  discord: OAuthConfig;
  github: OAuthConfig;
  telegram: {
    botToken: string;
    botUsername: string;
    enabled: boolean;
  };
}

export class OAuthConfiguration {
  private static instance: OAuthConfiguration;
  private config: OAuthProviderConfig;

  private constructor() {
    const baseUrl = process.env.API_BASE_URL || 'http://localhost:3000';

    this.config = {
      twitter: {
        clientId: process.env.TWITTER_CLIENT_ID || '',
        clientSecret: process.env.TWITTER_CLIENT_SECRET || '',
        redirectUri: `${baseUrl}/api/client/airdrop/connect/twitter/callback`,
        authorizationUrl: 'https://twitter.com/i/oauth2/authorize',
        tokenUrl: 'https://api.twitter.com/2/oauth2/token',
        scopes: ['tweet.read', 'users.read', 'follows.read'],
        enabled: !!(process.env.TWITTER_CLIENT_ID && process.env.TWITTER_CLIENT_SECRET),
      },
      discord: {
        clientId: process.env.DISCORD_CLIENT_ID || '',
        clientSecret: process.env.DISCORD_CLIENT_SECRET || '',
        redirectUri: `${baseUrl}/api/client/airdrop/connect/discord/callback`,
        authorizationUrl: 'https://discord.com/api/oauth2/authorize',
        tokenUrl: 'https://discord.com/api/oauth2/token',
        scopes: ['identify', 'guilds'],
        enabled: !!(process.env.DISCORD_CLIENT_ID && process.env.DISCORD_CLIENT_SECRET),
      },
      github: {
        clientId: process.env.GITHUB_CLIENT_ID || '',
        clientSecret: process.env.GITHUB_CLIENT_SECRET || '',
        redirectUri: `${baseUrl}/api/client/airdrop/connect/github/callback`,
        authorizationUrl: 'https://github.com/login/oauth/authorize',
        tokenUrl: 'https://github.com/login/oauth/access_token',
        scopes: ['user:email', 'read:user'],
        enabled: !!(process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET),
      },
      telegram: {
        botToken: process.env.TELEGRAM_BOT_TOKEN || '',
        botUsername: process.env.TELEGRAM_BOT_USERNAME || '',
        enabled: !!process.env.TELEGRAM_BOT_TOKEN,
      },
    };
  }

  static getInstance(): OAuthConfiguration {
    if (!OAuthConfiguration.instance) {
      OAuthConfiguration.instance = new OAuthConfiguration();
    }
    return OAuthConfiguration.instance;
  }

  getTwitterConfig(): OAuthConfig {
    return this.config.twitter;
  }

  getDiscordConfig(): OAuthConfig {
    return this.config.discord;
  }

  getGithubConfig(): OAuthConfig {
    return this.config.github;
  }

  getTelegramConfig() {
    return this.config.telegram;
  }

  isTwitterEnabled(): boolean {
    return this.config.twitter.enabled;
  }

  isDiscordEnabled(): boolean {
    return this.config.discord.enabled;
  }

  isGithubEnabled(): boolean {
    return this.config.github.enabled;
  }

  isTelegramEnabled(): boolean {
    return this.config.telegram.enabled;
  }

  getAllProviders() {
    return {
      twitter: this.config.twitter.enabled,
      discord: this.config.discord.enabled,
      github: this.config.github.enabled,
      telegram: this.config.telegram.enabled,
    };
  }

  validateConfiguration(): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!process.env.API_BASE_URL) {
      errors.push('API_BASE_URL is not configured');
    }

    if (this.config.twitter.enabled && !this.config.twitter.clientSecret) {
      errors.push('Twitter OAuth is enabled but client secret is missing');
    }

    if (this.config.discord.enabled && !this.config.discord.clientSecret) {
      errors.push('Discord OAuth is enabled but client secret is missing');
    }

    if (this.config.github.enabled && !this.config.github.clientSecret) {
      errors.push('GitHub OAuth is enabled but client secret is missing');
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }
}

export const oauthConfig = OAuthConfiguration.getInstance();

export const OFFICIAL_ACCOUNTS = {
  twitter: {
    username: process.env.OFFICIAL_TWITTER_USERNAME || 'AizuraAI',
    userId: process.env.OFFICIAL_TWITTER_ID || '',
  },
  discord: {
    serverId: process.env.OFFICIAL_DISCORD_SERVER_ID || '',
    serverName: process.env.OFFICIAL_DISCORD_SERVER_NAME || 'Aizura',
  },
  telegram: {
    channelId: process.env.OFFICIAL_TELEGRAM_CHANNEL || '',
    channelUsername: process.env.OFFICIAL_TELEGRAM_CHANNEL_USERNAME || '',
  },
  github: {
    orgName: process.env.OFFICIAL_GITHUB_ORG || '',
  },
};
