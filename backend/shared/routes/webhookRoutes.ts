import { Router } from 'express';
import { createRateLimit } from '../middleware/validation.js';
import { getContainer } from '../infrastructure/Container.js';

const router = Router();

/**
 * Factory function to create webhook routes with container dependency
 * Routes are configured to get the controller from the container
 */
export default function createWebhookRoutes(): Router {
  const container = getContainer();
  const webhookController = container.get('webhookController');

  /**
   * POST /webhook/proposal
   * Receives webhook notifications for new proposals
   */
  router.post(
    '/proposal',
    createRateLimit('POST:/webhook/proposal'),
    webhookController.handleProposalWebhook.bind(webhookController)
  );

  return router;
}
