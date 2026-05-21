import { Request, Response } from 'express';
import { OrchestratorService } from '../services/orchestratorService.js';
import type { Orchestrator } from '../../consortium/orchestrator/Orchestrator.js';

export class OrchestratorController {
  private orchestratorService: OrchestratorService;

  constructor() {
    this.orchestratorService = new OrchestratorService();
  }

  setOrchestrator(orchestrator: Orchestrator): void {
    this.orchestratorService.setOrchestrator(orchestrator);
  }

  async getStatus(_req: Request, res: Response) {
    try {
      const result = await this.orchestratorService.getStatus();

      if (!result.success) {
        return res.status(500).json({ error: result.error });
      }

      res.json(result.status);
    } catch (error) {
      console.error('Error fetching orchestrator status:', error);
      res.status(500).json({ error: 'Failed to fetch orchestrator status' });
    }
  }

  async stop(_req: Request, res: Response) {
    try {
      const result = await this.orchestratorService.stop();

      if (!result.success) {
        return res.status(500).json({ error: result.error });
      }

      if (req.logAdminAction) {
        await req.logAdminAction({
          actionType: 'orchestrator_stop',
          resourceType: 'orchestrator',
          success: true,
        });
      }

      res.json({ success: true, message: 'Orchestrator stopped' });
    } catch (error) {
      console.error('Error stopping orchestrator:', error);

      if (req.logAdminAction) {
        await req.logAdminAction({
          actionType: 'orchestrator_stop',
          resourceType: 'orchestrator',
          success: false,
          errorMessage: error instanceof Error ? error.message : 'Unknown error',
        });
      }

      res.status(500).json({ error: 'Failed to stop orchestrator' });
    }
  }

  async start(_req: Request, res: Response) {
    try {
      const result = await this.orchestratorService.start();

      if (!result.success) {
        return res.status(500).json({ error: result.error });
      }

      if (req.logAdminAction) {
        await req.logAdminAction({
          actionType: 'orchestrator_start',
          resourceType: 'orchestrator',
          success: true,
        });
      }

      res.json({ success: true, message: 'Orchestrator started' });
    } catch (error) {
      console.error('Error starting orchestrator:', error);

      if (req.logAdminAction) {
        await req.logAdminAction({
          actionType: 'orchestrator_start',
          resourceType: 'orchestrator',
          success: false,
          errorMessage: error instanceof Error ? error.message : 'Unknown error',
        });
      }

      res.status(500).json({ error: 'Failed to start orchestrator' });
    }
  }

  async forceReleaseLock(_req: Request, res: Response) {
    try {
      const result = await this.orchestratorService.forceReleaseLock();

      if (!result.success) {
        return res.status(500).json({ error: result.error });
      }

      if (req.logAdminAction) {
        await req.logAdminAction({
          actionType: 'orchestrator_force_unlock',
          resourceType: 'orchestrator',
          actionDetails: {
            warning: 'Force unlock is a dangerous operation',
          },
          success: true,
        });
      }

      res.json({ success: true, message: 'Orchestrator lock forcefully released' });
    } catch (error) {
      console.error('Error force releasing lock:', error);

      if (req.logAdminAction) {
        await req.logAdminAction({
          actionType: 'orchestrator_force_unlock',
          resourceType: 'orchestrator',
          success: false,
          errorMessage: error instanceof Error ? error.message : 'Unknown error',
        });
      }

      res.status(500).json({ error: 'Failed to force release lock' });
    }
  }
}
