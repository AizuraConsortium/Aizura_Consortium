import { Router } from 'express';
import { u2eWebhookController } from '../controllers/u2eWebhookController';

export function createU2EWebhookRoutes(): Router {
  const router = Router();

  router.post('/u2e/event', (req, res) => u2eWebhookController.receiveEvent(req, res));

  return router;
}

export default createU2EWebhookRoutes;
