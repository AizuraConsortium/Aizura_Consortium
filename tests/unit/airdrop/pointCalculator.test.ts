import { describe, it, expect } from 'vitest';

interface PointsConfig {
  social: {
    twitter: number;
    discord: number;
    telegram: number;
    github: number;
  };
  referral: {
    base: number;
    milestone1000: number;
    milestone5000: number;
  };
  content: {
    article: number;
    video: number;
    thread: number;
    meme: number;
  };
  engagement: {
    dailyLogin: number;
    weeklyStreak: number;
    monthlyStreak: number;
  };
}

const POINTS_CONFIG: PointsConfig = {
  social: {
    twitter: 500,
    discord: 300,
    telegram: 200,
    github: 400,
  },
  referral: {
    base: 200,
    milestone1000: 500,
    milestone5000: 1000,
  },
  content: {
    article: 1000,
    video: 800,
    thread: 500,
    meme: 300,
  },
  engagement: {
    dailyLogin: 10,
    weeklyStreak: 100,
    monthlyStreak: 500,
  },
};

function calculateSocialPoints(connections: Partial<Record<keyof PointsConfig['social'], boolean>>): number {
  let points = 0;
  for (const [platform, connected] of Object.entries(connections)) {
    if (connected && platform in POINTS_CONFIG.social) {
      points += POINTS_CONFIG.social[platform as keyof PointsConfig['social']];
    }
  }
  return points;
}

function calculateReferralPoints(referralCount: number, referredUserPoints: number[]): number {
  let points = referralCount * POINTS_CONFIG.referral.base;

  const qualifiedReferrals = referredUserPoints.filter(p => p >= 1000).length;
  const highValueReferrals = referredUserPoints.filter(p => p >= 5000).length;

  points += qualifiedReferrals * POINTS_CONFIG.referral.milestone1000;
  points += highValueReferrals * POINTS_CONFIG.referral.milestone5000;

  return points;
}

function calculateContentPoints(submissions: Array<{ type: keyof PointsConfig['content']; approved: boolean }>): number {
  return submissions
    .filter(s => s.approved)
    .reduce((sum, s) => sum + POINTS_CONFIG.content[s.type], 0);
}

function calculateEngagementPoints(loginDays: number, weeklyStreaks: number, monthlyStreaks: number): number {
  return (
    loginDays * POINTS_CONFIG.engagement.dailyLogin +
    weeklyStreaks * POINTS_CONFIG.engagement.weeklyStreak +
    monthlyStreaks * POINTS_CONFIG.engagement.monthlyStreak
  );
}

describe('Point Calculator', () => {
  describe('Social Connection Points', () => {
    it('should award points for connecting Twitter', () => {
      const points = calculateSocialPoints({ twitter: true });
      expect(points).toBe(500);
    });

    it('should award points for multiple social connections', () => {
      const points = calculateSocialPoints({
        twitter: true,
        discord: true,
        telegram: true,
        github: true,
      });
      expect(points).toBe(1400);
    });

    it('should not award points for unconnected platforms', () => {
      const points = calculateSocialPoints({
        twitter: false,
        discord: false,
      });
      expect(points).toBe(0);
    });

    it('should handle partial connections', () => {
      const points = calculateSocialPoints({
        twitter: true,
        discord: false,
        github: true,
      });
      expect(points).toBe(900);
    });
  });

  describe('Referral Points', () => {
    it('should award base points for each referral', () => {
      const points = calculateReferralPoints(5, [0, 0, 0, 0, 0]);
      expect(points).toBe(1000);
    });

    it('should award milestone bonus when referral reaches 1000 points', () => {
      const points = calculateReferralPoints(3, [1200, 800, 1500]);
      expect(points).toBe(3 * 200 + 2 * 500);
    });

    it('should award both milestones when referral reaches 5000 points', () => {
      const points = calculateReferralPoints(2, [5500, 2000]);
      expect(points).toBe(2 * 200 + 2 * 500 + 1 * 1000);
    });

    it('should handle zero referrals', () => {
      const points = calculateReferralPoints(0, []);
      expect(points).toBe(0);
    });

    it('should handle large number of qualified referrals', () => {
      const referralPoints = Array(10).fill(1500);
      const points = calculateReferralPoints(10, referralPoints);
      expect(points).toBe(10 * 200 + 10 * 500);
    });
  });

  describe('Content Submission Points', () => {
    it('should award points for approved article', () => {
      const points = calculateContentPoints([
        { type: 'article', approved: true },
      ]);
      expect(points).toBe(1000);
    });

    it('should not award points for rejected submissions', () => {
      const points = calculateContentPoints([
        { type: 'article', approved: false },
        { type: 'video', approved: false },
      ]);
      expect(points).toBe(0);
    });

    it('should award points for multiple approved submissions', () => {
      const points = calculateContentPoints([
        { type: 'article', approved: true },
        { type: 'video', approved: true },
        { type: 'thread', approved: true },
        { type: 'meme', approved: false },
      ]);
      expect(points).toBe(1000 + 800 + 500);
    });

    it('should handle different content types', () => {
      const points = calculateContentPoints([
        { type: 'meme', approved: true },
        { type: 'thread', approved: true },
      ]);
      expect(points).toBe(300 + 500);
    });
  });

  describe('Engagement Points', () => {
    it('should award points for daily logins', () => {
      const points = calculateEngagementPoints(7, 0, 0);
      expect(points).toBe(70);
    });

    it('should award bonus for weekly streaks', () => {
      const points = calculateEngagementPoints(14, 2, 0);
      expect(points).toBe(14 * 10 + 2 * 100);
    });

    it('should award bonus for monthly streaks', () => {
      const points = calculateEngagementPoints(30, 4, 1);
      expect(points).toBe(30 * 10 + 4 * 100 + 1 * 500);
    });

    it('should handle zero engagement', () => {
      const points = calculateEngagementPoints(0, 0, 0);
      expect(points).toBe(0);
    });

    it('should calculate total for high engagement user', () => {
      const points = calculateEngagementPoints(90, 12, 3);
      expect(points).toBe(90 * 10 + 12 * 100 + 3 * 500);
    });
  });

  describe('Total Points Calculation', () => {
    it('should sum all point categories correctly', () => {
      const social = calculateSocialPoints({ twitter: true, discord: true });
      const referral = calculateReferralPoints(2, [1200, 5500]);
      const content = calculateContentPoints([
        { type: 'article', approved: true },
        { type: 'video', approved: true },
      ]);
      const engagement = calculateEngagementPoints(30, 4, 1);

      const total = social + referral + content + engagement;

      expect(total).toBeGreaterThan(0);
      expect(social).toBe(800);
      expect(referral).toBe(2 * 200 + 2 * 500 + 1 * 1000);
      expect(content).toBe(1800);
      expect(engagement).toBe(30 * 10 + 4 * 100 + 1 * 500);
    });

    it('should handle user with maximum engagement', () => {
      const social = calculateSocialPoints({
        twitter: true,
        discord: true,
        telegram: true,
        github: true,
      });
      const referral = calculateReferralPoints(10, Array(10).fill(6000));
      const content = calculateContentPoints([
        { type: 'article', approved: true },
        { type: 'article', approved: true },
        { type: 'video', approved: true },
        { type: 'thread', approved: true },
        { type: 'meme', approved: true },
      ]);
      const engagement = calculateEngagementPoints(90, 12, 3);

      const total = social + referral + content + engagement;
      expect(total).toBeGreaterThan(20000);
    });
  });
});
