import type { Orchestrator } from '../../shared/orchestrator/Orchestrator.js';

export interface OrchestratorStatus {
  isRunning: boolean;
  isLeader: boolean;
  instanceId: string | null;
  lockStatus: {
    isLocked: boolean;
    instanceId: string | null;
    acquiredAt?: string;
    lastHeartbeat?: string;
    expiresAt?: string;
    ageSeconds?: number;
    heartbeatAgeSeconds?: number;
    expiresInSeconds?: number;
  } | null;
  currentState: {
    tickInterval: number;
    isProcessingTick: boolean;
    tickCount: number;
    currentTopic: {
      id: string;
      state: string;
      started_at: string;
    } | null;
    pendingMessages: number;
    refusalNotices: number;
  };
}

export class OrchestratorService {
  private orchestrator: Orchestrator | null = null;

  setOrchestrator(orchestrator: Orchestrator): void {
    this.orchestrator = orchestrator;
  }

  async getStatus(): Promise<{ success: boolean; status?: OrchestratorStatus; error?: string }> {
    try {
      if (!this.orchestrator) {
        return {
          success: false,
          error: 'Orchestrator not initialized',
        };
      }

      const leadershipStatus = this.orchestrator.getLeadershipStatus();
      const lockStatus = await this.orchestrator.getLockStatus();
      const runtimeStatus = this.orchestrator.getStatus();

      return {
        success: true,
        status: {
          isRunning: runtimeStatus.isRunning,
          isLeader: runtimeStatus.isLeader,
          instanceId: leadershipStatus.instanceId,
          lockStatus,
          currentState: runtimeStatus.currentState,
        },
      };
    } catch (error) {
      console.error('Error getting orchestrator status:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  async start(): Promise<{ success: boolean; error?: string }> {
    try {
      if (!this.orchestrator) {
        return {
          success: false,
          error: 'Orchestrator not initialized',
        };
      }

      await this.orchestrator.start();
      return { success: true };
    } catch (error) {
      console.error('Error starting orchestrator:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  async stop(): Promise<{ success: boolean; error?: string }> {
    try {
      if (!this.orchestrator) {
        return {
          success: false,
          error: 'Orchestrator not initialized',
        };
      }

      await this.orchestrator.stop();
      return { success: true };
    } catch (error) {
      console.error('Error stopping orchestrator:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  async forceReleaseLock(): Promise<{ success: boolean; error?: string }> {
    try {
      if (!this.orchestrator) {
        return {
          success: false,
          error: 'Orchestrator not initialized',
        };
      }

      return await this.orchestrator.forceReleaseLock();
    } catch (error) {
      console.error('Error force releasing lock:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }
}
