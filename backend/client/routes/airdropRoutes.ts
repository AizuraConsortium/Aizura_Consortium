import { Router } from 'express';
import { AirdropController } from '../controllers/airdropController.js';
import { requireAuth } from '../../shared/middleware/auth.js';
import { requireRole } from '../../shared/middleware/rbac.js';
import { createRateLimit } from '../../shared/middleware/validation.js';
import { parsePagination } from '../../shared/middleware/pagination.js';

const router = Router();
const airdropController = new AirdropController();

// Leaderboard Endpoints
router.get(
  '/leaderboard',
  createRateLimit('GET:/api/client/airdrop/leaderboard'),
  parsePagination,
  airdropController.getLeaderboard.bind(airdropController)
);

router.get(
  '/my-stats',
  createRateLimit('GET:/api/client/airdrop/my-stats'),
  requireAuth,
  requireRole('client'),
  airdropController.getMyStats.bind(airdropController)
);

router.get(
  '/my-rank',
  createRateLimit('GET:/api/client/airdrop/my-rank'),
  requireAuth,
  requireRole('client'),
  airdropController.getMyRank.bind(airdropController)
);

router.get(
  '/points-breakdown',
  createRateLimit('GET:/api/client/airdrop/points-breakdown'),
  requireAuth,
  requireRole('client'),
  airdropController.getPointsBreakdown.bind(airdropController)
);

router.get(
  '/estimate',
  createRateLimit('GET:/api/client/airdrop/estimate'),
  requireAuth,
  requireRole('client'),
  airdropController.getAirdropEstimate.bind(airdropController)
);

router.get(
  '/point-history',
  createRateLimit('GET:/api/client/airdrop/point-history'),
  requireAuth,
  requireRole('client'),
  parsePagination,
  airdropController.getPointHistory.bind(airdropController)
);

// Social Connection Endpoints
router.post(
  '/connect/twitter',
  createRateLimit('POST:/api/client/airdrop/connect/twitter'),
  requireAuth,
  requireRole('client'),
  airdropController.connectTwitter.bind(airdropController)
);

router.get(
  '/connect/twitter/callback',
  createRateLimit('GET:/api/client/airdrop/connect/twitter/callback'),
  airdropController.handleTwitterCallback.bind(airdropController)
);

router.post(
  '/verify/twitter-follow',
  createRateLimit('POST:/api/client/airdrop/verify/twitter-follow'),
  requireAuth,
  requireRole('client'),
  airdropController.verifyTwitterFollow.bind(airdropController)
);

router.post(
  '/connect/discord',
  createRateLimit('POST:/api/client/airdrop/connect/discord'),
  requireAuth,
  requireRole('client'),
  airdropController.connectDiscord.bind(airdropController)
);

router.get(
  '/connect/discord/callback',
  createRateLimit('GET:/api/client/airdrop/connect/discord/callback'),
  airdropController.handleDiscordCallback.bind(airdropController)
);

router.delete(
  '/disconnect/:platform',
  createRateLimit('DELETE:/api/client/airdrop/disconnect/:platform'),
  requireAuth,
  requireRole('client'),
  airdropController.disconnectSocial.bind(airdropController)
);

router.get(
  '/social-connections',
  createRateLimit('GET:/api/client/airdrop/social-connections'),
  requireAuth,
  requireRole('client'),
  airdropController.getSocialConnections.bind(airdropController)
);

// Referral Endpoints
router.get(
  '/referral-code',
  createRateLimit('GET:/api/client/airdrop/referral-code'),
  requireAuth,
  requireRole('client'),
  airdropController.getReferralCode.bind(airdropController)
);

router.get(
  '/referrals',
  createRateLimit('GET:/api/client/airdrop/referrals'),
  requireAuth,
  requireRole('client'),
  airdropController.getReferrals.bind(airdropController)
);

router.get(
  '/referral-stats',
  createRateLimit('GET:/api/client/airdrop/referral-stats'),
  requireAuth,
  requireRole('client'),
  airdropController.getReferralStats.bind(airdropController)
);

// Content Submission Endpoints
router.post(
  '/submit-content',
  createRateLimit('POST:/api/client/airdrop/submit-content'),
  requireAuth,
  requireRole('client'),
  airdropController.submitContent.bind(airdropController)
);

router.get(
  '/my-submissions',
  createRateLimit('GET:/api/client/airdrop/my-submissions'),
  requireAuth,
  requireRole('client'),
  airdropController.getMySubmissions.bind(airdropController)
);

router.get(
  '/submission/:id',
  createRateLimit('GET:/api/client/airdrop/submission/:id'),
  requireAuth,
  requireRole('client'),
  airdropController.getSubmissionById.bind(airdropController)
);

// Engagement Tracking
router.post(
  '/track-activity',
  createRateLimit('POST:/api/client/airdrop/track-activity'),
  requireAuth,
  requireRole('client'),
  airdropController.trackActivity.bind(airdropController)
);

// Wallet Management
router.put(
  '/wallet-address',
  createRateLimit('PUT:/api/client/airdrop/wallet-address'),
  requireAuth,
  requireRole('client'),
  airdropController.updateWalletAddress.bind(airdropController)
);

export default router;
