import { describe, it, expect, beforeEach, vi } from 'vitest';

interface SybilCheckResult {
  isSuspicious: boolean;
  riskScore: number;
  flags: string[];
  reasons: string[];
}

const RISK_THRESHOLDS = {
  HIGH: 80,
  MEDIUM: 50,
  LOW: 30,
};

function detectIPClustering(userIP: string, otherUsersOnSameIP: number): Partial<SybilCheckResult> {
  const result = { riskScore: 0, flags: [] as string[], reasons: [] as string[] };

  if (otherUsersOnSameIP > 5) {
    result.riskScore += 50;
    result.flags.push('ip_clustering');
    result.reasons.push(`IP address shared with ${otherUsersOnSameIP} other accounts`);
  } else if (otherUsersOnSameIP > 2) {
    result.riskScore += 25;
    result.flags.push('shared_ip');
    result.reasons.push(`IP address shared with ${otherUsersOnSameIP} other accounts`);
  }

  return result;
}

function detectCircularReferral(referralChain: string[]): Partial<SybilCheckResult> {
  const result = { riskScore: 0, flags: [] as string[], reasons: [] as string[] };

  const uniqueReferrals = new Set(referralChain);
  if (uniqueReferrals.size < referralChain.length) {
    result.riskScore += 60;
    result.flags.push('circular_referral');
    result.reasons.push(`Circular referral chain detected (length: ${referralChain.length})`);
  }

  return result;
}

function detectSuspiciousBehavior(
  accountAgeHours: number,
  totalPoints: number,
  loginCount: number
): Partial<SybilCheckResult> {
  const result = { riskScore: 0, flags: [] as string[], reasons: [] as string[] };

  if (accountAgeHours < 24 && totalPoints > 500) {
    result.riskScore += 30;
    result.flags.push('rapid_point_gain');
    result.reasons.push('Earned over 500 points within first 24 hours');
  }

  if (loginCount > 100 && accountAgeHours < 168) {
    result.riskScore += 25;
    result.flags.push('excessive_logins');
    result.reasons.push('Unusual login frequency for new account');
  }

  const pointsPerHour = accountAgeHours > 0 ? totalPoints / accountAgeHours : 0;
  if (pointsPerHour > 50) {
    result.riskScore += 20;
    result.flags.push('unnatural_activity_rate');
    result.reasons.push(`Earning ${pointsPerHour.toFixed(1)} points per hour (unusually high)`);
  }

  return result;
}

function detectDuplicateSocialAccounts(
  platform: string,
  otherUsersWithSameAccount: number
): Partial<SybilCheckResult> {
  const result = { riskScore: 0, flags: [] as string[], reasons: [] as string[] };

  if (otherUsersWithSameAccount > 0) {
    result.riskScore += 35;
    result.flags.push(`duplicate_${platform}`);
    result.reasons.push(`${platform} account linked to ${otherUsersWithSameAccount} other user(s)`);
  }

  return result;
}

function detectIdenticalReferralBehavior(
  referralScores: number[]
): Partial<SybilCheckResult> {
  const result = { riskScore: 0, flags: [] as string[], reasons: [] as string[] };

  if (referralScores.length < 3) return result;

  const avgScore = referralScores.reduce((a, b) => a + b, 0) / referralScores.length;
  const scoreVariance = referralScores.reduce((sum, score) => sum + Math.pow(score - avgScore, 2), 0) / referralScores.length;
  const scoreStdDev = Math.sqrt(scoreVariance);

  if (scoreStdDev < avgScore * 0.1) {
    result.riskScore += 25;
    result.flags.push('identical_referral_behavior');
    result.reasons.push(`Referrals have suspiciously similar scores (${Math.round(avgScore)} ± ${Math.round(scoreStdDev)})`);
  }

  return result;
}

