import { Router } from 'express';
import { ProposalController } from '../controllers/proposalController.js';
import { requireAuth } from '../../../middleware/auth.js';
import { requireRole } from '../../../middleware/rbac.js';

const router = Router();
const proposalController = new ProposalController();

router.get(
  '/',
  requireAuth,
  requireRole('client'),
  proposalController.getClientProposals.bind(proposalController)
);

router.get(
  '/:id',
  requireAuth,
  requireRole('client'),
  proposalController.getProposalById.bind(proposalController)
);

export default router;
