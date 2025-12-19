import { Router, Request, Response } from 'express';
import { ErrorService } from '../../admin/services/errorService.js';
import { createRateLimit } from '../middleware/validation.js';
import { errorLogSchema, createBodyValidator } from '../validation/schemas.js';
import { sanitizeText } from '../utils/sanitization.js';

const router = Router();
const errorService = new ErrorService();

router.post('/log',
  createRateLimit('POST:/api/errors/log'),
  createBodyValidator(errorLogSchema),
  async (req: Request, res: Response) => {
  try {
    const { source, severity, error_type, message, details, agent_id, topic_id, appName } = req.body;

    const sanitizedMessage = sanitizeText(message, 1000);
    const sanitizedErrorType = sanitizeText(error_type, 100);

    const errorDetails = details ? {
      ...details,
      appName: appName ? sanitizeText(appName, 50) : undefined
    } : (appName ? { appName: sanitizeText(appName, 50) } : undefined);

    const loggedError = await errorService.logError({
      source,
      severity,
      error_type: sanitizedErrorType,
      message: sanitizedMessage,
      details: errorDetails,
      agent_id,
      topic_id
    });

    res.status(201).json({
      success: true,
      error_id: loggedError.id,
      message: 'Error logged successfully'
    });
  } catch (error) {
    console.error('Error logging error:', error);
    res.status(500).json({
      error: 'Failed to log error',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

export default router;
