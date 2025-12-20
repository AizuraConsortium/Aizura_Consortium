import { Router } from 'express';
import { ProposalController } from '../controllers/proposalController.js';
import { requireAuth } from '../../shared/middleware/auth.js';
import { requireRole } from '../../shared/middleware/rbac.js';
import { createRateLimit, validateProposal, validateVote } from '../../shared/middleware/validation.js';

const router = Router();
const proposalController = new ProposalController();

router.get(
  '/',
  createRateLimit('GET:/api/client/proposals'),
  requireAuth,
  requireRole('client'),
  proposalController.getClientProposals.bind(proposalController)
);

router.post(
  '/',
  createRateLimit('POST:/api/client/proposals'),
  validateProposal,
  requireAuth,
  requireRole('client'),
  proposalController.createProposal.bind(proposalController)
);

router.get(
  '/:id',
  createRateLimit('GET:/api/client/proposals/:id'),
  requireAuth,
  requireRole('client'),
  proposalController.getProposalById.bind(proposalController)
);

router.post(
  '/:id/vote',
  createRateLimit('POST:/api/client/proposals/:id/vote'),
  validateVote,
  requireAuth,
  requireRole('client'),
  proposalController.voteOnProposal.bind(proposalController)
);

router.get(
  '/:id/vote',
  createRateLimit('GET:/api/client/proposals/:id/vote'),
  requireAuth,
  requireRole('client'),
  proposalController.getUserVote.bind(proposalController)
);

export default router;
