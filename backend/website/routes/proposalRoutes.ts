import { Router } from 'express';
import { ProposalController } from '../controllers/proposalController.js';
import { requireAuth } from '../../shared/middleware/auth.js';

const router = Router();
const proposalController = new ProposalController();

router.get('/', proposalController.getProposals.bind(proposalController));
router.get('/:id', proposalController.getProposalById.bind(proposalController));
router.post('/', requireAuth, proposalController.createProposal.bind(proposalController));
router.post('/:id/vote', requireAuth, proposalController.voteOnProposal.bind(proposalController));
router.get('/:id/vote', requireAuth, proposalController.getUserVote.bind(proposalController));

export default router;
