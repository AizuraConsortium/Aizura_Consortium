import { Router } from 'express';
import { ProposalController } from '../controllers/proposalController.js';

const router = Router();
const proposalController = new ProposalController();

router.get('/', proposalController.getProposals.bind(proposalController));
router.get('/:id', proposalController.getProposalById.bind(proposalController));

export default router;
