import { Router } from 'express';
import { ProposalController } from '../controllers/proposalController.js';
import { createRateLimit } from '../../shared/middleware/validation.js';

const router = Router();
const proposalController = new ProposalController();

router.get(
  '/',
  createRateLimit('GET:/api/website/proposals'),
  proposalController.getProposals.bind(proposalController)
);

router.get(
  '/:id',
  createRateLimit('GET:/api/website/proposals/:id'),
  proposalController.getProposalById.bind(proposalController)
);

export default router;
