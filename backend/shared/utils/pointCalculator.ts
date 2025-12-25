export const POINT_VALUES = {
  SOCIAL_CONNECTIONS: {
    TWITTER: 150,
    DISCORD: 150,
    TELEGRAM: 100,
    GITHUB: 100,
  },
  SOCIAL_FOLLOWING: {
    TWITTER: 75,
    DISCORD: 50,
    TELEGRAM: 50,
  },
  CONTENT: {
    TWITTER_THREAD: 100,
    YOUTUBE_VIDEO: 300,
    ARTICLE: 200,
    PODCAST: 500,
    MEME: 50,
    INFOGRAPHIC: 150,
    CODE_CONTRIBUTION: 200,
    BUG_REPORT: 100,
    FEATURE_SUGGESTION: 75,
    TRANSLATION: 200,
    REDDIT_POST: 75,
    QUOTE_TWEET: 50,
    RETWEET: 20,
  },
  REFERRAL: {
    SIGNUP: 0,
    TWO_SOCIALS: 100,
    POINTS_500: 200,
    POINTS_2000: 300,
  },
  ENGAGEMENT: {
    LOGIN: 5,
    VIEW_DEBATE: 10,
    READ_ARTICLE: 15,
    VOTE: 50,
    COMMENT: 10,
    PROPOSAL_SUBMIT: 100,
  },
  STREAK_BONUS: {
    DAY_7: 50,
    DAY_14: 150,
    DAY_30: 300,
    DAY_60: 1000,
  },
  LIMITS: {
    ARTICLES_PER_DAY: 3,
    COMMENTS_PER_WEEK: 10,
    DEBATES_PER_DAY: 5,
    RETWEETS_PER_WEEK: 7,
    QUOTE_TWEETS_PER_WEEK: 7,
  },
} as const;

export interface PointCalculation {
  basePoints: number;
  bonusPoints: number;
  totalPoints: number;
  reason: string;
  metadata?: Record<string, unknown>;
}

export class PointCalculator {
  static calculateSocialConnection(platform: keyof typeof POINT_VALUES.SOCIAL_CONNECTIONS): PointCalculation {
    const basePoints = POINT_VALUES.SOCIAL_CONNECTIONS[platform];
    return {
      basePoints,
      bonusPoints: 0,
      totalPoints: basePoints,
      reason: `Connected ${platform} account`,
    };
  }

  static calculateSocialFollow(platform: keyof typeof POINT_VALUES.SOCIAL_FOLLOWING): PointCalculation {
    const basePoints = POINT_VALUES.SOCIAL_FOLLOWING[platform];
    return {
      basePoints,
      bonusPoints: 0,
      totalPoints: basePoints,
      reason: `Following Aizura on ${platform}`,
    };
  }

  static calculateContentSubmission(
    contentType: keyof typeof POINT_VALUES.CONTENT,
    adminAwardedPoints?: number
  ): PointCalculation {
    const basePoints = adminAwardedPoints || POINT_VALUES.CONTENT[contentType];
    return {
      basePoints,
      bonusPoints: 0,
      totalPoints: basePoints,
      reason: `Content approved: ${contentType}`,
      metadata: { contentType, adminAwardedPoints },
    };
  }

  static calculateReferralMilestone(milestone: keyof typeof POINT_VALUES.REFERRAL): PointCalculation {
    const basePoints = POINT_VALUES.REFERRAL[milestone];
    return {
      basePoints,
      bonusPoints: 0,
      totalPoints: basePoints,
      reason: `Referral milestone: ${milestone}`,
    };
  }

  static calculateEngagement(
    activityType: keyof typeof POINT_VALUES.ENGAGEMENT,
    multiplier = 1
  ): PointCalculation {
    const basePoints = POINT_VALUES.ENGAGEMENT[activityType] * multiplier;
    return {
      basePoints,
      bonusPoints: 0,
      totalPoints: basePoints,
      reason: `Engagement: ${activityType}`,
    };
  }

  static calculateStreakBonus(streakDays: number): PointCalculation {
    let basePoints = 0;
    let bonusKey = '';

    if (streakDays >= 60) {
      basePoints = POINT_VALUES.STREAK_BONUS.DAY_60;
      bonusKey = '60-day';
    } else if (streakDays >= 30) {
      basePoints = POINT_VALUES.STREAK_BONUS.DAY_30;
      bonusKey = '30-day';
    } else if (streakDays >= 14) {
      basePoints = POINT_VALUES.STREAK_BONUS.DAY_14;
      bonusKey = '14-day';
    } else if (streakDays >= 7) {
      basePoints = POINT_VALUES.STREAK_BONUS.DAY_7;
      bonusKey = '7-day';
    }

    return {
      basePoints,
      bonusPoints: 0,
      totalPoints: basePoints,
      reason: `Login streak bonus: ${bonusKey}`,
      metadata: { streakDays },
    };
  }

  static calculateAirdropShare(userPoints: number, totalPoints: number, airdropSupply: number): number {
    if (totalPoints === 0 || userPoints === 0) return 0;
    return (userPoints / totalPoints) * airdropSupply;
  }

  static calculateAirdropPercentage(userPoints: number, totalPoints: number): number {
    if (totalPoints === 0 || userPoints === 0) return 0;
    return (userPoints / totalPoints) * 100;
  }
}
