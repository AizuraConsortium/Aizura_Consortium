import { describe, it, expect, beforeEach } from 'vitest';

interface User {
  id: string;
  email: string;
  points: number;
  referralCode: string;
  connectedSocials: string[];
}

interface ContentSubmission {
  id: string;
  userId: string;
  type: string;
  status: 'pending' | 'approved' | 'rejected';
  points: number;
}

class MockAirdropSystem {
  private users: Map<string, User> = new Map();
  private submissions: Map<string, ContentSubmission> = new Map();
  private referralMap: Map<string, string[]> = new Map();

  async signUp(email: string, referredByCode?: string): Promise<User> {
    const user: User = {
      id: `user_${Date.now()}_${Math.random()}`,
      email,
      points: 0,
      referralCode: `REF_${Math.random().toString(36).substring(7).toUpperCase()}`,
      connectedSocials: [],
    };

    this.users.set(user.id, user);

    if (referredByCode) {
      const referrer = Array.from(this.users.values()).find(
        u => u.referralCode === referredByCode
      );
      if (referrer) {
        const referrals = this.referralMap.get(referrer.id) || [];
        referrals.push(user.id);
        this.referralMap.set(referrer.id, referrals);

        referrer.points += 200;
      }
    }

    return user;
  }

  async connectSocial(userId: string, platform: string): Promise<number> {
    const user = this.users.get(userId);
    if (!user) throw new Error('User not found');

    if (user.connectedSocials.includes(platform)) {
      return 0;
    }

    user.connectedSocials.push(platform);

    const pointsMap: Record<string, number> = {
      twitter: 500,
      discord: 300,
      telegram: 200,
      github: 400,
    };

    const points = pointsMap[platform] || 0;
    user.points += points;

    return points;
  }

  async submitContent(userId: string, type: string, title: string): Promise<ContentSubmission> {
    const submission: ContentSubmission = {
      id: `sub_${Date.now()}`,
      userId,
      type,
      status: 'pending',
      points: 0,
    };

    this.submissions.set(submission.id, submission);
    return submission;
  }

  async reviewSubmission(submissionId: string, approved: boolean, points?: number): Promise<void> {
    const submission = this.submissions.get(submissionId);
    if (!submission) throw new Error('Submission not found');

    const user = this.users.get(submission.userId);
    if (!user) throw new Error('User not found');

    submission.status = approved ? 'approved' : 'rejected';

    if (approved) {
      const defaultPoints: Record<string, number> = {
        article: 1000,
        video: 800,
        thread: 500,
        meme: 300,
      };

      submission.points = points || defaultPoints[submission.type] || 500;
      user.points += submission.points;

      const referrals = this.referralMap.get(user.id) || [];
      for (const referredId of referrals) {
        const referrer = this.users.get(user.id);
        if (referrer && user.points >= 1000 && user.points - submission.points < 1000) {
          referrer.points += 500;
        }
      }
    }
  }

  async getUser(userId: string): Promise<User | undefined> {
    return this.users.get(userId);
  }

  async getReferrals(userId: string): Promise<string[]> {
    return this.referralMap.get(userId) || [];
  }

  async getLeaderboard(limit: number = 10): Promise<User[]> {
    return Array.from(this.users.values())
      .sort((a, b) => b.points - a.points)
      .slice(0, limit);
  }
}

