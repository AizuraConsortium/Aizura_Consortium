import { Router } from 'express';
import { WebhookController } from '../controllers/webhookController.js';
import { createRateLimit } from '../middleware/validation.js';

const router = Router();
export const webhookController = new WebhookController();

/**
 * POST /webhook/proposal
 * Receives webhook notifications for new proposals
 */
router.post(
  '/proposal',
  createRateLimit('POST:/webhook/proposal'),
  webhookController.handleProposalWebhook.bind(webhookController)
);

export default router;
