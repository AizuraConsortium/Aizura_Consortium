/**
 * Error Controller
 *
 * Handles HTTP requests for client-side error logging.
 * Processes error submissions from frontend applications.
 */

import { Request, Response } from 'express';
import { ErrorService } from '../../admin/services/errorService.js';
import { sanitizeText } from '../utils/sanitization.js';

/**
 * Controller for error logging endpoints
 */
export class ErrorController {
  constructor(private errorService: ErrorService) {}

  /**
   * POST /api/errors/log
   * Log an error from a client application
   *
   * Body parameters (validated by middleware):
   * - source: Error source ('frontend' | 'agent')
   * - severity: Error severity ('info' | 'warning' | 'error' | 'critical')
   * - error_type: Type/category of error
   * - message: Error message
   * - details: Additional error details (optional)
   * - agent_id: Associated agent ID (optional)
   * - topic_id: Associated topic ID (optional)
   * - appName: Name of the application logging the error (optional)
   */
  async logError(req: Request, res: Response): Promise<void> {
    try {
      // Extract request data (validation already done by middleware)
      const {
        source,
        severity,
        error_type,
        message,
        details,
        agent_id,
        topic_id,
        appName,
      } = req.body;

      // Sanitize text inputs
      const sanitizedMessage = sanitizeText(message, 1000);
      const sanitizedErrorType = sanitizeText(error_type, 100);

      // Prepare error details with optional appName
      const errorDetails = details
        ? {
            ...details,
            appName: appName ? sanitizeText(appName, 50) : undefined,
          }
        : appName
        ? { appName: sanitizeText(appName, 50) }
        : undefined;

      // Delegate to service layer
      const loggedError = await this.errorService.logError({
        source,
        severity,
        error_type: sanitizedErrorType,
        message: sanitizedMessage,
        details: errorDetails,
        agent_id,
        topic_id,
      });

      // Return success response
      res.status(201).json({
        success: true,
        error_id: loggedError.id,
        message: 'Error logged successfully',
      });
    } catch (error) {
      console.error('Error logging error:', error);
      res.status(500).json({
        error: 'Failed to log error',
        message: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }
}
