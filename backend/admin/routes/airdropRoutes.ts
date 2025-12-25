import { Router } from 'express';
import { AirdropAdminController } from '../controllers/airdropAdminController.js';
import { requireAuth } from '../../shared/middleware/auth.js';
import { requireRole } from '../../shared/middleware/rbac.js';
import { createRateLimit } from '../../shared/middleware/validation.js';
import { parsePagination } from '../../shared/middleware/pagination.js';

const router = Router();
const airdropAdminController = new AirdropAdminController();

// Content Review Endpoints
router.get(
  '/submissions/pending',
  createRateLimit('GET:/api/admin/airdrop/submissions/pending'),
  requireAuth,
  requireRole('admin'),
  parsePagination,
  airdropAdminController.getPendingSubmissions.bind(airdropAdminController)
);

router.get(
  '/submissions',
  createRateLimit('GET:/api/admin/airdrop/submissions'),
  requireAuth,
  requireRole('admin'),
  parsePagination,
  airdropAdminController.getAllSubmissions.bind(airdropAdminController)
);

router.post(
  '/submissions/:id/approve',
  createRateLimit('POST:/api/admin/airdrop/submissions/:id/approve'),
  requireAuth,
  requireRole('admin'),
  airdropAdminController.approveSubmission.bind(airdropAdminController)
);

router.post(
  '/submissions/:id/reject',
  createRateLimit('POST:/api/admin/airdrop/submissions/:id/reject'),
  requireAuth,
  requireRole('admin'),
  airdropAdminController.rejectSubmission.bind(airdropAdminController)
);

router.post(
  '/submissions/:id/request-changes',
  createRateLimit('POST:/api/admin/airdrop/submissions/:id/request-changes'),
  requireAuth,
  requireRole('admin'),
  airdropAdminController.requestChanges.bind(airdropAdminController)
);

// User Management Endpoints
router.get(
  '/users',
  createRateLimit('GET:/api/admin/airdrop/users'),
  requireAuth,
  requireRole('admin'),
  parsePagination,
  airdropAdminController.getFlaggedUsers.bind(airdropAdminController)
);

router.post(
  '/users/:id/flag',
  createRateLimit('POST:/api/admin/airdrop/users/:id/flag'),
  requireAuth,
  requireRole('admin'),
  airdropAdminController.flagUser.bind(airdropAdminController)
);

router.post(
  '/users/:id/unflag',
  createRateLimit('POST:/api/admin/airdrop/users/:id/unflag'),
  requireAuth,
  requireRole('admin'),
  airdropAdminController.unflagUser.bind(airdropAdminController)
);

router.post(
  '/users/:id/ban',
  createRateLimit('POST:/api/admin/airdrop/users/:id/ban'),
  requireAuth,
  requireRole('admin'),
  airdropAdminController.banUser.bind(airdropAdminController)
);

router.post(
  '/users/:id/adjust-points',
  createRateLimit('POST:/api/admin/airdrop/users/:id/adjust-points'),
  requireAuth,
  requireRole('admin'),
  airdropAdminController.adjustUserPoints.bind(airdropAdminController)
);

router.get(
  '/users/:id/activity-log',
  createRateLimit('GET:/api/admin/airdrop/users/:id/activity-log'),
  requireAuth,
  requireRole('admin'),
  parsePagination,
  airdropAdminController.getUserActivityLog.bind(airdropAdminController)
);

router.get(
  '/users/:id/sybil-check',
  createRateLimit('GET:/api/admin/airdrop/users/:id/sybil-check'),
  requireAuth,
  requireRole('admin'),
  airdropAdminController.checkUserSybilRisk.bind(airdropAdminController)
);

// Analytics Endpoints
router.get(
  '/stats',
  createRateLimit('GET:/api/admin/airdrop/stats'),
  requireAuth,
  requireRole('admin'),
  airdropAdminController.getOverallStats.bind(airdropAdminController)
);

router.get(
  '/analytics',
  createRateLimit('GET:/api/admin/airdrop/analytics'),
  requireAuth,
  requireRole('admin'),
  airdropAdminController.getAnalytics.bind(airdropAdminController)
);

router.get(
  '/export',
  createRateLimit('GET:/api/admin/airdrop/export'),
  requireAuth,
  requireRole('admin'),
  airdropAdminController.exportLeaderboard.bind(airdropAdminController)
);

// Sybil Detection
router.post(
  '/sybil-scan',
  createRateLimit('POST:/api/admin/airdrop/sybil-scan'),
  requireAuth,
  requireRole('admin'),
  airdropAdminController.runSybilScan.bind(airdropAdminController)
);

export default router;
