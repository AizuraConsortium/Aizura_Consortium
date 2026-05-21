import type { Request, Response } from 'express';
import type { Orchestrator } from '../../consortium/orchestrator/Orchestrator.js';
import { ErrorLogger } from '../services/errorLogger.js';

/**
 * Controller for handling webhook requests
 */
export class WebhookController {
  private orchestrator: Orchestrator | null = null;
  private errorLogger: ErrorLogger;

  constructor() {
    this.errorLogger = ErrorLogger.getInstance();
  }

  /**
   * Sets the orchestrator instance for processing proposals
   * @param orchestrator - The orchestrator instance to use
   */
  setOrchestrator(orchestrator: Orchestrator): void {
    this.orchestrator = orchestrator;
  }

  /**
   * Handles incoming proposal webhooks
   * @param req - Express request object
   * @param res - Express response object
   */
  async handleProposalWebhook(req: Request, res: Response): Promise<void> {
    try {
      const { proposal_id } = req.body;

      if (!proposal_id) {
        await this.errorLogger.logBackendError(
          'WEBHOOK_VALIDATION_ERROR',
          'Missing proposal_id in webhook request',
          {
            requestPath: req.path,
            requestMethod: req.method,
            metadata: { body: req.body }
          }
        );
        res.status(400).json({ error: 'proposal_id required' });
        return;
      }

      console.log(`📨 Webhook received for proposal: ${proposal_id}`);

      if (!this.orchestrator) {
        await this.errorLogger.logBackendError(
          'ORCHESTRATOR_NOT_INITIALIZED',
          'Webhook received but orchestrator not initialized',
          {
            requestPath: req.path,
            requestMethod: req.method,
            metadata: { proposalId: proposal_id }
          }
        );
        res.status(503).json({ error: 'Service not ready' });
        return;
      }

      try {
        await this.orchestrator.handleNewProposal(proposal_id);
        res.json({
          success: true,
          message: 'Proposal received and queued for processing'
        });
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        const stackTrace = error instanceof Error ? error.stack : undefined;

        console.error(`❌ Error handling proposal ${proposal_id}:`, error);

        await this.errorLogger.logBackendError(
          'WEBHOOK_PROCESSING_ERROR',
          `Failed to process proposal webhook: ${errorMessage}`,
          {
            requestPath: req.path,
            requestMethod: req.method,
            stackTrace,
            metadata: {
              proposalId: proposal_id,
              error: errorMessage
            }
          }
        );

        res.status(500).json({
          error: 'Failed to process proposal',
          details: errorMessage
        });
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      const stackTrace = error instanceof Error ? error.stack : undefined;

      console.error('💥 Webhook fatal error:', error);

      await this.errorLogger.logBackendError(
        'WEBHOOK_FATAL_ERROR',
        `Webhook fatal error: ${errorMessage}`,
        {
          requestPath: req.path,
          requestMethod: req.method,
          stackTrace,
          metadata: { body: req.body }
        }
      );

      res.status(500).json({
        error: 'Internal server error',
        message: 'An unexpected error occurred'
      });
    }
  }
}