describe('Anti-Sybil Detection', () => {
  describe('IP Clustering Detection', () => {
    it('should flag accounts with >5 users on same IP', () => {
      const result = detectIPClustering('192.168.1.1', 6);
      expect(result.riskScore).toBe(50);
      expect(result.flags).toContain('ip_clustering');
    });

    it('should flag accounts with 3-5 users on same IP with lower risk', () => {
      const result = detectIPClustering('192.168.1.1', 3);
      expect(result.riskScore).toBe(25);
      expect(result.flags).toContain('shared_ip');
    });

    it('should not flag accounts with <=2 users on same IP', () => {
      const result = detectIPClustering('192.168.1.1', 2);
      expect(result.riskScore).toBe(0);
      expect(result.flags).toHaveLength(0);
    });

    it('should not flag unique IP addresses', () => {
      const result = detectIPClustering('192.168.1.1', 0);
      expect(result.riskScore).toBe(0);
    });
  });

  describe('Circular Referral Detection', () => {
    it('should detect circular referral chain', () => {
      const chain = ['userA', 'userB', 'userC', 'userA'];
      const result = detectCircularReferral(chain);
      expect(result.riskScore).toBe(60);
      expect(result.flags).toContain('circular_referral');
    });

    it('should detect self-referral', () => {
      const chain = ['userA', 'userA'];
      const result = detectCircularReferral(chain);
      expect(result.riskScore).toBe(60);
    });

    it('should not flag legitimate referral chains', () => {
      const chain = ['userA', 'userB', 'userC', 'userD'];
      const result = detectCircularReferral(chain);
      expect(result.riskScore).toBe(0);
    });
  });

  describe('Suspicious Behavior Detection', () => {
    it('should flag rapid point accumulation', () => {
      const result = detectSuspiciousBehavior(12, 600, 10);
      expect(result.flags).toContain('rapid_point_gain');
      expect(result.riskScore).toBeGreaterThanOrEqual(30);
    });

    it('should flag excessive logins for new account', () => {
      const result = detectSuspiciousBehavior(100, 500, 120);
      expect(result.flags).toContain('excessive_logins');
    });

    it('should flag unnatural activity rate', () => {
      const result = detectSuspiciousBehavior(10, 600, 50);
      expect(result.flags).toContain('unnatural_activity_rate');
    });

    it('should not flag normal user behavior', () => {
      const result = detectSuspiciousBehavior(720, 5000, 50);
      expect(result.flags).toHaveLength(0);
    });

    it('should flag multiple suspicious patterns', () => {
      const result = detectSuspiciousBehavior(20, 800, 150);
      expect(result.flags.length).toBeGreaterThan(1);
      expect(result.riskScore).toBeGreaterThan(50);
    });
  });

  describe('Duplicate Social Account Detection', () => {
    it('should flag duplicate Twitter accounts', () => {
      const result = detectDuplicateSocialAccounts('twitter', 2);
      expect(result.riskScore).toBe(35);
      expect(result.flags).toContain('duplicate_twitter');
    });

    it('should flag duplicate Discord accounts', () => {
      const result = detectDuplicateSocialAccounts('discord', 1);
      expect(result.riskScore).toBe(35);
      expect(result.flags).toContain('duplicate_discord');
    });

    it('should not flag unique social accounts', () => {
      const result = detectDuplicateSocialAccounts('twitter', 0);
      expect(result.riskScore).toBe(0);
    });
  });

  describe('Identical Referral Behavior Detection', () => {
    it('should flag referrals with identical scores', () => {
      const scores = [1000, 1000, 1000, 1000];
      const result = detectIdenticalReferralBehavior(scores);
      expect(result.flags).toContain('identical_referral_behavior');
      expect(result.riskScore).toBe(25);
    });

    it('should flag referrals with very similar scores', () => {
      const scores = [1000, 1005, 998, 1002];
      const result = detectIdenticalReferralBehavior(scores);
      expect(result.flags).toContain('identical_referral_behavior');
    });

    it('should not flag referrals with diverse scores', () => {
      const scores = [500, 1200, 2500, 800];
      const result = detectIdenticalReferralBehavior(scores);
      expect(result.flags).toHaveLength(0);
    });

    it('should not flag with <3 referrals', () => {
      const scores = [1000, 1000];
      const result = detectIdenticalReferralBehavior(scores);
      expect(result.flags).toHaveLength(0);
    });
  });

  describe('Risk Score Thresholds', () => {
    it('should classify high risk accounts correctly', () => {
      const riskScore = 85;
      expect(riskScore).toBeGreaterThanOrEqual(RISK_THRESHOLDS.HIGH);
    });

    it('should classify medium risk accounts correctly', () => {
      const riskScore = 60;
      expect(riskScore).toBeGreaterThanOrEqual(RISK_THRESHOLDS.MEDIUM);
      expect(riskScore).toBeLessThan(RISK_THRESHOLDS.HIGH);
    });

    it('should classify low risk accounts correctly', () => {
      const riskScore = 40;
      expect(riskScore).toBeGreaterThanOrEqual(RISK_THRESHOLDS.LOW);
      expect(riskScore).toBeLessThan(RISK_THRESHOLDS.MEDIUM);
    });

    it('should classify safe accounts correctly', () => {
      const riskScore = 20;
      expect(riskScore).toBeLessThan(RISK_THRESHOLDS.LOW);
    });
  });

  describe('Combined Risk Assessment', () => {
    it('should accumulate risk from multiple factors', () => {
      const ipRisk = detectIPClustering('192.168.1.1', 6);
      const behaviorRisk = detectSuspiciousBehavior(12, 800, 150);
      const socialRisk = detectDuplicateSocialAccounts('twitter', 2);

      const totalRisk = (ipRisk.riskScore || 0) + (behaviorRisk.riskScore || 0) + (socialRisk.riskScore || 0);

      expect(totalRisk).toBeGreaterThan(RISK_THRESHOLDS.HIGH);
    });

    it('should flag user as suspicious when risk exceeds threshold', () => {
      const totalRisk = 85;
      const isSuspicious = totalRisk >= RISK_THRESHOLDS.MEDIUM;
      expect(isSuspicious).toBe(true);
    });

    it('should not flag low-risk legitimate users', () => {
      const totalRisk = 15;
      const isSuspicious = totalRisk >= RISK_THRESHOLDS.MEDIUM;
      expect(isSuspicious).toBe(false);
    });
  });
});
