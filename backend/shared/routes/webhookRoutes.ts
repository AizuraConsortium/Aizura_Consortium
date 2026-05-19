import { Router, Request, Response, NextFunction } from 'express';
import { timingSafeEqual } from 'crypto';
import { createRateLimit } from '../middleware/validation.js';
import { getContainer } from '../infrastructure/Container.js';

const router = Router();

// Shared secret check for the proposal webhook. The caller (Supabase trigger
// or pg_net) must send `Authorization: Bearer <WEBHOOK_PROPOSAL_SECRET>`.
// Without this, anyone could trigger orchestrator.handleNewProposal, which
// fans out to 6 LLM providers — i.e. drain the AI budget.
function requireProposalWebhookSecret(req: Request, res: Response, next: NextFunction): void {
  const expected = process.env.WEBHOOK_PROPOSAL_SECRET;

  if (!expected) {
    console.error('WEBHOOK_PROPOSAL_SECRET not configured — refusing webhook to fail closed');
    res.status(503).json({ error: 'Webhook authentication not configured' });
    return;
  }

  const header = req.headers.authorization || '';
  const match = header.match(/^Bearer (.+)$/);
  const provided = match ? match[1] : null;

  if (!provided) {
    res.status(401).json({ error: 'Missing webhook credentials' });
    return;
  }

  const a = Buffer.from(provided);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) {
    res.status(401).json({ error: 'Invalid webhook credentials' });
    return;
  }

  next();
}

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
    requireProposalWebhookSecret,
    webhookController.handleProposalWebhook.bind(webhookController)
  );

  return router;
}
