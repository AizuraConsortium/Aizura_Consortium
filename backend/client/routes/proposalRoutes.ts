import { Router } from 'express';
import { ProposalController } from '../controllers/proposalController.js';
import { requireAuth } from '../../shared/middleware/auth.js';
import { requireRole } from '../../shared/middleware/rbac.js';
import { createRateLimit, validateProposal, validateVote } from '../../shared/middleware/validation.js';

const router = Router();
const proposalController = new ProposalController();

/**
 * Middleware Order (STANDARD):
 * 1. createRateLimit() - Rate limiting (always first)
 * 2. requireAuth - Verify authentication
 * 3. requireRole('client') - Verify authorization
 * 4. validate* - Validate request data
 * 5. controller.method - Handle request
 */

/**
 * GET /api/client/proposals
 * Get all proposals for authenticated client
 */
router.get(
  '/',
  createRateLimit('GET:/api/client/proposals'),
  requireAuth,
  requireRole('client'),
  proposalController.getClientProposals.bind(proposalController)
);

/**
 * POST /api/client/proposals
 * Create a new proposal
 * Correct middleware order: rate limit → auth → role → validation → controller
 */
router.post(
  '/',
  createRateLimit('POST:/api/client/proposals'),
  requireAuth,
  requireRole('client'),
  validateProposal,
  proposalController.createProposal.bind(proposalController)
);

/**
 * GET /api/client/proposals/:id
 * Get a specific proposal by ID
 */
router.get(
  '/:id',
  createRateLimit('GET:/api/client/proposals/:id'),
  requireAuth,
  requireRole('client'),
  proposalController.getProposalById.bind(proposalController)
);

/**
 * POST /api/client/proposals/:id/vote
 * Vote on a proposal
 * Correct middleware order: rate limit → auth → role → validation → controller
 */
router.post(
  '/:id/vote',
  createRateLimit('POST:/api/client/proposals/:id/vote'),
  requireAuth,
  requireRole('client'),
  validateVote,
  proposalController.voteOnProposal.bind(proposalController)
);

/**
 * GET /api/client/proposals/:id/vote
 * Get user's vote on a proposal
 */
router.get(
  '/:id/vote',
  createRateLimit('GET:/api/client/proposals/:id/vote'),
  requireAuth,
  requireRole('client'),
  proposalController.getUserVote.bind(proposalController)
);

export default router;
