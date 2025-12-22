import { Router } from 'express';
import { createRateLimit } from '../middleware/validation.js';
import { errorLogSchema, createBodyValidator } from '../validation/schemas.js';
import { getContainer } from '../infrastructure/Container.js';

const router = Router();

/**
 * Factory function to create error routes with container dependency
 * Routes are configured to get the controller from the container
 */
export default function createErrorRoutes(): Router {
  const container = getContainer();
  const errorController = container.get('errorController');

  /**
   * POST /api/errors/log
   * Log an error from a client application
   */
  router.post(
    '/log',
    createRateLimit('POST:/api/errors/log'),
    createBodyValidator(errorLogSchema),
    errorController.logError.bind(errorController)
  );

  return router;
}
