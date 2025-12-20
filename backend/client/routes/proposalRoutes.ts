import { Router } from 'express';
import { ProposalController } from '../controllers/proposalController.js';
import { requireAuth } from '../../shared/middleware/auth.js';
import { requireRole } from '../../shared/middleware/rbac.js';
import { createRateLimit } from '../../shared/middleware/validation.js';

const router = Router();
const proposalController = new ProposalController();

router.get(
  '/',
  createRateLimit('GET:/api/client/proposals'),
  requireAuth,
  requireRole('client'),
  proposalController.getClientProposals.bind(proposalController)
);

router.get(
  '/:id',
  createRateLimit('GET:/api/client/proposals/:id'),
  requireAuth,
  requireRole('client'),
  proposalController.getProposalById.bind(proposalController)
);

export default router;