describe('Airdrop User Flows (Integration)', () => {
  let system: MockAirdropSystem;

  beforeEach(() => {
    system = new MockAirdropSystem();
  });

  describe('Complete Signup → Social Connect → Earn Points Flow', () => {
    it('should complete full user onboarding flow', async () => {
      const user = await system.signUp('user@example.com');

      expect(user.id).toBeTruthy();
      expect(user.email).toBe('user@example.com');
      expect(user.points).toBe(0);
      expect(user.referralCode).toBeTruthy();

      const twitterPoints = await system.connectSocial(user.id, 'twitter');
      expect(twitterPoints).toBe(500);

      const discordPoints = await system.connectSocial(user.id, 'discord');
      expect(discordPoints).toBe(300);

      const updatedUser = await system.getUser(user.id);
      expect(updatedUser?.points).toBe(800);
      expect(updatedUser?.connectedSocials).toContain('twitter');
      expect(updatedUser?.connectedSocials).toContain('discord');
    });

    it('should prevent duplicate social connection', async () => {
      const user = await system.signUp('user@example.com');

      await system.connectSocial(user.id, 'twitter');
      const secondAttempt = await system.connectSocial(user.id, 'twitter');

      expect(secondAttempt).toBe(0);

      const updatedUser = await system.getUser(user.id);
      expect(updatedUser?.points).toBe(500);
    });

    it('should handle all social platforms', async () => {
      const user = await system.signUp('user@example.com');

      await system.connectSocial(user.id, 'twitter');
      await system.connectSocial(user.id, 'discord');
      await system.connectSocial(user.id, 'telegram');
      await system.connectSocial(user.id, 'github');

      const updatedUser = await system.getUser(user.id);
      expect(updatedUser?.points).toBe(1400);
      expect(updatedUser?.connectedSocials).toHaveLength(4);
    });
  });

  describe('Content Submission → Admin Review → Points Awarded Flow', () => {
    it('should complete full content submission flow', async () => {
      const user = await system.signUp('writer@example.com');

      const submission = await system.submitContent(user.id, 'article', 'My Great Article');
      expect(submission.status).toBe('pending');
      expect(submission.points).toBe(0);

      await system.reviewSubmission(submission.id, true);

      const updatedSubmission = await system.getUser(user.id);
      const finalSubmission = await system.getUser(user.id);

      expect(updatedSubmission?.points).toBe(1000);
    });

    it('should not award points for rejected submissions', async () => {
      const user = await system.signUp('writer@example.com');

      const submission = await system.submitContent(user.id, 'article', 'Bad Article');
      await system.reviewSubmission(submission.id, false);

      const updatedUser = await system.getUser(user.id);
      expect(updatedUser?.points).toBe(0);
    });

    it('should allow admin to adjust points', async () => {
      const user = await system.signUp('writer@example.com');

      const submission = await system.submitContent(user.id, 'article', 'Exceptional Article');
      await system.reviewSubmission(submission.id, true, 1500);

      const updatedUser = await system.getUser(user.id);
      expect(updatedUser?.points).toBe(1500);
    });

    it('should handle multiple submissions', async () => {
      const user = await system.signUp('creator@example.com');

      await system.submitContent(user.id, 'article', 'Article 1');
      await system.submitContent(user.id, 'video', 'Video 1');
      await system.submitContent(user.id, 'thread', 'Thread 1');

      const sub1 = await system.submitContent(user.id, 'article', 'Article 1');
      const sub2 = await system.submitContent(user.id, 'video', 'Video 1');
      const sub3 = await system.submitContent(user.id, 'thread', 'Thread 1');

      await system.reviewSubmission(sub1.id, true);
      await system.reviewSubmission(sub2.id, true);
      await system.reviewSubmission(sub3.id, false);

      const updatedUser = await system.getUser(user.id);
      expect(updatedUser?.points).toBe(1000 + 800);
    });
  });

  describe('Referral Flow: Generate Code → Friend Signs Up → Milestones → Points Awarded', () => {
    it('should complete full referral flow', async () => {
      const referrer = await system.signUp('referrer@example.com');
      const referralCode = referrer.referralCode;

      expect(referralCode).toBeTruthy();

      const friend = await system.signUp('friend@example.com', referralCode);

      const updatedReferrer = await system.getUser(referrer.id);
      expect(updatedReferrer?.points).toBe(200);

      const referrals = await system.getReferrals(referrer.id);
      expect(referrals).toContain(friend.id);
    });

    it('should award milestone bonus when referral reaches 1000 points', async () => {
      const referrer = await system.signUp('referrer@example.com');
      const friend = await system.signUp('friend@example.com', referrer.referralCode);

      await system.connectSocial(friend.id, 'twitter');
      await system.connectSocial(friend.id, 'discord');

      const submission = await system.submitContent(friend.id, 'article', 'Article');
      await system.reviewSubmission(submission.id, true);

      const friendUser = await system.getUser(friend.id);
      expect(friendUser?.points).toBeGreaterThanOrEqual(1000);

      const updatedReferrer = await system.getUser(referrer.id);
      expect(updatedReferrer?.points).toBeGreaterThanOrEqual(200 + 500);
    });

    it('should handle multiple referrals', async () => {
      const referrer = await system.signUp('referrer@example.com');

      const friend1 = await system.signUp('friend1@example.com', referrer.referralCode);
      const friend2 = await system.signUp('friend2@example.com', referrer.referralCode);
      const friend3 = await system.signUp('friend3@example.com', referrer.referralCode);

      const updatedReferrer = await system.getUser(referrer.id);
      expect(updatedReferrer?.points).toBe(600);

      const referrals = await system.getReferrals(referrer.id);
      expect(referrals).toHaveLength(3);
    });

    it('should not award points for invalid referral code', async () => {
      const referrer = await system.signUp('referrer@example.com');
      const friend = await system.signUp('friend@example.com', 'INVALID_CODE');

      const updatedReferrer = await system.getUser(referrer.id);
      expect(updatedReferrer?.points).toBe(0);
    });
  });

  describe('Leaderboard and Rankings', () => {
    it('should rank users by points correctly', async () => {
      const user1 = await system.signUp('user1@example.com');
      const user2 = await system.signUp('user2@example.com');
      const user3 = await system.signUp('user3@example.com');

      await system.connectSocial(user1.id, 'twitter');
      await system.connectSocial(user2.id, 'twitter');
      await system.connectSocial(user2.id, 'discord');
      await system.connectSocial(user3.id, 'twitter');
      await system.connectSocial(user3.id, 'discord');
      await system.connectSocial(user3.id, 'telegram');
      await system.connectSocial(user3.id, 'github');

      const leaderboard = await system.getLeaderboard();

      expect(leaderboard[0].id).toBe(user3.id);
      expect(leaderboard[0].points).toBe(1400);
      expect(leaderboard[1].id).toBe(user2.id);
      expect(leaderboard[1].points).toBe(800);
      expect(leaderboard[2].id).toBe(user1.id);
      expect(leaderboard[2].points).toBe(500);
    });

    it('should respect leaderboard limit', async () => {
      for (let i = 0; i < 20; i++) {
        await system.signUp(`user${i}@example.com`);
      }

      const top5 = await system.getLeaderboard(5);
      expect(top5).toHaveLength(5);

      const top10 = await system.getLeaderboard(10);
      expect(top10).toHaveLength(10);
    });
  });

  describe('Complex Multi-User Scenarios', () => {
    it('should handle viral referral chain', async () => {
      const founder = await system.signUp('founder@example.com');

      const tier1a = await system.signUp('tier1a@example.com', founder.referralCode);
      const tier1b = await system.signUp('tier1b@example.com', founder.referralCode);

      const tier2a = await system.signUp('tier2a@example.com', tier1a.referralCode);
      const tier2b = await system.signUp('tier2b@example.com', tier1a.referralCode);
      const tier2c = await system.signUp('tier2c@example.com', tier1b.referralCode);

      const founderUser = await system.getUser(founder.id);
      expect(founderUser?.points).toBe(400);

      const tier1aUser = await system.getUser(tier1a.id);
      expect(tier1aUser?.points).toBe(400);
    });

    it('should handle power user with all activities', async () => {
      const powerUser = await system.signUp('power@example.com');

      await system.connectSocial(powerUser.id, 'twitter');
      await system.connectSocial(powerUser.id, 'discord');
      await system.connectSocial(powerUser.id, 'telegram');
      await system.connectSocial(powerUser.id, 'github');

      const article = await system.submitContent(powerUser.id, 'article', 'Great Article');
      await system.reviewSubmission(article.id, true);

      const video = await system.submitContent(powerUser.id, 'video', 'Tutorial Video');
      await system.reviewSubmission(video.id, true);

      await system.signUp('referral1@example.com', powerUser.referralCode);
      await system.signUp('referral2@example.com', powerUser.referralCode);

      const finalUser = await system.getUser(powerUser.id);
      expect(finalUser?.points).toBeGreaterThan(3000);
    });
  });
});
